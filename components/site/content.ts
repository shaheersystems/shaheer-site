/**
 * Everything the page says, in one place. The layout below it is thin enough
 * that editing copy should never mean reading JSX.
 */

export const EMAIL = "shaheercode@gmail.com";
export const GITHUB = "https://github.com/shaheersystems";

export type Entry = {
  title: string;
  blurb: string;
  /** Present only where a real destination exists. Absent entries render as
   *  plain text rather than as links that go nowhere. */
  href?: string;
  /** Off-site links get the arrow and the new-tab treatment. */
  external?: boolean;
};

export type Column = {
  heading: string;
  entries: Entry[];
};

export const COLUMNS: Column[] = [
  {
    heading: "Building",
    entries: [
      {
        title: "Independent",
        blurb: "Contract engineering for small product teams.",
      },
      {
        title: "shaheersystems",
        blurb: "Tools and experiments, in the open.",
        href: GITHUB,
        external: true,
      },
    ],
  },
  {
    heading: "Projects",
    entries: [
      {
        title: "Ledger",
        blurb: "Real-time finance dashboard. 1.2M transactions a day.",
      },
      {
        title: "Atlas Health",
        blurb: "Patient scheduling across a clinic network.",
      },
      {
        title: "Kiln",
        blurb: "Headless storefront. 0.8s median load.",
      },
      {
        title: "Signal",
        blurb: "Newsroom analytics. Five teams, one source of truth.",
      },
    ],
  },
  {
    heading: "Services",
    entries: [
      {
        title: "Web applications",
        blurb: "React and Next.js, built to survive year three.",
      },
      {
        title: "APIs & backend",
        blurb: "Node and Postgres. Data models that hold.",
      },
      {
        title: "Mobile apps",
        blurb: "React Native, shipped to both stores.",
      },
      {
        title: "Rescue work",
        blurb: "Slow, fragile, or half-finished. I have fixed a few.",
      },
    ],
  },
];
