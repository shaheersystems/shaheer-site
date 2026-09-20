import { Lattice } from "@/components/lattice/lattice";
import { EMAIL, GITHUB } from "@/components/site/content";
import { LinkColumns } from "@/components/site/link-columns";
import { Reveal } from "@/components/site/reveal";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * One column, one page, no navigation. Everything is reachable by scrolling,
 * so a nav bar would only be a second way to reach four things that are
 * already on screen.
 *
 * The column is 34rem wide and the type is set at 14px — a measure of roughly
 * 62 characters, which is where prose stops needing the eye to travel.
 */
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-[34rem] flex-1 px-6 pt-24 pb-24 text-sm leading-[1.75] sm:pt-32">
        <Reveal as="section">
          <h1 className="font-medium text-ink">Shaheer</h1>

          <div className="mt-6 space-y-4 text-muted-ink">
            <p>
              <Lede>Building systems.</Lede> Full-stack engineer working the
              whole depth of a product — data model, API, interface. Six years
              of it, mostly in fintech, health, and commerce, where downtime is
              expensive and details get noticed.
            </p>
            <p>
              In the past I&rsquo;ve built a finance dashboard clearing over a
              million transactions a day, a scheduling platform for a network
              of clinics, and a storefront that renders at the edge in under a
              second.
            </p>
          </div>
        </Reveal>

        {/* Sits in the gap between the introduction and the index, where the
            page would otherwise just be empty. Masked at both edges so it
            reads as ambient rather than as a framed illustration. */}
        <Reveal className="mt-14 mb-16" y={0}>
          <Lattice className="fade-x" />
        </Reveal>

        <LinkColumns />

        <Reveal as="section" className="mt-16">
          <h2 className="font-medium text-ink">Now</h2>
          <div className="mt-6 space-y-4 text-muted-ink">
            <p>
              Six years in, the part that still holds my attention is the
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
