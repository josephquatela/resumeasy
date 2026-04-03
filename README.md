# Resumeasy

A fast, open-source resume builder. No paywalls. No upsells. Dark theme by default.

Built as a direct response to Teal's paywalled design customization. Resumeasy gives you full control over your resume content — toggle bullet points on/off, drag sections to reorder, pick your own theme, and export to PDF — all free, cloud-synced across devices via Supabase.

---

## Features

| Feature | Status |
|---|---|
| Supabase auth (email + magic link) | ✅ Core |
| Cloud-synced resume storage | ✅ Core |
| Multiple resume snapshots (tailored per job) | ✅ Core |
| Checkable / uncheckable bullet points | ✅ Core |
| Drag-and-drop section & bullet reordering | ✅ Core |
| Live two-pane preview | ✅ Core |
| Template designer (font, color, spacing) | ✅ Core |
| PDF export | ✅ Core |
| AI bullet point suggestions | 🔲 Stretch |
| Job description keyword matching | 🔲 Stretch |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Component model fits section/bullet tree |
| Build | Vite | Fast DX, no config overhead |
| State | Zustand | Lightweight, devtools-friendly; syncs to Supabase async |
| Backend / DB | Supabase | Postgres + Auth + Realtime, zero infra to manage |
| Auth | Supabase Auth (magic link + email) | Simple, no password UX, free tier generous |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible, composable, no jQuery deps |
| Styling | Tailwind CSS v4 | Utility-first, easy dark theme |
| PDF Export | `react-pdf` (`@react-pdf/renderer`) | Renders React to PDF natively, no headless browser |
| Fonts | Geist (UI) + configurable per-resume | Clean system UI font, designer-swappable resume fonts |

---

## Project Structure

```
resumeforge/
├── src/
│   ├── components/
│   │   ├── auth/             # Login / signup screens
│   │   │   └── AuthGate.tsx
│   │   ├── editor/           # Left pane — content editor
│   │   │   ├── SectionBlock.tsx
│   │   │   ├── BulletItem.tsx
│   │   │   └── SectionList.tsx
│   │   ├── preview/          # Right pane — live resume preview
│   │   │   ├── ResumePreview.tsx
│   │   │   └── templates/    # Template renderers
│   │   ├── designer/         # Theme/style controls
│   │   │   └── DesignerPanel.tsx
│   │   ├── resumelist/       # Resume snapshot picker/sidebar
│   │   │   └── ResumeList.tsx
│   │   └── toolbar/          # Top nav tabs
│   │       └── Toolbar.tsx
│   ├── lib/
│   │   └── supabase.ts       # Supabase client singleton
│   ├── store/
│   │   ├── resumeStore.ts    # Zustand store — active resume state
│   │   ├── designStore.ts    # Zustand store — theme settings
│   │   └── authStore.ts      # Zustand store — session/user
│   ├── types/
│   │   └── resume.ts         # Core TypeScript types
│   ├── hooks/
│   │   ├── useDragOrder.ts   # dnd-kit drag logic abstracted
│   │   ├── useExport.ts      # PDF export hook
│   │   └── useSupabaseSync.ts # Debounced Supabase write hook
│   ├── utils/
│   │   └── serialize.ts      # JSON import/export helpers
│   └── App.tsx
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── specs/
│   ├── 01_data_model.md
│   ├── 02_checkable_items.md
│   ├── 03_drag_reorder.md
│   ├── 04_live_preview.md
│   ├── 05_template_designer.md
│   └── 06_pdf_export.md
├── .env.local               # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── public/
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/yourhandle/resumeforge.git
cd resumeforge

# Install
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase project URL and anon key to .env.local

# Run Supabase migrations (requires Supabase CLI)
npx supabase db push

# Dev server
npm run dev

# Build
npm run build
```

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Design Philosophy

- **Dark theme first.** Obsidian background, off-white text, single accent color. The resume output is always light (for printing/PDF), but the builder itself lives in the dark.
- **Lightweight auth.** Magic link login via Supabase — no passwords, no friction. Your resumes are tied to your account and synced across devices.
- **Zero lock-in.** JSON export, PDF export — your data is always portable regardless of where it's stored.
- **Composable templates.** Templates are just React components that receive a `ResumeData` prop. Adding a new template = adding a new component.

---

## Feature Specs

See [`/specs`](./specs/) for detailed implementation specs per feature.

--

## License

MIT
