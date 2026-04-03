import { useDesignStore } from '../../store/designStore';
import { FontDropdown } from './controls/FontDropdown';
import { SliderControl } from './controls/SliderControl';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

export function PresentationTab() {
  const design = useDesignStore((s) => s.design);
  const update = useDesignStore((s) => s.update);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionLabel>Font Family</SectionLabel>
        <FontDropdown />
      </div>

      <div className="h-px bg-zinc-800" />

      <div>
        <SectionLabel>Font Sizes</SectionLabel>
        <div className="flex flex-col gap-6">
          <SliderControl
            label="Name"
            value={design.nameFontSize}
            min={16}
            max={32}
            step={1}
            unit="pt"
            onChange={(v) => update({ nameFontSize: v })}
          />
          <SliderControl
            label="Section Header"
            value={design.sectionHeaderFontSize}
            min={8}
            max={14}
            step={0.5}
            unit="pt"
            onChange={(v) => update({ sectionHeaderFontSize: v })}
          />
          <SliderControl
            label="Subheader"
            value={design.subheaderFontSize}
            min={8}
            max={13}
            step={0.5}
            unit="pt"
            onChange={(v) => update({ subheaderFontSize: v })}
          />
          <SliderControl
            label="Body"
            value={design.baseFontSize}
            min={9}
            max={12}
            step={0.5}
            unit="pt"
            onChange={(v) => update({ baseFontSize: v })}
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div>
        <SectionLabel>Spacing</SectionLabel>
        <div className="flex flex-col gap-6">
          <SliderControl
            label="Line Height"
            value={design.lineHeight}
            min={1.1}
            max={1.8}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(v) => update({ lineHeight: v })}
          />
          <SliderControl
            label="Bullet Line Height"
            value={design.listLineHeight}
            min={1.1}
            max={1.8}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(v) => update({ listLineHeight: v })}
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div>
        <SectionLabel>Section Spacing</SectionLabel>
        <SliderControl
          label="Between Sections"
          value={design.sectionSpacing}
          min={8}
          max={24}
          step={1}
          unit="px"
          onChange={(v) => update({ sectionSpacing: v })}
        />
      </div>
    </div>
  );
}
