interface ColorSwatchProps {
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export function ColorSwatch({ color, isActive, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={color}
      className={`w-6 h-6 rounded transition-all ${
        isActive ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-white scale-110' : 'hover:scale-110'
      }`}
      style={{ backgroundColor: color }}
      aria-pressed={isActive}
    />
  );
}
