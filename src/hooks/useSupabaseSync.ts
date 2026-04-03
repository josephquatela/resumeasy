import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useDesignStore } from '../store/designStore';

export function useSupabaseSync() {
  const resume = useResumeStore((s) => s.resume);
  const design = useDesignStore((s) => s.design);
  const syncToSupabase = useResumeStore((s) => s.syncToSupabase);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!resume) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      syncToSupabase();
    }, 800);
    return () => clearTimeout(timerRef.current);
  }, [resume, design]);
}
