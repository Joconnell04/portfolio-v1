"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionProps,
} from "framer-motion";
import { type ButtonHTMLAttributes, type HTMLAttributes, type PointerEvent as ReactPointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticSharedProps = {
  strength?: number;
  className?: string;
};

function useMagneticMotion<T extends HTMLElement>(strength: number) {
  const ref = useRef<T | null>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.18 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.18 });

  function setTarget(event: ReactPointerEvent<T>) {
    if (reduceMotion) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const deltaX = event.clientX - rect.left - rect.width / 2;
    const deltaY = event.clientY - rect.top - rect.height / 2;

    x.set((deltaX / Math.max(rect.width / 2, 1)) * strength);
    y.set((deltaY / Math.max(rect.height / 2, 1)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return {
    ref,
    style: { x: springX, y: springY },
    onPointerMove: setTarget,
    onPointerLeave: reset,
    reduceMotion,
  };
}

export function MagneticCard({
  strength = 14,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & MagneticSharedProps) {
  const magnetic = useMagneticMotion<HTMLDivElement>(strength);

  return (
    <motion.div
      ref={magnetic.ref}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileHover={magnetic.reduceMotion ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({
  strength = 12,
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & MagneticSharedProps) {
  const magnetic = useMagneticMotion<HTMLButtonElement>(strength);

  return (
    <motion.button
      ref={magnetic.ref}
      type={type}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileHover={magnetic.reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={magnetic.reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
