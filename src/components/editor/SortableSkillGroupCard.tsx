import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkillGroup } from '../../types/resume';
import { SkillGroupCard } from './SkillGroupCard';

interface SortableSkillGroupCardProps {
  group: SkillGroup;
}

export function SortableSkillGroupCard({ group }: SortableSkillGroupCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div ref={setNodeRef} style={style}>
      <SkillGroupCard group={group} dragHandleProps={dragHandleProps} />
    </div>
  );
}
