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

export type Project = {
  title: string;
  /** Where or what it is: the company, or the kind of work. */
  context: string;
  blurb: string;
  /** Shown as a small marker on work still in progress. */
  current?: boolean;
  /** Source repository, where it is public. */
  href?: string;
};

/** Real work, most recent first. */
export const PROJECTS: Project[] = [
  {
    title: "QHSE compliance platform",
    context: "Current",
    blurb:
      "A platform for managing quality, health, safety and environmental compliance.",
    current: true,
  },
  {
    title: "Emperror",
    context: "Experiment",
    blurb: "An experimental coding agent.",
    href: "https://github.com/shaheersystems/emperror",
  },
  {
    title: "Antiflow",
    context: "Backend library",
    blurb:
      "A backend library for building workflows, in the spirit of n8n, defined entirely in JSON.",
    href: "https://github.com/shaheersystems-inc/antiflow",
  },
  {
    title: "Domain reseller platform",
    context: "Navicosoft",
    blurb: "Helped build the platform resellers use to register and manage domains.",
  },
  {
    title: "Hosting management platform",
    context: "Navicosoft",
    blurb: "Built with the same team: the platform for managing hosting services.",
  },
];

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
