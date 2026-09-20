"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/* Slow out, no overshoot: the page should look like it settled, not like it
   arrived. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical offset in px before reveal. */
  y?: number;
  as?: "div" | "li" | "span" | "section";
};

/**
 * Entry animation for a block of the page: 10px up and a fade, once.
 * `whileInView` compiles to an IntersectionObserver rather than a scroll
 * listener, and `useReducedMotion` drops the transform entirely — the content
 * is then simply present, never invisible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 10,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
