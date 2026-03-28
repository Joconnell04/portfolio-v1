import { RecruiterConsole } from "@/components/recruiter-console";
import { getGitHubContributionHeatmap } from "@/lib/github/contributions";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

const introLines = [
  "clear systems",
  "usable motion",
  "high-contrast layouts",
  "3D-printing writing",
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="bootline">home</span>
              <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.2em] text-[#f3fff6] sm:text-4xl lg:text-5xl">
                I build portfolio systems that stay clear, fast, and easy to scan.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a6ffbf] sm:text-base">
                I split this site into Home, Projects, Experience, Writing, and Travel so people can jump straight to the evidence that matters.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#8bffbc]">
                <a href="/projects" className="hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5">
                  Projects
                </a>
                <a href="/experience" className="hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5">
                  Experience
                </a>
                <a href="/writing" className="hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5">
                  Writing
                </a>
                <a href="/travel" className="hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5">
                  Travel
                </a>
              </div>
            </div>
            <pre className="ascii-rain whitespace-pre-wrap text-right text-[11px] leading-4 text-[#00e5ff] sm:text-xs">
{introLines.map((line, index) => `>${String(index + 1).padStart(2, "0")} ${line}`).join("\n")}
            </pre>
          </div>
        </div>
      </section>

      <RecruiterConsole projects={projects} heatmap={heatmap} />
    </div>
  );
}
