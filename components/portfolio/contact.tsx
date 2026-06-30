import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "./reveal";

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
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-paper px-6 py-16 sm:px-12 sm:py-24">
          {/* ambient signage glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Currently taking new work
            </div>

            <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-tight sm:text-7xl">
              Let&apos;s build something
              <span className="text-brand"> worth shipping.</span>
            </h2>

            <p className="max-w-lg text-lg font-light leading-relaxed text-ink/80">
              Have a project in mind, or just want a second opinion on a tricky
              build? Tell me what you&apos;re working on — I reply within a day.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:shaheercode@gmail.com"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-4 text-base font-medium text-paper transition-colors hover:bg-brand"
              >
                <Mail className="h-4 w-4" />
                shaheercode@gmail.com
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
                >
                  {s.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
