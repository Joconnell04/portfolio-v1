const highlights = [
  "Hybrid Repository / Minimal List",
  "Notion-seeded content model",
  "Next.js 15 + Tailwind + shadcn/ui",
  "Vercel deployment target",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="mb-10 border-b border-white/10 pb-8">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/50">Jackson O\u2019Connell</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
          Personal portfolio built as a clean hybrid repository.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          A restrained, editorial portfolio with Notion-driven content and a codebase designed for fast iteration,
          typed seeding, and minimal visual noise.
        </p>
      </div>

      <section className="grid gap-3">
        {highlights.map((item) => (
          <div key={item} className="flex items-center justify-between border-b border-white/10 py-4 text-sm text-white/80">
            <span>{item}</span>
            <span className="text-white/35">\u2192</span>
          </div>
        ))}
      </section>
    </main>
  );
}
