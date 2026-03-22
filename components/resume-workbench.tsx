"use client";

import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

type ResumeApiResponse = {
  resume: {
    id: string;
    title: string;
    summary: string;
    content: string;
    createdAt: string;
    improvements: string[];
  };
  feedback: {
    answer: string;
    memoryUsed: string[];
  };
};

export function ResumeWorkbench() {
  const [mode, setMode] = useState<"feedback" | "generate" | "projects">("feedback");
  const [role, setRole] = useState("AI Engineer Intern");
  const [title, setTitle] = useState("AI Internship Resume");
  const [summary, setSummary] = useState("Focused on AI internships with full-stack product shipping evidence.");
  const [content, setContent] = useState("");
  const [generatedResume, setGeneratedResume] = useState<string>("");
  const [feedback, setFeedback] = useState<ResumeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch("/api/resume-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });
      const json = (await response.json()) as { content: string };
      setGeneratedResume(json.content);
      setMode("generate");
    } finally {
      setLoading(false);
    }
  }

  async function saveAndReview() {
    setLoading(true);
    try {
      const response = await fetch("/api/resume-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, summary, content })
      });
      const json = (await response.json()) as ResumeApiResponse;
      setFeedback(json);
      setMode("feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-4 text-[#ff980f]">
          <FileText className="h-7 w-7" />
          <h1 className="page-title">Resume Builder</h1>
        </div>
        <p className="page-subtitle">AI-powered resume feedback & generation using your memory history</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => setMode("feedback")} className={mode === "feedback" ? "orange-button" : "muted-button"}>
          Get Feedback
        </button>
        <button onClick={generate} className={mode === "generate" ? "orange-button" : "muted-button"}>
          Auto-Generate
        </button>
        <button onClick={() => setMode("projects")} className={mode === "projects" ? "orange-button" : "muted-button"}>
          Projects
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="soft-card">
          <h2 className="text-[20px] font-semibold text-slate-900">Paste Your Resume</h2>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-6 h-14 w-full rounded-2xl border border-[#e5e8ef] px-5 text-[16px] outline-none"
            placeholder="Resume title"
          />
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-4 h-14 w-full rounded-2xl border border-[#e5e8ef] px-5 text-[16px] outline-none"
            placeholder="Short summary"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={15}
            className="mt-4 min-h-[430px] w-full rounded-[24px] border border-[#e5e8ef] p-5 text-[18px] text-slate-700 outline-none"
            placeholder="Paste your resume text here..."
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={saveAndReview} className="orange-button">
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
            <button onClick={generate} className="muted-button">
              Generate Resume
            </button>
          </div>
        </section>

        <section className="soft-card">
          <div className="flex items-center gap-3 text-[#ff980f]">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-[20px] font-semibold text-slate-900">AI Feedback</h2>
          </div>

          {mode === "generate" && generatedResume ? (
            <pre className="mt-10 whitespace-pre-wrap text-[17px] leading-8 text-slate-700">{generatedResume}</pre>
          ) : feedback ? (
            <div className="mt-8 space-y-6">
              <div className="whitespace-pre-wrap text-[18px] leading-8 text-slate-700">{feedback.feedback.answer}</div>
              <div>
                <p className="text-[16px] font-semibold text-slate-900">Memory used</p>
                <div className="mt-3 space-y-3">
                  {feedback.feedback.memoryUsed.map((memory, index) => (
                    <div key={`resume-memory-${index}`} className="rounded-2xl bg-[#fff8ef] p-4 text-[16px] leading-7 text-slate-600">
                      {memory}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : mode === "projects" ? (
            <div className="mt-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f5f7fb] text-slate-300">
                <FileText className="h-8 w-8" />
              </div>
              <p className="mt-6 text-[18px] text-slate-500">Project-based resume suggestions will appear here</p>
            </div>
          ) : (
            <div className="mt-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f5f7fb] text-slate-300">
                <FileText className="h-8 w-8" />
              </div>
              <p className="mt-6 text-[18px] text-slate-500">Paste your resume and click analyze</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
