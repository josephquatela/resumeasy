import { FontFamily } from '../../../types/resume';
import { useDesignStore } from '../../../store/designStore';

const FONT_OPTIONS: FontFamily[] = [
  'Georgia',
  'Garamond',
  'Merriweather',
  'Lato',
  'Source Sans Pro',
  'Libre Baskerville',
];

export function FontDropdown() {
  const fontFamily = useDesignStore((s) => s.design.fontFamily);
  const update = useDesignStore((s) => s.update);

  return (
    <div>
      <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
        Font Family
      </label>
      <select
        value={fontFamily}
        onChange={(e) => update({ fontFamily: e.target.value as FontFamily })}
        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </select>
    </div>
  );
}
