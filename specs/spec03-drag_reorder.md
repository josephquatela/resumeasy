# Spec 03 — Drag-and-Drop Reordering

## Overview

Users can reorder both top-level sections (e.g. move Education above Experience) and items within a section (e.g. reorder bullet points or job blocks). Drag is triggered by a handle icon, not the entire row, to avoid conflicts with checkbox clicks and text editing.

---

## Library Choice: `@dnd-kit`

Use `@dnd-kit/core` + `@dnd-kit/sortable`. Reasons:
- Pointer + touch support built in
- Composable — separate contexts for sections vs. bullets
- Accessible by default (keyboard drag supported)
- No jQuery, no legacy dep tree
- Actively maintained as of 2025

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Drag Contexts

There are **three independent sortable contexts**:

| Context | Draggable Items | Scope |
|---|---|---|
| `SectionList` | Top-level sections | Full resume layout order |
| `ExperienceList` | Individual job blocks within Experience | Within the Experience section only |
| `BulletList` | Bullet points within a single job | Within one job block |

Each context is a separate `<SortableContext>` with its own items array.

---

## Implementation Pattern

### 1. Wrap the section list

```tsx
// SectionList.tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useResumeStore } from '../../store/resumeStore';

export function SectionList() {
  const { resume, reorderSections } = useResumeStore();
  const sectionIds = resume.sections
    .sort((a, b) => a.order - b.order)
    .map(s => s.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = sectionIds.indexOf(active.id as string);
    const toIndex = sectionIds.indexOf(over.id as string);
    reorderSections(fromIndex, toIndex);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
        {resume.sections.sort((a, b) => a.order - b.order).map(section => (
          <SortableSectionBlock key={section.id} section={section} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### 2. Make items sortable

```tsx
// SortableSectionBlock.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableSectionBlock({ section }: { section: Section }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionBlock
        section={section}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
```

### 3. Drag handle UI

```tsx
// DragHandle.tsx
export function DragHandle({ dragHandleProps }: { dragHandleProps: any }) {
  return (
    <button
      {...dragHandleProps}
      className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing
                 p-1 rounded text-zinc-500 hover:text-zinc-300 transition-opacity"
      aria-label="Drag to reorder"
    >
      <GripVertical size={14} />
    </button>
  );
}
```

The handle is only visible on `group-hover` of the parent row, keeping the UI clean.

---

## Store Reorder Actions

Use `arrayMove` from `@dnd-kit/sortable` to recompute order:

```typescript
import { arrayMove } from '@dnd-kit/sortable';

reorderSections: (fromIndex, toIndex) =>
  set(state => {
    const sorted = [...state.resume.sections].sort((a, b) => a.order - b.order);
    const reordered = arrayMove(sorted, fromIndex, toIndex);
    return {
      resume: {
        ...state.resume,
        sections: reordered.map((s, i) => ({ ...s, order: i }))
      }
    };
  }),

reorderBullets: (expId, fromIndex, toIndex) =>
  set(state => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              bullets: arrayMove(
                [...exp.bullets].sort((a, b) => a.order - b.order),
                fromIndex,
                toIndex
              ).map((b, i) => ({ ...b, order: i }))
            }
          : exp
      )
    }
  })),
```

---

## Drag Overlay (Polish)

Use `<DragOverlay>` to show a floating "ghost" of the item being dragged, rather than an empty placeholder:

```tsx
import { DragOverlay } from '@dnd-kit/core';

// Inside DndContext:
<DragOverlay>
  {activeId ? <DragGhost id={activeId} /> : null}
</DragOverlay>
```

The ghost renders a simplified, non-interactive version of the item at 90% opacity with a subtle box shadow to indicate it's floating.

---

## Constraints

- Section drag: only reorders sections, not individual experience items across sections
- Bullet drag: scoped to a single job block — bullets cannot be dragged between jobs in v1
- Drag is disabled when the editor is in a text-editing state (detect via `document.activeElement`)