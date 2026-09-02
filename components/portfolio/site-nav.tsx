"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

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
    <header
      className={`fixed inset-x-0 top-0 z-60 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-canvas/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="grid size-7 place-items-center bg-ink text-on-ink transition-colors duration-200 group-hover:bg-brand group-hover:text-on-brand">
            <span className="font-display text-sm leading-none">S</span>
          </span>
          <span className="text-sm font-medium tracking-tight">Shaheer</span>
        </a>

        <ul className="hidden items-center md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group flex items-baseline gap-1.5 px-3.5 py-2 text-sm text-muted-ink transition-colors duration-150 hover:text-ink"
              >
                <span className="font-mono text-[10px] tabular-nums text-muted-ink/60 transition-colors group-hover:text-brand">
                  {link.code}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          <Button
            asChild
            className="hidden h-8 bg-ink px-3.5 text-sm text-on-ink hover:bg-brand hover:text-on-brand md:inline-flex"
          >
            <a href="#contact">Start a project</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                aria-label="Toggle menu"
                className="grid size-8 place-items-center border-line bg-transparent p-0 hover:bg-surface-2 md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300 ${
                      open ? "translate-y-[5.5px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300 ${
                      open ? "-translate-y-[5.5px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="top"
              showCloseButton={false}
              className="border-b border-line bg-canvas pb-6 md:hidden"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pt-16 sm:px-6">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-t border-line py-4 text-2xl transition-colors hover:text-brand"
                  >
                    <span className="font-display">{link.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-muted-ink">
                      {link.code}
                    </span>
                  </a>
                ))}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <ThemeToggle />
                  <Button
                    asChild
                    className="h-10 flex-1 bg-ink text-sm text-on-ink hover:bg-brand hover:text-on-brand"
                  >
                    <a href="#contact" onClick={() => setOpen(false)}>
                      Start a project
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
