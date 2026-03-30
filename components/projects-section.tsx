"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextScramble } from "@/components/text-scramble";
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

function ProjectCard({
  project,
  index,
  accent,
}: {
  project: PortfolioProject;
  index: number;
  accent: string;
}) {
  return (
    <motion.article
      variants={fadeUpItem}
      inherit={false}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group overflow-hidden border bg-black"
      style={{
        borderColor: accent + "40",
        boxShadow: `8px 8px 0 ${accent}60`,
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3 text-[10px] uppercase tracking-[0.3em]"
        style={{ borderColor: accent + "30", backgroundColor: "#030003" }}
      >
        <span style={{ color: accent + "cc" }}>
          {project.segment ?? "Project"}
        </span>
        <span className="text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Card body */}
      <div className="space-y-4 p-5 sm:p-6">
        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]"
                style={{
                  border: `1px solid ${accent}35`,
                  color: accent + "aa",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold uppercase tracking-[0.1em] text-[#f0eaff] sm:text-2xl">
          <TextScramble text={project.title} />
        </h3>

        {/* Summary */}
        <p className="max-w-3xl text-sm leading-7 text-white/55">
          {project.summary}
        </p>

        {/* Footer */}
        {project.sourceUrl && (
          <div
            className="flex items-center justify-end border-t pt-4"
            style={{ borderColor: accent + "20" }}
          >
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-150"
              style={{
                borderColor: accent + "60",
                color: accent,
              }}
            >
              GitHub
            </a>
          </div>
        )}
      </div>
    </motion.article>
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
    <motion.div variants={fadeUpItem} inherit={false} className="space-y-5">
      <div className="flex items-center gap-4">
        <span
          className="text-[11px] uppercase tracking-[0.32em]"
          style={{ color: accent }}
        >
          &gt; {label}
        </span>
        <div
          className="h-px flex-1"
          style={{ backgroundColor: accent + "30" }}
        />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
          {projects.length} {projects.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <motion.div className="grid gap-4" variants={fadeUpContainer}>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            accent={accent}
          />
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
  const workProjects = projects.filter((p) => isWorkExperience(p));
  const personalProjects = projects.filter((p) => !isWorkExperience(p));

  return (
    <motion.section
      className="mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div
        variants={fadeUpItem}
        inherit={false}
        className="mb-10 flex items-center justify-between"
      >
        <span className="text-[11px] uppercase tracking-[0.32em] text-white/30">
          Selected work
        </span>
        <Link
          href="/projects"
          className="text-[10px] uppercase tracking-[0.22em] text-[#a855f7] transition-colors duration-150 hover:text-[#c084fc]"
        >
          View all &rsaquo;
        </Link>
      </motion.div>

      <div className="space-y-14">
        <CategorySection
          label="Work Experience"
          projects={workProjects}
          accent={MAGENTA}
        />
        <CategorySection
          label="Personal Projects"
          projects={personalProjects}
          accent={PURPLE}
        />
      </div>
    </motion.section>
  );
}
