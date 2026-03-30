import Link from "next/link";
import { ProjectsSection } from "@/components/projects-section";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/Joconnell04" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jackson-t-oconnell/",
  },
  { label: "Writing", href: "/writing" },
] as const;

export default async function HomePage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="min-h-screen bg-black pt-14 text-[#f0eaff]">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#9b87c0]">
          4th Year · Computer Science · Georgia Institute of Technology
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Jackson O&apos;Connell
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-[#9b87c0]">
          Building data pipelines, ML systems, and full-stack tools. Writing
          about 3D printing and hardware on the side.
        </p>
        <div className="mt-6 flex flex-wrap gap-5">
          {SOCIAL.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noreferrer noopener" : undefined
              }
              className="text-sm text-white/40 transition-colors duration-150 hover:text-white/80"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <ProjectsSection projects={projects} />

      {/* Footer */}
      <footer className="mx-auto max-w-3xl border-t border-white/[0.06] px-6 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-white/25">
          <span>Jackson O&apos;Connell · Georgia Tech</span>
          <Link
            href="/recruiter"
            className="transition-colors duration-150 hover:text-white/60"
          >
            Recruiter Terminal
          </Link>
        </div>
      </footer>
    </div>
  );
}
