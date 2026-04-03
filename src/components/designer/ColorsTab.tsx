import { useState } from 'react';
import { useDesignStore } from '../../store/designStore';
import { ColorSwatch } from './controls/ColorSwatch';

const PRESET_COLORS = [
  { hex: '#1a1a1a', label: 'Black' },
  { hex: '#374151', label: 'Charcoal' },
  { hex: '#059669', label: 'Emerald' },
  { hex: '#1e3a8a', label: 'Navy' },
  { hex: '#881337', label: 'Burgundy' },
  { hex: '#c2410c', label: 'Rust' },
  { hex: '#475569', label: 'Slate' },
  { hex: '#b45309', label: 'Gold' },
];

export function ColorsTab() {
  const accentColor = useDesignStore((s) => s.design.accentColor);
  const update = useDesignStore((s) => s.update);
  const [hexInput, setHexInput] = useState(accentColor);

  function handleHexCommit() {
    const trimmed = hexInput.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
      update({ accentColor: trimmed });
    } else {
      setHexInput(accentColor);
    }
  }

  function handleSwatchClick(hex: string) {
    update({ accentColor: hex });
    setHexInput(hex);
  }

  function handleColorPicker(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    update({ accentColor: val });
    setHexInput(val);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-3 block">
          Preset Colors
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map(({ hex }) => (
            <ColorSwatch
              key={hex}
              color={hex}
              isActive={accentColor.toLowerCase() === hex.toLowerCase()}
              onClick={() => handleSwatchClick(hex)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
          Custom Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColor}
            onChange={handleColorPicker}
            className="w-9 h-9 rounded cursor-pointer bg-transparent border border-zinc-700 p-0.5"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onBlur={handleHexCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleHexCommit()}
            placeholder="#1a1a1a"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>
    </div>
  );
}
