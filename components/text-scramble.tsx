"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%*+_<>/\\[]{}";

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickGlyph(source: string, index: number, phase: number) {
  const glyphSeed = hashString(`${source}:${index}:${phase}`);
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
  const [active, setActive] = useState(false);
  const [displayText, setDisplayText] = useState(() => scrambleText(text, 0));
  const durationMs = Math.max(500, Math.min(1100, text.length * 38));

  useEffect(() => {
    if (!trigger) {
      setActive(false);
      setDisplayText(text);
      return;
    }

    setActive(false);
    setDisplayText(scrambleText(text, 0));
  }, [text, trigger]);

  useEffect(() => {
    if (!trigger || !active) return;

    if (reduceMotion) {
      setDisplayText(text);
      return;
    }

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
  }, [active, durationMs, reduceMotion, text, trigger]);

  return (
    <motion.span
      aria-label={text}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.75 }}
      onViewportEnter={() => setActive(true)}
      className={cn("inline-block tracking-tight", className)}
    >
      {reduceMotion ? text : displayText}
    </motion.span>
  );
}
