"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem, viewportOnce } from "@/components/reveal";
import type { PortfolioProject } from "@/lib/supabase/portfolio-projects";

const PURPLE = "#a855f7";
const MAGENTA = "#e879f9";

function isWorkExperience(project: PortfolioProject) {
  const seg = project.segment?.toLowerCase() ?? "";
  return (
    seg.includes("work") || seg.includes("experience") || seg.includes("intern")
  );
}

function ProjectRow({
  project,
  accent,
}: {
  project: PortfolioProject;
  accent: string;
}) {
  return (
    <motion.div
      variants={fadeUpItem}
      inherit={false}
      className="group border-t border-white/[0.06] py-6 first:border-t-0"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {/* Segment label */}
          {project.segment && (
            <p
              className="mb-1.5 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: accent + "99" }}
            >
              {project.segment}
            </p>
          )}

          {/* Title */}
          <h3 className="text-base font-medium text-white/90 transition-colors duration-150 group-hover:text-white">
            {project.title}
          </h3>

          {/* Summary */}
          {project.summary && (
            <p className="mt-2 text-sm leading-6 text-white/45">
              {project.summary}
            </p>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-wide"
                  style={{ color: accent + "66" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Source link */}
        {project.sourceUrl && (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/25 transition-colors duration-150 hover:text-white/70"
            aria-label={`${project.title} on GitHub`}
          >
            GitHub ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}

function CategorySection({
  label,
  projects,
  accent,
}: {
  label: string;
  projects: PortfolioProject[];
  accent: string;
}) {
  if (projects.length === 0) return null;

  return (
    <motion.div variants={fadeUpItem} inherit={false} className="space-y-0">
      {/* Section header */}
      <div className="mb-2 flex items-center gap-3">
        <span
          className="text-[10px] uppercase tracking-[0.32em]"
          style={{ color: accent }}
        >
          {label}
        </span>
        <div
          className="h-px flex-1"
          style={{ backgroundColor: accent + "25" }}
        />
      </div>

      {/* Project rows */}
      <motion.div variants={fadeUpContainer}>
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} accent={accent} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const work = projects.filter((p) => isWorkExperience(p));
  const personal = projects.filter((p) => !isWorkExperience(p));

  return (
    <motion.section
      className="mx-auto max-w-3xl px-6 pb-24 sm:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      {/* Section label */}
      <motion.div
        variants={fadeUpItem}
        inherit={false}
        className="mb-10 flex items-center justify-between"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
          Selected work
        </span>
        <Link
          href="/projects"
          className="text-[10px] uppercase tracking-[0.22em] text-[#a855f7] transition-colors duration-150 hover:text-[#c084fc]"
        >
          All projects →
        </Link>
      </motion.div>

      <div className="space-y-12">
        <CategorySection
          label="Work Experience"
          projects={work}
          accent={MAGENTA}
        />
        <CategorySection
          label="Personal Projects"
          projects={personal}
          accent={PURPLE}
        />
      </div>
    </motion.section>
  );
}
