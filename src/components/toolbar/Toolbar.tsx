import { useState, useRef } from 'react';
import { Download, LogOut, Paintbrush, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useResumeStore } from '../../store/resumeStore';
import { useExport } from '../../hooks/useExport';

interface ToolbarProps {
  isDesignerOpen: boolean;
  onToggleDesigner: () => void;
}

export function Toolbar({ isDesignerOpen, onToggleDesigner }: ToolbarProps) {
  const signOut = useAuthStore((s) => s.signOut);
  const resume = useResumeStore((s) => s.resume);
  const allResumes = useResumeStore((s) => s.allResumes);
  const renameResume = useResumeStore((s) => s.renameResume);
  const isSaving = useResumeStore((s) => s.isSaving);
  const { exportPDF, downloadJSON, isExporting } = useExport();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 h-14 flex items-center">
      <div className="px-4 shrink-0">
        <span className="text-lg font-bold text-white">Resumeasy</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {resume && (
          isEditing ? (
            <input
              ref={inputRef}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleKeyDown}
              className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-1.5 text-sm font-medium text-white text-center focus:outline-none focus:border-zinc-400 w-64"
            />
          ) : (
            <button
              onClick={startEditing}
              title="Click to rename"
              className="bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-lg px-4 py-1.5 text-sm font-medium text-zinc-200 hover:text-white text-center transition-colors w-64 truncate"
            >
              {resume.name}
            </button>
          )
        )}
      </div>

      <div className="flex items-center gap-2 px-4 shrink-0">
        <span className="text-xs text-zinc-500 min-w-[50px] text-right">
          {isSaving ? 'Saving...' : 'Saved'}
        </span>

        <button
          onClick={onToggleDesigner}
          title="Design"
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
            isDesignerOpen
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Paintbrush size={14} />
          <span>Design</span>
        </button>

        <button
          onClick={exportPDF}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 transition-colors"
        >
          {isExporting
            ? <Loader2 size={14} className="animate-spin" />
            : <Download size={14} />}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </button>

        <button
          onClick={downloadJSON}
          title="Export JSON"
          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Download size={14} />
          <span>JSON</span>
        </button>

        <button
          onClick={() => signOut()}
          title="Sign out"
          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
