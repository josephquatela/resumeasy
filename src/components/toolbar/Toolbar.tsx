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
  const isSaving = useResumeStore((s) => s.isSaving);
  const { exportPDF, downloadJSON, isExporting } = useExport();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 h-14 flex items-center">
      <div className="px-4 shrink-0">
        <span className="text-lg font-bold text-white">Resumeasy</span>
      </div>

      <div className="flex-1" />

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
