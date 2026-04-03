import { Plus, Trash2, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

interface ResumeListProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ResumeList({ isOpen, onToggle }: ResumeListProps) {
  const allResumes = useResumeStore((s) => s.allResumes);
  const resume = useResumeStore((s) => s.resume);
  const createResume = useResumeStore((s) => s.createResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const selectResume = useResumeStore((s) => s.selectResume);

  function handleCreate() {
    const name = window.prompt('Resume name:', 'New Resume') ?? 'New Resume';
    createResume(name.trim() || 'New Resume');
  }

  // Collapsed: thin icon strip
  if (!isOpen) {
    return (
      <aside className="w-12 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-3 transition-all duration-200">
        <button
          onClick={onToggle}
          title="Expand sidebar"
          className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <PanelLeftOpen size={16} />
        </button>
        <div className="w-px h-4 bg-zinc-700" />
        {allResumes.map((row) => {
          const isActive = row.data.id === resume?.id;
          return (
            <button
              key={row.id}
              onClick={() => selectResume(row.id)}
              title={row.name}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <FileText size={15} />
            </button>
          );
        })}
        <button
          onClick={handleCreate}
          title="New resume"
          className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={15} />
        </button>
      </aside>
    );
  }

  // Expanded
  return (
    <aside className="w-60 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          My Resumes
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreate}
            title="New resume"
            className="w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors duration-150"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors duration-150"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {allResumes.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-zinc-500">No resumes yet</p>
            <p className="text-xs text-zinc-600 mt-1">Click + to create one</p>
          </div>
        )}
        {allResumes.map((row) => {
          const isActive = row.data.id === resume?.id;
          return (
            <button
              key={row.id}
              onClick={() => selectResume(row.id)}
              className={`group w-full flex items-center justify-between text-left px-4 py-3 transition-colors duration-150 relative ${
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
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity duration-150 shrink-0"
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
