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

function toHeatmapFromCells(username: string, cells: ContributionCell[]): ContributionHeatmap | null {
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
}

async function fetchGraphQLHeatmap(username: string): Promise<ContributionHeatmap | null> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "user-agent": "portfolio-v1",
      },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection(includePrivate: true) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }`,
        variables: { login: username },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              weeks?: {
                contributionDays?: {
                  date?: string;
                  contributionCount?: number;
                  contributionLevel?: string;
                }[];
              }[];
            };
          };
        };
      };
    };

    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const cells: ContributionCell[] = [];

    weeks.forEach((week, x) => {
      (week.contributionDays ?? []).forEach((day, y) => {
        const level = day.contributionLevel === "FOURTH_QUARTILE" ? 4 : day.contributionLevel === "THIRD_QUARTILE" ? 3 : day.contributionLevel === "SECOND_QUARTILE" ? 2 : day.contributionLevel === "FIRST_QUARTILE" ? 1 : 0;
        cells.push({
          date: day.date ?? new Date().toISOString().slice(0, 10),
          count: day.contributionCount ?? 0,
          level,
          x,
          y,
        });
      });
    });

    return toHeatmapFromCells(username, cells);
  } catch {
    return null;
  }
}


function levelFromCount(count: number) {
  if (count >= 20) return 4;
  if (count >= 10) return 3;
  if (count >= 4) return 2;
  if (count >= 1) return 1;
  return 0;
}

async function fetchPublicRepoCommitHeatmap(username: string): Promise<ContributionHeatmap | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/portfolio-v1/commits?author=${username}&per_page=100`, {
      headers: {
        "user-agent": "portfolio-v1",
        accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const commits = (await response.json()) as { commit?: { author?: { date?: string } } }[];
    const counts = new Map<string, number>();

    for (const commit of commits) {
      const date = commit.commit?.author?.date?.slice(0, 10);
      if (!date) continue;
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 364);
    const calendarStart = new Date(start);
    calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

    const cells: ContributionCell[] = [];
    for (let week = 0; week < 53; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        const current = new Date(calendarStart);
        current.setDate(calendarStart.getDate() + week * 7 + day);
        if (current > end) {
          continue;
        }
        const date = current.toISOString().slice(0, 10);
        const count = counts.get(date) ?? 0;
        cells.push({
          date,
          count,
          level: levelFromCount(count),
          x: week,
          y: day,
        });
      }
    }

    return toHeatmapFromCells(username, cells);
  } catch {
    return null;
  }
}

async function fetchScrapedHeatmap(username: string): Promise<ContributionHeatmap | null> {
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

    return toHeatmapFromCells(username, cells);
  } catch {
    return null;
  }
}

export async function getGitHubContributionHeatmap(username: string): Promise<ContributionHeatmap | null> {
  return (await fetchGraphQLHeatmap(username)) ?? (await fetchScrapedHeatmap(username)) ?? (await fetchPublicRepoCommitHeatmap(username));
}
