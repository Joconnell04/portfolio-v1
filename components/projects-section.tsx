"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextScramble } from '@/components/text-scramble';
import { fadeUpContainer, fadeUpItem, viewportOnce } from '@/components/reveal';
import { cn } from '@/lib/utils';
import type { PortfolioProject } from '@/lib/supabase/portfolio-projects';

const ACCENTS = ['#00ff87', '#00e5ff', '#f7ff00', '#ff4df8'] as const;

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  return (
    <motion.section
      className='mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 lg:px-8'
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      variants={fadeUpContainer}
    >
      <motion.div variants={fadeUpItem} inherit={false} className='grid gap-6 border-t border-[#00ff87]/50 pt-8 lg:grid-cols-[280px_minmax(0,1fr)]'>
        <div className='hud-window p-5 sm:p-6'>
          <span className='bootline'>selected windows</span>
          <h2 className='mt-4 max-w-xs text-2xl font-semibold uppercase tracking-[0.22em] text-[#f3fff6] sm:text-3xl'>
            project huds
          </h2>
          <p className='mt-4 text-sm leading-6 text-[#a7ffbf]'>
            Each project stays fixed in place with sharp geometry and a synthetic 3D pop.
          </p>
          <div className='mt-6 grid gap-2 text-[11px] uppercase tracking-[0.24em] text-[#84ffb1]'>
            <span className='hud-button inline-flex w-fit items-center px-3 py-2'>hover for glitch</span>
            <span className='hud-button inline-flex w-fit items-center px-3 py-2'>source links included</span>
            <Link href='/projects' className='hud-button inline-flex w-fit items-center px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5'>
              View More
            </Link>
          </div>
        </div>

        <motion.div className='grid gap-5' variants={fadeUpContainer}>
          {projects.length === 0 ? (
            <motion.div variants={fadeUpItem} inherit={false} className='hud-window p-6 text-sm leading-6 text-[#a7ffbf]'>
              Project data is loading. Check the portfolio graph connection and refresh shortly.
            </motion.div>
          ) : (
            projects.map((project, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <motion.article
                  key={project.slug}
                  variants={fadeUpItem}
                  inherit={false}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={cn(
                    'hud-window group overflow-hidden bg-black p-0',
                    index % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1'
                  )}
                  style={{ boxShadow: '14px 14px 0 ' + accent }}
                >
                  <div className='flex items-center justify-between border-b border-[#00ff87]/80 bg-[#030503] px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#8bffbc]'>
                    <span>{project.segment ?? 'Portfolio project'}</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <div className='space-y-4 p-4 sm:p-5'>
                    <div className='flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.26em] text-[#7dffad]'>
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className='border border-[#00ff87]/70 bg-black px-2.5 py-1'>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className='glitch-text text-2xl font-semibold uppercase tracking-[0.12em] text-[#f7fff9] sm:text-3xl' data-text={project.title}>
                      {project.title}
                    </h3>

                    <p className='max-w-4xl text-sm leading-7 text-[#ccffd8] sm:text-[15px]'>
                      <TextScramble text={project.summary} />
                    </p>

                    <div className='flex flex-wrap items-center justify-between gap-3 border-t border-[#00ff87]/30 pt-4 text-[11px] uppercase tracking-[0.28em] text-[#8cffb6]'>
                      <span>3d pop / sharp edges / zero radius</span>
                      {project.sourceUrl ? (
                        <a
                          href={project.sourceUrl}
                          target='_blank'
                          rel='noreferrer noopener'
                          className='hud-button inline-flex items-center px-4 py-2 text-[#ebfff1] transition hover:-translate-y-0.5'
                        >
                          source
                        </a>
                      ) : (
                        <span className='text-[#62d98c]'>source unavailable</span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
