import { useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { SectionList } from './SectionList';

export function EditorPanel() {
  const resume = useResumeStore((s) => s.resume);
  const allResumes = useResumeStore((s) => s.allResumes);
  const renameResume = useResumeStore((s) => s.renameResume);

  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    if (!resume) return;
    setNameValue(resume.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitRename() {
    if (!resume) return;
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== resume.name) {
      const row = allResumes.find((r) => r.data.id === resume.id);
      if (row) renameResume(row.id, trimmed);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') setIsEditing(false);
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {resume && (
        <div className="px-4 pt-4 pb-2">
          {isEditing ? (
            <input
              ref={inputRef}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleKeyDown}
              className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:border-zinc-400 w-full max-w-xs"
            />
          ) : (
            <button
              onClick={startEditing}
              title="Click to rename"
              className="group flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <span className="truncate max-w-xs">{resume.name}</span>
              <Pencil size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
            </button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 pt-2">
        <SectionList />
      </div>
    </div>
  );
}
