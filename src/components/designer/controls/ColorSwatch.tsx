interface ColorSwatchProps {
  color: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function ColorSwatch({ color, label, isActive, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-pressed={isActive}
      className={`group flex flex-col items-center gap-1.5 transition-all`}
    >
      <div
        className={`w-10 h-10 rounded-lg transition-all ${
          isActive
            ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-blue-400 scale-110'
            : 'hover:scale-105 hover:ring-1 hover:ring-zinc-500 hover:ring-offset-1 hover:ring-offset-zinc-950'
        }`}
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
        {label}
      </span>
    </button>
  );
}
