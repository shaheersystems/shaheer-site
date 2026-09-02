import { Boxes, Code2, Gauge, Smartphone } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

const SERVICES = [
  {
    icon: Code2,
    title: "Web applications",
    body: "End-to-end product builds with Next.js and TypeScript — from the data model to a polished, accessible interface.",
  },
  {
    icon: Boxes,
    title: "APIs & backend",
    body: "Reliable services, clean schemas, and the kind of infrastructure that stays quiet while your product grows.",
  },
  {
    icon: Smartphone,
    title: "Mobile apps",
    body: "Cross-platform apps in React Native that feel native, share logic with the web, and ship to both stores.",
  },
  {
    icon: Gauge,
    title: "Performance & rescue",
    body: "Audits and rebuilds for slow or fragile codebases — faster pages, fewer bugs, a foundation you can build on.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-14 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="flex flex-col gap-5">
          <SectionLabel code="02">What I do</SectionLabel>
          <h2 className="font-display max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.015em]">
            One engineer, the whole stack.
          </h2>
          <p className="max-w-[58ch] text-pretty leading-relaxed text-muted-ink">
            You get a single point of contact who can take a feature from idea
            to production — no handoffs, no telephone game.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05} className="h-full">
            <div className="group flex h-full flex-col gap-4 bg-paper p-6 transition-colors duration-300 hover:bg-surface-2 sm:p-8">
              <span className="grid size-10 place-items-center border border-line-strong text-brand transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand">
                <s.icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-2xl leading-tight tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-ink">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
