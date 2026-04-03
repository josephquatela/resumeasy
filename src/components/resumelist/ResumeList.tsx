import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export function ResumeList() {
  const allResumes = useResumeStore((s) => s.allResumes);
  const resume = useResumeStore((s) => s.resume);
  const createResume = useResumeStore((s) => s.createResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const selectResume = useResumeStore((s) => s.selectResume);

  function handleCreate() {
    const name = window.prompt('Resume name:', 'New Resume') ?? 'New Resume';
    createResume(name.trim() || 'New Resume');
  }

  return (
    <aside className="w-64 shrink-0 bg-zinc-900 h-full border-r border-zinc-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Resumes</span>
        <button
          onClick={handleCreate}
          title="New resume"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded p-1 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {allResumes.map((row) => {
          const isActive = row.data.id === resume?.id;
          return (
            <button
              key={row.id}
              onClick={() => selectResume(row.id)}
              className={`group w-full flex items-center justify-between text-left px-4 py-2.5 transition-colors relative ${
                isActive
                  ? 'bg-zinc-800 border-l-2 border-blue-500 text-zinc-100'
                  : 'border-l-2 border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
            >
              <span className="text-sm truncate flex-1 pr-2">{row.name}</span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${row.name}"?`)) {
                    deleteResume(row.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity shrink-0"
                aria-label="Delete resume"
              >
                <Trash2 size={13} />
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
