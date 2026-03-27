import { createClient } from "@supabase/supabase-js";

export type PortfolioProject = {
  slug: string;
  title: string;
  summary: string;
  segment?: string;
  tags: string[];
  sourceUrl?: string;
};

type PortfolioEmbeddingRow = {
  project_name: string;
  description: string;
  tags: string[] | null;
  segment: string | null;
  source_url: string | null;
};

function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function summarizeDescription(projectName: string, description: string) {
  const parts = description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const meaningfulParts = parts[0]?.toLowerCase() === projectName.toLowerCase() ? parts.slice(1) : parts;
  const merged = meaningfulParts.join(" ").replace(/\s+/g, " ").trim();

  if (merged.length <= 240) {
    return merged;
  }

  return `${merged.slice(0, 237).trimEnd()}…`;
}

export async function getPortfolioProjects(limit = 8): Promise<PortfolioProject[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_embeddings")
    .select("project_name, description, tags, segment, source_url")
    .order("project_name", { ascending: true })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as PortfolioEmbeddingRow[]).map((row) => ({
    slug: toSlug(row.project_name),
    title: row.project_name,
    summary: summarizeDescription(row.project_name, row.description),
    segment: row.segment ?? undefined,
    tags: row.tags ?? [],
    sourceUrl: row.source_url ?? undefined,
  }));
}
