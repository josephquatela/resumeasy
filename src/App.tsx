import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useResumeStore } from './store/resumeStore';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { AuthGate } from './components/auth/AuthGate';
import { Toolbar } from './components/toolbar/Toolbar';
import { ResumeList } from './components/resumelist/ResumeList';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { DesignerPanel } from './components/designer/DesignerPanel';

function AppShell() {
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useSupabaseSync();

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        isDesignerOpen={isDesignerOpen}
        onToggleDesigner={() => setIsDesignerOpen((o) => !o)}
      />
      <div className="flex h-[calc(100vh-56px)] overflow-hidden" style={{ marginTop: '56px' }}>
        <ResumeList isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((o) => !o)} />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[45%] min-w-0 overflow-y-auto">
            <EditorPanel />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <PreviewPanel />
          </div>
        </div>
      </div>
      {isDesignerOpen && <DesignerPanel onClose={() => setIsDesignerOpen(false)} />}
    </div>
  );
}

export default function App() {
  const { session, isLoading, init } = useAuthStore();
  const loadResumes = useResumeStore((s) => s.loadResumes);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (session) {
      loadResumes();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin border-t-2 border-blue-600 rounded-full w-8 h-8" />
      </div>
    );
  }

  if (!session) {
    return <AuthGate />;
  }

  return <AppShell />;
}
