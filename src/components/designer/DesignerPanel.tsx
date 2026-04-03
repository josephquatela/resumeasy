import { useState } from 'react';
import { X } from 'lucide-react';
import { PresentationTab } from './PresentationTab';
import { ColorsTab } from './ColorsTab';
import { SectionsTab } from './SectionsTab';
import { SettingsTab } from './SettingsTab';

interface DesignerPanelProps {
  onClose: () => void;
}

type Tab = 'presentation' | 'colors' | 'sections' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'presentation', label: 'Presentation' },
  { id: 'colors', label: 'Colors' },
  { id: 'sections', label: 'Sections' },
  { id: 'settings', label: 'Settings' },
];

export function DesignerPanel({ onClose }: DesignerPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('presentation');

  return (
    <div className="fixed top-14 right-0 bottom-0 z-40 w-96 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
        <div>
          <h2 className="text-base font-semibold text-white">Design</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Customize your resume appearance</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          aria-label="Close designer panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-4 gap-1 shrink-0">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'presentation' && <PresentationTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'sections' && <SectionsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
