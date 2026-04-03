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
  const addBullet = useResumeStore((s) => s.addBullet);

  return (
    <div className="group mb-2 rounded border border-zinc-700 bg-zinc-800/50">
      <div className="flex items-center gap-2 p-2">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox checked={exp.visible} onChange={() => toggleExperience(exp.id)} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-100 truncate">{exp.company}</div>
          <div className="text-xs text-zinc-400 truncate">
            {exp.title}
            {exp.employmentType ? ` • ${exp.employmentType}` : ''}
          </div>
          <div className="text-xs text-zinc-500">
            {exp.startDate} – {exp.endDate ?? 'Present'}
          </div>
        </div>
      </div>
      <div className="px-3 pb-2">
        <BulletList expId={exp.id} bullets={exp.bullets} />
        <button
          onClick={() => addBullet(exp.id, '')}
          className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          + Add Bullet
        </button>
      </div>
    </div>
  );
}
