import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

/* next/font self-hosts these and exposes each as a CSS variable that
   app/globals.css maps onto --font-display / --font-sans / --font-mono.

   Loaded here rather than with an `@import url(...)` to Google Fonts inside
   globals.css: Turbopack strips a remote @import out of the compiled
   stylesheet, so the families never arrive and headings fall back to Georgia. */

const instrumentSerif = Instrument_Serif({
  // The family ships a single weight; it has no bolder cut to request.
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shaheer — Full-stack Engineer",
  description:
    "Shaheer is a full-stack software engineer who builds fast, reliable products from the database to the last pixel. Available for new projects.",
  openGraph: {
    title: "Shaheer — Full-stack Engineer",
    description:
      "Full-stack engineer building software that ships, scales, and performs.",
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
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
