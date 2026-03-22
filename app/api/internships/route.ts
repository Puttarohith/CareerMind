import { NextRequest, NextResponse } from "next/server";

import { readProfile } from "@/lib/demo-store";
import { saveApplication } from "@/lib/career-advisor";

export async function GET() {
  const profile = await readProfile();
  const recommendations = profile.targetRoles.map((role, index) => ({
    id: `rec-${index + 1}`,
    company: ["Groq", "Hugging Face", "Postman"][index % 3],
    role,
    reason:
      index === 0
        ? "Strong overlap with shipped AI projects and conversational product work."
        : "Your full-stack + AI blend matches teams that value prototypes and demos.",
    fitScore: 78 + index * 6
  }));

  return NextResponse.json({
    applications: profile.internships,
    recommendations
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    company?: string;
    role?: string;
    status?: "saved" | "applied" | "interview" | "rejected" | "offer";
    notes?: string;
    matchScore?: number;
  };

  if (!body.company || !body.role || !body.status || !body.notes) {
    return NextResponse.json({ error: "company, role, status, and notes are required." }, { status: 400 });
  }

  const profile = await saveApplication({
    id: `application-${Date.now()}`,
    company: body.company,
    role: body.role,
    status: body.status,
    date: new Date().toISOString(),
    notes: body.notes,
    matchScore: body.matchScore || 75
  });

  return NextResponse.json(profile);
}
