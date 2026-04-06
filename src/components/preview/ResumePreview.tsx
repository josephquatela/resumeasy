import { useState, useEffect } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { useResumeStore } from '../../store/resumeStore';
import { useDesignStore } from '../../store/designStore';
import { useFilteredResume } from '../../hooks/useFilteredResume';
import { ResumePDF } from '../pdf/ResumePDF';
import { FilteredResumeData, DesignSettings } from '../../types/resume';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function PdfPreview({ data, design }: { data: FilteredResumeData; design: DesignSettings }) {
  return (
    <BlobProvider document={<ResumePDF data={data} design={design} />}>
      {({ url, loading, error }) => {
        if (error) {
          return (
            <div className="flex items-center justify-center h-full bg-zinc-900 text-red-400 text-sm px-6 text-center">
              Failed to render preview: {error.message}
            </div>
          );
        }
        if (loading || !url) {
          return (
            <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-500 text-sm">
              <div className="animate-spin border-t-2 border-zinc-500 rounded-full w-5 h-5" />
            </div>
          );
        }
        return (
          <iframe
            src={url}
            title="Resume preview"
            style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
          />
        );
      }}
    </BlobProvider>
  );
}

export function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const design = useDesignStore((s) => s.design);
  const filteredData = useFilteredResume(resume);

  const debouncedData = useDebounce<FilteredResumeData | null>(filteredData, 300);
  const debouncedDesign = useDebounce(design, 300);

  if (!debouncedData) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-400 text-sm">
        No resume loaded. Create or select a resume.
      </div>
    );
  }

  const previewKey = JSON.stringify({ data: debouncedData, design: debouncedDesign });
  return <PdfPreview key={previewKey} data={debouncedData} design={debouncedDesign} />;
}
