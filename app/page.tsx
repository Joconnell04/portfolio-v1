import { RecruiterConsole } from "@/components/recruiter-console";
import { getGitHubContributionHeatmap } from "@/lib/github/contributions";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

const bootLines = [
  "initializing creative shell",
  "loading portfolio graph",
  "mounting recruiter interface",
  "routing through neon layer",
] as const;

export default async function HomePage() {
  const [projects, heatmap] = await Promise.all([
    getPortfolioProjects(),
    getGitHubContributionHeatmap("Joconnell04"),
  ]);

  return (
    <div className="min-h-screen bg-black text-[#e8ffe7]">
      <section className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="hud-window p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="bootline">boot sequence</span>
              <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.24em] text-[#f3fff6] sm:text-4xl">
                digital art portfolio
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a6ffbf] sm:text-base">
                High-contrast, zero-radius, kinetic layout built to feel like a hacker playground instead of a normal resume page.
              </p>
            </div>
            <pre className="ascii-rain whitespace-pre-wrap text-right text-[11px] leading-4 text-[#00e5ff] sm:text-xs">
{bootLines.map((line, index) => `>${String(index + 1).padStart(2, "0")} ${line}`).join("\n")}
            </pre>
          </div>
        </div>
      </section>

      <RecruiterConsole projects={projects} heatmap={heatmap} />
    </div>
  );
}
