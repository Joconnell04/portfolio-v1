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

async function queryPortfolioEmbeddings(queryEmbedding: number[], limit: number) {
  const supabase = createRecruiterSupabaseClient();

  if (!supabase) {
    return [] as PortfolioEmbeddingRow[];
  }

  const rpcResult = await supabase.rpc("match_portfolio_embeddings", {
    query_embedding: queryEmbedding,
    match_count: limit,
  });

  if (!rpcResult.error && Array.isArray(rpcResult.data)) {
    return rpcResult.data as PortfolioEmbeddingRow[];
  }

  const fallback = await supabase
    .from("portfolio_embeddings")
    .select("*")
    .limit(limit);

  if (fallback.error || !Array.isArray(fallback.data)) {
    return [] as PortfolioEmbeddingRow[];
  }

  return fallback.data as PortfolioEmbeddingRow[];
}

export async function searchPortfolioEmbeddings(query: string, limit = 6): Promise<RecruiterMatch[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  if (!process.env.OPENAI_API_KEY) {
    return [];
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding(process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small"),
      value: trimmedQuery,
    });

    const rows = await queryPortfolioEmbeddings(embedding, limit);

    return rows
      .map((row, index) => ({
        id: normalizeId(row, index),
        content: normalizeContent(row),
        metadata: normalizeMetadata(row.metadata),
        similarity: normalizeSimilarity(row),
      }))
      .filter((row) => row.content.length > 0);
  } catch {
    return [];
  }
}

export async function buildRecruiterContext(query: string, limit = 6) {
  const matches = await searchPortfolioEmbeddings(query, limit);

  if (matches.length === 0) {
    return "No relevant evidence was retrieved from the experience graph.";
  }

  return matches
    .map((match, index) => {
      const metadata = match.metadata ? JSON.stringify(match.metadata) : "{}";
      return (index + 1) + ". similarity=" + match.similarity.toFixed(3) + "
content: " + match.content + "
metadata: " + metadata;
    })
    .join("

");
}
