"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { setTheme, useTheme, type Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

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
            className={`grid size-8 cursor-pointer place-items-center transition-colors duration-150 ${
              selected
                ? "bg-ink text-on-ink"
                : "text-muted-ink hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
