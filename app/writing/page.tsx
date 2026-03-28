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

export default function WritingPage() {
  return (
    <PortfolioRouteShell
      eyebrow="writing"
      title="Selected writing"
      description="A compact index of the technical writing and editorial work that sits alongside the engineering projects."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {WRITING.map((item) => (
          <article key={item.title} className="hud-window rounded-none border border-[#00ff87]/40 bg-black p-5 shadow-[10px_10px_0_rgba(0,229,255,0.15)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[#84ffb1]">Writing</div>
            <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em] text-[#f7fff9]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#d7ffe1]">{item.summary}</p>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hud-button mt-5 inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[#ebfff1] transition hover:-translate-y-0.5"
            >
              Open
            </a>
          </article>
        ))}
      </section>
    </PortfolioRouteShell>
  );
}
