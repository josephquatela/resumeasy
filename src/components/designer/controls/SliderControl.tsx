interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  onChange,
}: SliderControlProps) {
  const displayValue = format ? format(value) : `${value}${unit ?? ''}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-300 font-medium">{label}</span>
        <span className="text-sm text-zinc-400 font-mono tabular-nums bg-zinc-800 px-2 py-0.5 rounded">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}
