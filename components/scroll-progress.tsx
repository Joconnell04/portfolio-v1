"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/5">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-emerald-300 via-white to-emerald-300"
        style={{ scaleX }}
      />
    </div>
  );
}
