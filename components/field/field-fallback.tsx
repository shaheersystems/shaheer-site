import { buildFallbackPaths } from "./geometry";

/**
 * What the graphic is on every machine that cannot give us a WebGL context:
 * hardware acceleration switched off, a blocklisted GPU, a remote-desktop
 * session, or a context lost under memory pressure.
 *
 * Same field, same camera, held on its first frame. Three paths, one per depth
 * band, stand in for the per-dot fade the shader does — far rows lighter, near
 * rows heavier.
 */
export function FieldFallback() {
  const { viewBox, bands } = buildFallbackPaths();

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full text-ink select-none"
    >
      {bands.map(({ d, opacity }) => (
        <path
          key={opacity}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeOpacity={opacity * 0.5}
          /* A zero-length segment with a round cap is a dot. Non-scaling, so
             the width is read in px regardless of the viewBox. */
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
