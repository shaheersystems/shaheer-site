import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "./reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/shaheersystems" },
  { label: "LinkedIn", href: "#" },
  { label: "X / Twitter", href: "#" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 pt-8 sm:px-6 sm:pb-32"
    >
      <Reveal>
        <Card className="relative gap-0 overflow-hidden rounded-[2rem] border border-line bg-paper px-6 py-16 ring-0 sm:px-12 sm:py-24">
          {/* ambient signage glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-8">
            <Badge
              variant="outline"
              className="h-auto gap-2 border-line-strong bg-paper px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Currently taking new work
            </Badge>

            <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-tight sm:text-7xl">
              Let&apos;s build something
              <span className="text-brand"> worth shipping.</span>
            </h2>

            <p className="max-w-lg text-lg font-light leading-relaxed text-ink/80">
              Have a project in mind, or just want a second opinion on a tricky
              build? Tell me what you&apos;re working on — I reply within a day.
            </p>

            <Button
              asChild
              className="group h-auto gap-2.5 rounded-full bg-ink px-6 py-4 text-base text-paper hover:bg-brand hover:text-paper"
            >
              <a href="mailto:shaheercode@gmail.com">
                <Mail data-icon="inline-start" />
                shaheercode@gmail.com
                <ArrowUpRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Button>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {SOCIALS.map((s) => (
                <Button
                  key={s.label}
                  asChild
                  variant="link"
                  className="group h-auto gap-1 px-0 text-sm font-medium text-ink/70 no-underline hover:text-ink hover:no-underline"
                >
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <ArrowUpRight
                      data-icon="inline-end"
                      className="size-3.5 text-muted-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                    />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
