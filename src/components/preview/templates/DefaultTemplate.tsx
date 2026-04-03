import React from 'react';
import { FilteredResumeData, DesignSettings, WorkExperience, Education, SkillGroup, Project } from '../../../types/resume';

interface TemplateProps {
  data: FilteredResumeData;
  design: DesignSettings;
}

function SectionHeader({ label, design }: { label: string; design: DesignSettings }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${design.accentColor}`,
        paddingBottom: 3,
        marginBottom: 8,
        marginTop: design.sectionSpacing,
        fontSize: `${design.sectionHeaderFontSize}pt`,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        color: design.accentColor,
      }}
    >
      {label}
    </div>
  );
}

function ExperienceSection({ label, items, design }: { label: string; items: WorkExperience[]; design: DesignSettings }) {
  return (
    <div>
      <SectionHeader label={label} design={design} />
      {items.map((exp) => (
        <div key={exp.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: `${design.baseFontSize}pt` }}>{exp.company}</strong>
            <span style={{ fontSize: `${design.baseFontSize * 0.9}pt`, color: '#555' }}>
              {exp.startDate} – {exp.endDate ?? 'Present'}
            </span>
          </div>
          <div style={{ fontSize: `${design.subheaderFontSize}pt`, color: '#444', marginBottom: 3 }}>
            {exp.title}{exp.employmentType ? ` · ${exp.employmentType}` : ''}
            {exp.location ? ` · ${exp.location}` : ''}
          </div>
          {exp.bullets.length > 0 && (
            <ul style={{ margin: '3px 0 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
              {exp.bullets.map((b) => (
                <li
                  key={b.id}
                  style={{
                    fontSize: `${design.baseFontSize}pt`,
                    color: '#333',
                    lineHeight: design.listLineHeight,
                    marginBottom: 1,
                  }}
                >
                  {b.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ label, items, design }: { label: string; items: Education[]; design: DesignSettings }) {
  return (
    <div>
      <SectionHeader label={label} design={design} />
      {items.map((edu) => (
        <div key={edu.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: `${design.baseFontSize}pt` }}>{edu.institution}</strong>
            <span style={{ fontSize: `${design.baseFontSize * 0.9}pt`, color: '#555' }}>
              {edu.startDate} – {edu.endDate}
            </span>
          </div>
          <div style={{ fontSize: `${design.subheaderFontSize}pt`, color: '#444' }}>
            {edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ label, items, design }: { label: string; items: SkillGroup[]; design: DesignSettings }) {
  return (
    <div>
      <SectionHeader label={label} design={design} />
      {items.map((sg) => (
        <div key={sg.id} style={{ fontSize: `${design.baseFontSize}pt`, marginBottom: 3 }}>
          <strong>{sg.category}: </strong>
          <span style={{ color: '#333' }}>{sg.skills.join(', ')}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ label, items, design }: { label: string; items: Project[]; design: DesignSettings }) {
  return (
    <div>
      <SectionHeader label={label} design={design} />
      {items.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <strong style={{ fontSize: `${design.baseFontSize}pt` }}>{p.name}</strong>
            {p.link && (
              <span style={{ fontSize: `${design.baseFontSize * 0.85}pt`, color: '#555' }}>
                {p.link}
              </span>
            )}
          </div>
          {p.description && (
            <div style={{ fontSize: `${design.subheaderFontSize}pt`, color: '#444', marginBottom: 3 }}>
              {p.description}
            </div>
          )}
          {p.bullets.length > 0 && (
            <ul style={{ margin: '3px 0 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
              {p.bullets.map((b) => (
                <li
                  key={b.id}
                  style={{
                    fontSize: `${design.baseFontSize}pt`,
                    color: '#333',
                    lineHeight: design.listLineHeight,
                    marginBottom: 1,
                  }}
                >
                  {b.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function DefaultTemplate({ data, design }: TemplateProps) {
  const { contact, summary, sections, experience, education, skills, projects } = data;

  const showContact = sections.some((s) => s.type === 'contact');
  const showSummary = sections.some((s) => s.type === 'summary');

  return (
    <div
      style={{
        '--accent': design.accentColor,
        fontFamily: design.fontFamily,
        fontSize: `${design.baseFontSize}pt`,
        lineHeight: design.lineHeight,
        color: '#1a1a1a',
      } as React.CSSProperties}
    >
      {showContact && (
        <div style={{ marginBottom: design.sectionSpacing }}>
          <h1
            style={{
              fontSize: `${design.nameFontSize}pt`,
              fontWeight: 'bold',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {contact.name}
          </h1>
          <div style={{ fontSize: `${design.baseFontSize * 0.9}pt`, color: '#555', marginTop: 4 }}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github, contact.website]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>
      )}

      {showSummary && summary && (
        <div style={{ fontSize: `${design.baseFontSize}pt`, marginBottom: design.sectionSpacing, fontStyle: 'italic', color: '#444' }}>
          {summary}
        </div>
      )}

      {sections.map((section) => {
        if (section.type === 'contact' || section.type === 'summary') return null;
        switch (section.type) {
          case 'experience':
            return <ExperienceSection key={section.id} label={section.label} items={experience} design={design} />;
          case 'education':
            return <EducationSection key={section.id} label={section.label} items={education} design={design} />;
          case 'skills':
            return <SkillsSection key={section.id} label={section.label} items={skills} design={design} />;
          case 'projects':
            return <ProjectsSection key={section.id} label={section.label} items={projects} design={design} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
