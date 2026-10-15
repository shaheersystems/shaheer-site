import { AsciiBackground } from "@/components/site/ascii-background";
import { EMAIL, GITHUB } from "@/components/site/content";
import { LinkColumns } from "@/components/site/link-columns";
import { ProjectGrid } from "@/components/site/project-grid";
import { Reveal } from "@/components/site/reveal";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * One column, one page, no navigation. Everything is reachable by scrolling,
 * so a nav bar would only be a second way to reach four things that are
 * already on screen.
 *
 * The column is 40rem wide and the type is set at 14px — a measure of roughly
 * 75 characters, the long end of comfortable, which gives the project grid
 * and the two-column index below room to breathe.
 */
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <AsciiBackground />
      <main className="mx-auto w-full max-w-[40rem] flex-1 px-6 pt-24 pb-24 text-sm leading-[1.75] sm:pt-32">
        <Reveal as="section">
          <h1 className="font-medium text-ink">Shaheer</h1>

          <div className="mt-6 space-y-4 text-muted-ink">
            <p>
              <Lede>Building systems.</Lede> Full-stack engineer working the
              whole depth of a product — data model, API, interface. Three
              years of it, on platforms where downtime is expensive and details
              get noticed.
            </p>
            <p>
              At Navicosoft I helped build a domain reseller platform and a
              hosting management platform. Right now I&rsquo;m building a
              platform for QHSE compliance.
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <ProjectGrid />
        </div>

        <div className="mt-16">
          <LinkColumns />
        </div>

        <Reveal as="section" className="mt-16">
          <h2 className="font-medium text-ink">Now</h2>
          <div className="mt-6 space-y-4 text-muted-ink">
            <p>
              Three years in, the part that still holds my attention is the
              unglamorous middle: the schema, the failure paths, the query that
              has to stay fast at a hundred times the traffic.{" "}
              <Lede>None of it ever gets demoed</Lede>, and all of it decides
              whether the thing survives contact with real users.
            </p>
            <p>
              Reading more source than documentation this year. Most of what I
              know about building well came from tracing why someone
              else&rsquo;s code was shaped the way it was, and being wrong about
              it first.
            </p>
            <p>
              Working out of Lahore, mostly with teams I never meet in person.
              Long walks, longer books, and an unreasonable volume of chai.
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="mt-16">
          <h2 className="font-medium text-ink">Connect</h2>
          <p className="mt-6 text-muted-ink">
            Reach me at{" "}
            <a href={`mailto:${EMAIL}`} className="link text-ink">
              {EMAIL}
            </a>{" "}
            or on{" "}
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer noopener"
              className="link text-ink"
            >
              GitHub
            </a>
            . I read everything; I answer the specific ones first.
          </p>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}

/**
 * The one typographic contrast on the page: a serif italic against the sans
 * body, used to open a thought. Instrument Serif runs small at a shared
 * size, so it is nudged up a notch to sit level with the text around it.
 */
function Lede({ children }: { children: React.ReactNode }) {
  return (
    <em className="font-display text-[1.08em] text-ink italic">{children}</em>
  );
}
