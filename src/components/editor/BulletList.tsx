import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BulletPoint } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { SortableBulletItem } from './SortableBulletItem';

interface BulletListProps {
  expId: string;
  bullets: BulletPoint[];
}

export function BulletList({ expId, bullets }: BulletListProps) {
  const reorderBullets = useResumeStore((s) => s.reorderBullets);

  const sorted = [...bullets].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBullets(expId, String(active.id), String(over.id));
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {sorted.map((bullet) => (
          <SortableBulletItem key={bullet.id} expId={expId} bullet={bullet} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
