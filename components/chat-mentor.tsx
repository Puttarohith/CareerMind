"use client";

import { useMemo, useState } from "react";
import { BrainCircuit, Plus, Send, User } from "lucide-react";

type ChatResponse = {
  answer: string;
  memoryUsed: string[];
  score: number;
  strategy: string[];
  stagnationRisk: "low" | "medium" | "high";
  recommendations: string[];
};

type ChatSession = {
  id: string;
  title: string;
  prompt: string;
};

const starterChats: ChatSession[] = [
  {
    id: "chat-1",
    title: "Help me prepare for interviews",
    prompt: "Help me prepare for interviews"
  },
  {
    id: "chat-2",
    title: "Review my resume",
    prompt: "Review my resume"
  }
];

export function ChatMentor() {
  const [prompt, setPrompt] = useState(starterChats[0].prompt);
  const [language, setLanguage] = useState<"English" | "Hindi" | "Telugu">("English");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChatResponse | null>(null);
  const [sessions, setSessions] = useState(starterChats);
  const [activeSession, setActiveSession] = useState(starterChats[0].id);

  const activeTitle = useMemo(() => sessions.find((item) => item.id === activeSession)?.title || "AI Career Mentor", [activeSession, sessions]);

  async function sendPrompt() {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, language })
      });
      const json = (await response.json()) as ChatResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    const next = {
      id: `chat-${Date.now()}`,
      title: "New career question",
      prompt: ""
    };
    setSessions((current) => [next, ...current]);
    setActiveSession(next.id);
    setPrompt("");
    setData(null);
  }

  return (
    <div className="grid min-h-[780px] gap-0 overflow-hidden rounded-[28px] border border-[#e4e8f0] bg-white xl:grid-cols-[370px_1fr]">
      <div className="grid border-r border-[#e7ebf3] xl:grid-cols-[370px_1fr]">
        <div className="border-r border-[#e7ebf3] bg-white">
          <div className="border-b border-[#e7ebf3] px-6 py-6">
            <button onClick={startNewChat} className="orange-button flex w-full gap-3 !rounded-2xl !py-4 text-[18px]">
              <Plus className="h-6 w-6" />
              New Chat
            </button>
          </div>
          <div className="space-y-3 p-4">
            {sessions.map((session) => {
              const active = session.id === activeSession;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    setActiveSession(session.id);
                    setPrompt(session.prompt);
                  }}
                  className={`w-full rounded-3xl px-4 py-4 text-left text-[18px] ${
                    active ? "bg-[#fff3e2] text-[#ff8e07]" : "text-slate-500"
                  }`}
                >
                  {session.title}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#e7ebf3] px-5 py-5 text-[16px] text-slate-500">
            <span className="text-[#ff980f]">*</span> {Math.max(8, data?.memoryUsed.length || 0)} memories available
          </div>
        </div>

        <div className="hidden xl:block" />
      </div>

      <div className="flex min-h-[780px] flex-col bg-[#fbfcfe]">
        <div className="border-b border-[#e7ebf3] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3e2] text-[#ff980f]">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-[20px] font-semibold text-slate-950">{activeTitle || "AI Career Mentor"}</h1>
              <p className="text-[15px] text-slate-500">Powered by Hindsight Memory</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-auto px-8 py-8">
          <div className="flex items-start justify-end gap-4">
            <div className="rounded-[26px] bg-[#ff980f] px-6 py-5 text-[20px] font-medium text-white shadow-[0_14px_26px_rgba(255,152,15,0.24)]">
              {prompt || "Help me prepare for interviews"}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6] text-slate-500">
              <User className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff3e2] text-[#ff980f]">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="max-w-4xl rounded-[28px] border border-[#e6ebf4] bg-white p-7 text-[18px] leading-9 text-slate-800">
              {data ? (
                <div className="space-y-5">
                  <div className="whitespace-pre-wrap">{data.answer}</div>
                  {data.memoryUsed.length > 0 && (
                    <div>
                      <p className="mb-3 text-[16px] font-semibold text-slate-900">Memory used</p>
                      <div className="space-y-3">
                        {data.memoryUsed.map((memory, index) => (
                          <div key={`chat-memory-${index}`} className="rounded-2xl bg-[#fff8ef] px-4 py-3 text-[16px] leading-7 text-slate-600">
                            {memory}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p>
                    Hello! I&apos;m <strong>CareerMind</strong>, and I&apos;m excited to help you prepare for your next big opportunity.
                  </p>
                  <p>
                    <strong>Looking at your history</strong>, I can tailor the advice using your profile, projects, resume changes, and prior applications.
                  </p>
                  <p>
                    Step 1: Tell me your target role, key projects, and strongest skills. I&apos;ll use Hindsight memory to personalize what comes next.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e7ebf3] bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask your AI mentor anything..."
              className="h-[68px] flex-1 rounded-[26px] border border-[#e5e8ef] bg-[#fcfdff] px-6 text-[18px] text-slate-700 outline-none"
            />
            <button onClick={sendPrompt} disabled={loading} className="orange-button h-[68px] w-[68px] rounded-[22px] !px-0 !py-0">
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
