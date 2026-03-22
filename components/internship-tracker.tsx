"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Plus, Sparkles } from "lucide-react";

type InternshipPayload = {
  applications: Array<{
    id: string;
    company: string;
    role: string;
    status: string;
    date: string;
    notes: string;
    matchScore: number;
  }>;
  recommendations: Array<{
    id: string;
    company: string;
    role: string;
    reason: string;
    fitScore: number;
  }>;
};

export function InternshipTracker() {
  const [data, setData] = useState<InternshipPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: "amazon",
    role: "software developer",
    status: "applied",
    notes: "Strong product fit. Need stronger interview preparation for DSA and APIs.",
    matchScore: 82
  });

  async function load() {
    const response = await fetch("/api/internships");
    const json = (await response.json()) as InternshipPayload;
    setData(json);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit() {
    setLoading(true);
    try {
      await fetch("/api/internships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      await load();
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const applications = data?.applications || [];
    return {
      total: applications.length,
      applied: applications.filter((item) => item.status === "applied").length,
      interview: applications.filter((item) => item.status === "interview").length,
      offer: applications.filter((item) => item.status === "offer").length,
      rejected: applications.filter((item) => item.status === "rejected").length
    };
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 text-[#ff980f]">
            <BriefcaseBusiness className="h-7 w-7" />
            <h1 className="page-title">Internship Tracker</h1>
          </div>
          <p className="page-subtitle">Track applications & get AI strategy advice</p>
        </div>
        <button onClick={() => setShowForm((current) => !current)} className="orange-button gap-3 text-[18px]">
          <Plus className="h-6 w-6" />
          Add
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total", stats.total, "#f8f4ef"],
          ["Applied", stats.applied, "#eaf1ff"],
          ["Interview", stats.interview, "#f9f1d9"],
          ["Offers", stats.offer, "#ddf4ea"],
          ["Rejected", stats.rejected, "#f8e4e6"]
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-[24px] p-6 text-center" style={{ backgroundColor: color as string }}>
            <p className="text-[46px] font-semibold leading-none text-slate-950">{value}</p>
            <p className="mt-2 text-[17px] text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="soft-card grid gap-4 xl:grid-cols-5">
          <input
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Role"
          />
          <input
            value={form.company}
            onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Company"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
          >
            <option value="saved">saved</option>
            <option value="applied">applied</option>
            <option value="interview">interview</option>
            <option value="offer">offer</option>
            <option value="rejected">rejected</option>
          </select>
          <input
            value={form.matchScore}
            onChange={(event) => setForm((current) => ({ ...current, matchScore: Number(event.target.value) }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Match score"
            type="number"
          />
          <button onClick={submit} className="orange-button">
            {loading ? "Saving..." : "Save Application"}
          </button>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="xl:col-span-5 min-h-[110px] rounded-2xl border border-[#e5e8ef] p-4 text-[16px] outline-none"
            placeholder="Notes"
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_480px]">
        <section className="space-y-5">
          {(data?.applications || []).map((item) => (
            <div key={item.id} className="soft-card max-w-[560px]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f3ee] text-slate-400">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[20px] font-semibold capitalize text-slate-950">{item.role}</p>
                  <p className="text-[18px] text-slate-500">{item.company}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="rounded-2xl border border-[#dde4f0] bg-[#f8fafc] px-4 py-2 text-[16px] text-[#2563eb]">
                      {item.status}
                    </div>
                    <div className="flex items-center gap-2 text-[18px] text-slate-500">
                      <CalendarDays className="h-5 w-5" />
                      Mar 22, 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="soft-card h-fit">
          <div className="flex items-center gap-3 text-[#ff980f]">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-[20px] font-semibold text-slate-900">AI Strategy Advisor</h2>
          </div>
          <button className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#e4e8f0] bg-[#fbfcfe] text-[18px] font-medium text-slate-900">
            <Sparkles className="h-5 w-5" />
            Get Strategy Advice
          </button>
          <p className="mt-16 text-center text-[18px] leading-8 text-slate-500">
            Add applications and click &quot;Get Strategy&quot; for personalized advice
          </p>
        </section>
      </div>
    </div>
  );
}
