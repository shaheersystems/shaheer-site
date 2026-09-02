export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (inlined into <head> in the root layout) so the
 * correct theme is on <html> before anything renders. Without it a dark-mode
 * visitor gets a white flash on every navigation.
 *
 * Deliberately kept out of `lib/theme.ts`: that module is `"use client"`, and
 * a server component importing from it would receive a client reference rather
 * than this string.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
