import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section } from '../../types/resume';
import { SectionBlock } from './SectionBlock';

interface SortableSectionBlockProps {
  section: Section;
}

export function SortableSectionBlock({ section }: SortableSectionBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionBlock section={section} dragHandleProps={dragHandleProps} />
    </div>
  );
}
