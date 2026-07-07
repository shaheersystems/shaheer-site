import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    tint: "from-[#ff5a30]/18 to-transparent",
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
    tint: "from-white/[0.07] to-transparent",
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
    tint: "from-[#ff5a30]/14 to-transparent",
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
    tint: "from-white/[0.07] to-transparent",
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
            <a href={p.href} className="group block h-full">
              <Card className="relative h-full justify-between gap-0 rounded-3xl border border-line bg-paper p-6 ring-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)] sm:p-8">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.tint} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <CardHeader className="relative items-start p-0">
                  <span className="font-mono text-xs text-muted-ink">
                    {p.index} / {p.year}
                  </span>
                  <CardAction>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </CardAction>
                </CardHeader>

                <CardContent className="relative mt-12 p-0 sm:mt-16">
                  <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {p.title}
                  </CardTitle>
                  <p className="mt-3 max-w-md text-pretty text-base font-light leading-relaxed text-ink/75">
                    {p.blurb}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge className="h-auto rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-normal uppercase tracking-wide text-paper">
                      {p.result}
                    </Badge>
                    {p.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="h-auto rounded-full border-line-strong px-3 py-1 font-mono text-[11px] font-normal uppercase tracking-wide text-muted-ink"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
