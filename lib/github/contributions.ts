export type ContributionCell = {
  date: string;
  count: number;
  level: number;
  x: number;
  y: number;
};

export type ContributionWeek = {
  columns: ContributionCell[];
  x: number;
};

export type ContributionHeatmap = {
  username: string;
  profileUrl: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  lastUpdated: string;
};

function getAttribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1] ?? null;
}

function parseNumber(value: string | null) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getGitHubContributionHeatmap(username: string): Promise<ContributionHeatmap | null> {
  try {
    const response = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const body = await response.text();
    const rectTags = body.match(/<rect\b[^>]*>/g) ?? [];
    const cells: ContributionCell[] = [];

    for (const rectTag of rectTags) {
      const date = getAttribute(rectTag, "data-date");
      if (!date) continue;

      cells.push({
        date,
        count: parseNumber(getAttribute(rectTag, "data-count")),
        level: parseNumber(getAttribute(rectTag, "data-level")),
        x: parseNumber(getAttribute(rectTag, "x")),
        y: parseNumber(getAttribute(rectTag, "y")),
      });
    }

    if (cells.length === 0) {
      return null;
    }

    const weekMap = new Map<number, ContributionCell[]>();
    for (const cell of cells) {
      const current = weekMap.get(cell.x) ?? [];
      current.push(cell);
      weekMap.set(cell.x, current);
    }

    const weeks = [...weekMap.entries()]
      .sort(([left], [right]) => left - right)
      .map(([x, columns]) => ({
        x,
        columns: columns.sort((left, right) => left.y - right.y),
      }));

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      totalContributions: cells.reduce((sum, cell) => sum + cell.count, 0),
      weeks,
      lastUpdated: cells[cells.length - 1]?.date ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
