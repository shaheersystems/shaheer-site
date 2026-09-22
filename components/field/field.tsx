"use client";

import dynamic from "next/dynamic";

/**
 * Keeps three.js out of the initial bundle. `ssr: false` is only honoured from
 * inside a Client Component, which is the only reason this wrapper exists —
 * the page itself stays a Server Component.
 *
 * The loading state is a blank box of the right height: `ssr: false` renders
 * it on the server, so anything here lands in the HTML of every visit.
 */
const FieldCanvas = dynamic(() => import("./field-canvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

export function Field({ className = "" }: { className?: string }) {
  return (
    /* Height is set on the DOM side so the box never collapses while the chunk
       loads and the text around it never reflows when it arrives. */
    <div
      className={`pointer-events-none isolate h-40 w-full select-none sm:h-48 ${className}`}
    >
      <FieldCanvas />
    </div>
  );
}
