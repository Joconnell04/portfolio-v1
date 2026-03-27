export type NotionPortfolioProjectRow = {
  "Project Name": string;
  Organization?: string | null;
  Segment?: string | null;
  Subcategory?: string | null;
  Status?: string | null;
  Verification?: string | null;
  Featured?: boolean | null;
  "Portfolio Priority"?: string | null;
  "Portfolio Angle"?: string | null;
  Summary?: string | null;
  Problem?: string | null;
  "What I Did"?: string | null;
  Impact?: string | null;
  "Tech Stack"?: string | null;
  Links?: string | null;
  Notes?: string | null;
  "Source Notes"?: string | null;
  Timeframe?: string | null;
  "Website Ready"?: string | null;
  "Last Updated"?: string | null;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  organization?: string;
  segment?: string;
  tags: string[];
  status?: string;
  featured: boolean;
  priority?: string;
  angle?: string;
  summary?: string;
  problem?: string;
  role?: string;
  impact?: string;
  techStack?: string;
  links?: string;
  notes?: string;
  sourceNotes?: string;
  timeframe?: string;
  websiteReady?: string;
  lastUpdated?: string;
};

const splitTags = (value?: string | null) =>
  value ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : [];

export function mapNotionPortfolioProject(row: NotionPortfolioProjectRow): PortfolioProject {
  return {
    slug: row["Project Name"].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: row["Project Name"],
    organization: row.Organization ?? undefined,
    segment: row.Segment ?? undefined,
    tags: splitTags(row.Subcategory),
    status: row.Status ?? undefined,
    featured: row.Featured ?? false,
    priority: row["Portfolio Priority"] ?? undefined,
    angle: row["Portfolio Angle"] ?? undefined,
    summary: row.Summary ?? undefined,
    problem: row.Problem ?? undefined,
    role: row["What I Did"] ?? undefined,
    impact: row.Impact ?? undefined,
    techStack: row["Tech Stack"] ?? undefined,
    links: row.Links ?? undefined,
    notes: row.Notes ?? undefined,
    sourceNotes: row["Source Notes"] ?? undefined,
    timeframe: row.Timeframe ?? undefined,
    websiteReady: row["Website Ready"] ?? undefined,
    lastUpdated: row["Last Updated"] ?? undefined,
  };
}
