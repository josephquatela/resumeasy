import { useResumeStore } from '../../store/resumeStore';

export function SectionsTab() {
  const resume = useResumeStore((s) => s.resume);
  const toggleSection = useResumeStore((s) => s.toggleSection);

  if (!resume) {
    return (
      <p className="text-sm text-zinc-500">No resume loaded.</p>
    );
  }

  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-zinc-500 mb-1">Toggle section visibility</p>
      {sorted.map((section) => (
        <label
          key={section.id}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={section.visible}
            onChange={() => toggleSection(section.id)}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 cursor-pointer accent-blue-500"
          />
          <span className="text-sm text-zinc-300 group-hover:text-white transition-colors capitalize">
            {section.label}
          </span>
        </label>
      ))}
    </div>
  );
}
