"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "./theme-script";

export type Theme = "system" | "light" | "dark";

function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function apply(theme: Theme) {
  const dark = resolve(theme) === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/* Module-level store: the nav and the mobile sheet each mount a toggle, and
   both must reflect the same value. */
const listeners = new Set<() => void>();
let current: Theme | null = null;

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // A "system" preference should keep tracking the OS after first paint.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getTheme() === "system") {
      apply("system");
      emit();
    }
  };
  media.addEventListener("change", onSystemChange);

  // Keep other tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    current = null;
    apply(getTheme());
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getTheme(): Theme {
  if (current) return current;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    current = stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    current = "system";
  }
  return current;
}

export function setTheme(theme: Theme) {
  current = theme;
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled — the theme still applies for this page.
  }
  apply(theme);
  emit();
}

/**
 * Returns `null` until after hydration. The server can't know the visitor's
 * theme, so rendering a selected state on the server would mismatch; consumers
 * render a neutral placeholder for the first paint instead.
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
}
