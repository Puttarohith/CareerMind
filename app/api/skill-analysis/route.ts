import { NextRequest, NextResponse } from "next/server";

import { analyzeSkillGap } from "@/lib/career-advisor";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role?: string };
  if (!body.role) {
    return NextResponse.json({ error: "Role is required." }, { status: 400 });
  }

  const analysis = await analyzeSkillGap(body.role);
  return NextResponse.json(analysis);
}
