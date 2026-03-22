import { NextRequest, NextResponse } from "next/server";

import { readProfile } from "@/lib/demo-store";
import { updateProfile } from "@/lib/career-advisor";

export async function GET() {
  const profile = await readProfile();
  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as Partial<Awaited<ReturnType<typeof readProfile>>>;
  const profile = await updateProfile(body);
  return NextResponse.json(profile);
}
