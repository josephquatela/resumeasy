import React from 'react';
import { FilteredResumeData, DesignSettings, WorkExperience, Education, SkillGroup, Project } from '../../../types/resume';

interface TemplateProps {
  data: FilteredResumeData;
  design: DesignSettings;
}

interface SectionHeaderProps {
  label: string;
  accentColor: string;
  baseFontSize: number;
  sectionSpacing: number;
}

function SectionHeader({ label, accentColor, baseFontSize, sectionSpacing }: SectionHeaderProps) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${accentColor}`,
        paddingBottom: 3,
        marginBottom: 8,
        marginTop: sectionSpacing,
        fontSize: `${baseFontSize * 1.05}pt`,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        color: accentColor,
      }}
    >
      {label}
    </div>
  );
}

interface ExperienceSectionProps {
  label: string;
  items: WorkExperience[];
  design: DesignSettings;
}

function ExperienceSection({ label, items, design }: ExperienceSectionProps) {
  return (
    <div>
      <SectionHeader
        label={label}
        accentColor={design.accentColor}
        baseFontSize={design.baseFontSize}
        sectionSpacing={design.sectionSpacing}
      />
      {items.map((exp) => (
        <div key={exp.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: `${design.baseFontSize}pt` }}>{exp.company}</strong>
            <span style={{ fontSize: `${design.baseFontSize * 0.9}pt`, color: '#555' }}>
              {exp.startDate} – {exp.endDate ?? 'Present'}
            </span>
          </div>
          <div style={{ fontSize: `${design.baseFontSize * 0.95}pt`, color: '#444', marginBottom: 3 }}>
            {exp.title}{exp.employmentType ? ` · ${exp.employmentType}` : ''}
            {exp.location ? ` · ${exp.location}` : ''}
          </div>
          {exp.bullets.length > 0 && (
            <ul style={{ margin: '3px 0 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
              {exp.bullets.map((b) => (
                <li
                  key={b.id}
                  style={{
                    fontSize: `${design.baseFontSize * 0.95}pt`,
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

interface EducationSectionProps {
  label: string;
  items: Education[];
  design: DesignSettings;
}

function EducationSection({ label, items, design }: EducationSectionProps) {
  return (
    <div>
      <SectionHeader
        label={label}
        accentColor={design.accentColor}
        baseFontSize={design.baseFontSize}
        sectionSpacing={design.sectionSpacing}
      />
      {items.map((edu) => (
        <div key={edu.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: `${design.baseFontSize}pt` }}>{edu.institution}</strong>
            <span style={{ fontSize: `${design.baseFontSize * 0.9}pt`, color: '#555' }}>
              {edu.startDate} – {edu.endDate}
            </span>
          </div>
          <div style={{ fontSize: `${design.baseFontSize * 0.95}pt`, color: '#444' }}>
            {edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkillsSectionProps {
  label: string;
  items: SkillGroup[];
  design: DesignSettings;
}

function SkillsSection({ label, items, design }: SkillsSectionProps) {
  return (
    <div>
      <SectionHeader
        label={label}
        accentColor={design.accentColor}
        baseFontSize={design.baseFontSize}
        sectionSpacing={design.sectionSpacing}
      />
      {items.map((sg) => (
        <div key={sg.id} style={{ fontSize: `${design.baseFontSize * 0.95}pt`, marginBottom: 3 }}>
          <strong>{sg.category}: </strong>
          <span style={{ color: '#333' }}>{sg.skills.join(', ')}</span>
        </div>
      ))}
    </div>
  );
}

interface ProjectsSectionProps {
  label: string;
  items: Project[];
  design: DesignSettings;
}

function ProjectsSection({ label, items, design }: ProjectsSectionProps) {
  return (
    <div>
      <SectionHeader
        label={label}
        accentColor={design.accentColor}
        baseFontSize={design.baseFontSize}
        sectionSpacing={design.sectionSpacing}
      />
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
            <div style={{ fontSize: `${design.baseFontSize * 0.95}pt`, color: '#444', marginBottom: 3 }}>
              {p.description}
            </div>
          )}
          {p.bullets.length > 0 && (
            <ul style={{ margin: '3px 0 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
              {p.bullets.map((b) => (
                <li
                  key={b.id}
                  style={{
                    fontSize: `${design.baseFontSize * 0.95}pt`,
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
      {/* Header */}
      <div style={{ marginBottom: design.sectionSpacing }}>
        <h1
          style={{
            fontSize: `${design.baseFontSize * 2.2}pt`,
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

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: design.sectionSpacing, fontStyle: 'italic', color: '#444' }}>
          {summary}
        </div>
      )}

      {/* Sections in order */}
      {sections.map((section) => {
        if (section.type === 'contact' || section.type === 'summary') return null;
        switch (section.type) {
          case 'experience':
            return (
              <ExperienceSection
                key={section.id}
                label={section.label}
                items={experience}
                design={design}
              />
            );
          case 'education':
            return (
              <EducationSection
                key={section.id}
                label={section.label}
                items={education}
                design={design}
              />
            );
          case 'skills':
            return (
              <SkillsSection
                key={section.id}
                label={section.label}
                items={skills}
                design={design}
              />
            );
          case 'projects':
            return (
              <ProjectsSection
                key={section.id}
                label={section.label}
                items={projects}
                design={design}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
