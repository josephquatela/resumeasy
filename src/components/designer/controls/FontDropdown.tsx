import { useRef, useState, useEffect } from 'react';
import { FontFamily } from '../../../types/resume';
import { useDesignStore } from '../../../store/designStore';
import {
  saveCustomFont,
  deleteCustomFont,
  listCustomFonts,
  registerFontFromBuffer,
} from '../../../lib/customFonts';

const BUILT_IN_FONTS: { value: FontFamily; label: string; description: string }[] = [
  { value: 'Lora', label: 'Lora', description: 'Classic serif' },
  { value: 'EB Garamond', label: 'EB Garamond', description: 'Elegant, condensed' },
  { value: 'Merriweather', label: 'Merriweather', description: 'High x-height serif' },
  { value: 'Lato', label: 'Lato', description: 'Clean humanist sans' },
  { value: 'Source Sans 3', label: 'Source Sans 3', description: 'Technical, readable' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville', description: 'Modern serif' },
];

export function FontDropdown() {
  const fontFamily = useDesignStore((s) => s.design.fontFamily);
  const update = useDesignStore((s) => s.update);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    listCustomFonts().then(setCustomFonts);
  }, []);

  async function handleFontUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Derive a clean font name from the filename (strip extension)
    const name = file.name.replace(/\.[^.]+$/, '');
    setIsUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      registerFontFromBuffer(name, buffer);
      await saveCustomFont(name, buffer);
      setCustomFonts((prev) => (prev.includes(name) ? prev : [...prev, name]));
      update({ fontFamily: name });
    } finally {
      setIsUploading(false);
      // Reset so the same file can be re-uploaded if needed
      e.target.value = '';
    }
  }

  async function handleDeleteCustomFont(name: string, e: React.MouseEvent) {
    e.stopPropagation();
    await deleteCustomFont(name);
    setCustomFonts((prev) => prev.filter((f) => f !== name));
    if (fontFamily === name) update({ fontFamily: 'Lora' });
  }

  function FontButton({
    value,
    label,
    description,
    onDelete,
  }: {
    value: string;
    label: string;
    description: string;
    onDelete?: (e: React.MouseEvent) => void;
  }) {
    return (
      <button
        onClick={() => update({ fontFamily: value })}
        className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left w-full ${
          fontFamily === value
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'
        }`}
      >
        <span className="text-base text-zinc-100" style={{ fontFamily: value }}>
          {label}
        </span>
        <span className="flex items-center gap-2 ml-3 shrink-0">
          <span className="text-xs text-zinc-500">{description}</span>
          {onDelete && (
            <span
              role="button"
              onClick={onDelete}
              className="text-zinc-600 hover:text-red-400 text-xs leading-none px-1"
              title="Remove font"
            >
              ✕
            </span>
          )}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {BUILT_IN_FONTS.map(({ value, label, description }) => (
        <FontButton key={value} value={value} label={label} description={description} />
      ))}

      {customFonts.length > 0 && (
        <>
          <p className="text-xs text-zinc-500 mt-1 mb-0.5 px-1">Custom fonts</p>
          {customFonts.map((name) => (
            <FontButton
              key={name}
              value={name}
              label={name}
              description="Uploaded"
              onDelete={(e) => handleDeleteCustomFont(name, e)}
            />
          ))}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleFontUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-sm transition-all disabled:opacity-50 mt-1"
      >
        {isUploading ? 'Uploading…' : '+ Upload font'}
      </button>
    </div>
  );
}
