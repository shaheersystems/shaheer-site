import { ArrowUp } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center bg-ink text-on-ink">
            <span className="font-display text-xs leading-none">S</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-ink">
            © {year} Shaheer — Built from scratch
          </span>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 self-start font-mono text-[11px] uppercase tracking-[0.16em] text-muted-ink transition-colors hover:text-ink sm:self-auto"
        >
          Back to top
          <span className="grid size-7 place-items-center border border-line-strong transition-colors group-hover:border-ink">
            <ArrowUp
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </span>
        </a>
      </div>
    </footer>
  );
}
