import { COLUMNS, type Entry } from "./content";
import { Reveal } from "./reveal";

/**
 * The index of the site: three labelled columns of short entries. The only
 * place on the page with more than one level of hierarchy, and it gets there
 * with weight and color alone — no rules, no cards, no badges.
 */
export function LinkColumns() {
  return (
    <section aria-label="Index" className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
      {COLUMNS.map((column, i) => (
        <Reveal key={column.heading} delay={i * 0.06}>
          <h2 className="text-muted-ink">{column.heading}</h2>
          <ul className="mt-5 space-y-5">
            {column.entries.map((entry) => (
              <li key={entry.title}>
                <EntryTitle entry={entry} />
                <p className="text-muted-ink">{entry.blurb}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </section>
  );
}

function EntryTitle({ entry }: { entry: Entry }) {
  if (!entry.href) {
    return <span className="block font-medium text-ink">{entry.title}</span>;
  }

  return (
    <a
      href={entry.href}
      className="link inline-flex items-baseline gap-1 font-medium text-ink"
      {...(entry.external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      {entry.title}
      {entry.external && <ExternalArrow />}
    </a>
  );
}

/**
 * Drawn here rather than pulled from an icon set: this is two strokes, and the
 * arrow has to sit on the text's baseline grid at 14px without the optical
 * padding a library glyph carries.
 *
 * `text-decoration: none` on the SVG keeps the link's underline off it — an
 * underlined arrow reads as a rendering bug.
 */
function ExternalArrow() {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      focusable="false"
      className="size-2 shrink-0 self-center text-muted-ink [text-decoration:none]"
    >
      <path
        d="M2.5 7.5 7.5 2.5M3.4 2.5h4.1v4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
