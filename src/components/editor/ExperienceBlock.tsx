import { Trash2 } from 'lucide-react';
import { WorkExperience } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';
import { BulletList } from './BulletList';

interface ExperienceBlockProps {
  exp: WorkExperience;
  dragHandleProps?: Record<string, unknown>;
}

export function ExperienceBlock({ exp, dragHandleProps }: ExperienceBlockProps) {
  const toggleExperience = useResumeStore((s) => s.toggleExperience);
  const deleteExperience = useResumeStore((s) => s.deleteExperience);
  const addBullet = useResumeStore((s) => s.addBullet);

  return (
    <div className="group mb-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50">
      <div className="flex items-start gap-2 p-4">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox checked={exp.visible} onChange={() => toggleExperience(exp.id)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-base font-semibold text-zinc-100 truncate">{exp.company}</div>
              <div className="text-sm text-zinc-300 truncate mt-0.5">
                {exp.title}
                {exp.employmentType ? (
                  <span className="text-zinc-500"> &middot; {exp.employmentType}</span>
                ) : null}
              </div>
              {exp.location && (
                <div className="text-xs text-zinc-500 mt-0.5">{exp.location}</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap border border-zinc-700/60">
                {exp.startDate} – {exp.endDate ?? 'Present'}
              </span>
              <button
                onClick={() => deleteExperience(exp.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity duration-150"
                aria-label="Delete experience"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {exp.bullets.length > 0 && <div className="h-px bg-zinc-700/40 mx-4" />}
      <div className="px-4 pb-4 pt-3">
        <div className="border-l-2 border-zinc-700/60 pl-3 ml-8">
          <BulletList expId={exp.id} bullets={exp.bullets} />
        </div>
        <button
          onClick={() => addBullet(exp.id, '')}
          className="mt-2 ml-8 w-[calc(100%-2rem)] border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-1.5 text-xs transition-colors duration-150"
        >
          + Add Bullet
        </button>
      </div>
    </div>
  );
}
