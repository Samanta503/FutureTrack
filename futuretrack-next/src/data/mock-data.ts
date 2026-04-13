import {
  CareerStep,
  Course,
  Job,
  Recommendation,
  UserProfile,
} from "@/lib/types";

export const featuredDomains = [
  "Product Management",
  "Data Science",
  "Frontend Engineering",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
];

export const landingFeatures = [
  {
    title: "Interactive Profile Builder",
    description:
      "Create a rich career profile with education, skills, projects, and achievements in minutes.",
  },
  {
    title: "Job Matching System",
    description:
      "Match score for every role based on your skills, interests, and experience level.",
  },
  {
    title: "Skill Gap Analyzer",
    description:
      "Spot missing skills quickly and get a practical learning path to close your gap.",
  },
  {
    title: "Course & Dashboard Recommendations",
    description:
      "Discover targeted courses and weekly growth recommendations from your dashboard.",
  },
  {
    title: "Pro Tips by Market Demand",
    description:
      "Stay ahead with trend-backed tips on hot skills and hiring demand.",
  },
];

export const howItWorks: CareerStep[] = [
  {
    title: "Build Your Career DNA",
    description: "Add education, skills, goals, and portfolio evidence.",
  },
  {
    title: "Get Smart Matches",
    description: "Find jobs ranked by match percentage and relevance.",
  },
  {
    title: "Close Skill Gaps",
    description: "See missing skills and learn with targeted course plans.",
  },
  {
    title: "Track and Grow",
    description: "Follow personalized weekly recommendations and milestones.",
  },
];

export const testimonials = [
  {
    name: "Ananya S.",
    role: "Final Year B.Tech Student",
    quote:
      "FutureTrack helped me identify cloud skills I was missing. I got two internship offers within 6 weeks.",
  },
  {
    name: "Irfan M.",
    role: "Career Switcher to Data Analytics",
    quote:
      "The skill-gap breakdown and course recommendations were exactly what I needed to pivot.",
  },
  {
    name: "Keerthi P.",
    role: "Junior Frontend Developer",
    quote:
      "The job match percentage gave me confidence to apply for roles that truly fit my profile.",
  },
];

export const sampleUserProfile: UserProfile = {
  id: 1,
  fullName: "Riya Verma",
  title: "Aspiring Product Analyst",
  location: "Bengaluru",
  education: "B.Sc Computer Science",
  experienceYears: 1,
  careerInterests: ["Product Analytics", "Data Visualization", "Growth"],
  skills: ["SQL", "Excel", "Python", "Power BI", "Communication"],
  bio: "Career-focused learner interested in product-led decision making and analytics.",
};

export const jobs: Job[] = [
  {
    id: 101,
    title: "Product Analyst Intern",
    company: "NovaPath",
    location: "Bengaluru",
    domain: "Product Management",
    experienceLevel: "Entry",
    requiredSkills: ["SQL", "Python", "A/B Testing", "Dashboarding", "Communication"],
    salaryRange: "INR 4.5L - 6L",
    summary: "Support product teams with user behavior insights and experiment analysis.",
    responsibilities: [
      "Analyze product funnel and retention metrics",
      "Build dashboards for product teams",
      "Collaborate on experiment design and reporting",
    ],
    benefits: ["Hybrid work", "Mentorship", "Learning stipend"],
  },
  {
    id: 102,
    title: "Frontend Developer",
    company: "PixelForge Labs",
    location: "Remote",
    domain: "Frontend Engineering",
    experienceLevel: "Entry",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Git"],
    salaryRange: "INR 6L - 9L",
    summary: "Build responsive interfaces for B2B SaaS modules.",
    responsibilities: [
      "Develop reusable UI components",
      "Integrate frontend with APIs",
      "Improve page performance and accessibility",
    ],
    benefits: ["Remote-first", "Health insurance", "Wellness allowance"],
  },
  {
    id: 103,
    title: "Data Analyst",
    company: "FinEdge",
    location: "Mumbai",
    domain: "Data Science",
    experienceLevel: "Mid",
    requiredSkills: ["SQL", "Python", "Tableau", "Statistics", "Storytelling"],
    salaryRange: "INR 8L - 13L",
    summary: "Transform business data into insights for growth and operations.",
    responsibilities: [
      "Deliver insights to leadership teams",
      "Automate recurring KPI reporting",
      "Partner with product and marketing teams",
    ],
    benefits: ["Performance bonus", "Upskilling budget", "Flexible timing"],
  },
  {
    id: 104,
    title: "Cloud Support Associate",
    company: "SkyMesh Cloud",
    location: "Hyderabad",
    domain: "Cloud & DevOps",
    experienceLevel: "Entry",
    requiredSkills: ["Linux", "Networking", "AWS Basics", "Troubleshooting", "Scripting"],
    salaryRange: "INR 5L - 8L",
    summary: "Handle cloud platform support and basic deployment troubleshooting.",
    responsibilities: [
      "Resolve support tickets and incidents",
      "Assist in cloud configuration tasks",
      "Document technical runbooks",
    ],
    benefits: ["Night shift allowance", "Certification support", "On-call bonus"],
  },
];

export const courses: Course[] = [
  {
    id: 201,
    title: "A/B Testing for Product Teams",
    provider: "GrowthX Academy",
    duration: "4 weeks",
    level: "Intermediate",
    domain: "Product Management",
    category: "Analytics",
    skillsCovered: ["A/B Testing", "Experiment Design", "Metrics"],
    rating: 4.7,
  },
  {
    id: 202,
    title: "React + TypeScript Bootcamp",
    provider: "CodeSprint",
    duration: "6 weeks",
    level: "Beginner",
    domain: "Frontend Engineering",
    category: "Development",
    skillsCovered: ["React", "TypeScript", "State Management", "Component Design"],
    rating: 4.8,
  },
  {
    id: 203,
    title: "Tableau for Business Insights",
    provider: "DataCraft",
    duration: "3 weeks",
    level: "Beginner",
    domain: "Data Science",
    category: "Visualization",
    skillsCovered: ["Tableau", "Dashboards", "Storytelling"],
    rating: 4.5,
  },
  {
    id: 204,
    title: "AWS Cloud Practitioner Path",
    provider: "CloudLift",
    duration: "5 weeks",
    level: "Beginner",
    domain: "Cloud & DevOps",
    category: "Cloud",
    skillsCovered: ["AWS Basics", "Cloud Concepts", "IAM", "Billing"],
    rating: 4.6,
  },
  {
    id: 205,
    title: "SQL for Product Analysts",
    provider: "QueryLab",
    duration: "2 weeks",
    level: "Intermediate",
    domain: "Product Management",
    category: "Analytics",
    skillsCovered: ["SQL", "Data Modeling", "KPI Analysis"],
    rating: 4.9,
  },
];

export const dashboardRecommendations: Recommendation[] = [
  {
    id: 1,
    type: "job",
    title: "Apply to Product Analyst Intern roles",
    reason: "You already match core analytics requirements in most entry roles.",
  },
  {
    id: 2,
    type: "course",
    title: "Learn A/B Testing this month",
    reason: "Improves your match score by up to 18% for product analytics jobs.",
  },
  {
    id: 3,
    type: "tip",
    title: "Build one portfolio case study",
    reason: "Recruiters prioritize evidence of decision-making and metrics impact.",
  },
];

export const marketProTips = [
  "Companies are actively hiring for SQL + BI + experimentation skill combinations.",
  "Frontend roles increasingly expect TypeScript and performance optimization basics.",
  "Cloud fundamentals with Linux and scripting create faster entry paths for DevOps careers.",
];
