import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { RECRUITER_AGENT_PROMPT } from "@/lib/recruiter/prompt";
import { buildRecruiterContext } from "@/lib/recruiter/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getLatestUserQuery(messages: UIMessage[]) {
  const userMessages = messages.filter((message) => message.role === "user");
  const latest = userMessages[userMessages.length - 1];

  if (!latest) {
    return "";
  }

  if (typeof latest.content === "string") {
    return latest.content;
  }

  return latest.content
    .map((part) => (typeof part === "string" ? part : "text" in part ? part.text : ""))
    .join(" ")
    .trim();
}

export async function POST(request: Request) {
  const body = await request.json();
  const messages = (body.messages ?? []) as UIMessage[];
  const latestQuery = getLatestUserQuery(messages);
  const retrievedContext = latestQuery ? await buildRecruiterContext(latestQuery) : "No relevant evidence was retrieved from the experience graph.";

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
