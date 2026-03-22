import { readProfile, writeProfile } from "@/lib/demo-store";
import { callGroq } from "@/lib/groq";
import { listCareerMemories, memoryEngineName, recallCareerMemory, retainCareerMemory } from "@/lib/hindsight";
import { calculateReadinessScore, detectStagnation } from "@/lib/scoring";
import { AdvisorResponse, CareerProfile, DashboardData, InternshipApplication, ResumeVersion, TimelineEvent } from "@/lib/types";

function buildFallbackAdvice(prompt: string, profile: CareerProfile, memories: string[], language: string) {
  const topRole = profile.targetRoles[0];
  const weakness = profile.codingWeaknesses[0];
  const internshipSignal = profile.internships[0];
  const intro =
    language === "Hindi"
      ? `Hindi mode: Based on your previous data, this is the most useful direction for a ${topRole} path.`
      : language === "Telugu"
        ? `Telugu mode: Based on your earlier progress, this is a strong direction for the ${topRole} goal.`
        : `Based on your saved history, this is the strongest next move for a ${topRole} path.`;

  return `${intro}\n\nYou asked: ${prompt}\n\nMemory used:\n- ${memories.join("\n- ") || "No prior memory found."}\n\nNext steps:\n1. Turn your existing projects into metric-heavy resume bullets.\n2. Close the gap in ${weakness.toLowerCase()} with a 2-week focused practice sprint.\n3. Apply to roles similar to ${internshipSignal.company} where your full-stack AI experience is already competitive.\n4. Add one deployment or MLOps proof-point this week to improve your readiness score.`;
}

export async function buildAdvisorResponse(prompt: string, language: "English" | "Hindi" | "Telugu"): Promise<AdvisorResponse> {
  const profile = await readProfile();
  await ensureSeedMemories(profile);
  const memories = await recallCareerMemory(`${profile.name} ${prompt}`);
  const readinessScore = calculateReadinessScore(profile);
  const stagnation = detectStagnation(profile);

  const systemPrompt =
    "You are an elite AI internship and career mentor. Use retrieved memory explicitly. Always mention how past data changes the advice. Return concise markdown with sections: Insight, Action Plan, Memory Used.";
  const userPrompt = `Candidate profile: ${JSON.stringify(profile)}\nRetrieved memory: ${JSON.stringify(
    memories.map((item) => item.text)
  )}\nPreferred language: ${language}\nQuestion: ${prompt}`;

  let answer = buildFallbackAdvice(prompt, profile, memories.map((item) => item.text), language);
  try {
    const groq = await callGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);
    if (groq) {
      answer = groq;
    }
  } catch {
    // Keep fallback advice.
  }

  await retainCareerMemory(
    `Chat insight for ${profile.name}: Question="${prompt}". Personalized advice referenced ${
      memories.length
    } prior memories and readiness score ${readinessScore}.`,
    ["chat", "mentor", language.toLowerCase()]
  );

  return {
    answer,
    memoryUsed: memories.map((item) => item.text),
    score: readinessScore,
    strategy: [
      "Quantify project impact with metrics and outcomes.",
      "Prioritize DSA plus SQL drills before the next interview loop.",
      "Target internships that reward shipping end-to-end AI products."
    ],
    stagnationRisk: stagnation,
    recommendations: profile.missingSkills.slice(0, 4)
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const profile = await readProfile();
  await ensureSeedMemories(profile);
  const memories = await listCareerMemories(50);
  const readinessScore = calculateReadinessScore(profile);

  return {
    profile,
    readinessScore,
    trendLabel:
      readinessScore >= 80 ? "Fast upward trajectory" : readinessScore >= 65 ? "Promising with targeted gaps" : "Needs sharper execution",
    weeklyFocus: [
      `Strengthen ${profile.missingSkills[0]} through one real build task.`,
      "Turn the latest project into three quantified resume bullets.",
      "Apply to 5 internships that match your strongest stack overlap."
    ],
    memoryHealth: {
      engine: memoryEngineName(),
      storedFacts: memories.length,
      lastSync: new Date().toISOString()
    },
    beforeAfterDemo: {
      before: "Generic advice: Learn coding, improve your resume, and apply broadly.",
      after:
        "Memory-based advice: Based on your Vector Labs rejection, weak DSA round, and strong Resume Ranker project, focus on dynamic programming drills, add deployment metrics, and target full-stack AI internships where your shipped products outperform pure algorithm scores."
    }
  };
}

export async function updateProfile(partial: Partial<CareerProfile>) {
  const profile = await readProfile();
  const nextProfile = {
    ...profile,
    ...partial
  };

  await writeProfile(nextProfile);
  await retainCareerMemory(
    `Profile update for ${nextProfile.name}: skills=${nextProfile.skills.join(", ")}; targetRoles=${nextProfile.targetRoles.join(
      ", "
    )}; weaknesses=${nextProfile.codingWeaknesses.join(", ")}.`,
    ["profile", "skills", "career"]
  );

  return nextProfile;
}

export async function saveResumeVersion(resume: ResumeVersion) {
  const profile = await readProfile();
  const nextProfile = {
    ...profile,
    resumes: [resume, ...profile.resumes],
    timeline: [
      {
        id: `resume-${Date.now()}`,
        kind: "resume",
        title: resume.title,
        detail: resume.summary,
        date: resume.createdAt,
        impact: "positive",
        tags: ["resume", "builder"]
      } satisfies TimelineEvent,
      ...profile.timeline
    ]
  };

  await writeProfile(nextProfile);
  await retainCareerMemory(
    `Resume version saved: ${resume.title}. Summary: ${resume.summary}. Improvements: ${resume.improvements.join("; ")}.`,
    ["resume", "builder", "career"]
  );

  return nextProfile;
}

export async function generateResume(role: string) {
  const profile = await readProfile();
  const memories = await recallCareerMemory(`${role} resume evidence`);
  const draft = `# ${profile.name}

## Headline
${profile.headline}

## Target Role
${role}

## Skills
${profile.skills.join(" | ")}

## Projects
${profile.projects
  .map((project) => `- ${project.name}: ${project.description} Outcome: ${project.outcome}. Stack: ${project.stack.join(", ")}.`)
  .join("\n")}

## Evidence from Memory
${memories.map((item) => `- ${item.text}`).join("\n") || "- Add more history through chat, applications, and resume updates."}
`;

  return {
    content: draft,
    improvements: [
      "Reordered content to match the requested role.",
      "Pulled strong projects and repeated strengths from memory.",
      "Highlighted evidence from prior applications and learning history."
    ]
  };
}

export async function saveApplication(application: InternshipApplication) {
  const profile = await readProfile();
  const nextProfile = {
    ...profile,
    internships: [application, ...profile.internships],
    timeline: [
      {
        id: application.id,
        kind: "application",
        title: `${application.company} - ${application.role}`,
        detail: `${application.status.toUpperCase()}: ${application.notes}`,
        date: application.date,
        impact: application.status === "rejected" ? "warning" : "positive",
        tags: ["application", application.status]
      } satisfies TimelineEvent,
      ...profile.timeline
    ]
  };

  await writeProfile(nextProfile);
  await retainCareerMemory(
    `Internship update: ${application.company} ${application.role} is ${application.status}. Notes: ${application.notes}. Match score: ${application.matchScore}.`,
    ["internship", application.status, application.company.toLowerCase()]
  );

  return nextProfile;
}

export async function analyzeSkillGap(role: string) {
  const profile = await readProfile();
  const roleMap: Record<string, string[]> = {
    "AI Engineer Intern": ["Python", "MLOps", "Docker", "Vector Databases", "LLM Evaluation"],
    "Machine Learning Intern": ["Python", "Data Structures", "PyTorch", "MLOps", "SQL"],
    "Full-Stack AI Developer": ["Next.js", "Node.js", "Docker", "System Design", "Vector Databases"]
  };

  const desired = roleMap[role] || roleMap["AI Engineer Intern"];
  const present = desired.filter((item) => profile.skills.includes(item));
  const missing = desired.filter((item) => !profile.skills.includes(item));
  const readiness = Math.round((present.length / desired.length) * 100);

  await retainCareerMemory(
    `Skill gap analysis run for role ${role}. Present skills: ${present.join(", ")}. Missing skills: ${missing.join(", ")}.`,
    ["analysis", "skills", slug(role)]
  );

  return {
    role,
    present,
    missing,
    readiness,
    roadmap: missing.map((item, index) => `Week ${index + 1}: Build one mini deliverable around ${item}.`)
  };
}

export async function getTimelineSummary() {
  const profile = await readProfile();
  return profile.timeline
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function slug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function ensureSeedMemories(profile: CareerProfile) {
  const existing = await listCareerMemories(10);
  if (existing.length > 0) {
    return;
  }

  const facts = [
    `Candidate ${profile.name} is targeting ${profile.targetRoles.join(", ")}.`,
    `${profile.name} has built ${profile.projects.map((project) => project.name).join(" and ")}.`,
    `Key coding weaknesses: ${profile.codingWeaknesses.join(", ")}.`,
    `Learning behavior: ${profile.learningBehavior.join(", ")}.`,
    `Recent internship outcomes: ${profile.internships.map((item) => `${item.company}=${item.status}`).join(", ")}.`,
    `Current missing skills are ${profile.missingSkills.join(", ")}.`
  ];

  for (const fact of facts) {
    await retainCareerMemory(fact, ["seed", "profile", "career"]);
  }
}
