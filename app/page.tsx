import { SiteNav } from "@/components/portfolio/site-nav";
import { Hero } from "@/components/portfolio/hero";
import { Work } from "@/components/portfolio/work";
import { Services } from "@/components/portfolio/services";
import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { SiteFooter } from "@/components/portfolio/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-base text-ink">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Work />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
