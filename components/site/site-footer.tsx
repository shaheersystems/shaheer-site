import { ThemeToggle } from "./theme-toggle";

/**
 * The page's one horizontal rule, and the only chrome on the site. It spans the
 * full viewport while its contents stay in the text column, so the line reads
 * as the floor of the page rather than as a divider inside it.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[34rem] items-center justify-between gap-6 px-6 py-5 text-sm">
        <p className="text-muted-ink">Build the boring parts well.</p>
        <div className="flex items-center gap-3">
          <span className="text-muted-ink tabular-nums">
            {new Date().getFullYear()}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
