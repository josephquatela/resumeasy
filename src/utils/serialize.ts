import { ResumeData } from '../types/resume';

export function serializeResume(resume: ResumeData): string {
  return JSON.stringify(resume, null, 2);
}

export function deserializeResume(json: string): ResumeData {
  return JSON.parse(json) as ResumeData;
}
