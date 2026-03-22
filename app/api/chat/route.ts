import { NextRequest, NextResponse } from "next/server";

import { buildAdvisorResponse } from "@/lib/career-advisor";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    prompt?: string;
    language?: "English" | "Hindi" | "Telugu";
  };

  if (!body.prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  const response = await buildAdvisorResponse(body.prompt, body.language || "English");
  return NextResponse.json(response);
}
