import { useMemo } from 'react';
import { ResumeData, FilteredResumeData } from '../types/resume';

export function useFilteredResume(resume: ResumeData | null): FilteredResumeData | null {
  return useMemo(() => {
    if (!resume) return null;
    return {
      ...resume,
      sections: resume.sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order),
      experience: resume.experience
        .filter((e) => e.visible)
        .sort((a, b) => a.order - b.order)
        .map((e) => ({
          ...e,
          bullets: e.bullets
            .filter((b) => b.visible)
            .sort((a, b) => a.order - b.order),
        })),
      education: resume.education
        .filter((e) => e.visible)
        .sort((a, b) => a.order - b.order),
      skills: resume.skills
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order),
      projects: resume.projects
        .filter((p) => p.visible)
        .sort((a, b) => a.order - b.order)
        .map((p) => ({
          ...p,
          bullets: p.bullets
            .filter((b) => b.visible)
            .sort((a, b) => a.order - b.order),
        })),
    };
  }, [resume]);
}
