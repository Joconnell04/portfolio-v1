"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%*+_<>/\\[]{}";

const imul = typeof Math.imul === "function"
  ? Math.imul
  : (left: number, right: number) => {
      const leftHigh = (left >>> 16) & 0xffff;
      const leftLow = left & 0xffff;
      const rightHigh = (right >>> 16) & 0xffff;
      const rightLow = right & 0xffff;
      return ((leftLow * rightLow) + ((((leftHigh * rightLow) + (leftLow * rightHigh)) << 16) >>> 0)) | 0;
    };

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickGlyph(source: string, index: number, phase: number) {
  const glyphSeed = hashString([source, index, phase].join(":"));
  return GLYPHS[glyphSeed % GLYPHS.length] ?? "#";
}

function scrambleText(source: string, progress: number) {
  const safeProgress = Math.min(1, Math.max(0, progress));
  const revealCount = Math.floor(source.length * safeProgress);
  const phase = Math.floor(safeProgress * 18);

  return source
    .split("")
    .map((character, index) => {
      if (/\s/.test(character)) return character;
      if (index < revealCount) return character;
      return pickGlyph(source, index, phase);
    })
    .join("");
}

function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false);

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

  return isFinePointer;
}

export function TextScramble({
  text,
  className,
  trigger = true,
}: {
  text: string;
  className?: string;
  trigger?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isFinePointer = useFinePointer();
  const shouldAnimate = trigger && !reduceMotion && isFinePointer;
  const [active, setActive] = useState(false);
  const [displayText, setDisplayText] = useState(() => scrambleText(text, 0));
  const durationMs = Math.max(500, Math.min(1100, text.length * 38));

  useEffect(() => {
    if (!shouldAnimate) {
      setActive(false);
      setDisplayText(text);
      return;
    }

    setActive(false);
    setDisplayText(scrambleText(text, 0));
  }, [shouldAnimate, text]);

  useEffect(() => {
    if (!shouldAnimate || !active) return;

    let frame = 0;
    const frames = Math.max(12, Math.round(durationMs / 24));
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = frame / frames;
      setDisplayText(scrambleText(text, progress));

      if (frame >= frames) {
        window.clearInterval(timer);
        setDisplayText(text);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [active, durationMs, shouldAnimate, text]);

  return (
    <motion.span
      aria-label={text}
      initial={shouldAnimate ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={shouldAnimate ? { once: true, amount: 0.65 } : undefined}
      onViewportEnter={shouldAnimate ? () => setActive(true) : undefined}
      className={cn("inline-block tracking-tight", className)}
    >
      {shouldAnimate ? displayText : text}
    </motion.span>
  );
}
