import { Document, Font, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FilteredResumeData, DesignSettings, DateFormat } from '../../types/resume';

// react-pdf's font fetch requires absolute URLs — root-relative paths may not
// resolve correctly inside its rendering context.
const origin = window.location.origin;
function f(name: string) { return `${origin}/fonts/${name}`; }

Font.register({ family: 'Lora', fonts: [{ src: f('lora-400.woff'), fontWeight: 400 }, { src: f('lora-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('lora-700.woff'), fontWeight: 700 }] });
Font.register({ family: 'EB Garamond', fonts: [{ src: f('eb-garamond-400.woff'), fontWeight: 400 }, { src: f('eb-garamond-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('eb-garamond-700.woff'), fontWeight: 700 }] });
Font.register({ family: 'Merriweather', fonts: [{ src: f('merriweather-400.woff'), fontWeight: 400 }, { src: f('merriweather-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('merriweather-700.woff'), fontWeight: 700 }] });
Font.register({ family: 'Lato', fonts: [{ src: f('lato-400.woff'), fontWeight: 400 }, { src: f('lato-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('lato-700.woff'), fontWeight: 700 }] });
Font.register({ family: 'Source Sans 3', fonts: [{ src: f('source-sans-3-400.woff'), fontWeight: 400 }, { src: f('source-sans-3-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('source-sans-3-700.woff'), fontWeight: 700 }] });
Font.register({ family: 'Libre Baskerville', fonts: [{ src: f('libre-baskerville-400.woff'), fontWeight: 400 }, { src: f('libre-baskerville-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' }, { src: f('libre-baskerville-700.woff'), fontWeight: 700 }] });

const REGISTERED_FONTS = new Set(['Lora', 'EB Garamond', 'Merriweather', 'Lato', 'Source Sans 3', 'Libre Baskerville']);

// Maps old font names (pre-rename) and any unregistered font to a safe registered fallback.
const FONT_MIGRATION: Record<string, string> = {
  'Georgia': 'Lora',
  'Garamond': 'EB Garamond',
  'Source Sans Pro': 'Source Sans 3',
};

function resolveFont(fontFamily: string): string {
  if (REGISTERED_FONTS.has(fontFamily)) return fontFamily;
  return FONT_MIGRATION[fontFamily] ?? 'Lora';
}

function formatDate(dateStr: string | null, format: DateFormat): string {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const monthIndex = parseInt(month, 10) - 1;
  const monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  switch (format) {
    case 'MM/YYYY': return `${month}/${year}`;
    case 'Mon YYYY': return `${monthsShort[monthIndex]} ${year}`;
    case 'Month YYYY': return `${monthsFull[monthIndex]} ${year}`;
    case 'YYYY': return year;
    default: return `${month}/${year}`;
  }
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
  const showContact = sections.some((s) => s.type === 'contact');
  const showSummary = sections.some((s) => s.type === 'summary');

  function renderExperience(label: string) {
    return (
      <View key="experience">
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
        </View>
        {experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 8 }}>
            <View style={styles.experienceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.company}>{exp.company}</Text>
              </View>
              <Text style={styles.dates}>
                {formatDate(exp.startDate, design.dateFormat)} – {formatDate(exp.endDate, design.dateFormat)}
              </Text>
            </View>
            <Text style={{ fontSize: design.subheaderFontSize, marginBottom: 2, color: '#444' }}>
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
          <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
        </View>
        {education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <View style={styles.experienceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.company}>{edu.institution}</Text>
              </View>
              <Text style={styles.dates}>
                {formatDate(edu.startDate, design.dateFormat)} – {formatDate(edu.endDate || null, design.dateFormat)}
              </Text>
            </View>
            <Text style={{ fontSize: design.subheaderFontSize, color: '#444' }}>
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
          <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
        </View>
        {skills.map((sg) => (
          <Text key={sg.id} style={{ marginBottom: 3, fontSize: design.subheaderFontSize }}>
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
          <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
        </View>
        {projects.map((p) => (
          <View key={p.id} style={{ marginBottom: 6 }}>
            <View style={styles.experienceRow}>
              <Text style={styles.company}>{p.name}</Text>
              {p.link ? (
                <Text style={styles.dates}>{p.link}</Text>
              ) : null}
            </View>
            {p.description ? (
              <Text style={{ fontSize: design.subheaderFontSize, marginBottom: 2, color: '#444' }}>
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
        {showContact && (
          <View style={styles.header}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.contactLine}>
              {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github, contact.website]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
        )}

        {/* Summary */}
        {showSummary && summary ? (
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
  const fontFamily = resolveFont(design.fontFamily);

  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: design.baseFontSize,
      paddingHorizontal: design.marginX * 72,
      paddingVertical: design.marginY * 72,
      color: '#1a1a1a',
      lineHeight: design.lineHeight,
    },
    header: { marginBottom: design.sectionSpacing },
    name: {
      fontSize: design.nameFontSize,
      fontWeight: 'bold',
      lineHeight: 1.2,
      marginBottom: 4,
    },
    contactLine: {
      fontSize: design.baseFontSize * 0.9,
      color: '#555',
    },
    sectionHeader: {
      borderBottomWidth: 1,
      borderBottomColor: design.accentColor,
      paddingBottom: 2,
      marginTop: design.sectionSpacing,
      marginBottom: 6,
    },
    sectionHeaderText: {
      fontSize: design.sectionHeaderFontSize,
      fontWeight: 'bold',
      color: design.accentColor,
    },
    experienceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    company: { fontWeight: 'bold' },
    dates: { color: '#555', fontSize: design.baseFontSize * 0.9, flexShrink: 0 },
    bulletRow: {
      flexDirection: 'row',
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletDot: { width: 10, fontSize: design.subheaderFontSize, lineHeight: design.listLineHeight },
    bulletText: {
      flex: 1,
      lineHeight: design.listLineHeight,
      fontSize: design.subheaderFontSize,
    },
  });
}
