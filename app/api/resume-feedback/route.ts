import { NextRequest, NextResponse } from "next/server";

import { buildAdvisorResponse, saveResumeVersion } from "@/lib/career-advisor";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    title?: string;
    summary?: string;
    content?: string;
  };

  if (!body.title || !body.content || !body.summary) {
    return NextResponse.json({ error: "Resume title, summary, and content are required." }, { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const resume = {
    id: `resume-${Date.now()}`,
    title: body.title,
    summary: body.summary,
    content: body.content,
    createdAt: timestamp,
    improvements: [
      "Add measurable impact to every project bullet.",
      "Align summary to the target internship theme.",
      "Keep the strongest AI stack evidence above the fold."
    ]
  };

  await saveResumeVersion(resume);
  const feedback = await buildAdvisorResponse(
    `Give feedback on this resume for internship success. Resume summary: ${body.summary}. Resume content: ${body.content}`,
    "English"
  );

  return NextResponse.json({
    resume,
    feedback
  });
}
