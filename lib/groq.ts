type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callGroq(messages: GroqMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "qwen/qwen3-32b";

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return data.choices?.[0]?.message?.content || null;
}
