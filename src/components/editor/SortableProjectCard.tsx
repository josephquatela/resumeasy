import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '../../types/resume';
import { ProjectCard } from './ProjectCard';

interface SortableProjectCardProps {
  project: Project;
}

export function SortableProjectCard({ project }: SortableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div ref={setNodeRef} style={style}>
      <ProjectCard project={project} dragHandleProps={dragHandleProps} />
    </div>
  );
}
