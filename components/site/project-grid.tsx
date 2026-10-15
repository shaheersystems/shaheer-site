import { PROJECTS } from "./content";
import { ExternalArrow } from "./link-columns";
import { Reveal } from "./reveal";

/**
 * The work itself, as a grid of hairline cells. The current project spans the
 * full width so the grid reads as "now" on top and "before" beneath, and five
 * entries fill two columns without leaving a hole.
 *
 * Cells take the page colour as a solid fill, so the ASCII background stops
 * at their edges and the text inside sits on a quiet surface.
 */
export function ProjectGrid() {
  return (
    <Reveal as="section">
      <h2 className="font-medium text-ink">Projects</h2>
      <ul className="mt-6 grid border-t border-l border-line sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <li
            key={project.title}
            className={`border-r border-b border-line bg-canvas p-5 ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <p className="flex items-center gap-2 text-xs text-muted-ink">
              {project.current ? (
                <span aria-hidden="true" className="size-1.5 bg-brand" />
              ) : null}
              {project.context}
            </p>
            <h3 className="mt-3 font-medium text-ink">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link inline-flex items-baseline gap-1"
                >
                  {project.title}
                  <ExternalArrow />
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p className="mt-1 text-muted-ink">{project.blurb}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
