"use client";

import { motion, useReducedMotion } from "framer-motion";

export function NoiseOverlay() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ mixBlendMode: "soft-light" }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, -6, 0, 4, 0],
              y: [0, 4, -3, 2, 0],
              opacity: [0.08, 0.12, 0.09, 0.11, 0.08],
            }
      }
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.04),transparent_30%)]"
        style={{ opacity: 0.45 }}
      />
      <div
        className="absolute inset-[-20%] opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.45) 0.6px, transparent 0.6px)",
          backgroundSize: "5px 5px",
          backgroundPosition: "0 0",
        }}
      />
    </motion.div>
  );
}
