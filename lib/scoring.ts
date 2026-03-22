import { CareerProfile } from "@/lib/types";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateReadinessScore(profile: CareerProfile) {
  const skillCoverage = Math.max(0, 100 - profile.missingSkills.length * 8);
  const projectDepth = Math.min(100, profile.projects.length * 22);
  const applicationMomentum =
    profile.internships.filter((item) => item.status === "interview" || item.status === "offer").length *
    18;
  const resumeStrength = Math.min(
    100,
    profile.resumes.at(0)?.improvements.length ? 72 - profile.resumes.at(0)!.improvements.length * 6 : 65
  );
  const weaknessPenalty = profile.codingWeaknesses.length * 4;

  return clamp(skillCoverage * 0.3 + projectDepth * 0.2 + applicationMomentum * 0.2 + resumeStrength * 0.2 + (100 - weaknessPenalty) * 0.1);
}

export function detectStagnation(profile: CareerProfile) {
  const latestEvent = profile.timeline
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!latestEvent) {
    return "high" as const;
  }

  const daysSinceLatest = (Date.now() - new Date(latestEvent.date).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLatest > 21) return "high" as const;
  if (daysSinceLatest > 10) return "medium" as const;
  return "low" as const;
}
