export type ExperienceLevel = "Entry" | "Mid" | "Senior";

export interface UserProfile {
  id: number;
  fullName: string;
  title: string;
  location: string;
  education: string;
  experienceYears: number;
  careerInterests: string[];
  skills: string[];
  bio: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  domain: string;
  experienceLevel: ExperienceLevel;
  requiredSkills: string[];
  salaryRange: string;
  summary: string;
  responsibilities: string[];
  benefits: string[];
}

export interface Course {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  domain: string;
  category: string;
  skillsCovered: string[];
  rating: number;
}

export interface CareerStep {
  title: string;
  description: string;
}

export interface Recommendation {
  id: number;
  type: "job" | "course" | "tip";
  title: string;
  reason: string;
}
