# Spec 02 — Checkable / Uncheckable Line Items

## Overview

The killer feature. The user should be able to toggle any bullet point, job, section, or skill on/off. Toggled-off items are hidden from the preview and PDF export, but remain fully editable in the content editor. This lets users tailor the same base resume to different job applications without duplicate documents.

---

## Interaction Model

### Hierarchy of toggleability

Every level of the resume tree is independently toggleable:

```
☑ Section (e.g. Work Experience)        → hides entire section from preview
  ☑ Experience (e.g. Alo Yoga)          → hides that job block
    ☑ Bullet (e.g. "Led product...")    → hides just that bullet
```

Toggling a parent off does **not** change the state of its children — it just hides the parent container. When the parent is re-enabled, children render at their last known visibility state.

### Visual treatment in the editor

| State | Appearance |
|---|---|
| Visible (`visible: true`) | Full opacity, dark checkbox filled with accent color |
| Hidden (`visible: false`) | Reduced opacity (40%), checkbox empty, subtle strikethrough on text |

The content remains readable and editable at reduced opacity — not greyed out to the point of being unusable.

---

## Component Spec

### `BulletItem.tsx`

```tsx
interface BulletItemProps {
  bullet: BulletPoint;
  expId: string;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
  dragHandleProps?: DraggableAttributes; // from dnd-kit, see Spec 03
}
```

**Anatomy:**
```
[ drag handle ] [ checkbox ] [ bullet text (inline editable) ] [ delete icon ]
```

- **Drag handle:** six-dot icon, only visible on hover. Cursor changes to `grab`.
- **Checkbox:** custom styled, not a native `<input type="checkbox">`. Uses a small square with accent color fill when checked.
- **Text:** `contentEditable` div or controlled `<textarea>` that auto-resizes. On blur, commits to store.
- **Delete icon:** trash icon, appears on hover only. Requires no confirmation (undo-friendly with Cmd+Z would be a v2 addition).

### `ExperienceBlock.tsx`

```tsx
interface ExperienceBlockProps {
  experience: WorkExperience;
  onToggle: () => void;
  onToggleBullet: (bulletId: string) => void;
  dragHandleProps?: DraggableAttributes;
}
```

**Anatomy:**
```
[ drag handle ] [ checkbox ] [ Company Name ] [ dates ]
                              [ Job Title • Employment Type ]
                              [ bullet list (each with own checkbox) ]
                              [ + Add Bullet ]
```

### `SectionBlock.tsx`

```tsx
interface SectionBlockProps {
  section: Section;
  onToggle: () => void;
  children: React.ReactNode;
  dragHandleProps?: DraggableAttributes;
}
```

Collapsible via a chevron. The `visible` toggle is independent of the collapsed/expanded state of the editor accordion — collapsing just hides the children in the editor UI, toggling hides them from the resume output.

---

## Store Actions Used

```typescript
// Toggle entire section
toggleSection(sectionId);

// Toggle a specific job
toggleExperience(expId);

// Toggle a specific bullet
toggleBullet(expId, bulletId);
```

Each toggle is a simple immutable update:
```typescript
toggleBullet: (expId, bulletId) =>
  set(state => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              bullets: exp.bullets.map(b =>
                b.id === bulletId ? { ...b, visible: !b.visible } : b
              )
            }
          : exp
      )
    }
  }))
```

---

## Preview Filtering

The preview and PDF renderer both filter on `visible`:

```typescript
// In ResumePreview.tsx
const visibleExperience = resume.experience
  .filter(e => e.visible)
  .sort((a, b) => a.order - b.order)
  .map(e => ({
    ...e,
    bullets: e.bullets.filter(b => b.visible).sort((a, b) => a.order - b.order)
  }));
```

No conditional rendering logic needed inside template components — they always receive pre-filtered data.

---

## Accessibility

- All checkboxes use `role="checkbox"` and `aria-checked`
- Keyboard: `Space` to toggle focused checkbox
- Labels are associated with their controls
- Reduced-opacity hidden items still have full keyboard focus