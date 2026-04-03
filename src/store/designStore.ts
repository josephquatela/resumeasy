import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DesignSettings, defaultDesign } from '../types/resume';

interface DesignStore {
  design: DesignSettings;
  update: (updates: Partial<DesignSettings>) => void;
  reset: () => void;
  setDesign: (design: DesignSettings) => void; // keep for resumeStore compatibility
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => ({
      design: defaultDesign,
      update: (updates) =>
        set((state) => ({ design: { ...state.design, ...updates } })),
      reset: () => set({ design: defaultDesign }),
      setDesign: (design) => set({ design }),
    }),
    { name: 'resumeasy-design' }
  )
);
