import { useResumeStore } from '../../store/resumeStore';

export function SectionsTab() {
  const resume = useResumeStore((s) => s.resume);
  const toggleSection = useResumeStore((s) => s.toggleSection);

  if (!resume) {
    return <p className="text-sm text-zinc-500">No resume loaded.</p>;
  }

  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
        Section Visibility
      </p>
      {sorted.map((section) => (
        <button
          key={section.id}
          onClick={() => toggleSection(section.id)}
          className={`flex items-center justify-between px-4 py-3.5 rounded-lg border transition-all text-left ${
            section.visible
              ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
              : 'border-zinc-800 bg-transparent opacity-50 hover:opacity-70'
          }`}
        >
          <span className={`text-sm font-medium ${section.visible ? 'text-zinc-100' : 'text-zinc-400 line-through'}`}>
            {section.label}
          </span>
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              section.visible
                ? 'bg-blue-500 border-blue-500'
                : 'bg-transparent border-zinc-600'
            }`}
          >
            {section.visible && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
