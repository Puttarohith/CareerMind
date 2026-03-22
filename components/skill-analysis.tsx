"use client";

import { useMemo, useState } from "react";
import { BarChart3, Plus } from "lucide-react";

type AnalysisResponse = {
  role: string;
  present: string[];
  missing: string[];
  readiness: number;
  roadmap: string[];
};

type SkillItem = {
  name: string;
  category: string;
  score: number;
};

export function SkillAnalysis() {
  const [mode, setMode] = useState<"overview" | "gap">("overview");
  const [role, setRole] = useState("AI Engineer Intern");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillItem[]>([{ name: "javs", category: "Programming", score: 50 }]);
  const [showForm, setShowForm] = useState(false);
  const [newSkill, setNewSkill] = useState<SkillItem>({ name: "", category: "Programming", score: 50 });

  async function run() {
    setLoading(true);
    try {
      const response = await fetch("/api/skill-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });
      const json = (await response.json()) as AnalysisResponse;
      setAnalysis(json);
      setMode("gap");
    } finally {
      setLoading(false);
    }
  }

  const hasEnoughCategories = useMemo(() => new Set(skills.map((item) => item.category)).size >= 3, [skills]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 text-[#ff980f]">
            <BarChart3 className="h-7 w-7" />
            <h1 className="page-title">Skill Analysis</h1>
          </div>
          <p className="page-subtitle">Track skills, detect gaps, and get improvement plans</p>
        </div>
        <button onClick={() => setShowForm((current) => !current)} className="orange-button gap-3 text-[18px]">
          <Plus className="h-6 w-6" />
          Add Skill
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => setMode("overview")} className={mode === "overview" ? "orange-button" : "muted-button"}>
          Overview
        </button>
        <button onClick={() => setMode("gap")} className={mode === "gap" ? "orange-button" : "muted-button"}>
          Gap Analysis
        </button>
      </div>

      {showForm && (
        <div className="soft-card grid gap-4 xl:grid-cols-4">
          <input
            value={newSkill.name}
            onChange={(event) => setNewSkill((current) => ({ ...current, name: event.target.value }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Skill name"
          />
          <input
            value={newSkill.category}
            onChange={(event) => setNewSkill((current) => ({ ...current, category: event.target.value }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Category"
          />
          <input
            type="number"
            value={newSkill.score}
            onChange={(event) => setNewSkill((current) => ({ ...current, score: Number(event.target.value) }))}
            className="h-14 rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
            placeholder="Score"
          />
          <button
            onClick={() => {
              if (!newSkill.name.trim()) return;
              setSkills((current) => [...current, newSkill]);
              setNewSkill({ name: "", category: "Programming", score: 50 });
              setShowForm(false);
            }}
            className="orange-button"
          >
            Save Skill
          </button>
        </div>
      )}

      {mode === "overview" ? (
        <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
          <section className="soft-card min-h-[510px]">
            <h2 className="text-[20px] font-semibold text-slate-900">Skill Distribution</h2>
            <div className="grid min-h-[400px] place-items-center text-center">
              <p className="max-w-xl text-[18px] leading-8 text-slate-500">
                {hasEnoughCategories ? "Radar chart can be rendered here once charting is added." : "Add skills in at least 3 categories to see the radar chart"}
              </p>
            </div>
          </section>

          <section className="soft-card min-h-[510px]">
            <h2 className="text-[20px] font-semibold text-slate-900">All Skills ({skills.length})</h2>
            <div className="mt-12 space-y-8">
              {skills.map((item, index) => (
                <div key={`${item.name}-${index}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[18px] font-medium text-slate-900">{item.name}</p>
                    <p className="text-[16px] text-slate-500">{item.score}%</p>
                  </div>
                  <div className="h-3 rounded-full bg-[#f0f0f0]">
                    <div className="h-3 rounded-full bg-[#ff980f]" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-3 text-[16px] text-slate-500">{item.category}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <section className="soft-card h-fit">
            <h2 className="text-[20px] font-semibold text-slate-900">Gap Analysis</h2>
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-6 h-14 w-full rounded-2xl border border-[#e5e8ef] px-4 text-[16px] outline-none"
              placeholder="Target role"
            />
            <button onClick={run} className="orange-button mt-4 w-full">
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>
          </section>

          <section className="soft-card">
            {analysis ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[18px] font-semibold text-slate-900">{analysis.role}</p>
                  <p className="mt-2 text-[16px] text-slate-500">Readiness: {analysis.readiness}%</p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <div>
                    <p className="text-[16px] font-semibold text-slate-900">Present Skills</p>
                    <div className="mt-3 space-y-3">
                      {analysis.present.map((item, index) => (
                        <div key={`present-${index}`} className="rounded-2xl bg-[#f6faf7] p-4 text-[16px] text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-slate-900">Missing Skills</p>
                    <div className="mt-3 space-y-3">
                      {analysis.missing.map((item, index) => (
                        <div key={`missing-${index}`} className="rounded-2xl bg-[#fff8ef] p-4 text-[16px] text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-slate-900">Improvement Plan</p>
                  <div className="mt-3 space-y-3">
                    {analysis.roadmap.map((item, index) => (
                      <div key={`roadmap-${index}`} className="rounded-2xl border border-[#eceef4] p-4 text-[16px] text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[320px] place-items-center text-center">
                <p className="max-w-xl text-[18px] leading-8 text-slate-500">Run a gap analysis to compare current skills against a target role.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
