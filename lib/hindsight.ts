import { HindsightClient } from "@vectorize-io/hindsight-client";

import { appendLocalMemory, readLocalMemories } from "@/lib/demo-store";
import { MemoryFact } from "@/lib/types";

const hindsightApiUrl = process.env.HINDSIGHT_API_URL || "https://hindsight.vectorize.io";
const hindsightApiKey = process.env.HINDSIGHT_API_KEY;
const bankId = process.env.HINDSIGHT_BANK_ID || "career-mentor-demo";
let bankReady = false;

function getClient() {
  if (!hindsightApiKey) {
    return null;
  }

  return new HindsightClient({
    baseUrl: hindsightApiUrl,
    apiKey: hindsightApiKey
  });
}

export async function retainCareerMemory(text: string, tags: string[]) {
  const client = getClient();

  if (client) {
    try {
      await ensureBank(client);
      await (client as any).retain(bankId, text, {
        context: tags.join(", "),
        metadata: { tags }
      });
      return { engine: "Hindsight Cloud", success: true as const };
    } catch {
      await appendLocalMemory(text, tags);
      return { engine: "Fallback Shadow Store", success: true as const };
    }
  }

  await appendLocalMemory(text, tags);
  return { engine: "Fallback Shadow Store", success: true as const };
}

export async function recallCareerMemory(query: string, topK = 6): Promise<MemoryFact[]> {
  const client = getClient();

  if (client) {
    try {
      await ensureBank(client);
      const response = await (client as any).recall(bankId, query, {
        budget: "high"
      });

      return (response.results || []).map((item: { text: string; score?: number }) => ({
        text: item.text,
        score: item.score,
        source: "hindsight"
      })).slice(0, topK);
    } catch {
      return recallFallbackMemory(query, topK);
    }
  }

  return recallFallbackMemory(query, topK);
}

export async function listCareerMemories(limit = 20): Promise<MemoryFact[]> {
  const client = getClient();

  if (client) {
    try {
      await ensureBank(client);
      const response = await (client as any).listMemories(bankId, {
        limit
      });

      return (response.items || []).map((item: { text: string }) => ({
        text: item.text,
        source: "hindsight"
      }));
    } catch {
      return listFallbackMemories(limit);
    }
  }

  return listFallbackMemories(limit);
}

async function listFallbackMemories(limit: number): Promise<MemoryFact[]> {
  const rows = await readLocalMemories();
  return rows.slice(0, limit).map((item) => ({
    text: item.text,
    source: "fallback"
  }));
}

async function recallFallbackMemory(query: string, topK: number): Promise<MemoryFact[]> {
  const rows = await readLocalMemories();
  const tokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  return rows
    .map((item) => {
      const hay = `${item.text} ${item.tags.join(" ")}`.toLowerCase();
      const score = tokens.reduce((total, token) => total + (hay.includes(token) ? 1 : 0), 0);
      return { text: item.text, score, source: "fallback" as const };
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, topK);
}

export function memoryEngineName() {
  return hindsightApiKey ? "Hindsight Cloud" : "Fallback Shadow Store";
}

async function ensureBank(client: HindsightClient) {
  if (bankReady) {
    return;
  }

  try {
    await (client as any).createBank(bankId, {
      name: "Career Advisor Memory",
      mission:
        "Remember user skills, projects, internship applications, resume versions, coding weaknesses, and learning behavior to improve future career advice.",
      disposition: {
        skepticism: 3,
        literalism: 3,
        empathy: 4
      }
    });
  } catch {
    // Ignore create errors since the bank may already exist.
  }

  bankReady = true;
}
