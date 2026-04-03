import { useDesignStore } from '../../store/designStore';
import { DateFormat } from '../../types/resume';
import { SliderControl } from './controls/SliderControl';

const DATE_FORMAT_OPTIONS: { value: DateFormat; label: string; example: string }[] = [
  { value: 'MM/YYYY', label: 'Numeric', example: '06/2023' },
  { value: 'Mon YYYY', label: 'Short', example: 'Jun 2023' },
  { value: 'Month YYYY', label: 'Full', example: 'June 2023' },
  { value: 'YYYY', label: 'Year only', example: '2023' },
];

export function SettingsTab() {
  const design = useDesignStore((s) => s.design);
  const update = useDesignStore((s) => s.update);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Date Format
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DATE_FORMAT_OPTIONS.map(({ value, label, example }) => (
            <button
              key={value}
              onClick={() => update({ dateFormat: value })}
              className={`flex flex-col px-4 py-3 rounded-lg border transition-all text-left ${
                design.dateFormat === value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-sm font-medium text-zinc-200">{label}</span>
              <span className="text-xs text-zinc-500 mt-0.5 font-mono">{example}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
          Margins
        </p>
        <div className="flex flex-col gap-6">
          <SliderControl
            label="Horizontal Margin"
            value={design.marginX}
            min={0.4}
            max={1.0}
            step={0.05}
            format={(v) => `${v.toFixed(2)}"`}
            onChange={(v) => update({ marginX: v })}
          />
          <SliderControl
            label="Vertical Margin"
            value={design.marginY}
            min={0.4}
            max={1.0}
            step={0.05}
            format={(v) => `${v.toFixed(2)}"`}
            onChange={(v) => update({ marginY: v })}
          />
        </div>
      </div>
    </div>
  );
}
