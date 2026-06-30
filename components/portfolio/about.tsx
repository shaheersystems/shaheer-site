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
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <SectionLabel code="03">About</SectionLabel>
          <h2 className="text-balance text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            Precise where it counts, pragmatic everywhere else.
          </h2>
          <div className="max-w-lg space-y-4 text-lg font-light leading-relaxed text-ink/80">
            <p>
              I&apos;ve spent the last six years shipping products across
              fintech, health, and commerce — the kind of work where downtime is
              expensive and details are noticed.
            </p>
            <p>
              I care about the unglamorous parts: clear data models, fast loads,
              honest estimates, and code the next person can read. Good software
              feels obvious in hindsight, and that&apos;s the bar I work toward.
            </p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-paper p-5">
                <div className="text-3xl font-black tracking-tight text-ink">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-ink">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-paper p-7">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
              Toolkit
            </span>
            {STACK_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-2.5">
                <span className="text-sm font-medium text-ink">
                  {group.heading}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line-strong px-3 py-1 text-sm text-ink/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <span className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
              Recent path
            </span>
            {TIMELINE.map((t) => (
              <div
                key={t.year}
                className="flex items-baseline gap-4 border-t border-line py-3.5 last:border-b"
              >
                <span className="font-mono text-sm text-brand">{t.year}</span>
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-medium">{t.role}</span>
                  <span className="text-sm text-muted-ink">{t.place}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
