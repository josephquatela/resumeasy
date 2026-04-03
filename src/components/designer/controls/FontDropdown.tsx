import { FontFamily } from '../../../types/resume';
import { useDesignStore } from '../../../store/designStore';

const FONT_OPTIONS: { value: FontFamily; label: string; description: string }[] = [
  { value: 'Georgia', label: 'Georgia', description: 'Classic serif' },
  { value: 'Garamond', label: 'Garamond', description: 'Elegant, condensed' },
  { value: 'Merriweather', label: 'Merriweather', description: 'High x-height serif' },
  { value: 'Lato', label: 'Lato', description: 'Clean humanist sans' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', description: 'Technical, readable' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville', description: 'Modern serif' },
];

export function FontDropdown() {
  const fontFamily = useDesignStore((s) => s.design.fontFamily);
  const update = useDesignStore((s) => s.update);

  return (
    <div className="flex flex-col gap-2">
      {FONT_OPTIONS.map(({ value, label, description }) => (
        <button
          key={value}
          onClick={() => update({ fontFamily: value })}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left ${
            fontFamily === value
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'
          }`}
        >
          <span
            className="text-base text-zinc-100"
            style={{ fontFamily: value }}
          >
            {label}
          </span>
          <span className="text-xs text-zinc-500 ml-3 shrink-0">{description}</span>
        </button>
      ))}
    </div>
  );
}
