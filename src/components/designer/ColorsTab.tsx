import { useState } from 'react';
import { useDesignStore } from '../../store/designStore';
import { ColorSwatch } from './controls/ColorSwatch';

const PRESET_COLORS = [
  { hex: '#1a1a1a', label: 'Black' },
  { hex: '#374151', label: 'Charcoal' },
  { hex: '#1e3a8a', label: 'Navy' },
  { hex: '#059669', label: 'Emerald' },
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
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">
          Accent Color
        </p>
        <div className="grid grid-cols-4 gap-4">
          {PRESET_COLORS.map(({ hex, label }) => (
            <ColorSwatch
              key={hex}
              color={hex}
              label={label}
              isActive={accentColor.toLowerCase() === hex.toLowerCase()}
              onClick={() => handleSwatchClick(hex)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Custom Color
        </p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={accentColor}
              onChange={handleColorPicker}
              className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-2 border-zinc-700 p-1 hover:border-zinc-500 transition-colors"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexCommit}
              onKeyDown={(e) => e.key === 'Enter' && handleHexCommit()}
              placeholder="#1a1a1a"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-sm text-zinc-100 font-mono focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>
        <div
          className="mt-4 h-10 rounded-lg border border-zinc-700"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
