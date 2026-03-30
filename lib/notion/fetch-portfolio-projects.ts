import { notion } from "./client";
import type { PortfolioProject } from "@/lib/supabase/portfolio-projects";

function getText(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as Record<string, unknown>;
  if (Array.isArray(p.title))
    return (p.title as Array<{ plain_text: string }>)
      .map((t) => t.plain_text)
      .join("");
  if (Array.isArray(p.rich_text))
    return (p.rich_text as Array<{ plain_text: string }>)
      .map((t) => t.plain_text)
      .join("");
  return "";
}

function getSelect(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as Record<string, unknown>;
  if (p.select && typeof p.select === "object")
    return ((p.select as Record<string, unknown>).name as string) ?? "";
  return "";
}

function getMultiSelect(prop: unknown): string[] {
  if (!prop || typeof prop !== "object") return [];
  const p = prop as Record<string, unknown>;
  if (Array.isArray(p.multi_select))
    return (p.multi_select as Array<{ name: string }>).map((t) => t.name);
  return [];
}

function getUrl(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as Record<string, unknown>;
  return typeof p.url === "string" ? p.url : "";
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeGitHubUrl(raw: string): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return undefined;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 2) return undefined;
    return `https://github.com/${parts[0]}/${parts[1]}`;
  } catch {
    return undefined;
  }
}

export async function fetchNotionPortfolioProjects(
  limit = 12,
): Promise<PortfolioProject[]> {
  const databaseId = process.env.NOTION_PORTFOLIO_PROJECTS_DATABASE_ID;
  if (!databaseId || !process.env.NOTION_API_KEY) return [];

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: limit,
    });

    const projects = response.results
      .filter(
        (page): page is Extract<typeof page, { properties: unknown }> =>
          "properties" in page,
      )
      .flatMap((page): PortfolioProject[] => {
        const props = (page as { properties: Record<string, unknown> })
          .properties;
        const title = getText(props["Project Name"]);
        if (!title) return [];

        const summary =
          getText(props["Summary"]) || getText(props["What I Did"]) || "";
        if (!summary) return [];

        const tags =
          getMultiSelect(props["Subcategory"]).length > 0
            ? getMultiSelect(props["Subcategory"])
            : getText(props["Tech Stack"])
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

        const rawLink = getUrl(props["Links"]);
        const sourceUrl = normalizeGitHubUrl(rawLink);

        return [
          {
            slug: toSlug(title),
            title,
            summary,
            segment: getSelect(props["Segment"]) || undefined,
            tags,
            sourceUrl,
          },
        ];
      });

    return projects;
  } catch {
    return [];
  }
}
