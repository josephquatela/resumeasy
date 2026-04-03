import { Trash2 } from 'lucide-react';
import { BulletPoint } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';

interface BulletItemProps {
  expId: string;
  bullet: BulletPoint;
  dragHandleProps?: Record<string, unknown>;
}

export function BulletItem({ expId, bullet, dragHandleProps }: BulletItemProps) {
  const updateBullet = useResumeStore((s) => s.updateBullet);
  const deleteBullet = useResumeStore((s) => s.deleteBullet);
  const toggleBullet = useResumeStore((s) => s.toggleBullet);

  return (
    <div className="group flex items-start gap-2 py-1">
      <DragHandle dragHandleProps={dragHandleProps} />
      <Checkbox checked={bullet.visible} onChange={() => toggleBullet(expId, bullet.id)} />
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          updateBullet(expId, bullet.id, { text: e.currentTarget.textContent ?? '' })
        }
        className={`flex-1 text-sm outline-none bg-transparent min-w-0 ${
          !bullet.visible ? 'line-through opacity-40' : 'text-zinc-200'
        }`}
      >
        {bullet.text}
      </div>
      <button
        onClick={() => deleteBullet(expId, bullet.id)}
        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 shrink-0 mt-0.5 transition-opacity"
        aria-label="Delete bullet"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
