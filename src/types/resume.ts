export type ResumeId = string;

export interface BulletPoint {
  id: ResumeId;
  text: string;
  visible: boolean;
  order: number;
}

export interface WorkExperience {
  id: ResumeId;
  company: string;
  title: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate: string | null;
  location?: string;
  bullets: BulletPoint[];
  visible: boolean;
  order: number;
}

export interface Education {
  id: ResumeId;
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  visible: boolean;
  order: number;
}

export interface SkillGroup {
  id: ResumeId;
  category: string;
  skills: string[];
  visible: boolean;
  order: number;
}

export interface Project {
  id: ResumeId;
  name: string;
  description: string;
  bullets: BulletPoint[];
  link?: string;
  visible: boolean;
  order: number;
}

export type SectionType = 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';

export interface Section {
  id: ResumeId;
  type: SectionType;
  label: string;
  visible: boolean;
  order: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ResumeData {
  id: ResumeId;
  name: string;
  contact: ContactInfo;
  targetTitle?: string;
  summary?: string;
  sections: Section[];
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export type DateFormat = 'MM/YYYY' | 'Mon YYYY' | 'Month YYYY' | 'YYYY';
export type FontFamily = 'Georgia' | 'Garamond' | 'Merriweather' | 'Lato' | 'Source Sans Pro' | 'Libre Baskerville';

export interface DesignSettings {
  fontFamily: FontFamily;
  baseFontSize: number;      // pt, range: 9–12 (body text base)
  nameFontSize: number;      // pt, range: 16–32
  sectionHeaderFontSize: number; // pt, range: 8–14
  subheaderFontSize: number; // pt, range: 8–13 (job title, institution)
  lineHeight: number;        // e.g. 1.35, range: 1.1–1.8
  listLineHeight: number;    // separate control for bullet spacing
  accentColor: string;       // hex string
  marginX: number;           // inches, range: 0.4–1.0
  marginY: number;           // inches, range: 0.4–1.0
  dateFormat: DateFormat;
  sectionSpacing: number;    // px between sections, range: 8–24
  template: 'default';
}

export const defaultDesign: DesignSettings = {
  fontFamily: 'Georgia',
  baseFontSize: 10,
  nameFontSize: 22,
  sectionHeaderFontSize: 10,
  subheaderFontSize: 10,
  lineHeight: 1.35,
  listLineHeight: 1.3,
  accentColor: '#1a1a1a',
  marginX: 0.65,
  marginY: 0.65,
  dateFormat: 'MM/YYYY',
  sectionSpacing: 14,
  template: 'default',
};

// Same shape as ResumeData but semantically "pre-filtered" — all items are visible
export type FilteredResumeData = ResumeData;

export interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  design: DesignSettings;
  created_at: string;
  updated_at: string;
}
