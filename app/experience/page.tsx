import { PortfolioRouteShell } from "@/components/portfolio-route-shell";

const EXPERIENCE = [
  {
    title: "Systems and automation",
    body: "Transforms messy workflows into structured data, repeatable automations, and dashboards that stakeholders can actually use.",
  },
  {
    title: "Frontend product work",
    body: "Builds sharp, high-contrast interfaces in Next.js with Framer Motion and accessibility-minded layout decisions.",
  },
  {
    title: "Technical writing",
    body: "Turns deep 3D-printing and hardware knowledge into clear editorial pieces for broad audiences.",
  },
  {
    title: "Recruiter-facing storytelling",
    body: "Shapes portfolio content so hiring teams can move from first glance to relevant evidence without hunting.",
  },
] as const;

export default function ExperiencePage() {
  return (
    <PortfolioRouteShell
      eyebrow="experience"
      title="How I work"
      description="A concise snapshot of the skills, patterns, and operating style behind the portfolio."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {EXPERIENCE.map((item) => (
          <article key={item.title} className="hud-window rounded-none border border-[#00ff87]/40 bg-black p-5 shadow-[10px_10px_0_rgba(0,229,255,0.15)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[#84ffb1]">{item.title}</div>
            <p className="mt-3 text-sm leading-6 text-[#d7ffe1]">{item.body}</p>
          </article>
        ))}
      </section>
    </PortfolioRouteShell>
  );
}
