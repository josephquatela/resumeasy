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
    <div className="fixed top-14 right-0 bottom-0 z-40 w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-200">Design</h2>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Close designer panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 shrink-0">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === id
                ? 'text-white border-b-2 border-blue-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'presentation' && <PresentationTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'sections' && <SectionsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
