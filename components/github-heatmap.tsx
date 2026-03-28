"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TextScramble } from "@/components/text-scramble";
import { MagneticButton } from "@/components/magnetic";
import { fadeUpContainer, fadeUpItem, viewportOnce } from "@/components/reveal";
import type { ContributionHeatmap, ContributionCell } from "@/lib/github/contributions";
import { cn } from "@/lib/utils";

function levelClass(level: number) {
  switch (level) {
    case 4:
      return "bg-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.45)]";
    case 3:
      return "bg-emerald-400/80";
    case 2:
      return "bg-emerald-400/55";
    case 1:
      return "bg-emerald-400/30";
    default:
      return "bg-white/10";
  }
}

function formatDateLabel(date: string) {
  const parsed = new Date(date);
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function HeatmapCell({ cell, active, onHover }: { cell: ContributionCell; active: boolean; onHover: (cell: ContributionCell) => void }) {
  return (
    <button
      type="button"
      aria-label={`${cell.count} contributions on ${cell.date}`}
      onMouseEnter={() => onHover(cell)}
      onFocus={() => onHover(cell)}
      className={cn(
        "h-3 w-3 rounded-none border border-white/5 transition duration-150",
        levelClass(cell.level),
        active ? "scale-[1.18] border-white/20" : "hover:scale-[1.12] hover:border-white/15"
      )}
    />
  );
}

export function GitHubActivityHeatmap({ heatmap }: { heatmap: ContributionHeatmap | null }) {
  const [activeCell, setActiveCell] = useState<ContributionCell | null>(null);

  const summary = useMemo(() => {
    if (!heatmap) return null;
    return `${heatmap.totalContributions.toLocaleString()} contributions tracked across ${heatmap.weeks.length} weeks`;
  }, [heatmap]);

  return (
    <motion.section
      className="mx-auto w-full max-w-7xl px-4 pb-32 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div variants={fadeUpItem} inherit={false} className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <TextScramble text="GitHub activity" className="text-xs uppercase tracking-[0.3em] text-emerald-300/70" />
          <h2 className="max-w-xs text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Public contribution rhythm from the Joconnell04 profile.
          </h2>
          <p className="text-sm leading-6 text-white/55">
            A minimal heatmap that keeps the visual language restrained while still surfacing activity density and the
            latest contribution date.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.26em] text-white/35">
            <MagneticButton
              className="border border-white/10 bg-white/5 px-3 py-1 text-white/65 transition hover:border-emerald-400/25 hover:text-emerald-100"
              onMouseEnter={() => {
                if (heatmap && heatmap.weeks.length > 0 && !activeCell) {
                  const firstCell = heatmap.weeks[0]?.columns[0];
                  if (firstCell) setActiveCell(firstCell);
                }
              }}
            >
              Live profile
            </MagneticButton>
            <span className="border border-white/10 bg-black/20 px-3 py-1 text-white/45">{summary ?? "Heatmap unavailable"}</span>
          </div>
        </div>

        <motion.div
          variants={fadeUpItem}
          inherit={false}
          className="rounded-none border border-white/10 bg-white/[0.04] p-5"
        >
          {heatmap && heatmap.weeks.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/35">
                <span>{heatmap.username}</span>
                <a href={heatmap.profileUrl} target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-emerald-100">
                  View profile
                </a>
              </div>

              <motion.div className="flex gap-1 overflow-x-auto pb-2" variants={fadeUpContainer} inherit={false}>
                {heatmap.weeks.map((week) => (
                  <motion.div key={week.x} variants={fadeUpItem} inherit={false} className="flex flex-col gap-1">
                    {week.columns.map((cell) => (
                      <HeatmapCell
                        key={cell.date}
                        cell={cell}
                        active={activeCell?.date === cell.date}
                        onHover={setActiveCell}
                      />
                    ))}
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/60">
                <div>
                  <div className="text-xs uppercase tracking-[0.26em] text-white/35">Active day</div>
                  <div className="mt-1 text-white/80">
                    {activeCell ? `${formatDateLabel(activeCell.date)} · ${activeCell.count} contribution${activeCell.count === 1 ? "" : "s"}` : "Hover a square to inspect a day"}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/35">
                  <span className="h-3 w-3 rounded-none bg-white/10" />
                  <span className="h-3 w-3 rounded-none bg-emerald-400/30" />
                  <span className="h-3 w-3 rounded-none bg-emerald-400/55" />
                  <span className="h-3 w-3 rounded-none bg-emerald-400/80" />
                  <span className="h-3 w-3 rounded-none bg-emerald-300" />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-none border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-6 text-white/50">
              GitHub activity data is unavailable right now, so the page falls back to this empty state.
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
