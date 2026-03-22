import { NextResponse } from "next/server";

import { resetDemoData } from "@/lib/demo-store";

export async function POST() {
  await resetDemoData();
  return NextResponse.json({ ok: true });
}
