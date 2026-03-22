import { promises as fs } from "fs";
import path from "path";

import { demoProfile } from "@/lib/demo-data";
import { CareerProfile } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const profilePath = path.join(dataDir, "profile.json");
const memoryPath = path.join(dataDir, "memory-log.json");

type LocalMemoryRecord = {
  id: string;
  text: string;
  tags: string[];
  createdAt: string;
};

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readProfile(): Promise<CareerProfile> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(profilePath, "utf8");
    return JSON.parse(raw) as CareerProfile;
  } catch {
    await writeProfile(demoProfile);
    return demoProfile;
  }
}

export async function writeProfile(profile: CareerProfile) {
  await ensureDataDir();
  await fs.writeFile(profilePath, JSON.stringify(profile, null, 2), "utf8");
}

export async function appendLocalMemory(text: string, tags: string[]) {
  await ensureDataDir();
  const existing = await readLocalMemories();
  existing.unshift({
    id: `memory-${Date.now()}`,
    text,
    tags,
    createdAt: new Date().toISOString()
  });
  await fs.writeFile(memoryPath, JSON.stringify(existing, null, 2), "utf8");
}

export async function readLocalMemories(): Promise<LocalMemoryRecord[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(memoryPath, "utf8");
    return JSON.parse(raw) as LocalMemoryRecord[];
  } catch {
    return [];
  }
}

export async function resetDemoData() {
  await ensureDataDir();
  await writeProfile(demoProfile);
  await fs.writeFile(memoryPath, JSON.stringify([], null, 2), "utf8");
}
