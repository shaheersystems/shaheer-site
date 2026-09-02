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
  },
];

export function Work() {
  return (
    <section id="work" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="flex flex-col gap-5">
          <SectionLabel code="01">Selected work</SectionLabel>
          <h2 className="font-display max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.015em]">
            A few things I&rsquo;ve built that I&rsquo;m proud of.
          </h2>
        </Reveal>
      </div>

      {/* A 1px grid rather than floating cards: the gap is the border, so the
          set reads as one system instead of four detached objects. */}
      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.index} delay={i * 0.05} className="h-full">
            <a
              href={p.href}
              className="group flex h-full flex-col justify-between bg-canvas p-6 transition-colors duration-300 hover:bg-paper sm:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-muted-ink">
                  {p.index} / {p.year}
                </span>
                <span className="grid size-9 place-items-center border border-line-strong text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand">
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </div>

              <div className="mt-16 sm:mt-24">
                <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-pretty leading-relaxed text-muted-ink">
                  {p.blurb}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <span className="border border-brand bg-brand px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-on-brand">
                    {p.result}
                  </span>
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-line-strong px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-ink"
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
