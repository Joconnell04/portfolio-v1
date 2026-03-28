"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TextScramble } from "@/components/text-scramble";
import { fadeUpContainer, fadeUpItem, viewportOnce } from "@/components/reveal";
import { cn } from "@/lib/utils";
import type { TravelLocation } from "@/lib/supabase/travel-history";

function projectPoint(latitude: number, longitude: number) {
  return {
    x: ((longitude + 180) / 360) * 100,
    y: ((90 - latitude) / 180) * 100,
  };
}

function LocationPin({
  location,
  selected,
  onSelect,
}: {
  location: TravelLocation;
  selected: boolean;
  onSelect: (slug: string) => void;
}) {
  const position = projectPoint(location.latitude, location.longitude);

  return (
    <motion.button
      type="button"
      aria-label={location.name}
      onClick={() => onSelect(location.slug)}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#00150c]/80 p-0 transition focus:outline-none",
        selected ? "z-20 shadow-[0_0_0_1px_rgba(0,255,135,0.6),0_0_24px_rgba(0,255,135,0.38)]" : "z-10"
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      inherit={false}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center border border-[#00ff87]/80 bg-black text-[9px] text-[#00ff87]",
          selected ? "shadow-[0_0_0_4px_rgba(0,255,135,0.16)]" : "shadow-[0_0_0_2px_rgba(255,255,255,0.06)]"
        )}
      >
        <span className={cn("h-1.5 w-1.5 bg-current", selected ? "animate-pulse" : "")} />
      </span>
      <span className="sr-only">{location.name}</span>
    </motion.button>
  );
}

export function TravelMissionControl({ locations }: { locations: TravelLocation[] }) {
  const [activeSlug, setActiveSlug] = useState(locations[0]?.slug ?? "");

  const activeLocation = useMemo(
    () => locations.find((location) => location.slug === activeSlug) ?? locations[0] ?? null,
    [activeSlug, locations]
  );

  if (!activeLocation) {
    return (
      <section className="hud-window border border-white/10 bg-black p-6 text-sm text-[#a7ffbf]">
        Travel data is unavailable right now.
      </section>
    );
  }

  return (
    <motion.section
      className="grid gap-6 lg:grid-cols-[1.12fr_minmax(0,0.88fr)]"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div
        variants={fadeUpItem}
        inherit={false}
        className="hud-window overflow-hidden border border-white/10 bg-black/95 p-5 sm:p-6"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <TextScramble text="mission control" className="bootline" />
            <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.22em] text-[#f3fff6] sm:text-3xl">
              Travel globe
            </h2>
          </div>
          <div className="text-xs uppercase tracking-[0.24em] text-[#84ffb1]">
            Click a pin to open the destination window
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.12fr_minmax(0,0.88fr)]">
          <div className="relative aspect-square overflow-hidden border border-[#00ff87]/40 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,135,0.18),rgba(0,0,0,0.98)_62%)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_20%,20%_100%] opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_34%,rgba(255,255,255,0.08)_35%,transparent_36%),radial-gradient(circle_at_center,transparent_0_66%,rgba(0,255,135,0.22)_67%,transparent_68%)] opacity-70" />
            <div className="pointer-events-none absolute inset-3 border border-white/10" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/6" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/6" />

            {locations.map((location) => (
              <LocationPin
                key={location.slug}
                location={location}
                selected={location.slug === activeLocation.slug}
                onSelect={setActiveSlug}
              />
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/70 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#84ffb1]">
              {activeLocation.name}
            </div>
          </div>

          <div className="hud-window border border-white/10 bg-black/90 p-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeLocation.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.24 }}
                className="relative overflow-hidden"
                inherit={false}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={activeLocation.imageUrl}
                    alt={activeLocation.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.52)_48%,rgba(0,0,0,0.06)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_3px] mix-blend-screen opacity-30" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="text-[11px] uppercase tracking-[0.32em] text-[#00ff87]">destination window</div>
                    <h3 className="mt-3 text-4xl font-semibold uppercase tracking-[0.22em] text-white sm:text-5xl">
                      {activeLocation.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-2">
              {locations.map((location) => (
                <button
                  key={location.slug}
                  type="button"
                  onClick={() => setActiveSlug(location.slug)}
                  className={cn(
                    "border px-3 py-2 text-left text-xs uppercase tracking-[0.26em] transition",
                    location.slug === activeLocation.slug
                      ? "border-[#00ff87]/70 bg-[#00150c] text-[#ebfff1]"
                      : "border-white/10 bg-black text-white/55 hover:border-white/20 hover:text-white/80"
                  )}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
