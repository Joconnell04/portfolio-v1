import Link from "next/link";
import { ProjectsSection } from "@/components/projects-section";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

const introLines = [
  "data engineering",
  "ML systems",
  "3D printing & writing",
  "full-stack tooling",
] as const;

export default async function HomePage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="min-h-screen bg-black pt-14 text-[#f0eaff]">
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="border-b border-white/[0.06] pb-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="bootline">
                4th Year · Georgia Institute of Technology
              </span>
              <h1 className="mt-4 text-5xl font-semibold uppercase tracking-[0.1em] text-[#f0eaff] sm:text-6xl lg:text-7xl">
                Jackson
                <br />
                O&apos;Connell
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#9b87c0]">
                CS student building data pipelines, ML models, and interactive
                tools. Work across analytics, 3D printing, and applied
                engineering.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="hud-button px-4 py-2 text-[11px] text-[#f0eaff]"
                >
                  Projects
                </Link>
                <Link
                  href="/experience"
                  className="border border-white/20 bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors duration-150 hover:border-white/40 hover:text-white/80"
                >
                  Experience
                </Link>
              </div>
            </div>
            <pre className="ascii-rain shrink-0 text-right text-[11px] leading-5">
              {introLines
                .map(
                  (line, i) => `> ${String(i + 1).padStart(2, "0")}  ${line}`,
                )
                .join("\n")}
            </pre>
          </div>
        </div>
      </section>

      <ProjectsSection projects={projects} />
    </div>
  );
}
