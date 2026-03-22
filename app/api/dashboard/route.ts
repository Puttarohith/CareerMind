import { NextResponse } from "next/server";

import { getDashboardData } from "@/lib/career-advisor";

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}
