import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

type Project = {
  index: string;
  title: string;
  blurb: string;
  result: string;
  tags: string[];
  year: string;
  href: string;
  tint: string;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Ledger",
    blurb:
      "A real-time finance dashboard for a fintech startup. Built the event-driven backend and a snappy, data-dense interface used by 12k businesses.",
    result: "1.2M+ transactions/day",
    tags: ["Next.js", "PostgreSQL", "WebSockets"],
    year: "2025",
    href: "#contact",
    tint: "from-[#ff4a1c]/15 to-[#ff4a1c]/0",
  },
  {
    index: "02",
    title: "Atlas Health",
    blurb:
      "Patient-scheduling platform for a clinic network. Designed the booking flow and shipped a HIPAA-conscious API that cut no-shows by a third.",
    result: "−34% missed appointments",
    tags: ["React Native", "Node.js", "AWS"],
    year: "2024",
    href: "#contact",
    tint: "from-[#15140f]/10 to-[#15140f]/0",
  },
  {
    index: "03",
    title: "Kiln",
    blurb:
      "Headless commerce engine for a furniture brand. Replaced a sluggish monolith with an edge-rendered storefront — pages load in under a second.",
    result: "0.8s median load",
    tags: ["Next.js", "GraphQL", "Stripe"],
    year: "2024",
    href: "#contact",
    tint: "from-[#ff4a1c]/12 to-[#ff4a1c]/0",
  },
  {
    index: "04",
    title: "Signal",
    blurb:
      "Internal analytics tool for a media company. Turned a tangle of spreadsheets into one clear product editors actually enjoy opening each morning.",
    result: "5 teams, 1 source of truth",
    tags: ["TypeScript", "Prisma", "Charts"],
    year: "2023",
    href: "#contact",
    tint: "from-[#15140f]/10 to-[#15140f]/0",
  },
];

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="flex flex-col gap-4">
        <SectionLabel code="01">Selected work</SectionLabel>
        <h2 className="max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
          A few things I&apos;ve built that I&apos;m proud of.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.index} delay={i * 0.06}>
            <a
              href={p.href}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:shadow-[0_24px_60px_-32px_rgba(21,20,15,0.35)] sm:p-8"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.tint} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative flex items-start justify-between">
                <span className="font-mono text-xs text-muted-ink">
                  {p.index} / {p.year}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>

              <div className="relative mt-12 sm:mt-16">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-pretty font-light leading-relaxed text-ink/75">
                  {p.blurb}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-paper">
                    {p.result}
                  </span>
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
