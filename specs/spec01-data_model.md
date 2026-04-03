# Spec 01 — Resume Data Model

## Overview

The data model is the foundation of the entire app. Everything — the editor, preview, drag logic, PDF export — reads from and writes to this shape. Getting it right first saves rework on every other spec.

---

## Core Types

```typescript
// src/types/resume.ts

export type ResumeId = string; // nanoid()

export interface BulletPoint {
  id: ResumeId;
  text: string;
  visible: boolean; // checked or unchecked
  order: number;
}

export interface WorkExperience {
  id: ResumeId;
  company: string;
  title: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;       // ISO string or "MM/YYYY"
  endDate: string | null;  // null = "Present"
  location?: string;
  bullets: BulletPoint[];
  visible: boolean;
  order: number;
}

export interface Education {
  id: ResumeId;
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  visible: boolean;
  order: number;
}

export interface SkillGroup {
  id: ResumeId;
  category: string;        // e.g. "Languages", "Frameworks"
  skills: string[];
  visible: boolean;
  order: number;
}

export interface Project {
  id: ResumeId;
  name: string;
  description: string;
  bullets: BulletPoint[];
  link?: string;
  visible: boolean;
  order: number;
}

export type SectionType =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'custom';

export interface Section {
  id: ResumeId;
  type: SectionType;
  label: string;           // Display name, user-editable
  visible: boolean;
  order: number;
  // Section-level data lives here or in typed sub-collections below
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ResumeData {
  id: ResumeId;
  name: string;            // Resume snapshot name, e.g. "SWE - Alo Application"
  contact: ContactInfo;
  targetTitle?: string;
  summary?: string;
  sections: Section[];     // Ordered list of top-level sections (controls render order)
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Supabase Schema

```sql
-- supabase/migrations/001_initial_schema.sql

-- resumes table: one row per resume snapshot per user
create table resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null default 'My Resume',
  data        jsonb not null default '{}',   -- full ResumeData (contact, sections, experience, etc.)
  design      jsonb not null default '{}',   -- DesignSettings
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Row-level security: users can only access their own resumes
alter table resumes enable row level security;

create policy "Users access own resumes" on resumes
  for all using (auth.uid() = user_id);

-- Auto-update updated_at on write
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resumes_updated_at
  before update on resumes
  for each row execute function update_updated_at();
```

**Why JSONB over normalized tables?**
The resume content (`sections`, `experience`, `bullets`) is deeply hierarchical and not queried relationally — it's always loaded as a whole document. JSONB avoids a complex multi-table schema for v1, keeps reads/writes to a single row, and is still indexable if needed later.

---

## Supabase Client

```typescript
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type ResumeRow = {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  design: DesignSettings;
  created_at: string;
  updated_at: string;
};
```

---

## Zustand Store Shape

```typescript
// src/store/resumeStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { ResumeData } from '../types/resume';

interface ResumeStore {
  // Active resume state
  resume: ResumeData | null;
  allResumes: ResumeRow[];      // list for the snapshot picker
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;

  // Remote ops
  loadResumes: () => Promise<void>;
  selectResume: (id: string) => void;
  createResume: (name: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  renameResume: (id: string, name: string) => Promise<void>;
  syncToSupabase: () => Promise<void>;  // called by debounced hook after local mutations

  // Local mutations (optimistic — sync handled by useSupabaseSync)
  toggleSection: (sectionId: string) => void;
  toggleExperience: (expId: string) => void;
  toggleBullet: (expId: string, bulletId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  reorderBullets: (expId: string, fromIndex: number, toIndex: number) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  addBullet: (expId: string, text: string) => void;
  updateBullet: (expId: string, bulletId: string, text: string) => void;
  deleteBullet: (expId: string, bulletId: string) => void;
  addExperience: (exp: Omit<WorkExperience, 'id' | 'order'>) => void;
  updateExperience: (expId: string, updates: Partial<WorkExperience>) => void;

  // Portability
  exportJSON: () => string;
  importJSON: (json: string) => void;
}
```

---

## Key Design Decisions

### `visible` flag on every entity
Instead of deleting items when the user unchecks them, we set `visible: false`. This means:
- The preview only renders `visible === true` items
- The editor always renders all items (with visual distinction for hidden ones)
- The user can re-enable items without re-typing

### `order` field vs. array index
We store explicit `order` integers rather than relying on array position. This makes drag-and-drop reordering a simple sort operation on a derived view, rather than array mutation, which plays nicely with Zustand's immutable update pattern.

### Sections as a separate ordered list
`sections` is an ordered list of `Section` objects that controls the render order of top-level blocks (Experience before Education, etc.). Each section maps to a typed data collection (`experience[]`, `education[]`, etc.). This decouples section ordering from the data itself.

---

## Sync Strategy: Optimistic Local + Debounced Remote

All mutations update Zustand immediately (optimistic) and then write to Supabase on a debounce. This keeps the UI instant while preventing a Supabase call on every keystroke.

```typescript
// src/hooks/useSupabaseSync.ts

import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useDesignStore } from '../store/designStore';

export function useSupabaseSync() {
  const { resume, syncToSupabase } = useResumeStore();
  const { design } = useDesignStore();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!resume) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      syncToSupabase();
    }, 800); // 800ms debounce — fast enough to feel live, not spammy
    return () => clearTimeout(timerRef.current);
  }, [resume, design]);
}
```

`syncToSupabase` does a single `upsert` on the active resume row:

```typescript
syncToSupabase: async () => {
  const { resume } = get();
  const { design } = useDesignStore.getState();
  if (!resume) return;

  set({ isSaving: true });
  const { error } = await supabase
    .from('resumes')
    .update({ data: resume, design, updated_at: new Date().toISOString() })
    .eq('id', resume.id);

  set({ isSaving: false, error: error?.message ?? null });
}
```

A subtle "Saving..." / "Saved ✓" indicator in the toolbar reflects `isSaving` state.

---

## Auth Store

```typescript
// src/store/authStore.ts

import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  init: () => void;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  init: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInWithEmail: async (email) => {
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
```

---

## Seed Data

Provide a `defaultResume: ResumeData` constant so the app opens with a pre-filled example rather than an empty state. Makes first-run UX dramatically better.