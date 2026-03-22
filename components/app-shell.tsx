"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BrainCircuit, BriefcaseBusiness, FileText, LayoutDashboard, MessageSquareText } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Mentor", icon: MessageSquareText },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/internships", label: "Internships", icon: BriefcaseBusiness },
  { href: "/skills", label: "Skill Analysis", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <div className="mx-auto max-w-[1880px] p-6">
        <div className="overflow-hidden rounded-[28px] border border-[#dde3ed] bg-white">
          <div className="grid min-h-[calc(100vh-48px)] lg:grid-cols-[360px_1fr]">
            <aside className="border-r border-[#e7ebf3] bg-white">
              <div className="border-b border-[#e7ebf3] px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff980f] text-white">
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-[18px] font-semibold text-slate-950">CareerMind</h1>
                    <p className="mt-1 text-[14px] text-slate-500">Hindsight AI</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2 px-3 py-8">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={cn("nav-item", active && "nav-item-active")}>
                      <Icon className="h-6 w-6" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex h-20 items-center justify-center border-t border-[#e7ebf3] text-slate-400">
                <span className="text-4xl leading-none">&lt;</span>
              </div>
            </aside>

            <main className="bg-[#fbfcfe] p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
