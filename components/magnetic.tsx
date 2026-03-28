"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { HTMLMotionProps, Variants } from "framer-motion";
import {
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type MagneticSharedProps = {
  strength?: number;
  className?: string;
  variants?: Variants;
};

const MotionDiv = motion.div as unknown as ComponentType<any>;
const MotionButton = motion.button as unknown as ComponentType<any>;

function useMagneticMotion<T extends HTMLElement>(strength: number) {
  const ref = useRef<T | null>(null);
  const reduceMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.18 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.18 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(query.matches);

    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  function setTarget(event: ReactPointerEvent<T>) {
    if (reduceMotion || !isFinePointer || event.pointerType !== "mouse") return;

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
    onPointerMove: isFinePointer ? setTarget : undefined,
    onPointerLeave: isFinePointer ? reset : undefined,
    reduceMotion,
    isFinePointer,
  };
}

export function MagneticCard({
  strength = 14,
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & MagneticSharedProps) {
  const magnetic = useMagneticMotion<HTMLDivElement>(strength);

  return (
    <MotionDiv
      ref={magnetic.ref}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileHover={magnetic.reduceMotion || !magnetic.isFinePointer ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("will-change-transform", className)}
      inherit={false}
      {...(props as any)}
    >
      {children}
    </MotionDiv>
  );
}

export function MagneticButton({
  strength = 12,
  className,
  children,
  type = "button",
  ...props
}: HTMLMotionProps<"button"> & MagneticSharedProps) {
  const magnetic = useMagneticMotion<HTMLButtonElement>(strength);

  return (
    <MotionButton
      ref={magnetic.ref}
      type={type}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileHover={magnetic.reduceMotion || !magnetic.isFinePointer ? undefined : { scale: 1.02 }}
      whileTap={magnetic.reduceMotion || !magnetic.isFinePointer ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={cn("will-change-transform", className)}
      inherit={false}
      {...(props as any)}
    >
      {children}
    </MotionButton>
  );
}
