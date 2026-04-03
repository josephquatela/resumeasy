# Spec 04 — Live Preview Panel

## Overview

The app is split into two panes: a content editor on the left and a live resume preview on the right. The preview updates in real time as the user edits content, toggles items, or changes design settings. The preview always shows a white-background, print-ready document — regardless of the app's dark theme.

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Toolbar: Content Editor | Designer | Analyzer | Export PDF]   │
├────────────────────────┬────────────────────────────────────────┤
│                        │                                        │
│   Editor Pane (left)   │      Preview Pane (right)              │
│   ~45% width           │      ~55% width                        │
│   dark bg              │      light, paper-white resume         │
│   scrollable           │      scrollable                        │
│                        │                                        │
└────────────────────────┴────────────────────────────────────────┘
```

The split is fixed at ~45/55 in v1. A draggable divider is a v2 addition.

On mobile (<768px), the panes stack vertically: editor on top, preview below.

---

## Preview Component

```tsx
// src/components/preview/ResumePreview.tsx

import { useResumeStore } from '../../store/resumeStore';
import { useDesignStore } from '../../store/designStore';
import { DefaultTemplate } from './templates/DefaultTemplate';

export function ResumePreview() {
  const { resume } = useResumeStore();
  const { design } = useDesignStore();

  // Pre-filter to only visible items
  const data = useFilteredResume(resume);

  return (
    <div className="flex-1 bg-zinc-900 overflow-y-auto flex justify-center py-8 px-4">
      {/* Paper container */}
      <div
        id="resume-print-target"
        className="bg-white shadow-2xl"
        style={{
          width: '8.5in',
          minHeight: '11in',
          padding: `${design.marginY}in ${design.marginX}in`,
          fontFamily: design.fontFamily,
          fontSize: `${design.baseFontSize}pt`,
          lineHeight: design.lineHeight,
          color: '#1a1a1a',
        }}
      >
        <DefaultTemplate data={data} design={design} />
      </div>
    </div>
  );
}
```

### `useFilteredResume` hook

Centralizes the "only show visible items" logic so both the preview and PDF renderer use the same data:

```typescript
// src/hooks/useFilteredResume.ts

export function useFilteredResume(resume: ResumeData): FilteredResumeData {
  return useMemo(() => ({
    ...resume,
    sections: resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order),
    experience: resume.experience
      .filter(e => e.visible)
      .sort((a, b) => a.order - b.order)
      .map(e => ({
        ...e,
        bullets: e.bullets.filter(b => b.visible).sort((a, b) => a.order - b.order)
      })),
    education: resume.education.filter(e => e.visible).sort((a, b) => a.order - b.order),
    skills: resume.skills.filter(s => s.visible).sort((a, b) => a.order - b.order),
    projects: resume.projects.filter(p => p.visible).sort((a, b) => a.order - b.order),
  }), [resume]);
}
```

---

## Template System

Templates are React components that accept `FilteredResumeData` + `DesignSettings`:

```tsx
interface TemplateProps {
  data: FilteredResumeData;
  design: DesignSettings;
}

// All templates implement this interface
export function DefaultTemplate({ data, design }: TemplateProps) {
  // Render resume structure
}
```

Adding a new template = creating a new file implementing `TemplateProps`. v1 ships with one template (clean single-column). v2 adds a two-column template.

### Section render order

The template iterates `data.sections` in order to render section blocks:

```tsx
{data.sections.map(section => {
  switch (section.type) {
    case 'experience': return <ExperienceSection key={section.id} items={data.experience} design={design} />;
    case 'education': return <EducationSection key={section.id} items={data.education} design={design} />;
    case 'skills': return <SkillsSection key={section.id} items={data.skills} design={design} />;
    default: return null;
  }
})}
```

This means drag-reordering sections in the editor immediately changes the render order in the preview.

---

## Scale & Zoom

An 8.5in wide paper preview inside a browser window will overflow on most screens. Apply a CSS transform to scale it down to fit:

```tsx
function usePreviewScale(containerRef: RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const paperWidthPx = 8.5 * 96; // 8.5in at 96dpi
      const padding = 64;
      setScale(Math.min(1, (containerWidth - padding) / paperWidthPx));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return scale;
}
```

Apply scale as `transform: scale(${scale}); transform-origin: top center;`.

---

## Performance

The preview re-renders on any store change. This is fine for v1 since resume data is small. If editing becomes sluggish (e.g. on large resumes with many bullets), debounce the text-editing updates with a 150ms delay before committing to the store.