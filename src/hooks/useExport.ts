import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useDesignStore } from '../store/designStore';
import { useFilteredResume } from './useFilteredResume';
import { ResumePDF } from '../components/pdf/ResumePDF';

export function useExport() {
  const resume = useResumeStore((s) => s.resume);
  const design = useDesignStore((s) => s.design);
  const filteredData = useFilteredResume(resume);
  const exportJSON = useResumeStore((s) => s.exportJSON);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!filteredData || !resume) return;
    setIsExporting(true);
    try {
      const blob = await pdf(
        React.createElement(ResumePDF, { data: filteredData, design })
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.contact.name.replace(/\s+/g, '_')}_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportPDF, downloadJSON, isExporting };
}
