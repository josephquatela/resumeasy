import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkExperience } from '../../types/resume';
import { ExperienceBlock } from './ExperienceBlock';

interface SortableExperienceBlockProps {
  exp: WorkExperience;
}

export function SortableExperienceBlock({ exp }: SortableExperienceBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exp.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div ref={setNodeRef} style={style}>
      <ExperienceBlock exp={exp} dragHandleProps={dragHandleProps} />
    </div>
  );
}
