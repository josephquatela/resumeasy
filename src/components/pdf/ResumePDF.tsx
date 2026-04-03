import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FilteredResumeData, DesignSettings } from '../../types/resume';

// Font mapping: @react-pdf/renderer built-in fonts are used to avoid requiring
// external TTF files. Drop real TTF files in /public/fonts/ and update Font.register
// calls here to get exact font matching.
// Built-in fonts available: Helvetica, Courier, Times-Roman (and their variants)
function resolvedFontFamily(fontFamily: string): string {
  if (
    fontFamily === 'Georgia' ||
    fontFamily === 'Garamond' ||
    fontFamily === 'Merriweather' ||
    fontFamily === 'Libre Baskerville'
  ) {
    return 'Times-Roman';
  }
  // Lato, Source Sans Pro -> Helvetica
  return 'Helvetica';
}

// These optional fields mirror DocumentProps so that React.createElement(ResumePDF, ...)
// returns a ReactElement assignable to ReactElement<DocumentProps> as required by pdf().
interface ResumePDFProps {
  data: FilteredResumeData;
  design: DesignSettings;
  // DocumentProps passthrough fields (all optional)
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  keywords?: string;
  producer?: string;
  language?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export function ResumePDF({ data, design }: ResumePDFProps) {
  const styles = createStyles(design);
  const { contact, summary, sections, experience, education, skills, projects } = data;

  function renderExperience(label: string) {
    return (
      <View key="experience">
        <View style={styles.sectionHeader}>
          <Text>{label.toUpperCase()}</Text>
        </View>
        {experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 8 }}>
            <View style={styles.experienceRow}>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.dates}>
                {exp.startDate} – {exp.endDate ?? 'Present'}
              </Text>
            </View>
            <Text style={{ fontSize: design.baseFontSize * 0.95, marginBottom: 2, color: '#444' }}>
              {exp.title}{exp.employmentType ? ` · ${exp.employmentType}` : ''}
              {exp.location ? ` · ${exp.location}` : ''}
            </Text>
            {exp.bullets.map((b) => (
              <View key={b.id} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b.text}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  function renderEducation(label: string) {
    return (
      <View key="education">
        <View style={styles.sectionHeader}>
          <Text>{label.toUpperCase()}</Text>
        </View>
        {education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <View style={styles.experienceRow}>
              <Text style={styles.company}>{edu.institution}</Text>
              <Text style={styles.dates}>
                {edu.startDate} – {edu.endDate}
              </Text>
            </View>
            <Text style={{ fontSize: design.baseFontSize * 0.95, color: '#444' }}>
              {edu.degree} in {edu.field}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  function renderSkills(label: string) {
    return (
      <View key="skills">
        <View style={styles.sectionHeader}>
          <Text>{label.toUpperCase()}</Text>
        </View>
        {skills.map((sg) => (
          <Text key={sg.id} style={{ marginBottom: 3, fontSize: design.baseFontSize * 0.95 }}>
            <Text style={{ fontWeight: 'bold' }}>{sg.category}: </Text>
            {sg.skills.join(', ')}
          </Text>
        ))}
      </View>
    );
  }

  function renderProjects(label: string) {
    return (
      <View key="projects">
        <View style={styles.sectionHeader}>
          <Text>{label.toUpperCase()}</Text>
        </View>
        {projects.map((p) => (
          <View key={p.id} style={{ marginBottom: 6 }}>
            <Text style={styles.company}>{p.name}</Text>
            {p.description ? (
              <Text style={{ fontSize: design.baseFontSize * 0.95, marginBottom: 2, color: '#444' }}>
                {p.description}
              </Text>
            ) : null}
            {p.bullets.map((b) => (
              <View key={b.id} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b.text}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  function renderSection(section: FilteredResumeData['sections'][0]) {
    if (section.type === 'contact' || section.type === 'summary') return null;
    switch (section.type) {
      case 'experience':
        return renderExperience(section.label);
      case 'education':
        return renderEducation(section.label);
      case 'skills':
        return renderSkills(section.label);
      case 'projects':
        return renderProjects(section.label);
      default:
        return null;
    }
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.contactLine}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github, contact.website]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>

        {/* Summary */}
        {summary ? (
          <Text
            style={{
              marginBottom: design.sectionSpacing,
              fontStyle: 'italic',
              fontSize: design.baseFontSize,
              color: '#444',
            }}
          >
            {summary}
          </Text>
        ) : null}

        {/* Sections */}
        {sections.map((section) => renderSection(section))}
      </Page>
    </Document>
  );
}

function createStyles(design: DesignSettings) {
  const fontFamily = resolvedFontFamily(design.fontFamily);

  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: design.baseFontSize,
      paddingHorizontal: design.marginX * 72,
      paddingVertical: design.marginY * 72,
      color: '#1a1a1a',
      lineHeight: design.lineHeight,
    },
    header: { marginBottom: 10 },
    name: {
      fontSize: design.baseFontSize * 2.2,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    contactLine: {
      fontSize: design.baseFontSize * 0.9,
      color: '#555',
    },
    sectionHeader: {
      fontSize: design.baseFontSize * 1.1,
      fontWeight: 'bold',
      borderBottomWidth: 1,
      borderBottomColor: design.accentColor,
      paddingBottom: 2,
      marginTop: design.sectionSpacing,
      marginBottom: 6,
      color: design.accentColor,
    },
    experienceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    company: { fontWeight: 'bold' },
    dates: { color: '#555', fontSize: design.baseFontSize * 0.9 },
    bulletRow: {
      flexDirection: 'row',
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletDot: { width: 10, marginTop: 1 },
    bulletText: {
      flex: 1,
      lineHeight: design.listLineHeight,
      fontSize: design.baseFontSize * 0.95,
    },
  });
}
