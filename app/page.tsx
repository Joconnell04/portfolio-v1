const highlights = [
  "Minimal, content-first portfolio",
  "Notion-driven publishing workflow",
  "Next.js 15 + Tailwind setup",
  "Dark theme with restrained styling",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <div className="border-b border-white/10 pb-8">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/50">Jackson O’Connell</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          A clean portfolio foundation for projects, writing, and selected work.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Built to stay quiet visually and flexible under the hood: a dark, minimalist shell with room for Notion-
          sourced content and iterative updates.
        </p>
      </div>

      <section className="grid gap-0 pt-8">
        {highlights.map((item) => (
          <div key={item} className="flex items-center justify-between border-b border-white/10 py-4 text-sm text-white/80">
            <span>{item}</span>
            <span className="text-white/35">→</span>
          </div>
        ))}
      </section>
    </main>
  );
}
