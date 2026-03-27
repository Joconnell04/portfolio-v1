"use client";

import { motion } from "framer-motion";
import { MagneticButton, MagneticCard } from "@/components/magnetic";
import { TextScramble } from "@/components/text-scramble";
import { fadeUpContainer, fadeUpItem, viewportOnce } from "@/components/reveal";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/lib/supabase/portfolio-projects";

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  return (
    <motion.section
      className="mx-auto w-full max-w-7xl px-4 pb-32 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div variants={fadeUpItem} className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <TextScramble text="Selected projects" className="text-xs uppercase tracking-[0.3em] text-emerald-300/70" />
          <h2 className="max-w-xs text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Work pulled directly from the Supabase portfolio_embeddings table.
          </h2>
          <p className="text-sm leading-6 text-white/55">
            Minimal framing, typographic hierarchy, and a restrained rhythm so the work reads like a clean Proto-style
            portfolio rather than a dashboard.
          </p>
          <MagneticButton className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55 transition hover:border-emerald-400/25 hover:text-emerald-100">
            Available now
          </MagneticButton>
        </div>

        <motion.div className="grid gap-4" variants={fadeUpContainer}>
          {projects.length === 0 ? (
            <motion.div variants={fadeUpItem} className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-6 text-white/50">
              No projects were returned from Supabase. The page still renders, but the portfolio_embeddings query did not
              produce any rows.
            </motion.div>
          ) : (
            projects.map((project) => (
              <MagneticCard
                key={project.slug}
                strength={10}
                variants={fadeUpItem}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:border-emerald-400/25 hover:bg-white/[0.07]"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/35">
                  <span>{project.segment ?? "Portfolio project"}</span>
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-white/45">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 max-w-3xl text-2xl font-medium tracking-tight text-white md:text-3xl">
                  <TextScramble text={project.title} />
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65 md:text-[15px]">
                  <TextScramble text={project.summary} />
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-white/30">
                  {project.sourceUrl ? (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "rounded-full border border-white/10 px-3 py-1 transition",
                        "hover:border-emerald-400/25 hover:text-emerald-100"
                      )}
                    >
                      Source
                    </a>
                  ) : null}
                  <span>{project.tags.length ? project.tags.join(" · ") : "No tags available"}</span>
                </div>
              </MagneticCard>
            ))
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
