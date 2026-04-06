import { ResumeData } from '../types/resume';

export { defaultDesign } from '../types/resume';

export const defaultResume: ResumeData = {
  id: 'default-resume',
  name: 'My Resume',
  contact: {
    name: 'Elliot A. Alderson',
    email: 'elliot@fsociety.net',
    phone: '(555) 010-1010',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/ealderson',
    github: 'github.com/fsociety',
    website: 'mrrobot.dev',
  },
  targetTitle: 'Senior Software Engineer (10x, Self-Reported)',
  summary:
    'Full-stack engineer with 8+ years of experience breaking things in production and blaming the intern. Former Evil Corp contractor. Passionate about clean architecture, rubber duck debugging, and leaving helpful comments like "// don\'t touch this". Currently accepting new opportunities provided they don\'t involve TPS reports.',
  sections: [
    { id: 'sec-contact', type: 'contact', label: 'Contact', visible: true, order: 0 },
    { id: 'sec-summary', type: 'summary', label: 'Summary', visible: true, order: 1 },
    { id: 'sec-exp', type: 'experience', label: 'Experience', visible: true, order: 2 },
    { id: 'sec-edu', type: 'education', label: 'Education', visible: true, order: 3 },
    { id: 'sec-skills', type: 'skills', label: 'Skills', visible: true, order: 4 },
    { id: 'sec-proj', type: 'projects', label: 'Projects', visible: true, order: 5 },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Initech',
      title: 'Senior Software Engineer',
      employmentType: 'Full-time',
      startDate: '2021-06',
      endDate: null,
      location: 'Austin, TX',
      visible: true,
      order: 0,
      bullets: [
        {
          id: 'bul-1-1',
          text: 'Rewrote entire monolith in Rust "for performance"; PR has been in review for 14 months.',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-1-2',
          text: 'Reduced on-call pages by 60% by muting all alerts — root causes still TBD.',
          visible: true,
          order: 1,
        },
        {
          id: 'bul-1-3',
          text: 'Survived a Friday afternoon production deploy; awarded informal "Most Resilient Engineer" by the team Slack channel.',
          visible: true,
          order: 2,
        },
      ],
    },
    {
      id: 'exp-2',
      company: 'Dunder Mifflin Tech',
      title: 'Software Engineer',
      employmentType: 'Full-time',
      startDate: '2018-08',
      endDate: '2021-05',
      location: 'Scranton, PA (Remote)',
      visible: true,
      order: 1,
      bullets: [
        {
          id: 'bul-2-1',
          text: 'Migrated 47 microservices back into a monolith; presented to leadership as "right-sizing our cloud footprint."',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-2-2',
          text: 'Automated CI/CD pipeline using GitHub Actions, cutting deploy time from 45 min to 8 min — spent remaining time watching deploys anyway.',
          visible: true,
          order: 1,
        },
        {
          id: 'bul-2-3',
          text: 'Resolved a P0 incident caused by a missing semicolon; mentioned it in every retro for the next two quarters.',
          visible: true,
          order: 2,
        },
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Miskatonic University',
      degree: 'Bachelor of Science',
      field: 'Computer Science (Minor: Applied Necromancy)',
      gpa: '3.8',
      startDate: '2014-08',
      endDate: '2018-05',
      visible: true,
      order: 0,
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages & Frameworks',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Regex (write-only)', 'React', 'Node.js', 'YAML (reluctantly)'],
      visible: true,
      order: 0,
    },
    {
      id: 'skill-2',
      category: 'Infrastructure & Tools',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Vim (opened once, never escaped)', 'Stack Overflow', 'Duct Tape'],
      visible: true,
      order: 1,
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'SkyNet Lite',
      description:
        'Fine-tuned an LLM to write Git commit messages autonomously. It exclusively outputs "fix stuff," "wip," and "asdfgh." Indistinguishable from the rest of the team.',
      link: 'github.com/fsociety/skynet-lite',
      visible: true,
      order: 0,
      bullets: [
        {
          id: 'bul-p1-1',
          text: 'Achieved 97% accuracy matching human commit message quality — as measured by vagueness score.',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-p1-2',
          text: 'Gained 400 GitHub stars before anyone realized it wasn\'t sentient; 12 stars retracted after.',
          visible: true,
          order: 1,
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
