import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { createRecruiterSupabaseClient } from "./supabase";

export type RecruiterMatch = {
  id: string;
  content: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

type PortfolioEmbeddingRow = {
  id?: string | number;
  content?: string;
  chunk?: string;
  text?: string;
  body?: string;
  metadata?: Record<string, unknown> | string | null;
  similarity?: number;
  score?: number;
};

function normalizeMetadata(value: PortfolioEmbeddingRow["metadata"]) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value;
}

function normalizeContent(row: PortfolioEmbeddingRow) {
  return row.content ?? row.chunk ?? row.text ?? row.body ?? "";
}

function normalizeSimilarity(row: PortfolioEmbeddingRow) {
  const value = row.similarity ?? row.score ?? 0;
  return Number.isFinite(value) ? Number(value) : 0;
}

function normalizeId(row: PortfolioEmbeddingRow, index: number) {
  return String(row.id ?? index + 1);
}

export async function searchPortfolioEmbeddings(query: string, limit = 6): Promise<RecruiterMatch[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY for recruiter retrieval");
  }

  const { embedding } = await embed({
    model: openai.embedding(process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small"),
    value: trimmedQuery,
  });

  const supabase = createRecruiterSupabaseClient();
  const { data, error } = await supabase.rpc("match_portfolio_embeddings", {
    query_embedding: embedding,
    match_count: limit,
  });

  if (error) {
    throw new Error("Failed to query portfolio_embeddings: " + error.message);
  }

  return ((data as PortfolioEmbeddingRow[] | null | undefined) ?? []).map((row, index) => ({
    id: normalizeId(row, index),
    content: normalizeContent(row),
    metadata: normalizeMetadata(row.metadata),
    similarity: normalizeSimilarity(row),
  })).filter((row) => row.content.length > 0);
}

export async function buildRecruiterContext(query: string, limit = 6) {
  const matches = await searchPortfolioEmbeddings(query, limit);

  if (matches.length === 0) {
    return "No relevant evidence was retrieved from the experience graph.";
  }

  return matches
    .map((match, index) => {
      const metadata = match.metadata ? JSON.stringify(match.metadata) : "{}";
      return (index + 1) + ". similarity=" + match.similarity.toFixed(3) + "\ncontent: " + match.content + "\nmetadata: " + metadata;
    })
    .join("\n\n");
}
