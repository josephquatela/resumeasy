import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkExperience } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { SortableExperienceBlock } from './SortableExperienceBlock';

interface ExperienceListProps {
  experience: WorkExperience[];
}

export function ExperienceList({ experience }: ExperienceListProps) {
  const reorderExperience = useResumeStore((s) => s.reorderExperience);

  const sorted = [...experience].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderExperience(String(active.id), String(over.id));
    }
  }

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((exp) => (
            <SortableExperienceBlock key={exp.id} exp={exp} />
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={() => console.log('Add Experience — stub for v1')}
        className="mt-2 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-2 text-sm transition-colors duration-150"
      >
        + Add Experience
      </button>
    </div>
  );
}
