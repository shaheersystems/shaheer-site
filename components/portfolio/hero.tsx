"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
      transition: { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  return (
    <section id="top" className="relative border-b border-line">
      {/* Structural texture, not decoration: the same 64px module the layout
          is built on, faded until it reads as paper grain. */}
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-center px-4 pb-16 pt-32 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8"
        >
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink"
          >
            <span className="inline-flex items-center gap-2 border border-line bg-paper px-2.5 py-1.5">
              <span className="relative flex size-1.5">
                {!reduce && (
                  <span className="absolute inline-flex size-full animate-ping bg-brand opacity-75" />
                )}
                <span className="relative inline-flex size-1.5 bg-brand" />
              </span>
              Available for projects
            </span>
            <span className="hidden sm:inline">Software Engineer</span>
            <span className="hidden text-line-strong sm:inline">/</span>
            <span className="hidden sm:inline">Lahore → Worldwide</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display max-w-5xl text-balance text-[clamp(3rem,9vw,7.5rem)] leading-[0.94] tracking-[-0.02em]"
          >
            I build software that ships,{" "}
            <span className="text-muted-ink">scales,</span> &amp;{" "}
            <span className="text-brand">performs</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-[58ch] text-pretty text-lg leading-[1.6] text-muted-ink sm:text-xl"
          >
            I&rsquo;m <span className="font-medium text-ink">Shaheer</span>, a
            full-stack engineer who turns ambitious ideas into fast, reliable
            products — from the database to the last pixel.
          </motion.p>

          <motion.div
            variants={item}
            /* w-fit matters: `bg-line` is here only to paint the 1px seam
               between the two buttons. Left to stretch, it renders as a stray
               bar across the rest of the row. */
            className="flex w-fit flex-wrap items-center gap-px bg-line"
          >
            <Button
              asChild
              className="group h-auto bg-ink px-6 py-3.5 text-base text-on-ink hover:bg-brand hover:text-on-brand"
            >
              <a href="#contact">
                Start a project
                <ArrowUpRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="group h-auto border-0 bg-canvas px-6 py-3.5 text-base text-ink hover:bg-surface-2 hover:text-ink dark:border-0 dark:bg-canvas dark:hover:bg-surface-2"
            >
              <a href="#work">
                View selected work
                <ArrowDownRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* stack marquee — bottom rail */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="marquee-group relative overflow-hidden border-t border-line bg-paper py-3.5"
      >
        <div className="flex w-max animate-marquee gap-8 will-change-transform">
          {[...STACK, ...STACK].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-8 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink"
            >
              {tech}
              <span className="text-line-strong">/</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
