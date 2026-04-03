import { GripVertical } from 'lucide-react';

export function DragHandle({ dragHandleProps }: { dragHandleProps?: Record<string, unknown> }) {
  return (
    <button
      {...(dragHandleProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1.5 rounded text-zinc-600 hover:text-zinc-400 transition-all duration-150"
      aria-label="Drag to reorder"
    >
      <GripVertical size={15} />
    </button>
  );
}
