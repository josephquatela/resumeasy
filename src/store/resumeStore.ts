import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import {
  ResumeData,
  ResumeRow,
  WorkExperience,
  Education,
  Project,
  SkillGroup,
  BulletPoint,
  ContactInfo,
  Section,
} from '../types/resume';
import { defaultResume } from '../lib/defaults';
import { supabase } from '../lib/supabase';
import { useDesignStore } from './designStore';
import { serializeResume, deserializeResume } from '../utils/serialize';

interface ResumeStore {
  // State
  resume: ResumeData | null;
  allResumes: ResumeRow[];
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;

  // Remote ops
  loadResumes: () => Promise<void>;
  selectResume: (id: string) => Promise<void>;
  createResume: (name?: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  renameResume: (id: string, name: string) => Promise<void>;
  syncToSupabase: () => Promise<void>;

  // Local mutations — sections
  toggleSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;

  // Local mutations — experience
  addExperience: (exp: Omit<WorkExperience, 'id' | 'order'>) => void;
  updateExperience: (id: string, patch: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;
  toggleExperience: (id: string) => void;
  reorderExperience: (activeId: string, overId: string) => void;

  // Local mutations — bullets
  addBullet: (experienceId: string, text?: string) => void;
  updateBullet: (experienceId: string, bulletId: string, patch: Partial<BulletPoint>) => void;
  deleteBullet: (experienceId: string, bulletId: string) => void;
  toggleBullet: (experienceId: string, bulletId: string) => void;
  reorderBullets: (experienceId: string, activeId: string, overId: string) => void;

  // Local mutations — contact & summary
  updateContact: (patch: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;

  // Local mutations — education
  addEducation: (edu: Omit<Education, 'id' | 'order'>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  toggleEducation: (id: string) => void;

  // Local mutations — projects
  addProject: (project: Omit<Project, 'id' | 'order'>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProject: (id: string) => void;
  reorderProjects: (activeId: string, overId: string) => void;

  // Local mutations — skills
  addSkillGroup: (group: Omit<SkillGroup, 'id' | 'order'>) => void;
  updateSkillGroup: (id: string, patch: Partial<SkillGroup>) => void;
  deleteSkillGroup: (id: string) => void;
  toggleSkillGroup: (id: string) => void;
  reorderSkillGroups: (activeId: string, overId: string) => void;

  // Portability
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

// Helper: stamp updatedAt on every local mutation
function touch(resume: ResumeData): ResumeData {
  return { ...resume, updatedAt: new Date().toISOString() };
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: null,
  allResumes: [],
  isSaving: false,
  isLoading: false,
  error: null,

  // ---------------------------------------------------------------------------
  // Remote ops
  // ---------------------------------------------------------------------------

  loadResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as ResumeRow[];
      set({ allResumes: rows });

      if (rows.length === 0) {
        // No resumes exist — create the first one
        await get().createResume('My Resume');
      } else {
        // Auto-select the most recently updated resume
        const first = rows[0];
        set({ resume: first.data });
        // Hydrate design store with this resume's design
        useDesignStore.getState().setDesign(first.design);
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load resumes' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectResume: async (id: string) => {
    const row = get().allResumes.find((r) => r.id === id);
    if (!row) return;
    set({ resume: row.data });
    useDesignStore.getState().setDesign(row.design);
  },

  createResume: async (name = 'My Resume') => {
    set({ isSaving: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      const newResumeData: ResumeData = {
        ...defaultResume,
        id: crypto.randomUUID(),
        name,
        createdAt: now,
        updatedAt: now,
      };
      const design = useDesignStore.getState().design;

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: session.user.id,
          name,
          data: newResumeData,
          design,
        })
        .select()
        .single();

      if (error) throw error;

      const newRow = data as ResumeRow;
      set((s) => ({
        allResumes: [newRow, ...s.allResumes],
        resume: newResumeData,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create resume' });
    } finally {
      set({ isSaving: false });
    }
  },

  deleteResume: async (id: string) => {
    set({ error: null });
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;

      const remaining = get().allResumes.filter((r) => r.id !== id);
      const currentId = get().allResumes.find((r) => r.data.id === get().resume?.id)?.id;
      const deletingActive = currentId === id;

      set({ allResumes: remaining });

      if (deletingActive) {
        if (remaining.length > 0) {
          set({ resume: remaining[0].data });
          useDesignStore.getState().setDesign(remaining[0].design);
        } else {
          set({ resume: null });
          await get().createResume('My Resume');
        }
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete resume' });
    }
  },

  renameResume: async (id: string, name: string) => {
    set({ error: null });
    try {
      const { error } = await supabase.from('resumes').update({ name }).eq('id', id);
      if (error) throw error;

      set((s) => ({
        allResumes: s.allResumes.map((r) => (r.id === id ? { ...r, name } : r)),
        resume:
          s.resume && s.allResumes.find((r) => r.id === id)?.data.id === s.resume.id
            ? { ...s.resume, name }
            : s.resume,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to rename resume' });
    }
  },

  syncToSupabase: async () => {
    const { resume, allResumes } = get();
    if (!resume) return;

    set({ isSaving: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const design = useDesignStore.getState().design;
      const now = new Date().toISOString();

      // Find the DB row that owns this resume data
      const row = allResumes.find((r) => r.data.id === resume.id);

      if (row) {
        const { error } = await supabase
          .from('resumes')
          .update({ data: resume, design, updated_at: now })
          .eq('id', row.id);
        if (error) throw error;

        set((s) => ({
          allResumes: s.allResumes.map((r) =>
            r.id === row.id ? { ...r, data: resume, design, updated_at: now } : r
          ),
        }));
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to sync resume' });
    } finally {
      set({ isSaving: false });
    }
  },

  // ---------------------------------------------------------------------------
  // Local mutations — sections
  // ---------------------------------------------------------------------------

  toggleSection: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          sections: s.resume.sections.map((sec: Section) =>
            sec.id === id ? { ...sec, visible: !sec.visible } : sec
          ),
        }),
      };
    });
  },

  reorderSections: (activeId: string, overId: string) => {
    set((s) => {
      if (!s.resume) return s;
      const sections = s.resume.sections;
      const oldIndex = sections.findIndex((sec: Section) => sec.id === activeId);
      const newIndex = sections.findIndex((sec: Section) => sec.id === overId);
      if (oldIndex === -1 || newIndex === -1) return s;
      const reordered = arrayMove(sections, oldIndex, newIndex).map(
        (sec: Section, i: number) => ({ ...sec, order: i })
      );
      return { resume: touch({ ...s.resume, sections: reordered }) };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — experience
  // ---------------------------------------------------------------------------

  addExperience: (exp) => {
    set((s) => {
      if (!s.resume) return s;
      const newExp: WorkExperience = {
        ...exp,
        id: crypto.randomUUID(),
        order: s.resume.experience.length,
      };
      return {
        resume: touch({ ...s.resume, experience: [...s.resume.experience, newExp] }),
      };
    });
  },

  updateExperience: (id, patch) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) =>
            exp.id === id ? { ...exp, ...patch } : exp
          ),
        }),
      };
    });
  },

  deleteExperience: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      const filtered = s.resume.experience
        .filter((exp: WorkExperience) => exp.id !== id)
        .map((exp: WorkExperience, i: number) => ({ ...exp, order: i }));
      return { resume: touch({ ...s.resume, experience: filtered }) };
    });
  },

  toggleExperience: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) =>
            exp.id === id ? { ...exp, visible: !exp.visible } : exp
          ),
        }),
      };
    });
  },

  reorderExperience: (activeId: string, overId: string) => {
    set((s) => {
      if (!s.resume) return s;
      const experience = s.resume.experience;
      const oldIndex = experience.findIndex((e: WorkExperience) => e.id === activeId);
      const newIndex = experience.findIndex((e: WorkExperience) => e.id === overId);
      if (oldIndex === -1 || newIndex === -1) return s;
      const reordered = arrayMove(experience, oldIndex, newIndex).map(
        (e: WorkExperience, i: number) => ({ ...e, order: i })
      );
      return { resume: touch({ ...s.resume, experience: reordered }) };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — bullets
  // ---------------------------------------------------------------------------

  addBullet: (experienceId: string, text = '') => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) => {
            if (exp.id !== experienceId) return exp;
            const newBullet: BulletPoint = {
              id: crypto.randomUUID(),
              text,
              visible: true,
              order: exp.bullets.length,
            };
            return { ...exp, bullets: [...exp.bullets, newBullet] };
          }),
        }),
      };
    });
  },

  updateBullet: (experienceId: string, bulletId: string, patch: Partial<BulletPoint>) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) => {
            if (exp.id !== experienceId) return exp;
            return {
              ...exp,
              bullets: exp.bullets.map((b: BulletPoint) =>
                b.id === bulletId ? { ...b, ...patch } : b
              ),
            };
          }),
        }),
      };
    });
  },

  deleteBullet: (experienceId: string, bulletId: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) => {
            if (exp.id !== experienceId) return exp;
            const filtered = exp.bullets
              .filter((b: BulletPoint) => b.id !== bulletId)
              .map((b: BulletPoint, i: number) => ({ ...b, order: i }));
            return { ...exp, bullets: filtered };
          }),
        }),
      };
    });
  },

  toggleBullet: (experienceId: string, bulletId: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) => {
            if (exp.id !== experienceId) return exp;
            return {
              ...exp,
              bullets: exp.bullets.map((b: BulletPoint) =>
                b.id === bulletId ? { ...b, visible: !b.visible } : b
              ),
            };
          }),
        }),
      };
    });
  },

  reorderBullets: (experienceId: string, activeId: string, overId: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          experience: s.resume.experience.map((exp: WorkExperience) => {
            if (exp.id !== experienceId) return exp;
            const oldIndex = exp.bullets.findIndex((b: BulletPoint) => b.id === activeId);
            const newIndex = exp.bullets.findIndex((b: BulletPoint) => b.id === overId);
            if (oldIndex === -1 || newIndex === -1) return exp;
            const reordered = arrayMove(exp.bullets, oldIndex, newIndex).map(
              (b: BulletPoint, i: number) => ({ ...b, order: i })
            );
            return { ...exp, bullets: reordered };
          }),
        }),
      };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — contact & summary
  // ---------------------------------------------------------------------------

  updateContact: (patch: Partial<ContactInfo>) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({ ...s.resume, contact: { ...s.resume.contact, ...patch } }),
      };
    });
  },

  updateSummary: (summary: string) => {
    set((s) => {
      if (!s.resume) return s;
      return { resume: touch({ ...s.resume, summary }) };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — education
  // ---------------------------------------------------------------------------

  addEducation: (edu) => {
    set((s) => {
      if (!s.resume) return s;
      const newEdu: Education = {
        ...edu,
        id: crypto.randomUUID(),
        order: s.resume.education.length,
      };
      return {
        resume: touch({ ...s.resume, education: [...s.resume.education, newEdu] }),
      };
    });
  },

  updateEducation: (id: string, patch: Partial<Education>) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          education: s.resume.education.map((edu: Education) =>
            edu.id === id ? { ...edu, ...patch } : edu
          ),
        }),
      };
    });
  },

  deleteEducation: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      const filtered = s.resume.education
        .filter((edu: Education) => edu.id !== id)
        .map((edu: Education, i: number) => ({ ...edu, order: i }));
      return { resume: touch({ ...s.resume, education: filtered }) };
    });
  },

  toggleEducation: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          education: s.resume.education.map((edu: Education) =>
            edu.id === id ? { ...edu, visible: !edu.visible } : edu
          ),
        }),
      };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — projects
  // ---------------------------------------------------------------------------

  addProject: (project) => {
    set((s) => {
      if (!s.resume) return s;
      const newProject: Project = {
        ...project,
        id: crypto.randomUUID(),
        order: s.resume.projects.length,
      };
      return {
        resume: touch({ ...s.resume, projects: [...s.resume.projects, newProject] }),
      };
    });
  },

  updateProject: (id: string, patch: Partial<Project>) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          projects: s.resume.projects.map((p: Project) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        }),
      };
    });
  },

  deleteProject: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      const filtered = s.resume.projects
        .filter((p: Project) => p.id !== id)
        .map((p: Project, i: number) => ({ ...p, order: i }));
      return { resume: touch({ ...s.resume, projects: filtered }) };
    });
  },

  toggleProject: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          projects: s.resume.projects.map((p: Project) =>
            p.id === id ? { ...p, visible: !p.visible } : p
          ),
        }),
      };
    });
  },

  reorderProjects: (activeId: string, overId: string) => {
    set((s) => {
      if (!s.resume) return s;
      const projects = s.resume.projects;
      const oldIndex = projects.findIndex((p: Project) => p.id === activeId);
      const newIndex = projects.findIndex((p: Project) => p.id === overId);
      if (oldIndex === -1 || newIndex === -1) return s;
      const reordered = arrayMove(projects, oldIndex, newIndex).map(
        (p: Project, i: number) => ({ ...p, order: i })
      );
      return { resume: touch({ ...s.resume, projects: reordered }) };
    });
  },

  // ---------------------------------------------------------------------------
  // Local mutations — skills
  // ---------------------------------------------------------------------------

  addSkillGroup: (group) => {
    set((s) => {
      if (!s.resume) return s;
      const newGroup: SkillGroup = {
        ...group,
        id: crypto.randomUUID(),
        order: s.resume.skills.length,
      };
      return {
        resume: touch({ ...s.resume, skills: [...s.resume.skills, newGroup] }),
      };
    });
  },

  updateSkillGroup: (id: string, patch: Partial<SkillGroup>) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          skills: s.resume.skills.map((sg: SkillGroup) =>
            sg.id === id ? { ...sg, ...patch } : sg
          ),
        }),
      };
    });
  },

  deleteSkillGroup: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      const filtered = s.resume.skills
        .filter((sg: SkillGroup) => sg.id !== id)
        .map((sg: SkillGroup, i: number) => ({ ...sg, order: i }));
      return { resume: touch({ ...s.resume, skills: filtered }) };
    });
  },

  toggleSkillGroup: (id: string) => {
    set((s) => {
      if (!s.resume) return s;
      return {
        resume: touch({
          ...s.resume,
          skills: s.resume.skills.map((sg: SkillGroup) =>
            sg.id === id ? { ...sg, visible: !sg.visible } : sg
          ),
        }),
      };
    });
  },

  reorderSkillGroups: (activeId: string, overId: string) => {
    set((s) => {
      if (!s.resume) return s;
      const skills = s.resume.skills;
      const oldIndex = skills.findIndex((sg: SkillGroup) => sg.id === activeId);
      const newIndex = skills.findIndex((sg: SkillGroup) => sg.id === overId);
      if (oldIndex === -1 || newIndex === -1) return s;
      const reordered = arrayMove(skills, oldIndex, newIndex).map(
        (sg: SkillGroup, i: number) => ({ ...sg, order: i })
      );
      return { resume: touch({ ...s.resume, skills: reordered }) };
    });
  },

  // ---------------------------------------------------------------------------
  // Portability
  // ---------------------------------------------------------------------------

  exportJSON: () => {
    const { resume } = get();
    if (!resume) return '{}';
    return serializeResume(resume);
  },

  importJSON: (json: string) => {
    try {
      const imported = deserializeResume(json);
      set({ resume: imported });
    } catch {
      set({ error: 'Invalid resume JSON — could not import.' });
    }
  },
}));
