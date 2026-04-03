# Spec 06 — PDF Export

## Overview

The user clicks "Export PDF" and gets a properly formatted, print-ready PDF of their resume. The PDF must faithfully reflect the current visibility state (only checked items) and design settings (font, color, spacing, margins).

---

## Approach: `@react-pdf/renderer`

Use `@react-pdf/renderer` (also called `react-pdf`). This renders a separate React component tree to a PDF natively — no headless browser, no Puppeteer, no print CSS hacks.

```bash
npm install @react-pdf/renderer
```

**Why not `window.print()` or html2pdf?**
- `window.print()` is browser-dependent and breaks on most dark-theme setups
- `html2pdf` / `html2canvas` is pixel-rasterization — fonts render as images, not searchable text
- `@react-pdf/renderer` produces real vector PDF with embedded fonts and selectable text

**Tradeoff:** The PDF template is a separate component tree from the preview template. This means some duplication. It's worth it for PDF quality.

---

## PDF Document Component

```tsx
// src/components/pdf/ResumePDF.tsx

import {
  Document, Page, Text, View, StyleSheet, Font, Link
} from '@react-pdf/renderer';
import { FilteredResumeData, DesignSettings } from '../../types/resume';

// Register fonts
Font.register({
  family: 'Georgia',
  src: '/fonts/Georgia.ttf',
});

interface ResumePDFProps {
  data: FilteredResumeData;
  design: DesignSettings;
}

export function ResumePDF({ data, design }: ResumePDFProps) {
  const styles = createStyles(design);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.contact.name}</Text>
          <Text style={styles.contactLine}>
            {[data.contact.location, data.contact.phone, data.contact.email]
              .filter(Boolean).join(' • ')}
          </Text>
        </View>

        {/* Sections in order */}
        {data.sections.map(section => (
          <SectionPDF key={section.id} section={section} data={data} design={design} styles={styles} />
        ))}
      </Page>
    </Document>
  );
}

function createStyles(design: DesignSettings) {
  return StyleSheet.create({
    page: {
      fontFamily: design.fontFamily,
      fontSize: design.baseFontSize,
      paddingHorizontal: design.marginX * 72,  // 1in = 72pt
      paddingVertical: design.marginY * 72,
      color: '#1a1a1a',
      lineHeight: design.lineHeight,
    },
    header: {
      marginBottom: 10,
    },
    name: {
      fontSize: design.baseFontSize * 2.2,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    contactLine: {
      fontSize: design.baseFontSize * 0.9,
      color: '#555',
    },
    sectionHeader: {
      fontSize: design.baseFontSize * 1.1,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      borderBottomWidth: 1,
      borderBottomColor: design.accentColor,
      paddingBottom: 2,
      marginTop: design.sectionSpacing,
      marginBottom: 6,
    },
    experienceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    company: {
      fontWeight: 'bold',
    },
    dates: {
      color: '#555',
    },
    bulletRow: {
      flexDirection: 'row',
      marginTop: 2,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 8,
      marginTop: 1,
    },
    bulletText: {
      flex: 1,
      lineHeight: design.listLineHeight,
    },
  });
}
```

---

## Export Hook

```typescript
// src/hooks/useExport.ts

import { pdf } from '@react-pdf/renderer';
import { useResumeStore } from '../store/resumeStore';
import { useDesignStore } from '../store/designStore';
import { useFilteredResume } from './useFilteredResume';
import { ResumePDF } from '../components/pdf/ResumePDF';

export function useExport() {
  const { resume } = useResumeStore();
  const { design } = useDesignStore();
  const filteredData = useFilteredResume(resume);

  const [isExporting, setIsExporting] = useState(false);

  async function exportPDF() {
    setIsExporting(true);
    try {
      const blob = await pdf(
        <ResumePDF data={filteredData} design={design} />
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
  }

  return { exportPDF, isExporting };
}
```

---

## Font Handling

`@react-pdf/renderer` requires fonts to be registered from actual font files, not Google Fonts CDN URLs (CORS issues in the PDF renderer context). Options:

1. **Bundle fonts with the app** — download TTFs into `/public/fonts/`, reference as `/fonts/Georgia.ttf`. Simple, works offline. Best for v1.

2. **Fetch and cache at runtime** — fetch from Google Fonts API, cache in IndexedDB. More fonts, larger complexity. v2.

For v1, bundle 2–3 core fonts (Georgia, Lato, Libre Baskerville) and expand later.

---

## Export Button UX

```tsx
// In Toolbar
const { exportPDF, isExporting } = useExport();

<button
  onClick={exportPDF}
  disabled={isExporting}
  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded font-medium
             hover:bg-zinc-100 disabled:opacity-50 transition-colors"
>
  {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
  {isExporting ? 'Generating...' : 'Export PDF'}
</button>
```

---

## Known Limitations of `@react-pdf/renderer`

| Limitation | Workaround |
|---|---|
| No CSS support — uses its own StyleSheet | Duplicate styles from preview in PDF stylesheet |
| No web fonts from CDN | Bundle fonts locally |
| `flexbox` only for layout (no grid) | Design PDF template with flex |
| No `:hover`, no animation | N/A — PDF is static |
| Limited text features (no `white-space: pre`) | Normalize text before passing |

The PDF template is intentionally simpler than the preview template. Accuracy over pixel-perfection.

---

## Stretch: Print Preview Mode

A "Print Preview" button opens the PDF in a new browser tab using `<PDFViewer>` from `@react-pdf/renderer` instead of downloading it. Useful for quick review before download.

```tsx
import { PDFViewer } from '@react-pdf/renderer';

// In a modal/drawer:
<PDFViewer width="100%" height="100%">
  <ResumePDF data={filteredData} design={design} />
</PDFViewer>
```