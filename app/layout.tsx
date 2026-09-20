import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

/* next/font self-hosts these and exposes each as a CSS variable that
   app/globals.css maps onto --font-sans / --font-display / --font-mono.

   Loaded here rather than with an `@import url(...)` to Google Fonts inside
   globals.css: Turbopack strips a remote @import out of the compiled
   stylesheet, so the families never arrive and the page falls back to the
   system stack. */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  // The family ships a single weight; it has no bolder cut to request.
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shaheer — Full-stack Engineer",
  description:
    "Full-stack engineer working the whole depth of a product — data model, API, interface. Six years across fintech, health, and commerce. Available for contract work.",
  openGraph: {
    title: "Shaheer — Full-stack Engineer",
    description:
      "Full-stack engineer working the whole depth of a product — data model, API, interface.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* The bootstrap script below writes `class` and `color-scheme` onto <html>
       before React hydrates, so the server markup can never match by design.
       Suppressed on this element only — it does not cascade to children. */
    <html
      lang="en"
      dir="ltr"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before first paint, or a dark-mode visitor sees a white
            flash. Inline and synchronous is the only way to win that race. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
