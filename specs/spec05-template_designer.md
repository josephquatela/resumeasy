# Spec 05 — Template Designer

## Overview

The Designer panel lets users customize the visual appearance of their resume without touching the content. Controls include font family, font size, line height, accent color, margins, and date format. Changes reflect instantly in the live preview. All settings are stored in a separate `designStore` so they're decoupled from content data.

---

## Design Settings Type

```typescript
// Appended to src/types/resume.ts

export type DateFormat = 'MM/YYYY' | 'Mon YYYY' | 'Month YYYY' | 'YYYY';
export type FontFamily = 'Georgia' | 'Garamond' | 'Merriweather' | 'Lato' | 'Source Sans Pro' | 'Libre Baskerville';

export interface DesignSettings {
  fontFamily: FontFamily;
  baseFontSize: number;      // pt, range: 9–12
  lineHeight: number;        // e.g. 1.3, range: 1.1–1.8
  listLineHeight: number;    // separate control for bullet spacing
  accentColor: string;       // hex string
  marginX: number;           // inches, range: 0.4–1.0
  marginY: number;           // inches, range: 0.4–1.0
  dateFormat: DateFormat;
  sectionSpacing: number;    // px between sections, range: 8–24
  template: 'default';       // v2 will expand this
}

export const defaultDesign: DesignSettings = {
  fontFamily: 'Georgia',
  baseFontSize: 10,
  lineHeight: 1.35,
  listLineHeight: 1.3,
  accentColor: '#1a1a1a',
  marginX: 0.65,
  marginY: 0.65,
  dateFormat: 'MM/YYYY',
  sectionSpacing: 14,
  template: 'default',
};
```

---

## Design Store

```typescript
// src/store/designStore.ts

interface DesignStore {
  design: DesignSettings;
  update: (updates: Partial<DesignSettings>) => void;
  reset: () => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => ({
      design: defaultDesign,
      update: (updates) =>
        set(state => ({ design: { ...state.design, ...updates } })),
      reset: () => set({ design: defaultDesign }),
    }),
    { name: 'resumeforge-design' }
  )
);
```

---

## Designer Panel UI

The panel has four sub-tabs:

### Tab 1: Presentation
Font and spacing controls.

```
Font Family       [Dropdown: Georgia, Lato, Garamond, etc.]
Font Size         [Slider: 9–12pt]
Line Height       [Slider: 110%–180%]
List Line Height  [Slider: 110%–180%]
Section Spacing   [Slider: tight → loose]
```

**Font dropdown:** Renders each option in its own font for visual selection. Only embed fonts that work well at small sizes and are resume-appropriate.

Suggested font set:
| Font | Character |
|---|---|
| Georgia | Classic serif, ATS-safe |
| Garamond | Elegant, slightly condensed |
| Libre Baskerville | Modern serif |
| Lato | Clean humanist sans |
| Source Sans Pro | Technical, readable |
| Merriweather | High x-height serif |

All are available via Google Fonts. Load them lazily when selected.

### Tab 2: Colors

```
Accent Color   [Swatch grid + custom color picker]
```

Accent color is used for:
- Section header lines/borders
- Company name or name header
- Link colors

Preset swatches (8–10): black, charcoal, emerald, navy, burgundy, rust, slate, gold. Plus a custom HEX input and a native `<input type="color">` picker.

### Tab 3: Sections

Controls for which sections appear and their display labels. Mirrors the visibility toggles in the Content Editor but as a summary view. In v1, this can be a simple list of checkboxes.

### Tab 4: Settings

```
Date Format    [Dropdown: MM/YYYY | Mon YYYY | Month YYYY | YYYY]
Margins        [Two sliders: horizontal, vertical (in inches)]
```

---

## Component Structure

```
DesignerPanel/
  DesignerPanel.tsx        # Tab container
  PresentationTab.tsx      # Font + spacing controls
  ColorsTab.tsx            # Accent color picker
  SectionsTab.tsx          # Section visibility summary
  SettingsTab.tsx          # Date format, margins
  controls/
    FontDropdown.tsx
    SliderControl.tsx      # Labeled slider with value display
    ColorSwatch.tsx
    ColorPicker.tsx
```

### `SliderControl.tsx`

```tsx
interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;           // e.g. "pt", "%", "in"
  format?: (v: number) => string;
  onChange: (v: number) => void;
}
```

---

## Applying Design Settings to Preview

The preview root element receives all design tokens as inline styles or CSS custom properties:

```tsx
<div
  id="resume-print-target"
  style={{
    '--accent': design.accentColor,
    '--font': design.fontFamily,
    '--base-size': `${design.baseFontSize}pt`,
    '--line-height': design.lineHeight,
    '--section-gap': `${design.sectionSpacing}px`,
    fontFamily: `var(--font)`,
    fontSize: `var(--base-size)`,
    lineHeight: `var(--line-height)`,
    padding: `${design.marginY}in ${design.marginX}in`,
  } as CSSProperties}
>
```

Template components reference `var(--accent)` for colored elements, keeping templates decoupled from the design store.

---

## "Advanced" vs Basic

In v1, all controls are available without a paywall. That's the whole point of this project. Keep the full Designer panel unlocked.