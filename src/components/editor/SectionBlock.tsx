import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Section } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { DragHandle } from './DragHandle';
import { Checkbox } from './Checkbox';
import { ExperienceList } from './ExperienceList';
import { SortableProjectCard } from './SortableProjectCard';
import { SortableSkillGroupCard } from './SortableSkillGroupCard';

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
  const deleteEducation = useResumeStore((s) => s.deleteEducation);
  const addEducation = useResumeStore((s) => s.addEducation);

  const [showForm, setShowForm] = useState(false);
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gpa, setGpa] = useState('');

  const sorted = [...(resume?.education ?? [])].sort((a, b) => a.order - b.order);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!institution.trim()) return;
    addEducation({
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      gpa: gpa.trim() || undefined,
      visible: true,
    });
    setInstitution('');
    setDegree('');
    setField('');
    setStartDate('');
    setEndDate('');
    setGpa('');
    setShowForm(false);
  }

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  return (
    <div className="space-y-2">
      {sorted.map((edu) => (
        <div
          key={edu.id}
          className="group rounded-lg border border-zinc-700/50 bg-zinc-800/50 overflow-hidden"
        >
          <div className="flex items-start gap-2 px-3 pt-3 pb-2">
            <Checkbox checked={edu.visible} onChange={() => toggleEducation(edu.id)} />
            <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-zinc-100 truncate leading-snug">{edu.institution}</div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap border border-zinc-700/60">
                  {edu.startDate} – {edu.endDate}
                </span>
                <button
                  onClick={() => deleteEducation(edu.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity duration-150"
                  aria-label="Delete education"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="h-px bg-zinc-700/40 mx-3" />
          <div className="px-3 pb-3 pt-2 ml-6">
            <div className="border-l-2 border-zinc-700/60 pl-3">
              <div className="text-xs text-zinc-300 leading-relaxed">
                {edu.degree} in {edu.field}
              </div>
              {edu.gpa && (
                <div className="text-xs text-zinc-500 mt-0.5">GPA: {edu.gpa}</div>
              )}
            </div>
          </div>
        </div>
      ))}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 space-y-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <input
                className={inputClass}
                placeholder="Institution *"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
            <input
              className={inputClass}
              placeholder="Degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Field of Study"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Start Date (MM/YYYY)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="End Date (MM/YYYY)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="col-span-2">
              <input
                className={inputClass}
                placeholder="GPA (optional)"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs px-3 py-1.5 rounded-md transition-colors duration-150"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-1.5 text-xs transition-colors duration-150"
      >
        + Add Education
      </button>
    </div>
  );
}

// ---- SkillsList ----
function SkillsList() {
  const resume = useResumeStore((s) => s.resume);
  const addSkillGroup = useResumeStore((s) => s.addSkillGroup);
  const reorderSkillGroups = useResumeStore((s) => s.reorderSkillGroups);

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [skillsRaw, setSkillsRaw] = useState('');

  const sorted = [...(resume?.skills ?? [])].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSkillGroups(String(active.id), String(over.id));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category.trim()) return;
    const skillsArray = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    addSkillGroup({ category: category.trim(), skills: skillsArray, visible: true });
    setCategory('');
    setSkillsRaw('');
    setShowForm(false);
  }

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((group) => (
            <SortableSkillGroupCard key={group.id} group={group} />
          ))}
        </SortableContext>
      </DndContext>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 space-y-2"
        >
          <div className="space-y-2">
            <input
              className={inputClass}
              placeholder="Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              className={inputClass}
              placeholder="Skills (comma-separated, e.g. React, TypeScript, Node)"
              value={skillsRaw}
              onChange={(e) => setSkillsRaw(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs px-3 py-1.5 rounded-md transition-colors duration-150"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-1.5 text-xs transition-colors duration-150"
      >
        + Add Skill Group
      </button>
    </div>
  );
}

// ---- ProjectsList ----
function ProjectsList() {
  const resume = useResumeStore((s) => s.resume);
  const addProject = useResumeStore((s) => s.addProject);
  const reorderProjects = useResumeStore((s) => s.reorderProjects);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const sorted = [...(resume?.projects ?? [])].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderProjects(String(active.id), String(over.id));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      description: description.trim() || '',
      link: link.trim() || undefined,
      bullets: [],
      visible: true,
    });
    setName('');
    setDescription('');
    setLink('');
    setShowForm(false);
  }

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((project) => (
            <SortableProjectCard key={project.id} project={project} />
          ))}
        </SortableContext>
      </DndContext>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 space-y-2"
        >
          <div className="space-y-2">
            <input
              className={inputClass}
              placeholder="Project Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className={`${inputClass} resize-none`}
              placeholder="Description (optional)"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs px-3 py-1.5 rounded-md transition-colors duration-150"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="mt-1 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-1.5 text-xs transition-colors duration-150"
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
        <span className="flex-1 text-lg font-semibold text-zinc-100">
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
