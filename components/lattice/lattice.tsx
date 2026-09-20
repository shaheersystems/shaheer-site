"use client";

import dynamic from "next/dynamic";

/**
 * Keeps three.js out of the initial bundle. `ssr: false` is only honoured from
 * inside a Client Component, which is the only reason this wrapper exists —
 * the page itself stays a Server Component.
 *
 * The loading state is a blank box of the right height rather than the still
 * lattice: `ssr: false` renders the loading state on the server, so anything
 * here lands in the HTML of every visit. The still lattice is a ~7KB path and
 * belongs on the client, where it is built only if a context never arrives.
 */
const LatticeCanvas = dynamic(() => import("./lattice-canvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

export function Lattice({ className = "" }: { className?: string }) {
  return (
    /* `isolation: isolate` keeps the canvas' stacking to itself. Height is set
       here, on the DOM side, so the box never collapses while the chunk loads
       and the surrounding text never reflows when it arrives. */
    <div
      /* Heights are set against the lattice's own proportions — about 3:1 in
         view space — so the skyline spans the box instead of floating as an
         island in the middle of it. */
      className={`pointer-events-none isolate h-36 w-full select-none sm:h-40 ${className}`}
    >
      <LatticeCanvas />
    </div>
  );
}
