import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <Separator className="bg-line" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper">
            <span className="font-black text-xs leading-none">S</span>
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
            © {year} Shaheer — Built from scratch
          </span>
        </div>

        <Button
          asChild
          variant="link"
          className="group h-auto gap-2 self-start px-0 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink no-underline hover:text-ink hover:no-underline sm:self-auto"
        >
          <a href="#top">
            Back to top
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-ink">
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </Button>
      </div>
    </footer>
  );
}
