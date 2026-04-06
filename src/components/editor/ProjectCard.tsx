import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Project, BulletPoint } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';

interface ProjectCardProps {
  project: Project;
  dragHandleProps?: Record<string, unknown>;
}

export function ProjectCard({ project, dragHandleProps }: ProjectCardProps) {
  const toggleProject = useResumeStore((s) => s.toggleProject);
  const deleteProject = useResumeStore((s) => s.deleteProject);
  const updateProject = useResumeStore((s) => s.updateProject);

  const [newBulletKey, setNewBulletKey] = useState(0);

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  function addBullet() {
    const newBullet: BulletPoint = {
      id: crypto.randomUUID(),
      text: '',
      visible: true,
      order: project.bullets.length,
    };
    updateProject(project.id, { bullets: [...project.bullets, newBullet] });
    setNewBulletKey((k) => k + 1);
  }

  function updateBulletText(bulletId: string, text: string) {
    updateProject(project.id, {
      bullets: project.bullets.map((b) => b.id === bulletId ? { ...b, text } : b),
    });
  }

  function deleteBullet(bulletId: string) {
    updateProject(project.id, {
      bullets: project.bullets
        .filter((b) => b.id !== bulletId)
        .map((b, i) => ({ ...b, order: i })),
    });
  }

  function toggleBullet(bulletId: string) {
    updateProject(project.id, {
      bullets: project.bullets.map((b) => b.id === bulletId ? { ...b, visible: !b.visible } : b),
    });
  }

  return (
    <div className="group mb-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox checked={project.visible} onChange={() => toggleProject(project.id)} />
        <input
          className="flex-1 bg-transparent text-sm font-semibold text-zinc-100 outline-none placeholder-zinc-600 focus:bg-zinc-800/60 rounded px-1 -mx-1 min-w-0"
          defaultValue={project.name}
          onBlur={(e) => updateProject(project.id, { name: e.target.value })}
          placeholder="Project name"
        />
        <button
          onClick={() => deleteProject(project.id)}
          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity duration-150 shrink-0"
          aria-label="Delete project"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="h-px bg-zinc-700/40 mx-3" />
      <div className="px-3 pb-3 pt-2 ml-8">
        <div className="border-l-2 border-zinc-700/60 pl-3 space-y-1.5">
          <input
            className={inputClass}
            defaultValue={project.link ?? ''}
            onBlur={(e) => updateProject(project.id, { link: e.target.value || undefined })}
            placeholder="Link (optional)"
          />
          <textarea
            className={`${inputClass} resize-none`}
            defaultValue={project.description}
            onBlur={(e) => updateProject(project.id, { description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
          />
          {project.bullets.length > 0 && (
            <div className="pt-1 space-y-0.5">
              {project.bullets.map((bullet) => (
                <div key={bullet.id} className="group/bullet flex items-start gap-1.5">
                  <Checkbox
                    checked={bullet.visible}
                    onChange={() => toggleBullet(bullet.id)}
                  />
                  <span className={`shrink-0 mt-[3px] text-xs select-none ${!bullet.visible ? 'opacity-30 text-zinc-500' : 'text-zinc-500'}`}>•</span>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBulletText(bullet.id, e.currentTarget.textContent ?? '')}
                    className={`flex-1 text-xs leading-relaxed outline-none bg-transparent min-w-0 min-h-[1.4rem] rounded px-1 -mx-1 transition-colors focus:bg-zinc-800/60 ${!bullet.visible ? 'line-through opacity-40 text-zinc-400' : 'text-zinc-300'}`}
                  >
                    {bullet.text}
                  </div>
                  <button
                    onClick={() => deleteBullet(bullet.id)}
                    className="opacity-0 group-hover/bullet:opacity-100 text-zinc-500 hover:text-red-400 shrink-0 mt-0.5 transition-opacity duration-150"
                    aria-label="Delete bullet"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            key={newBulletKey}
            onClick={addBullet}
            className="w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-1 text-xs transition-colors duration-150"
          >
            + Add Bullet
          </button>
        </div>
      </div>
    </div>
  );
}
