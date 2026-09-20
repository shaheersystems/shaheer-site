"use client";

import type { SVGProps } from "react";
import { setTheme, useTheme, type Theme } from "@/lib/theme";

/**
 * Three-state segmented control rather than a two-state flip: "system" is a
 * real preference, and a flip switch has to silently discard it.
 *
 * `active` is null until after hydration (the server can't know the visitor's
 * theme) — the control renders unselected for that first frame instead of
 * guessing wrong and flickering.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const active = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={`inline-flex divide-x divide-line border border-line ${className}`}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`grid size-6 cursor-pointer place-items-center transition-colors duration-150 ${
              selected
                ? "bg-ink text-on-ink"
                : "text-muted-ink hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon className="size-3" />
          </button>
        );
      })}
    </div>
  );
}

/* Drawn as three shapes sharing one 12px box, one stroke weight and one radius
   so they read as a set. An icon library would give three glyphs drawn to
   three different optical sizes, at 14 kilobytes. */

function base(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.1,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

function SystemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="1.2" y="2" width="9.6" height="6.4" />
      <path d="M4.2 10.4h3.6" />
    </svg>
  );
}

function LightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="6" r="2.3" />
      <path d="M6 .9v1.2M6 9.9v1.2M.9 6h1.2M9.9 6h1.2M2.4 2.4l.85.85M8.75 8.75l.85.85M9.6 2.4l-.85.85M3.25 8.75l-.85.85" />
    </svg>
  );
}

function DarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M10 7.1A4.4 4.4 0 0 1 4.9 2a4.6 4.6 0 1 0 5.1 5.1Z" />
    </svg>
  );
}

const OPTIONS: {
  value: Theme;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
}[] = [
  { value: "system", label: "System theme", Icon: SystemIcon },
  { value: "light", label: "Light theme", Icon: LightIcon },
  { value: "dark", label: "Dark theme", Icon: DarkIcon },
];
