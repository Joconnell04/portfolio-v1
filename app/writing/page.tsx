import { PortfolioRouteShell } from "@/components/portfolio-route-shell";

const WRITING = [
  {
    title: "All3DP Technical Writing",
    summary: "Technical 3D-printing writing across printers, slicing, materials, and workflows.",
    href: "https://all3dp.com/authors/jacksonoconnell/",
  },
  {
    title: "3DSourced Technical Content",
    summary: "Editorial work that complements All3DP and PrintingAtoms with technical, search-friendly coverage.",
    href: "https://3dsourced.com/",
  },
  {
    title: "PrintingAtoms archive",
    summary: "Long-form writing and editorial leadership around 3D-printing hardware, software, and industry topics.",
    href: "https://printingatoms.com/",
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
      description="Scraper-style cards for the technical writing and editorial work that sits alongside the engineering projects."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {WRITING.map((item, index) => (
          <article key={item.title} className="hud-window flex h-full flex-col overflow-hidden border border-[#00ff87]/40 bg-black p-0 shadow-[10px_10px_0_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#030503] px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#8bffbc]">
              <span>scraper card</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.26em] text-[#7dffad]">
                <span>{sourceHost(item.href)}</span>
                <span>source</span>
              </div>
              <h2 className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#f7fff9]">{item.title}</h2>
              <p className="text-sm leading-6 text-[#d7ffe1]">{item.summary}</p>
            </div>

            <div className="mt-auto border-t border-[#00ff87]/30 p-5 pt-4">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[#ebfff1] transition hover:-translate-y-0.5"
              >
                Open source
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-6 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.28em] text-[#8cffb6]">
        source links stay visible on every writing card
      </footer>
    </PortfolioRouteShell>
  );
}
