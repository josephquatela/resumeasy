import { useDesignStore } from '../../store/designStore';
import { DateFormat } from '../../types/resume';
import { SliderControl } from './controls/SliderControl';

const DATE_FORMAT_OPTIONS: { value: DateFormat; label: string }[] = [
  { value: 'MM/YYYY', label: 'MM/YYYY (e.g. 06/2023)' },
  { value: 'Mon YYYY', label: 'Mon YYYY (e.g. Jun 2023)' },
  { value: 'Month YYYY', label: 'Month YYYY (e.g. June 2023)' },
  { value: 'YYYY', label: 'YYYY (e.g. 2023)' },
];

export function SettingsTab() {
  const design = useDesignStore((s) => s.design);
  const update = useDesignStore((s) => s.update);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
          Date Format
        </label>
        <select
          value={design.dateFormat}
          onChange={(e) => update({ dateFormat: e.target.value as DateFormat })}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
        >
          {DATE_FORMAT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <SliderControl
        label="Margin X (inches)"
        value={design.marginX}
        min={0.4}
        max={1.0}
        step={0.05}
        format={(v) => `${v.toFixed(2)}in`}
        onChange={(v) => update({ marginX: v })}
      />

      <SliderControl
        label="Margin Y (inches)"
        value={design.marginY}
        min={0.4}
        max={1.0}
        step={0.05}
        format={(v) => `${v.toFixed(2)}in`}
        onChange={(v) => update({ marginY: v })}
      />
    </div>
  );
}
