import { useDesignStore } from '../../store/designStore';
import { FontDropdown } from './controls/FontDropdown';
import { SliderControl } from './controls/SliderControl';

export function PresentationTab() {
  const design = useDesignStore((s) => s.design);
  const update = useDesignStore((s) => s.update);

  return (
    <div className="flex flex-col gap-5">
      <FontDropdown />

      <SliderControl
        label="Font Size"
        value={design.baseFontSize}
        min={9}
        max={12}
        step={0.5}
        unit="pt"
        onChange={(v) => update({ baseFontSize: v })}
      />

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
        label="List Line Height"
        value={design.listLineHeight}
        min={1.1}
        max={1.8}
        step={0.05}
        format={(v) => v.toFixed(2)}
        onChange={(v) => update({ listLineHeight: v })}
      />

      <SliderControl
        label="Section Spacing"
        value={design.sectionSpacing}
        min={8}
        max={24}
        step={1}
        unit="px"
        onChange={(v) => update({ sectionSpacing: v })}
      />
    </div>
  );
}
