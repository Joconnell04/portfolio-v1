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

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    slug: "recruiter-agent-module",
    title: "Recruiter Agent Module",
    summary: "Recruiter-facing portfolio module that helps visitors explore relevant experience, ask questions, and get a tailored overview of Jackson's background.",
    segment: "Personal Projects",
    tags: ["Next.js", "Vercel AI SDK", "Supabase", "OpenAI"],
    sourceUrl: "https://www.notion.so/33029338df99812a855af1d20fdf8d04",
  },
  {
    slug: "clawdbot-vitals",
    title: "ClawdBot Vitals",
    summary: "A playful, terminal-style portfolio component that shows monthly API token usage and host health without exposing secrets.",
    segment: "Personal Projects",
    tags: ["Observability", "Terminal UI", "OpenClaw"],
    sourceUrl: "https://www.notion.so/33129338df9981cc9f46c19bbece537a",
  },
  {
    slug: "all3dp-technical-writing",
    title: "All3DP Technical Writing",
    summary: "Technical 3D-printing writing across printers, slicing, materials, and workflows.",
    segment: "Media / Writing",
    tags: ["3D Printing", "Editorial", "Search"],
    sourceUrl: "https://www.notion.so/4c69ffd4a8c247ec9c108e4708d5fb40",
  },
  {
    slug: "3dsourced-technical-content",
    title: "3DSourced Technical Content",
    summary: "Editorial work that complements All3DP and PrintingAtoms with technical, search-friendly coverage.",
    segment: "Media / Writing",
    tags: ["3D Printing", "Content Strategy", "Editorial"],
    sourceUrl: "https://www.notion.so/7280b0e54307485b94ba5e43f5a73a3f",
  },
];

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
    return FALLBACK_PROJECTS.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("portfolio_embeddings")
    .select("project_name, description, tags, segment, source_url")
    .order("project_name", { ascending: true })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return FALLBACK_PROJECTS.slice(0, limit);
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
