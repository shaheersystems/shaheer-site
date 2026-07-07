"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind",
  "React Native",
  "AWS",
  "Prisma",
  "GraphQL",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pt-28 pb-12 sm:px-6"
    >
      {/* measurement ticks — wayfinding detail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-24 hidden h-px sm:inset-x-6 lg:block"
      >
        <div className="relative h-full w-full border-t border-line">
          {Array.from({ length: 13 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 h-2 w-px bg-line-strong"
              style={{ left: `${(i / 12) * 100}%` }}
            />
          ))}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-7"
      >
        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink"
        >
          <Badge
            variant="outline"
            className="h-auto gap-2 border-line-strong bg-paper px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink"
          >
            <span className="relative flex h-1.5 w-1.5">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Available for projects
          </Badge>
          <span className="hidden sm:inline">Software Engineer</span>
          <span className="hidden sm:inline text-line-strong">/</span>
          <span className="hidden sm:inline">Lahore → Worldwide</span>
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-4xl text-balance text-[clamp(2.5rem,8.5vw,7rem)] font-black leading-[0.95] tracking-[-0.03em]"
        >
          I build software that ships,{" "}
          <span className="text-muted-ink">scales,</span> &amp;{" "}
          <span className="relative whitespace-nowrap text-brand">
            performs
            <svg
              aria-hidden
              viewBox="0 0 300 16"
              className="absolute -bottom-1 left-0 h-3 w-full text-brand/40"
              preserveAspectRatio="none"
            >
              <path
                d="M2 12 C 80 4, 220 4, 298 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-xl text-lg font-light leading-relaxed text-ink/80 sm:text-xl"
        >
          I&apos;m{" "}
          <span className="font-medium text-ink">Shaheer</span>, a full-stack
          engineer who turns ambitious ideas into fast, reliable products —
          from the database to the last pixel.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="group h-auto rounded-full bg-ink px-6 py-3.5 text-base text-paper hover:bg-brand hover:text-paper"
          >
            <a href="#contact">
              Start a project
              <ArrowUpRight data-icon="inline-end" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="group h-auto rounded-full border-line-strong bg-transparent px-6 py-3.5 text-base text-ink hover:border-ink hover:bg-paper hover:text-ink"
          >
            <a href="#work">
              View selected work
              <ArrowDownRight data-icon="inline-end" className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* stack marquee — bottom rail */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="marquee-group mt-16 overflow-hidden border-y border-line py-4 sm:mt-20"
      >
        <div className="flex w-max animate-marquee gap-3 will-change-transform">
          {[...STACK, ...STACK].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap font-mono text-sm uppercase tracking-wide text-muted-ink"
            >
              {tech}
              <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
