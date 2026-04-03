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
    'w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500';

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <label className="text-xs text-zinc-500 mb-1 block">Full Name</label>
        <input
          className={inputClass}
          value={contact.name}
          onChange={(e) => updateContact({ name: e.target.value })}
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Email</label>
        <input
          className={inputClass}
          type="email"
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Phone</label>
        <input
          className={inputClass}
          value={contact.phone ?? ''}
          onChange={(e) => updateContact({ phone: e.target.value })}
          placeholder="+1 555-000-0000"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Location</label>
        <input
          className={inputClass}
          value={contact.location ?? ''}
          onChange={(e) => updateContact({ location: e.target.value })}
          placeholder="New York, NY"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">LinkedIn</label>
        <input
          className={inputClass}
          value={contact.linkedin ?? ''}
          onChange={(e) => updateContact({ linkedin: e.target.value })}
          placeholder="linkedin.com/in/jane"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">GitHub</label>
        <input
          className={inputClass}
          value={contact.github ?? ''}
          onChange={(e) => updateContact({ github: e.target.value })}
          placeholder="github.com/jane"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Website</label>
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
      rows={4}
      placeholder="Write a brief professional summary..."
      className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
    />
  );
}

// ---- EducationList ----
function EducationList() {
  const education = useResumeStore((s) => s.resume?.education ?? []);
  const toggleEducation = useResumeStore((s) => s.toggleEducation);

  const sorted = [...education].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sorted.map((edu) => (
        <div
          key={edu.id}
          className="group mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={edu.visible} onChange={() => toggleEducation(edu.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100 truncate">{edu.institution}</div>
              <div className="text-xs text-zinc-400">
                {edu.degree} in {edu.field}
                {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
              </div>
              <div className="text-xs text-zinc-500">
                {edu.startDate} – {edu.endDate}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Education — stub for v1')}
        className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
}

// ---- SkillsList ----
function SkillsList() {
  const skills = useResumeStore((s) => s.resume?.skills ?? []);
  const toggleSkillGroup = useResumeStore((s) => s.toggleSkillGroup);

  const sorted = [...skills].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sorted.map((group) => (
        <div
          key={group.id}
          className="group mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={group.visible} onChange={() => toggleSkillGroup(group.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100">{group.category}</div>
              <div className="text-xs text-zinc-400 truncate">{group.skills.join(', ')}</div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Skill Group — stub for v1')}
        className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        + Add Skill Group
      </button>
    </div>
  );
}

// ---- ProjectsList ----
function ProjectsList() {
  const projects = useResumeStore((s) => s.resume?.projects ?? []);
  const toggleProject = useResumeStore((s) => s.toggleProject);

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sorted.map((project) => (
        <div
          key={project.id}
          className="group mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
        >
          <div className="flex items-start gap-2">
            <Checkbox checked={project.visible} onChange={() => toggleProject(project.id)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
              {project.link && (
                <div className="text-xs text-blue-400 truncate">{project.link}</div>
              )}
              <div className="text-xs text-zinc-400 line-clamp-2">{project.description}</div>
              {project.bullets.length > 0 && (
                <div className="text-xs text-zinc-500 mt-0.5">
                  {project.bullets.length} bullet{project.bullets.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log('Add Project — stub for v1')}
        className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
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
    <div className="group mb-3 rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2 p-3">
        <DragHandle dragHandleProps={dragHandleProps} />
        <Checkbox
          checked={section.visible}
          onChange={() => toggleSection(section.id)}
        />
        <span
          className={`flex-1 text-sm font-medium ${
            !section.visible ? 'line-through opacity-40' : 'text-zinc-100'
          }`}
        >
          {section.label}
        </span>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label={expanded ? 'Collapse section' : 'Expand section'}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      {expanded && <div className="px-3 pb-3">{renderContent()}</div>}
    </div>
  );
}
