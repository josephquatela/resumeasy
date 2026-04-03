import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Section } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';
import { ExperienceList } from './ExperienceList';

interface SectionBlockProps {
  section: Section;
  dragHandleProps?: Record<string, unknown>;
}

// ---- ContactForm ----
function ContactForm() {
  const contact = useResumeStore((s) => s.resume?.contact);
  const updateContact = useResumeStore((s) => s.updateContact);

  if (!contact) return null;

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  const labelClass = 'text-xs text-zinc-400 mb-1.5 block font-medium';

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={labelClass}>Full Name</label>
        <input
          className={inputClass}
          value={contact.name}
          onChange={(e) => updateContact({ name: e.target.value })}
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          className={inputClass}
          type="email"
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <label className={labelClass}>Phone</label>
        <input
          className={inputClass}
          value={contact.phone ?? ''}
          onChange={(e) => updateContact({ phone: e.target.value })}
          placeholder="+1 555-000-0000"
        />
      </div>
      <div>
        <label className={labelClass}>Location</label>
        <input
          className={inputClass}
          value={contact.location ?? ''}
          onChange={(e) => updateContact({ location: e.target.value })}
          placeholder="New York, NY"
        />
      </div>
      <div>
        <label className={labelClass}>LinkedIn</label>
        <input
          className={inputClass}
          value={contact.linkedin ?? ''}
          onChange={(e) => updateContact({ linkedin: e.target.value })}
          placeholder="linkedin.com/in/jane"
        />
      </div>
      <div>
        <label className={labelClass}>GitHub</label>
        <input
          className={inputClass}
          value={contact.github ?? ''}
          onChange={(e) => updateContact({ github: e.target.value })}
          placeholder="github.com/jane"
        />
      </div>
      <div>
        <label className={labelClass}>Website</label>
        <input
          className={inputClass}
          value={contact.website ?? ''}
          onChange={(e) => updateContact({ website: e.target.value })}
          placeholder="janesmith.dev"
        />
      </div>
    </div>
  );
}

// ---- SummaryEditor ----
function SummaryEditor() {
  const summary = useResumeStore((s) => s.resume?.summary ?? '');
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <textarea
      defaultValue={summary}
      onBlur={(e) => updateSummary(e.target.value)}
      rows={5}
      placeholder="Write a brief professional summary..."
      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150 resize-none"
    />
  );
}

// ---- EducationList ----
function EducationList() {
  const resume = useResumeStore((s) => s.resume);
  const toggleEducation = useResumeStore((s) => s.toggleEducation);

  const sorted = [...(resume?.education ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sorted.map((edu) => (
        <div
          key={edu.id}
          className="group rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={edu.visible} onChange={() => toggleEducation(edu.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100 truncate">{edu.institution}</div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {edu.degree} in {edu.field}
                {edu.gpa ? <span className="text-zinc-500"> &middot; GPA: {edu.gpa}</span> : ''}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {edu.startDate} – {edu.endDate}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Education — stub for v1')}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-2 text-sm transition-colors duration-150"
      >
        + Add Education
      </button>
    </div>
  );
}

// ---- SkillsList ----
function SkillsList() {
  const resume = useResumeStore((s) => s.resume);
  const toggleSkillGroup = useResumeStore((s) => s.toggleSkillGroup);

  const sorted = [...(resume?.skills ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sorted.map((group) => (
        <div
          key={group.id}
          className="group rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={group.visible} onChange={() => toggleSkillGroup(group.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100 mb-2">{group.category}</div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-block bg-zinc-700/60 border border-zinc-600/50 text-zinc-300 text-xs px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Skill Group — stub for v1')}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-2 text-sm transition-colors duration-150"
      >
        + Add Skill Group
      </button>
    </div>
  );
}

// ---- ProjectsList ----
function ProjectsList() {
  const resume = useResumeStore((s) => s.resume);
  const toggleProject = useResumeStore((s) => s.toggleProject);

  const sorted = [...(resume?.projects ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sorted.map((project) => (
        <div
          key={project.id}
          className="group rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={project.visible} onChange={() => toggleProject(project.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
              {project.link && (
                <div className="text-xs text-blue-400 truncate mt-0.5">{project.link}</div>
              )}
              {project.description && (
                <div className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </div>
              )}
              {project.bullets.length > 0 && (
                <div className="text-xs text-zinc-600 mt-1">
                  {project.bullets.length} bullet{project.bullets.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Project — stub for v1')}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-2 text-sm transition-colors duration-150"
      >
        + Add Project
      </button>
    </div>
  );
}

// ---- SectionBlock ----
export function SectionBlock({ section, dragHandleProps }: SectionBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const resume = useResumeStore((s) => s.resume);

  function renderContent() {
    switch (section.type) {
      case 'experience':
        return <ExperienceList experience={resume?.experience ?? []} />;
      case 'education':
        return <EducationList />;
      case 'skills':
        return <SkillsList />;
      case 'projects':
        return <ProjectsList />;
      case 'contact':
        return <ContactForm />;
      case 'summary':
        return <SummaryEditor />;
      default:
        return (
          <p className="text-xs text-zinc-500 italic">No editor for this section type yet.</p>
        );
    }
  }

  return (
    <div
      className={`group mb-3 rounded-lg border border-zinc-700/50 bg-zinc-900/80 transition-opacity duration-150 ${
        !section.visible ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 p-4">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox
          checked={section.visible}
          onChange={() => toggleSection(section.id)}
        />
        <span className="flex-1 text-base font-medium text-zinc-100">
          {section.label}
        </span>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors duration-150"
          aria-label={expanded ? 'Collapse section' : 'Expand section'}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      {expanded && (
        <>
          <div className="h-px bg-zinc-700/40 mx-4" />
          <div className="px-4 pb-4 pt-4">{renderContent()}</div>
        </>
      )}
    </div>
  );
}
