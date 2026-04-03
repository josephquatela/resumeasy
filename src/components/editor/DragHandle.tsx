import { GripVertical } from 'lucide-react';

export function DragHandle({ dragHandleProps }: { dragHandleProps?: Record<string, unknown> }) {
  return (
    <button
      {...(dragHandleProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 rounded text-zinc-500 hover:text-zinc-300 transition-opacity"
      aria-label="Drag to reorder"
    >
      <GripVertical size={14} />
    </button>
  );
}
