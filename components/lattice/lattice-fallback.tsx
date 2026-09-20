import { buildCubes, buildFallbackPath } from "./geometry";

/**
 * What the graphic is on every machine that cannot give us a WebGL context:
 * hardware acceleration switched off in settings, a blocklisted GPU, a
 * remote-desktop session, or a context lost under memory pressure. None of
 * those are exotic, and none of them are the machine this was built on — which
 * is exactly how a broken fallback ships unnoticed.
 *
 * Same lattice, same seed, drawn still. Decoration is the canvas; this is the
 * contract.
 */
export function LatticeFallback() {
  const { d, viewBox } = buildFallbackPath(buildCubes());

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      /* The animated lattice fades its edges per vertex, from 0.34 at ground
         level to 0.13 at the top; a flat 0.22 is the same weight on average,
         which is as close as one opacity gets. */
      className="h-full w-full text-ink opacity-22 select-none"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        /* With non-scaling-stroke the width is read in px, not viewBox units —
           so this is a literal 1px hairline at any size, matching the borders
           everywhere else on the page. */
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
