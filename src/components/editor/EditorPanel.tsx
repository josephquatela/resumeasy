import { SectionList } from './SectionList';

export function EditorPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4">
      <SectionList />
    </div>
  );
}
