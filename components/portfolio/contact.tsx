import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./section-label";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/shaheersystems" },
  { label: "LinkedIn", href: "#" },
  { label: "X / Twitter", href: "#" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-14 overflow-hidden bg-paper"
    >
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_100%,black,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="flex flex-col items-start gap-8">
          <SectionLabel code="04">Contact</SectionLabel>

          <h2 className="font-display max-w-4xl text-balance text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-[-0.02em]">
            Let&rsquo;s build something{" "}
            <span className="text-brand">worth shipping</span>.
          </h2>

          <p className="max-w-[58ch] text-pretty text-lg leading-[1.6] text-muted-ink">
            Have a project in mind, or just want a second opinion on a tricky
            build? Tell me what you&rsquo;re working on — I reply within a day.
          </p>

          <Button
            asChild
            className="group mt-2 h-auto gap-2.5 bg-ink px-6 py-4 text-base text-on-ink hover:bg-brand hover:text-on-brand"
          >
            <a href="mailto:shaheercode@gmail.com">
              <Mail data-icon="inline-start" strokeWidth={1.75} />
              shaheercode@gmail.com
              <ArrowUpRight
                data-icon="inline-end"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Button>

          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-sm font-medium text-muted-ink transition-colors hover:text-ink"
              >
                {s.label}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
