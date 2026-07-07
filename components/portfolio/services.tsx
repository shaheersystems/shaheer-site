import { Boxes, Code2, Gauge, Smartphone } from "lucide-react";
import { Reveal } from "./reveal";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

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
      className="scroll-mt-24 border-y border-line bg-paper py-24 text-ink sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-4">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
            <span className="text-brand">02</span>
            <span className="h-px w-8 bg-line-strong" />
            <span>What I do</span>
          </div>
          <h2 className="max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
            One engineer, the whole stack.
          </h2>
          <p className="max-w-xl font-light leading-relaxed text-muted-ink">
            You get a single point of contact who can take a feature from idea
            to production — no handoffs, no telephone game.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="h-full">
              <Card className="group h-full gap-4 rounded-none border-0 bg-base p-7 ring-0 transition-colors duration-300 hover:bg-surface-2">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-brand transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-paper">
                  <s.icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold tracking-tight">
                  {s.title}
                </CardTitle>
                <CardDescription className="text-sm font-light leading-relaxed text-muted-ink">
                  {s.body}
                </CardDescription>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
