import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SkillGroup } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';

interface SkillGroupCardProps {
  group: SkillGroup;
  dragHandleProps?: Record<string, unknown>;
}

export function SkillGroupCard({ group, dragHandleProps }: SkillGroupCardProps) {
  const toggleSkillGroup = useResumeStore((s) => s.toggleSkillGroup);
  const deleteSkillGroup = useResumeStore((s) => s.deleteSkillGroup);
  const updateSkillGroup = useResumeStore((s) => s.updateSkillGroup);

  const [newSkill, setNewSkill] = useState('');

  function removeSkill(index: number) {
    updateSkillGroup(group.id, { skills: group.skills.filter((_, i) => i !== index) });
  }

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    updateSkillGroup(group.id, { skills: [...group.skills, trimmed] });
    setNewSkill('');
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  }

  return (
    <div className="group mb-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox checked={group.visible} onChange={() => toggleSkillGroup(group.id)} />
        <input
          className="flex-1 bg-transparent text-sm font-semibold text-zinc-100 outline-none placeholder-zinc-600 focus:bg-zinc-800/60 rounded px-1 -mx-1"
          defaultValue={group.category}
          onBlur={(e) => updateSkillGroup(group.id, { category: e.target.value })}
          placeholder="Category"
        />
        <button
          onClick={() => deleteSkillGroup(group.id)}
          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity duration-150"
          aria-label="Delete skill group"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="h-px bg-zinc-700/40 mx-3" />
      <div className="px-3 pb-3 pt-2 ml-8">
        <div className="border-l-2 border-zinc-700/60 pl-3 space-y-2">
          <div className={`flex flex-wrap gap-1.5 ${!group.visible ? 'opacity-40' : ''}`}>
            {group.skills.map((skill, i) => (
              <span
                key={i}
                className="group/tag inline-flex items-center gap-1 bg-zinc-700/60 border border-zinc-600/50 text-zinc-300 text-xs px-2 py-0.5 rounded-full"
              >
                {skill}
                <button
                  onClick={() => removeSkill(i)}
                  className="text-zinc-500 hover:text-red-400 transition-colors leading-none"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <input
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              placeholder="Add skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
            <button
              onClick={addSkill}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1 rounded-md border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
