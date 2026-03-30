import { PortfolioRouteShell } from "@/components/portfolio-route-shell";

const EXPERIENCES = [
  {
    company: "Delta Air Lines",
    role: "Data & Analytics Intern",
    accent: "#e879f9",
    summary:
      "Built ETL pipelines for flight incident data and Power BI dashboards tracking $8M in labor savings. Optimized pilot payroll systems and scaled reporting infrastructure for 1,000+ users.",
    details: ["ETL pipelines", "Power BI", "Pilot payroll", "1,000+ users"],
    metric: "$8M tracked",
  },
  {
    company: "Equifax",
    role: "ML Research Intern",
    accent: "#c084fc",
    summary:
      "Developed transformer-based credit risk models and explored model interpretability using BERT and TensorFlow. Focused on production-ready ML pipelines and explainability tooling.",
    details: ["Transformer models", "BERT", "TensorFlow", "Credit risk"],
    metric: "NLP research",
  },
  {
    company: "Georgia Tech — Scheller",
    role: "Automation Specialist",
    accent: "#e879f9",
    summary:
      "Mapped HR workflows and built Smartsheet-based automation systems to eliminate manual bottlenecks in onboarding. Reduced process overhead across multiple departmental pipelines.",
    details: ["HR workflows", "Smartsheet", "Onboarding", "Automation"],
    metric: "Process automation",
  },
] as const;

export default function ExperiencePage() {
  return (
    <PortfolioRouteShell
      eyebrow="professional"
      title="Experience"
      description="Data engineering, ML research, and automation across three organizations."
    >
      <section className="mt-2 grid gap-4">
        {EXPERIENCES.map((item, index) => (
          <article
            key={item.company}
            className="overflow-hidden border bg-black"
            style={{
              borderColor: item.accent + "35",
              boxShadow: `10px 10px 0 ${item.accent}50`,
            }}
          >
            <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
              {/* Left column */}
              <div
                className="border-b border-white/[0.06] bg-[#030003] md:border-b-0 md:border-r"
                style={{ borderRightColor: item.accent + "20" }}
              >
                <div className="flex h-full min-h-[200px] flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.35em] text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h2 className="mt-2 text-lg uppercase tracking-[0.14em] text-[#f0eaff] sm:text-xl">
                      {item.company}
                    </h2>
                    <div
                      className="mt-1 text-[11px] uppercase tracking-[0.24em]"
                      style={{ color: item.accent + "cc" }}
                    >
                      {item.role}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {item.details.map((detail) => (
                      <span
                        key={detail}
                        className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50"
                        style={{ border: `1px solid ${item.accent}25` }}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="p-5 sm:p-6">
                <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-[15px]">
                  {item.summary}
                </p>
                <div
                  className="mt-5 inline-block border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]"
                  style={{
                    borderColor: item.accent + "40",
                    color: item.accent + "cc",
                  }}
                >
                  {item.metric}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PortfolioRouteShell>
  );
}
