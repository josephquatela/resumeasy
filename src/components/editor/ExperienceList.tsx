import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkExperience } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { SortableExperienceBlock } from './SortableExperienceBlock';

interface ExperienceListProps {
  experience: WorkExperience[];
}

export function ExperienceList({ experience }: ExperienceListProps) {
  const reorderExperience = useResumeStore((s) => s.reorderExperience);
  const addExperience = useResumeStore((s) => s.addExperience);

  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');

  const sorted = [...experience].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderExperience(String(active.id), String(over.id));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;
    addExperience({
      company: company.trim(),
      title: title.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim() || null,
      location: location.trim() || undefined,
      bullets: [],
      visible: true,
    });
    setCompany('');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setShowForm(false);
  }

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150';

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((exp) => (
            <SortableExperienceBlock key={exp.id} exp={exp} />
          ))}
        </SortableContext>
      </DndContext>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 space-y-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <input
                className={inputClass}
                placeholder="Company *"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <input
                className={inputClass}
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <input
              className={inputClass}
              placeholder="Start Date (MM/YYYY)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="End Date (MM/YYYY or blank for Present)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="col-span-2">
              <input
                className={inputClass}
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
        className="mt-2 w-full border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-lg py-2 text-sm transition-colors duration-150"
      >
        + Add Experience
      </button>
    </div>
  );
}
