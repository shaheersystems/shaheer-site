"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { label: "Work", href: "#work", code: "01" },
  { label: "Services", href: "#services", code: "02" },
  { label: "About", href: "#about", code: "03" },
  { label: "Contact", href: "#contact", code: "04" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? "border-line-strong/70 bg-paper/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-[20deg]">
            <span className="font-black text-sm leading-none">S</span>
          </span>
          <span className="hidden font-medium tracking-tight sm:inline">
            Shaheer
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Button
                asChild
                variant="ghost"
                className="group h-auto gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink"
              >
                <a href={link.href}>
                  <span className="font-mono text-[10px] text-muted-ink/70 transition-colors group-hover:text-brand">
                    {link.code}
                  </span>
                  {link.label}
                </a>
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden h-auto rounded-full bg-ink px-4 py-2 text-sm text-paper hover:bg-brand hover:text-paper sm:inline-flex"
          >
            <a href="#contact">Start a project</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                aria-label="Toggle menu"
                className="grid size-9 place-items-center rounded-full border-line-strong/70 bg-transparent p-0 hover:bg-ink/5 md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${
                      open ? "translate-y-[5.25px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${
                      open ? "-translate-y-[5.25px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="top"
              showCloseButton={false}
              className="rounded-b-3xl border-line-strong/60 bg-paper/95 pb-4 backdrop-blur-xl md:hidden"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 pt-20 sm:px-6">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-ink/5"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-muted-ink">
                      {link.code}
                    </span>
                  </a>
                ))}
                <Button
                  asChild
                  className="mt-1 h-auto rounded-2xl bg-ink py-3 text-lg text-paper hover:bg-brand hover:text-paper"
                >
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Start a project
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
