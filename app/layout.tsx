import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dinRoundPro = localFont({
  src: [
    { path: "../fonts/dinroundpro_light.otf", weight: "300", style: "normal" },
    { path: "../fonts/dinroundpro.otf", weight: "400", style: "normal" },
    { path: "../fonts/dinroundpro_medi.otf", weight: "500", style: "normal" },
    { path: "../fonts/dinroundpro_bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/dinroundpro_black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-din",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${dinRoundPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
