import { Fragment } from "react";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

const STATS = [
  { value: "6+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "9", label: "Happy clients" },
  { value: "∞", label: "Cups of chai" },
];

const STACK_GROUPS = [
  {
    heading: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
  },
  {
    heading: "Backend",
    items: ["Node.js", "PostgreSQL", "Prisma", "GraphQL", "Redis"],
  },
  {
    heading: "Platform",
    items: ["AWS", "Vercel", "Docker", "CI/CD", "Cloudflare"],
  },
];

const TIMELINE = [
  { year: "2025", role: "Independent engineer", place: "Freelance" },
  { year: "2022", role: "Senior software engineer", place: "Fintech startup" },
  { year: "2019", role: "Full-stack developer", place: "Digital agency" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal className="flex flex-col gap-6">
            <SectionLabel code="03">About</SectionLabel>
            <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.015em]">
              Precise where it counts, pragmatic everywhere else.
            </h2>
            <div className="max-w-[62ch] space-y-4 text-pretty leading-relaxed text-muted-ink">
              <p>
                I&rsquo;ve spent the last six years shipping products across
                fintech, health, and commerce — the kind of work where downtime
                is expensive and details are noticed.
              </p>
              <p>
                I care about the unglamorous parts: clear data models, fast
                loads, honest estimates, and code the next person can read. Good
                software feels obvious in hindsight, and that&rsquo;s the bar I
                work toward.
              </p>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-paper p-5">
                  <div className="font-display text-4xl leading-none tabular-nums">
                    {s.value}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-ink">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-10">
            <div className="flex flex-col gap-5 border border-line bg-paper p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink">
                Toolkit
              </span>
              {STACK_GROUPS.map((group) => (
                <div key={group.heading} className="flex flex-col gap-2.5">
                  <span className="text-sm font-medium">{group.heading}</span>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="border border-line-strong px-2.5 py-1 text-sm text-muted-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <span className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink">
                Recent path
              </span>
              {TIMELINE.map((t) => (
                <Fragment key={t.year}>
                  <div className="h-px bg-line" />
                  <div className="flex items-baseline gap-5 py-4">
                    <span className="font-mono text-sm tabular-nums text-brand">
                      {t.year}
                    </span>
                    <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-medium">{t.role}</span>
                      <span className="text-sm text-muted-ink">{t.place}</span>
                    </div>
                  </div>
                </Fragment>
              ))}
              <div className="h-px bg-line" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
