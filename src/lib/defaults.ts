import { ResumeData } from '../types/resume';

export { defaultDesign } from '../types/resume';

export const defaultResume: ResumeData = {
  id: 'default-resume',
  name: 'My Resume',
  contact: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    website: 'alexrivera.dev',
  },
  targetTitle: 'Senior Software Engineer',
  summary:
    'Software engineer with 6+ years of experience building scalable web applications. Passionate about developer experience, clean architecture, and shipping products that users love.',
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
      company: 'Acme Corp',
      title: 'Senior Software Engineer',
      employmentType: 'Full-time',
      startDate: '2021-06',
      endDate: null,
      location: 'San Francisco, CA',
      visible: true,
      order: 0,
      bullets: [
        {
          id: 'bul-1-1',
          text: 'Led migration of monolithic Rails app to microservices, reducing p99 latency by 40%.',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-1-2',
          text: 'Designed and shipped a real-time notification system serving 500k daily active users.',
          visible: true,
          order: 1,
        },
        {
          id: 'bul-1-3',
          text: 'Mentored 3 junior engineers and established team code review standards.',
          visible: true,
          order: 2,
        },
      ],
    },
    {
      id: 'exp-2',
      company: 'Startup Labs',
      title: 'Software Engineer',
      employmentType: 'Full-time',
      startDate: '2018-08',
      endDate: '2021-05',
      location: 'Remote',
      visible: true,
      order: 1,
      bullets: [
        {
          id: 'bul-2-1',
          text: 'Built customer-facing dashboard with React and TypeScript, adopted by 12k users in first month.',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-2-2',
          text: 'Implemented CI/CD pipeline using GitHub Actions, cutting deploy time from 45 min to 8 min.',
          visible: true,
          order: 1,
        },
        {
          id: 'bul-2-3',
          text: 'Integrated Stripe billing APIs and reduced checkout abandonment rate by 18%.',
          visible: true,
          order: 2,
        },
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
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
      skills: ['TypeScript', 'JavaScript', 'Python', 'React', 'Node.js', 'Next.js'],
      visible: true,
      order: 0,
    },
    {
      id: 'skill-2',
      category: 'Infrastructure & Tools',
      skills: ['PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Supabase'],
      visible: true,
      order: 1,
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenMetrics',
      description:
        'Open-source observability dashboard for Node.js services. Collects custom metrics via a lightweight SDK and renders them in a real-time web UI.',
      link: 'github.com/alexrivera/openmetrics',
      visible: true,
      order: 0,
      bullets: [
        {
          id: 'bul-p1-1',
          text: 'Built SDK with zero-dependency footprint; adopted by 200+ GitHub stars in 3 months.',
          visible: true,
          order: 0,
        },
        {
          id: 'bul-p1-2',
          text: 'Implemented WebSocket-based live chart updates with React and Recharts.',
          visible: true,
          order: 1,
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
