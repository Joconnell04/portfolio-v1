"use client";

import createGlobe from 'cobe';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextScramble } from '@/components/text-scramble';
import { fadeUpContainer, fadeUpItem, viewportOnce } from '@/components/reveal';
import { cn } from '@/lib/utils';
import type { TravelLocation } from '@/lib/supabase/travel-history';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function markerSize(location: TravelLocation) {
  if (location.visitLabel === 'many / unknown') {
    return 0.06;
  }

  const parsed = Number.parseInt(location.visitLabel, 10);
  if (!Number.isFinite(parsed)) {
    return 0.035;
  }

  return clamp(0.028 + parsed * 0.006, 0.032, 0.055);
}

function DestinationCard({ location }: { location: TravelLocation }) {
  return (
    <motion.div
      key={location.slug}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.24 }}
      className='hud-window overflow-hidden border border-white/10 bg-black/90'
    >
      <div className='relative aspect-[4/3] overflow-hidden'>
        <img src={location.imageUrl} alt={location.name} className='absolute inset-0 h-full w-full object-cover' />
        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.5)_48%,rgba(0,0,0,0.08)_100%)]' />
        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_3px] mix-blend-screen opacity-30' />
        <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
          <div className='text-[11px] uppercase tracking-[0.32em] text-[#00ff87]'>travel log</div>
          <h3 className='mt-2 text-3xl font-semibold uppercase tracking-[0.2em] text-white sm:text-4xl'>
            {location.name}
          </h3>
        </div>
      </div>

      <div className='space-y-3 p-4 text-sm leading-6 text-white/70 sm:p-5'>
        <div className='flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.26em] text-white/35'>
          <span>region</span>
          <span className='text-white/75'>{location.region}</span>
        </div>
        <div className='flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.26em] text-white/35'>
          <span>visit count</span>
          <span className='text-white/75'>{location.visitLabel}</span>
        </div>
        {location.note ? <p className='text-white/60'>{location.note}</p> : null}
      </div>
    </motion.div>
  );
}

export function TravelCoordinates({ locations }: { locations: TravelLocation[] }) {
  const [activeSlug, setActiveSlug] = useState(locations[0]?.slug ?? '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({
    phi: 0.35,
    theta: 0.42,
    dragging: false,
    startX: 0,
    startY: 0,
    startPhi: 0.35,
    startTheta: 0.42,
  });

  const activeLocation = useMemo(
    () => locations.find((location) => location.slug === activeSlug) ?? locations[0] ?? null,
    [activeSlug, locations]
  );

  const markers = useMemo(
    () =>
      locations.map((location) => ({
        location: [location.latitude, location.longitude] as [number, number],
        size: markerSize(location),
      })),
    [locations]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const destroy = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: 1000,
      height: 1000,
      phi: rotationRef.current.phi,
      theta: rotationRef.current.theta,
      dark: 1,
      diffuse: 1.35,
      scale: 1.12,
      mapSamples: 16000,
      mapBrightness: 3.1,
      baseColor: [0.02, 0.02, 0.03],
      markerColor: [0, 1, 0.58],
      glowColor: [0, 0.72, 1],
      markers,
      onRender: (state) => {
        if (!rotationRef.current.dragging) {
          rotationRef.current.phi += 0.0032;
        }

        state.phi = rotationRef.current.phi;
        state.theta = rotationRef.current.theta;
      },
    });

    return () => {
      destroy();
    };
  }, [markers]);

  if (!activeLocation) {
    return (
      <section className='hud-window border border-white/10 bg-black p-6 text-sm text-[#a7ffbf]'>
        Travel data is unavailable right now.
      </section>
    );
  }

  return (
    <motion.section
      className='grid gap-6 lg:min-h-[78vh] lg:grid-cols-[minmax(0,1.4fr)_360px]'
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div variants={fadeUpItem} inherit={false} className='hud-window overflow-hidden border border-white/10 bg-black/95 p-5 sm:p-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <TextScramble text='coordinates' className='bootline' />
            <h2 className='mt-3 text-2xl font-semibold uppercase tracking-[0.2em] text-[#f3fff6] sm:text-3xl'>
              Interactive globe
            </h2>
          </div>
          <div className='max-w-sm text-xs uppercase tracking-[0.24em] text-[#84ffb1]'>
            Drag to rotate. Use the travel log to open destination pop-ups.
          </div>
        </div>

        <div className='mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]'>
          <div
            className='relative min-h-[60vh] overflow-hidden border border-[#00ff87]/40 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,135,0.16),rgba(0,0,0,0.98)_62%)]'
            onPointerDown={(event) => {
              rotationRef.current.dragging = true;
              rotationRef.current.startX = event.clientX;
              rotationRef.current.startY = event.clientY;
              rotationRef.current.startPhi = rotationRef.current.phi;
              rotationRef.current.startTheta = rotationRef.current.theta;
            }}
            onPointerMove={(event) => {
              if (!rotationRef.current.dragging) return;

              const deltaX = (event.clientX - rotationRef.current.startX) * 0.005;
              const deltaY = (event.clientY - rotationRef.current.startY) * 0.0045;

              rotationRef.current.phi = rotationRef.current.startPhi + deltaX;
              rotationRef.current.theta = clamp(rotationRef.current.startTheta + deltaY, -0.55, 1.1);
            }}
            onPointerUp={() => {
              rotationRef.current.dragging = false;
            }}
            onPointerLeave={() => {
              rotationRef.current.dragging = false;
            }}
          >
            <canvas ref={canvasRef} className='pointer-events-none absolute inset-0 h-full w-full' />
            <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_20%,20%_100%] opacity-35' />
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_34%,rgba(255,255,255,0.08)_35%,transparent_36%),radial-gradient(circle_at_center,transparent_0_66%,rgba(0,255,135,0.18)_67%,transparent_68%)] opacity-70' />
            <div className='pointer-events-none absolute inset-3 border border-white/10' />
            <div className='pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/6' />
            <div className='pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/6' />
            <div className='absolute left-4 top-4 border border-white/10 bg-black/75 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/50'>
              actual travel history
            </div>
            <div className='absolute bottom-4 left-4 max-w-xs border border-white/10 bg-black/80 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-[#84ffb1]'>
              {activeLocation.name} \u00B7 {activeLocation.visitLabel}
            </div>
          </div>

          <div className='space-y-4'>
            <AnimatePresence mode='wait' initial={false}>
              <DestinationCard key={activeLocation.slug} location={activeLocation} />
            </AnimatePresence>

            <div className='hud-window border border-white/10 bg-black/90 p-3'>
              <div className='mb-3 text-[11px] uppercase tracking-[0.28em] text-white/35'>travel logs</div>
              <div className='max-h-[30vh] space-y-2 overflow-y-auto pr-1'>
                {locations.map((location) => (
                  <button
                    key={location.slug}
                    type='button'
                    onClick={() => setActiveSlug(location.slug)}
                    className={cn(
                      'flex w-full items-center justify-between border px-3 py-2 text-left text-xs uppercase tracking-[0.22em] transition',
                      location.slug === activeLocation.slug
                        ? 'border-[#00ff87]/70 bg-[#00150c] text-[#ebfff1]'
                        : 'border-white/10 bg-black text-white/55 hover:border-white/20 hover:text-white/80'
                    )}
                  >
                    <span className='truncate pr-3'>{location.name}</span>
                    <span className='shrink-0 text-[10px] text-white/40'>{location.visitLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export const TravelMissionControl = TravelCoordinates;
