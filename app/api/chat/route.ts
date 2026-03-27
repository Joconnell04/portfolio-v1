import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { RECRUITER_AGENT_PROMPT } from "@/lib/recruiter/prompt";
import { buildRecruiterContext } from "@/lib/recruiter/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TextPart = { type: "text"; text: string };
type AnyPart = TextPart | { type: string };

function extractTextFromParts(parts: AnyPart[]): string {
  return parts
    .filter((p): p is TextPart => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

function getLatestUserQuery(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "user") continue;

    // AI SDK v5: message parts live on msg.parts
    const withParts = msg as UIMessage & { parts?: AnyPart[] };
    if (Array.isArray(withParts.parts) && withParts.parts.length > 0) {
      const text = extractTextFromParts(withParts.parts);
      if (text) return text;
    }

    // Fallback: some serialisation formats keep a top-level content string
    const withContent = msg as UIMessage & { content?: string };
    if (typeof withContent.content === "string" && withContent.content.trim()) {
      return withContent.content.trim();
    }
  }

  return "";
}

export async function POST(request: Request) {
  const body = await request.json();
  const messages = (body.messages ?? []) as UIMessage[];
  const latestQuery = getLatestUserQuery(messages);
  const retrievedContext = latestQuery
    ? await buildRecruiterContext(latestQuery)
    : "No relevant evidence was retrieved from the experience graph.";

  const model = openai(process.env.OPENAI_MODEL ?? "gpt-4.1-mini");
  const result = streamText({
    model,
    system: [
      RECRUITER_AGENT_PROMPT,
      "",
      "Retrieved evidence from the experience graph:",
      retrievedContext,
    ].join("\n"),
    messages: await convertToModelMessages(messages),
    temperature: 0.2,
    maxOutputTokens: 900,
  });

  return result.toDataStreamResponse({
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
