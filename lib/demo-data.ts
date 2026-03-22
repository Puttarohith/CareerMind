import { CareerProfile } from "@/lib/types";

export const demoProfile: CareerProfile = {
  userId: process.env.DEMO_USER_ID || "demo-user",
  name: "Rohith",
  headline: "Aspiring AI Engineer focused on internships in applied ML and full-stack AI.",
  targetRoles: [
    "AI Engineer Intern",
    "Machine Learning Intern",
    "Full-Stack AI Developer"
  ],
  preferredLanguage: "English",
  yearsOfExperience: 1,
  skills: [
    "Python",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "SQL",
    "LangChain",
    "Prompt Engineering"
  ],
  missingSkills: ["Data Structures", "System Design", "MLOps", "Docker", "Vector Databases"],
  projects: [
    {
      name: "Campus StudyBot",
      description: "Built a retrieval-based learning assistant for student FAQs.",
      stack: ["Next.js", "Node.js", "Supabase", "OpenAI"],
      outcome: "Used by 120 students during finals week."
    },
    {
      name: "Resume Ranker",
      description: "Parsed resumes and ranked them against internship job descriptions.",
      stack: ["Python", "FastAPI", "Sentence Transformers"],
      outcome: "Improved recruiter screening time by 35% in a college club pilot."
    }
  ],
  codingWeaknesses: [
    "Dynamic programming under time pressure",
    "SQL joins in interviews",
    "Over-explaining projects without metrics"
  ],
  learningBehavior: [
    "Learns fast through hands-on builds",
    "Consistency drops during exam weeks",
    "Responds well to milestone-based roadmaps"
  ],
  internships: [
    {
      id: "app-1",
      company: "Vector Labs",
      role: "AI Intern",
      status: "rejected",
      date: "2026-02-10",
      notes: "Strong project discussion but weak DSA round.",
      matchScore: 71
    },
    {
      id: "app-2",
      company: "CraftAI",
      role: "Full-Stack AI Intern",
      status: "interview",
      date: "2026-03-11",
      notes: "Need cleaner resume bullets and stronger API deployment examples.",
      matchScore: 84
    }
  ],
  resumes: [
    {
      id: "resume-1",
      title: "General AI Internship Resume",
      summary: "Focused on projects and coursework.",
      content:
        "Rohith\nSkills: Python, Next.js, Node.js, SQL, Prompt Engineering\nProjects: Campus StudyBot, Resume Ranker",
      createdAt: "2026-02-01",
      improvements: [
        "Add quantified metrics for both projects",
        "Move skills into grouped categories",
        "Highlight internship readiness with deployment experience"
      ]
    }
  ],
  timeline: [
    {
      id: "event-1",
      kind: "project",
      title: "Shipped Resume Ranker",
      detail: "Completed FastAPI backend and semantic ranking workflow.",
      date: "2026-01-15",
      impact: "positive",
      tags: ["project", "python", "nlp"]
    },
    {
      id: "event-2",
      kind: "application",
      title: "Vector Labs rejection",
      detail: "DSA round exposed weakness in dynamic programming.",
      date: "2026-02-10",
      impact: "warning",
      tags: ["application", "dsa", "feedback"]
    },
    {
      id: "event-3",
      kind: "resume",
      title: "Resume revision v1",
      detail: "Added AI project outcomes but still missing metrics on impact.",
      date: "2026-02-18",
      impact: "neutral",
      tags: ["resume"]
    },
    {
      id: "event-4",
      kind: "skill",
      title: "Started MLOps foundations",
      detail: "Began learning Docker and model deployment basics.",
      date: "2026-03-05",
      impact: "positive",
      tags: ["mlops", "docker"]
    }
  ]
};
