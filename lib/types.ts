export type TimelineKind =
  | "skill"
  | "project"
  | "resume"
  | "application"
  | "mistake"
  | "behavior"
  | "chat";

export type TimelineEvent = {
  id: string;
  kind: TimelineKind;
  title: string;
  detail: string;
  date: string;
  impact: "positive" | "neutral" | "warning";
  tags: string[];
};

export type ApplicationStatus = "saved" | "applied" | "interview" | "rejected" | "offer";

export type InternshipApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  date: string;
  notes: string;
  matchScore: number;
};

export type ResumeVersion = {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  improvements: string[];
};

export type CareerProfile = {
  userId: string;
  name: string;
  headline: string;
  targetRoles: string[];
  preferredLanguage: "English" | "Hindi" | "Telugu";
  yearsOfExperience: number;
  skills: string[];
  missingSkills: string[];
  projects: {
    name: string;
    description: string;
    stack: string[];
    outcome: string;
  }[];
  codingWeaknesses: string[];
  learningBehavior: string[];
  internships: InternshipApplication[];
  resumes: ResumeVersion[];
  timeline: TimelineEvent[];
};

export type MemoryFact = {
  text: string;
  score?: number;
  source?: "hindsight" | "fallback";
};

export type AdvisorResponse = {
  answer: string;
  memoryUsed: string[];
  score: number;
  strategy: string[];
  stagnationRisk: "low" | "medium" | "high";
  recommendations: string[];
};

export type DashboardData = {
  profile: CareerProfile;
  readinessScore: number;
  trendLabel: string;
  weeklyFocus: string[];
  memoryHealth: {
    engine: string;
    storedFacts: number;
    lastSync: string;
  };
  beforeAfterDemo: {
    before: string;
    after: string;
  };
};
