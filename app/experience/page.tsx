import { PortfolioRouteShell } from "@/components/portfolio-route-shell";

const EXPERIENCES = [
  {
    company: "Delta Air Lines",
    badge: "✈️",
    accent: "#00e5ff",
    summary:
      "Data strategy and automation at Delta. Built ETL pipelines for flight incidents and Power BI dashboards tracking $8M in labor savings. Optimized pilot payroll and scaled reporting systems for 1,000+ users.",
    details: ["ETL pipelines", "Power BI", "pilot payroll", "1,000+ users"],
  },
  {
    company: "Equifax",
    badge: "🧠",
    accent: "#f7ff00",
    summary:
      "Machine learning research at Equifax. Developing transformer-based credit risk models and exploring model interpretability using BERT and TensorFlow.",
    details: ["transformer models", "BERT", "TensorFlow", "credit risk"],
  },
  {
    company: "Georgia Tech (Scheller)",
    badge: "🏫",
    accent: "#00ff87",
    summary:
      "Automation specialist at Scheller. Mapping HR workflows and implementing Smartsheet systems to eliminate manual bottlenecks in the onboarding process.",
    details: ["HR workflows", "Smartsheet", "onboarding", "automation"],
  },
] as const;

const SUMMARY_CARDS = [
  { label: "Focus", value: "analytics + automation" },
  { label: "Scope", value: "business + technical teams" },
  { label: "Format", value: "measurable outcomes" },
] as const;

export default function ExperiencePage() {
  return (
    <PortfolioRouteShell
      eyebrow="professional"
      title="Professional experience"
      description="Role snapshots, scope, and measurable outcomes across analytics, ML, and automation."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.label} className="hud-window bg-black p-4 sm:p-5">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">{card.label}</div>
            <div className="mt-3 text-lg uppercase tracking-[0.16em] text-[#f3fff6]">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-5 grid gap-5">
        {EXPERIENCES.map((item, index) => (
          <article
            key={item.company}
            className="hud-window overflow-hidden border border-white/10 bg-black"
            style={{ boxShadow: `16px 16px 0 ${item.accent}` }}
          >
            <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
              <div className="border-b border-white/10 bg-[#050505] md:border-b-0 md:border-r md:border-white/10">
                <div className="flex h-full min-h-[220px] flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/15 bg-black text-2xl text-white"
                      style={{ boxShadow: `8px 8px 0 ${item.accent}` }}
                    >
                      {item.badge}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/40">{String(index + 1).padStart(2, "0")}</div>
                      <h2 className="mt-2 text-xl uppercase tracking-[0.16em] text-white sm:text-2xl">
                        {item.company}
                      </h2>
                      <div className="mt-3 text-[11px] uppercase tracking-[0.28em] text-white/45">Professional section</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.28em] text-white/45">
                    {item.details.map((detail) => (
                      <span key={detail} className="border border-white/10 bg-black px-2 py-1 text-white/70">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <p className="max-w-4xl text-sm leading-7 text-white/82 sm:text-[15px]">{item.summary}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="border border-white/10 bg-white/[0.03] px-3 py-3 text-[10px] uppercase tracking-[0.24em] text-white/45">
                    <div className="text-white/70">Company</div>
                    <div className="mt-2 text-white">{item.company}</div>
                  </div>
                  <div className="border border-white/10 bg-white/[0.03] px-3 py-3 text-[10px] uppercase tracking-[0.24em] text-white/45">
                    <div className="text-white/70">Format</div>
                    <div className="mt-2 text-white">Brutalist blocks</div>
                  </div>
                  <div className="border border-white/10 bg-white/[0.03] px-3 py-3 text-[10px] uppercase tracking-[0.24em] text-white/45">
                    <div className="text-white/70">Surface</div>
                    <div className="mt-2 text-white">Experience route</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PortfolioRouteShell>
  );
}
