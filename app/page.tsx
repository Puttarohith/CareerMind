import { DashboardClient } from "@/components/dashboard-client";
import { getDashboardData } from "@/lib/career-advisor";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
