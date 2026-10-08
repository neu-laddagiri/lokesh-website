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
  /** Shorter than the premise, for the homepage tiles. Falls back to premise. */
  tagline?: string;
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
    id: "shms-rollout",
    name: "Smart Health Monitoring System Rollout Plan",
    role: "Project Management capstone (MG 4057), American College of Greece, team project",
    period: "Summer 2026",
    premise:
      "Planned a 195-day, 55-task rollout across a healthcare network: scope and governance, a work breakdown structure, a Microsoft Project schedule across five phases with dependencies and milestones, a power-interest stakeholder matrix, and ten ranked risks.",
    tagline:
      "A 195-day, 55-task rollout across a healthcare network: five phases in Microsoft Project and ten ranked risks.",
    bullets: [],
    stack: ["Microsoft Project", "WBS", "Gantt Scheduling", "Risk Management"],
    links: [
      {
        label: "Read the report",
        href: "/documents/mg4057-shms-final-report.pdf",
        primary: true,
      },
      { label: "Course page", href: "/coursework/mg4057", internal: true },
    ],
    accent: "#14b8a6",
  },
  {
    id: "cardedge",
    name: "CardEdge",
    role: "Solo build",
    period: "June 2026 to present",
    premise:
      "A mobile-first poker and blackjack decision trainer. The interesting part is the simulation, not the card game.",
    tagline:
      "Poker and blackjack decision trainer, with the equity math simulated in the browser.",
    bullets: [
      "Monte Carlo equity simulator running in cancellable Web Workers, reporting 95% confidence intervals across Fast, Balanced, and Precise modes, recommending each move by comparing that interval against the break-even pot-odds threshold, with caching to avoid redundant computation.",
      "Rule-aware blackjack basic strategy across deck counts, H17/S17, double-after-split, and late surrender.",
      "Validated dollar-stakes table engine with legal-action validation, split-pot accounting, and street advancement for 2 to 10 players.",
      "Account-backed training history and profit/loss ledger on Supabase Postgres with row-level security. Guest mode works fully with local-only storage.",
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
      "A privacy-first Instagram data export analyzer. The export is parsed locally in the browser and the raw file never leaves the device. Includes an AI analyst chat that answers questions from aggregated metrics only, never the raw archive.",
    tagline:
      "Instagram export analyzer with an AI analyst chat. The archive is parsed locally and never leaves the device.",
    bullets: [
      "Local ZIP and JSON parsing with JSZip, handling export formats that vary by region and app version.",
      "Unified social graph connecting follows, DMs, and interactions, with scoring for relationship strength, cleanup priority, and privacy exposure.",
      "Day-by-hour activity heatmaps, monthly timelines, and engagement breakdowns rendered with Recharts.",
      "Optional Supabase cloud save for the parsed analysis, never the original ZIP, media, or full message history.",
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
    note: "No upload needed. Ships with synthetic demo data.",
  },
  {
    id: "nfl-salary",
    name: "NFL Salary vs. Team Performance",
    role: "DATA Club, project lead of a four-person team",
    period: "Spring 2026",
    premise:
      "Ten seasons of NFL salary allocation (2013 to 2022) modeled against team results. I built the data cleaning and merging, the scikit-learn model, and the Panel and Plotly dashboard.",
    tagline:
      "Ten NFL seasons of salary allocation modeled against team results. I built the data cleaning and merging, the scikit-learn model, and the Panel and Plotly dashboard.",
    bullets: [
      "Led the team from research question to final dashboard, setting the timeline and dividing the work.",
      "Assembled a decade of salary cap allocation and season outcomes into a single modeling dataset.",
      "Modeled spending by position group against team results.",
      "Built an interactive dashboard for exploring the relationship season by season.",
    ],
    stack: [
      "Python",
      "scikit-learn",
      "Plotly",
      "Panel",
      "Machine Learning",
      "Data Visualization",
    ],
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
    period: "June 2026 to present",
    premise:
      "The site you are reading, built to be the one link on my resume.",
    bullets: [
      "Publishes every course report, presentation, model, and poster as a linkable document.",
      "Server-rendered on the App Router with a light and dark theme, indexed through Google Search Console.",
      "Counts and facts live in source-of-truth data files, so the homepage and archive can't disagree.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Vercel"],
    links: [{ label: "Browse the archive", href: "/coursework", internal: true }],
    accent: "#86868b",
  },
  {
    id: "sec-football",
    name: "SEC Football Spending vs. Performance",
    role: "Business Statistics capstone (MGSC 2301)",
    period: "Summer 2026",
    premise:
      "Modeled athletic department spending against final conference standings across 70 SEC program-seasons from 2020 to 2024. Spending was statistically significant (p = 0.013) but explained only 8.7% of performance variance, which gives weak support for spend-to-win budgets.",
    tagline:
      "Across 70 SEC program-seasons, spending was significant (p = 0.013) but explained only 8.7% of performance variance.",
    bullets: [],
    stack: ["SPSS", "Regression Analysis"],
    links: [
      {
        label: "Course page",
        href: "/coursework/mgsc2301",
        internal: true,
        primary: true,
      },
    ],
    accent: "#ef4444",
  },
] as const;
