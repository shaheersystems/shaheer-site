import { ArrowUp } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper">
            <span className="font-black text-xs leading-none">S</span>
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
            © {year} Shaheer — Built from scratch
          </span>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.18em] text-muted-ink transition-colors hover:text-ink sm:self-auto"
        >
          Back to top
          <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-ink">
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </span>
        </a>
      </div>
    </footer>
  );
}
