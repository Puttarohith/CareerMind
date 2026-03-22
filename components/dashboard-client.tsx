"use client";

import Link from "next/link";
import { Brain, BriefcaseBusiness, FileText, Lightbulb, MessageSquareText, Sparkles } from "lucide-react";

import { DashboardData } from "@/lib/types";

function circleStyle(value: number) {
  const degree = Math.max(0, Math.min(100, value)) * 3.6;
  return {
    background: `conic-gradient(#ff980f ${degree}deg, #e8ebf1 ${degree}deg)`
  };
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const applications = data.profile.internships.length;
  const resumeVersions = data.profile.resumes.length;
  const projects = data.profile.projects.length;
  const chats = Math.max(2, data.memoryHealth.storedFacts - applications - resumeVersions - projects);
  const memories = [
    { label: "Skills", value: data.profile.skills.length },
    { label: "Applications", value: applications },
    { label: "Resume", value: resumeVersions },
    { label: "Projects", value: projects },
    { label: "Chats", value: chats }
  ];
  const maxMemory = Math.max(...memories.map((item) => item.value), 1);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 text-[#ff980f]">
          <Sparkles className="h-6 w-6" />
          <h1 className="page-title">Welcome, {data.profile.name}</h1>
        </div>
        <p className="page-subtitle">Your AI-powered career dashboard • Memories shape every recommendation</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_1.05fr_1fr]">
        <section className="soft-card border-t-4 border-t-[#ff980f]">
          <div className="flex items-center gap-3 text-slate-900">
            <Sparkles className="h-5 w-5 text-[#ff980f]" />
            <h2 className="text-[20px] font-semibold">Career Readiness Score</h2>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="grid h-[210px] w-[210px] place-items-center rounded-full" style={circleStyle(data.readinessScore)}>
              <div className="grid h-[160px] w-[160px] place-items-center rounded-full bg-white text-center">
                <div>
                  <p className="text-[46px] font-semibold leading-none text-[#ff7f00]">{data.readinessScore}%</p>
                  <p className="mt-2 text-[18px] text-slate-500">{data.readinessScore < 40 ? "Getting Started" : data.trendLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-7 text-center text-[16px] text-slate-500">Powered by Hindsight Memory</p>
        </section>

        <section className="soft-card">
          <div className="flex items-center gap-3 text-slate-900">
            <Brain className="h-5 w-5 text-[#ff980f]" />
            <h2 className="text-[20px] font-semibold">Hindsight Memory Bank</h2>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-[22px] bg-[#f8f4ef] p-5 text-center">
              <p className="text-[42px] font-semibold leading-none text-slate-900">{data.memoryHealth.storedFacts}</p>
              <p className="mt-2 text-[15px] text-slate-500">Total Memories</p>
            </div>
            <div className="rounded-[22px] bg-[#f8f4ef] p-5 text-center">
              <p className="text-[42px] font-semibold leading-none text-slate-900">{Math.min(8, data.memoryHealth.storedFacts)}</p>
              <p className="mt-2 text-[15px] text-slate-500">This Week</p>
            </div>
            <div className="rounded-[22px] bg-[#f8f4ef] p-5 text-center">
              <p className="text-[42px] font-semibold leading-none text-slate-900">6.4</p>
              <p className="mt-2 text-[15px] text-slate-500">Avg Priority</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[18px] font-semibold text-slate-500">Memory Breakdown</h3>
            <div className="mt-4 space-y-4">
              {memories.map((item) => (
                <div key={item.label} className="grid grid-cols-[120px_1fr_28px] items-center gap-4">
                  <span className="text-[16px] text-slate-500">{item.label}</span>
                  <div className="h-2 rounded-full bg-[#efefef]">
                    <div
                      className="h-2 rounded-full bg-[#ff980f]"
                      style={{ width: `${Math.max(10, (item.value / maxMemory) * 100)}%` }}
                    />
                  </div>
                  <span className="text-right text-[16px] text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="soft-card">
          <h2 className="text-[20px] font-semibold text-slate-900">Career Timeline</h2>
          <div className="mt-8 space-y-6">
            {data.profile.timeline.slice(0, 6).map((event, index) => {
              const colors = ["#3b82f6", "#a855f7", "#ec4899", "#22c55e", "#22c55e", "#6b7280"];
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: colors[index] || "#ff980f" }}>
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    {index < 5 && <div className="mt-2 h-10 w-[2px] bg-[#e7ebf3]" />}
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="truncate text-[18px] font-medium text-slate-900">{event.title}</p>
                    <p className="mt-1 text-[15px] text-slate-500">6 hours ago</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="soft-card">
          <h2 className="text-[20px] font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-8 space-y-4">
            <Link href="/chat" className="flex items-center gap-4 rounded-3xl border border-[#eceef4] p-5 transition hover:bg-[#fff8ef]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3df] text-[#ff980f]">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[18px] font-semibold text-slate-900">Chat with AI Mentor</p>
                <p className="text-[16px] text-slate-500">Get personalized career advice</p>
              </div>
            </Link>
            <Link href="/resume" className="flex items-center gap-4 rounded-3xl border border-[#eceef4] p-5 transition hover:bg-[#fff8ef]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3df] text-[#ff980f]">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[18px] font-semibold text-slate-900">Update Resume</p>
                <p className="text-[16px] text-slate-500">Save a new version and get feedback</p>
              </div>
            </Link>
            <Link href="/internships" className="flex items-center gap-4 rounded-3xl border border-[#eceef4] p-5 transition hover:bg-[#fff8ef]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3df] text-[#ff980f]">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[18px] font-semibold text-slate-900">Track Applications</p>
                <p className="text-[16px] text-slate-500">Store outcomes for strategy advice</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="soft-card">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-[#e7a600]" />
            <h2 className="text-[20px] font-semibold text-slate-900">AI Suggestions</h2>
          </div>
          <div className="mt-8 space-y-5">
            {data.weeklyFocus.map((item, index) => (
              <div key={index} className="rounded-3xl bg-[#fffaf3] p-5">
                <p className="text-[17px] leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
