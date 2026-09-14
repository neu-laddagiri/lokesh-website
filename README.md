# lokeshaddagiri.com

Portfolio and academic archive for Lokesh Addagiri, a Data Science and Business
Administration combined major at Northeastern University (expected May 2029),
with concentrations in International Business and Supply Chain Management.

**Available for a January to June 2027 co-op**, targeting data engineering,
data analysis, and business intelligence roles in financial services.

## Routes

| Route | What it holds |
| --- | --- |
| `/` | Availability, projects, experience, toolkit, coursework summary, contact |
| `/projects` | Full write-ups for every project, with live apps, source, and reports |
| `/coursework` | 14 completed courses and 5 in progress, each with its own page |
| `/coursework/[code]` | Syllabus plus every report, presentation, model, and poster |
| `/greece-2026` | Study abroad archive: academics, places, and flight map |

## Projects linked from the site

- **Banking Fraud and Corporate Misconduct** (DS 2500 capstone): roughly 35,000
  CFPB consumer complaints pulled through the API to test whether enforcement
  actions change bank behavior. Python, Pandas, Matplotlib.
- **CardEdge** ([live](https://cardedge-five.vercel.app) ·
  [source](https://github.com/neu-laddagiri/cardedge)): poker and blackjack
  decision trainer with a Monte Carlo equity simulator in cancellable Web
  Workers. Next.js, TypeScript, Supabase, Vitest.
- **IG Wrapped** ([live](https://ig-wrapped-snowy.vercel.app) ·
  [source](https://github.com/neu-laddagiri/ig-wrapped)): privacy-first
  Instagram export analyzer that parses the archive locally in the browser.
  Ships with synthetic demo data, so no real export is needed.
- **NFL Salary vs. Team Performance**
  ([source](https://github.com/bclynde/nfl-salary-performance)): ten seasons of
  salary allocation modeled against team results.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 4,
Framer Motion, MapLibre GL, deployed on Vercel.

## Source of truth for content

`src/lib/site-facts.ts` holds availability, education, and every count shown on
the site. Course counts derive from `src/lib/coursework-archive.ts` and project
copy lives in `src/lib/projects.ts`, so the homepage and the archive cannot
disagree. Update those files rather than editing numbers in components.

## Development

```bash
npm install
npm run dev
```

## Author

Lokesh Addagiri · Northeastern University ·
[LinkedIn](https://www.linkedin.com/in/lokeshaddagiri) ·
[GitHub](https://github.com/neu-laddagiri)
