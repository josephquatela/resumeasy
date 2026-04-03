import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useResumeStore } from '../../store/resumeStore';
import { SortableSectionBlock } from './SortableSectionBlock';

export function SectionList() {
  const resume = useResumeStore((s) => s.resume);
  const reorderSections = useResumeStore((s) => s.reorderSections);

  const sorted = [...(resume?.sections ?? [])].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id));
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sorted.map((section) => (
          <SortableSectionBlock key={section.id} section={section} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
