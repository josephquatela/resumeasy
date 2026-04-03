import { useRef, useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useDesignStore } from '../../store/designStore';
import { useFilteredResume } from '../../hooks/useFilteredResume';
import { DefaultTemplate } from './templates/DefaultTemplate';

function usePreviewScale(containerRef: React.RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const paperWidthPx = 8.5 * 96;
      const padding = 64;
      setScale(Math.min(1, (containerWidth - padding) / paperWidthPx));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return scale;
}

export function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const design = useDesignStore((s) => s.design);
  const filteredData = useFilteredResume(resume);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = usePreviewScale(containerRef);

  if (!filteredData) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-400 text-sm">
        No resume loaded. Create or select a resume.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-zinc-900 overflow-y-auto flex justify-center py-8 h-full"
    >
      <div
        id="resume-print-target"
        className="bg-white shadow-2xl"
        style={{
          width: '8.5in',
          minHeight: '11in',
          padding: `${design.marginY}in ${design.marginX}in`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          '--accent': design.accentColor,
        } as React.CSSProperties}
      >
        <DefaultTemplate data={filteredData} design={design} />
      </div>
    </div>
  );
}
