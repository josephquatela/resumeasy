/**
 * Shim for src/components/pdf/ResumePDF.tsx — created by the frontend agent.
 * This declaration allows useExport.ts to type-check before that file exists.
 * Once ResumePDF.tsx is in place this shim is a no-op (the real module wins).
 */
declare module '*/components/pdf/ResumePDF' {
  import type React from 'react';
  import type { DocumentProps } from '@react-pdf/renderer';
  import type { FilteredResumeData, DesignSettings } from './resume';

  export interface ResumePDFProps extends DocumentProps {
    data: FilteredResumeData;
    design: DesignSettings;
  }

  export const ResumePDF: React.ComponentType<ResumePDFProps>;
}
