import { PortfolioRouteShell } from "@/components/portfolio-route-shell";

const WRITING = [
  {
    title: "All3DP Technical Writing",
    summary:
      "Technical 3D-printing writing across printers, slicing, materials, and workflows.",
    href: "https://all3dp.com/authors/jacksonoconnell/",
    accent: "#a855f7",
  },
  {
    title: "3DSourced Technical Content",
    summary:
      "Editorial work covering 3D printing hardware, software, and industry topics with a search-first approach.",
    href: "https://3dsourced.com/",
    accent: "#e879f9",
  },
  {
    title: "PrintingAtoms Archive",
    summary:
      "Long-form writing and editorial leadership around 3D-printing hardware, software, and workflows.",
    href: "https://printingatoms.com/",
    accent: "#a855f7",
  },
] as const;

function sourceHost(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

export default function WritingPage() {
  return (
    <PortfolioRouteShell
      eyebrow="writing"
      title="Selected writing"
      description="Technical writing and editorial work in 3D printing, hardware, and workflows."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {WRITING.map((item, index) => (
          <article
            key={item.title}
            className="flex h-full flex-col overflow-hidden border bg-black"
            style={{
              borderColor: item.accent + "35",
              boxShadow: `8px 8px 0 ${item.accent}50`,
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3 text-[10px] uppercase tracking-[0.3em]"
              style={{
                borderColor: item.accent + "25",
                backgroundColor: "#030003",
              }}
            >
              <span style={{ color: item.accent + "aa" }}>
                {sourceHost(item.href)}
              </span>
              <span className="text-white/25">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 flex-col space-y-4 p-5">
              <h2 className="text-xl font-semibold uppercase tracking-[0.1em] text-[#f0eaff] sm:text-2xl">
                {item.title}
              </h2>
              <p className="flex-1 text-sm leading-6 text-white/55">
                {item.summary}
              </p>

              <div
                style={{ borderColor: item.accent + "25" }}
                className="border-t pt-4"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-150"
                  style={{
                    borderColor: item.accent + "60",
                    color: item.accent,
                  }}
                >
                  Open
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PortfolioRouteShell>
  );
}
