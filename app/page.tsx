import { SiteNav } from "@/components/portfolio/site-nav";
import { Hero } from "@/components/portfolio/hero";
import { Work } from "@/components/portfolio/work";
import { Services } from "@/components/portfolio/services";
import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { SiteFooter } from "@/components/portfolio/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas text-ink">
      <SiteNav />
      {/* The content column's own vertical rules. Past 1440px they read as the
          edges of the grid the whole page is set on. */}
      <div className="mx-auto flex w-full max-w-[1442px] flex-1 flex-col xl:rail">
        <main className="flex-1">
          <Hero />
          <Work />
          <Services />
          <About />
          <Contact />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
