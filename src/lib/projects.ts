export type ProjectLink = {
  label: string;
  href: string;
  /** Primary links get the filled button treatment. */
  primary?: boolean;
  /** Internal routes navigate with next/link instead of opening a new tab. */
  internal?: boolean;
};

export type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  /** The question or problem the project answers, in one line. */
  premise: string;
  bullets: readonly string[];
  stack: readonly string[];
  links: readonly ProjectLink[];
  accent: string;
  /** Shown next to the links when a demo needs explaining. */
  note?: string;
};

/**
 * Canonical project descriptions. These match the resume and LinkedIn.
 * Ordered by co-op relevance: the CFPB pipeline leads.
 */
export const projects: readonly Project[] = [
  {
    id: "banking-fraud",
    name: "Banking Fraud and Corporate Misconduct",
    role: "DS 2500 capstone, four-person team",
    period: "Spring 2026",
    premise: "Do regulatory penalties change bank behavior?",
    bullets: [
      "Collected roughly 35,000 consumer complaints through the CFPB API, handling paginated JSON and restructuring nested payloads into analysis-ready tables.",
      "Compared complaint patterns at Wells Fargo and TD Bank around major enforcement events.",
      "Built time-series visualizations and institution-level breakdowns.",
      "Delivered a written report and a team presentation.",
    ],
    stack: ["Python", "Pandas", "Matplotlib", "REST APIs", "Git"],
    links: [
      {
        label: "Read the report",
        href: "/documents/ds2500-banking-fraud-final-report.pdf",
        primary: true,
      },
      {
        label: "Presentation",
        href: "/documents/ds2500-banking-fraud-presentation.pdf",
      },
      { label: "Course page", href: "/coursework/ds2500", internal: true },
    ],
    accent: "#f59e0b",
    note: "My first complete end-to-end data science pipeline.",
  },
  {
    id: "cardedge",
    name: "CardEdge",
    role: "Solo build",
    period: "June 2026 to present",
    premise:
      "A mobile-first poker and blackjack decision trainer. The interesting part is the simulation, not the card game.",
    bullets: [
      "Monte Carlo equity simulator running in cancellable Web Workers, reporting 95% confidence intervals across Fast, Balanced, and Precise modes, with caching to avoid redundant computation.",
      "Rule-aware blackjack basic strategy across deck counts, H17/S17, double-after-split, and late surrender.",
      "Validated dollar-stakes table engine with legal-action validation, side pots, and street advancement for 2 to 10 players.",
      "Account-backed training history and profit/loss ledger on Supabase Postgres with row-level security. Guest mode works fully offline.",
      "Deterministic unit tests with coverage gates, verified on every push by GitHub Actions.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind 4",
      "Zustand",
      "Supabase",
      "Framer Motion",
      "Vitest",
    ],
    links: [
      {
        label: "Live app",
        href: "https://cardedge-five.vercel.app",
        primary: true,
      },
      { label: "Source", href: "https://github.com/neu-laddagiri/cardedge" },
    ],
    accent: "#2997ff",
  },
  {
    id: "ig-wrapped",
    name: "IG Wrapped",
    role: "Solo build",
    period: "June 2026 to present",
    premise:
      "A privacy-first Instagram data export analyzer. The export is parsed locally in the browser and the raw file never leaves the device.",
    bullets: [
      "Local ZIP and JSON parsing with JSZip, handling export formats that vary by region and app version.",
      "Unified social graph connecting follows, DMs, and interactions, with scoring for relationship strength, cleanup priority, and privacy exposure.",
      "Day-by-hour activity heatmaps, monthly timelines, and engagement breakdowns rendered with Recharts.",
      "Optional Supabase cloud save that stores computed insights only, never raw messages or media.",
      "Fail-closed Presentation Mode that blocks identity, DM, and search views during screen sharing.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind 4",
      "JSZip",
      "Recharts",
      "Supabase",
      "Framer Motion",
    ],
    links: [
      {
        label: "Live app",
        href: "https://ig-wrapped-snowy.vercel.app",
        primary: true,
      },
      { label: "Source", href: "https://github.com/neu-laddagiri/ig-wrapped" },
    ],
    accent: "#8b5cf6",
    note: "No upload needed: the app ships with synthetic demo data built in.",
  },
  {
    id: "nfl-salary",
    name: "NFL Salary vs. Team Performance",
    role: "DATA Club bootcamp, four-person team",
    period: "Spring 2026",
    premise:
      "Ten seasons of NFL salary allocation (2013 to 2022) modeled against team results, with an interactive dashboard.",
    bullets: [
      "Assembled a decade of salary cap allocation and season outcomes into a single modeling dataset.",
      "Modeled spending by position group against team results.",
      "Built an interactive dashboard for exploring the relationship season by season.",
    ],
    stack: ["Python", "Machine Learning", "Data Visualization"],
    links: [
      {
        label: "Source",
        href: "https://github.com/bclynde/nfl-salary-performance",
        primary: true,
      },
    ],
    accent: "#34c759",
  },
  {
    id: "portfolio",
    name: "This Site",
    role: "Solo build",
    period: "2025 to present",
    premise:
      "The site you are reading, built to be the one link on my resume.",
    bullets: [
      "Publishes every course report, presentation, model, and poster as a linkable document.",
      "Server-rendered on the App Router with a light and dark theme, indexed through Google Search Console.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Vercel"],
    links: [{ label: "Browse the archive", href: "/coursework", internal: true }],
    accent: "#86868b",
  },
] as const;
