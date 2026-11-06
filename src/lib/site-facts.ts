import { COOP } from "@/lib/coop";
import { academicSemesters, inProgressCourses } from "@/lib/coursework-archive";

/**
 * Canonical facts about Lokesh. Everything the site states about availability,
 * education, or counts is derived from here so the homepage, the coursework
 * archive, and page metadata can never contradict each other.
 */

export const EMAIL = "addagiri.l@northeastern.edu";

/**
 * What comes next. The Verisk co-op itself lives in coop-data.json (through
 * src/lib/coop.ts); after it, the search is for a summer internship.
 */
export const AVAILABILITY = {
  /** Hero pill on wide screens: "Incoming Technology Services Group Co-op at Verisk". */
  incoming: COOP.incoming,
  /** The same pill on phones, where the full title would wrap inside it. */
  incomingShort: `Incoming co-op at ${COOP.company}`,
  /** "Jan to Jun 2027", for the hero snapshot. */
  coopPeriod: COOP.period,
  /** Lead line of the hero's Looking for card. */
  searchHeadline: "Summer internship, starting July 2027",
  /** Completes "Looking for ..." in the contact section and on /projects. */
  search: "a summer internship starting in July 2027 in data, analytics, or operations",
  roles: [
    "Data Scientist",
    "Data Analyst",
    "Operations Analyst",
    "Business Intelligence Analyst",
  ],
  /** Shown under the role list in the hero. */
  outlook:
    "Open to any industry where data drives business decisions, including supply chain, e-commerce, healthcare, and financial services.",
  location: "Boston, MA",
} as const;

export const EDUCATION = {
  school: "Northeastern University",
  location: "Boston, MA",
  degree: "Candidate for Bachelor of Science",
  major: "Data Science and Business Administration (combined major)",
  concentrations: ["Supply Chain Management", "International Business"],
  graduation: "May 2029",
  gpa: "3.83 / 4.0",
  honors: ["John Martinson Honors Program", "Dean's List"],
  studyAbroad: "American College of Greece, Athens, May to June 2026",
  languages: [
    "Telugu (native)",
    "Spanish (limited working proficiency)",
    "Greek (elementary)",
  ],
} as const;

/** One line of evidence, not adjectives. Used in the hero and in metadata. */
export const HEADLINE_EVIDENCE =
  "I pulled roughly 35,000 consumer complaints through the CFPB API to test whether enforcement actions change bank behavior, and I ship web apps that run Monte Carlo simulations in the browser.";

/** Counted from the archive so the number can never drift from the content. */
export const coursesCompleted = academicSemesters.reduce(
  (total, semester) => total + semester.courses.length,
  0,
);

export const coursesInProgress = inProgressCourses.length;

export const termsCompleted = academicSemesters.length;

/**
 * Reports, presentations, models, and posters published under /documents.
 * Excludes syllabi, assignment prompts, and the resume. Recount when adding files.
 */
export const documentsPublished = 24;

export type Stat = {
  value: string;
  label: string;
};

/** The four shown on the homepage. */
export const siteStats: readonly Stat[] = [
  { value: String(coursesCompleted), label: "Courses Completed" },
  { value: String(coursesInProgress), label: "In Progress" },
  { value: String(documentsPublished), label: "Documents Published" },
  { value: EDUCATION.gpa.split(" ")[0], label: "GPA" },
];

/** The same numbers, plus terms, for the coursework archive hero. */
export const archiveStats: readonly Stat[] = [
  ...siteStats.slice(0, 3),
  { value: String(termsCompleted), label: "Terms Completed" },
  { value: EDUCATION.gpa.split(" ")[0], label: "Current GPA" },
];

/** Lead with the data and engineering topics. */
export const courseworkTopics = [
  "Python and Pandas",
  "Statistics and Regression",
  "SQL and Databases",
  "Mathematical Foundations of AI",
  "Discrete Structures",
  "Corporate Finance",
] as const;

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

/** Matches the skills on the resume and LinkedIn. Update them together. */
export const skillGroups: readonly SkillGroup[] = [
  {
    label: "Data and Analysis",
    items: [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Matplotlib",
      "Plotly",
      "Tableau",
      "REST APIs",
      "SQL",
      "SPSS",
      "Excel",
      "Regression",
    ],
  },
  {
    label: "Methods",
    items: [
      "Machine Learning",
      "Exploratory Data Analysis",
      "Statistical Data Analysis",
      "Monte Carlo Simulation",
      "Data Visualization",
      "Data Cleaning and Preprocessing",
      "ETL",
      "Data Pipelines",
    ],
  },
  {
    label: "Engineering",
    items: [
      "TypeScript",
      "JavaScript",
      "Java",
      "HTML",
      "CSS",
      "React",
      "Next.js",
      "Tailwind",
      "Supabase (Postgres)",
      "Web Workers",
    ],
  },
  {
    label: "Testing and Tooling",
    items: [
      "Vitest",
      "Unit Testing",
      "GitHub Actions",
      "Git",
      "Vercel",
      "Microsoft Project",
      "Technical Documentation",
      "Troubleshooting",
    ],
  },
  {
    label: "AI Tools",
    items: [
      "LLM APIs",
      "Prompt Engineering",
      "Claude Code",
      "ChatGPT",
      "Gemini",
      "GitHub Copilot",
      "Cursor",
    ],
  },
  {
    label: "Business and Operations",
    items: [
      "Market Research",
      "Competitor Analysis",
      "Risk Assessment",
      "Supply Chain Analysis",
    ],
  },
] as const;

export type ExperienceEntry = {
  role: string;
  org: string;
  location: string;
  period: string;
  points: readonly string[];
};

/** Newest first, as on the resume and LinkedIn. Future tense until the co-op starts. */
export const experience: readonly ExperienceEntry[] = [
  {
    role: `${COOP.title} (incoming)`,
    org: COOP.company,
    location: COOP.location,
    period: COOP.period,
    points: [
      "Selected after an eight-person panel interview for one of two spring co-op openings on the Technology Services team.",
      "Will support insurance clients running AIR's catastrophe-modeling software, installing, upgrading, and troubleshooting it.",
      "Will partner with software QA to find and resolve issues, write test plans, and build virtual machine libraries of AIR products.",
    ],
  },
  {
    role: "Webmaster",
    org: "INFORMS at Northeastern",
    location: "Boston, MA",
    period: "Oct 2026 to present",
    points: [
      "Selected to the officer board of an award-winning student chapter of INFORMS, the largest operations research society.",
      "Plan chapter seminars, member meetings, and social events alongside graduate officers and faculty.",
      "Own the chapter's website and its move to a custom domain, showcasing its events and leadership to members.",
    ],
  },
  {
    role: "Junior Technology Consultant",
    org: "Family Business Consulting Club, Northeastern University",
    location: "Boston, MA",
    period: "Sep 2026 to present",
    points: [
      "Selected through case interviews for a newly created technical role at a 30-member student consultancy.",
      "Support consulting teams of 8 to 15 on data workstreams for clients in specialty finance, adtech, and consumer software.",
      "Own the club's client-facing website, auditing it and ranking six fixes by priority in a remediation plan.",
    ],
  },
  {
    role: "Project Lead",
    org: "DATA Club @ Northeastern University",
    location: "Boston, MA",
    period: "Jan to Apr 2026",
    points: [
      "Studied whether the way NFL teams split salary cap dollars across position groups shows up in on-field results.",
      "Led the four-person team from research question to final dashboard, setting the timeline and dividing the work.",
      "Merged ten seasons (2013 to 2022) of cap and results data, then built the scikit-learn model and the Panel and Plotly dashboard.",
    ],
  },
  {
    role: "Youth Basketball Coach",
    org: "Milford Biddy Basketball",
    location: "Milford, MA",
    period: "Nov 2024 to Feb 2025",
    points: [
      "Coached a 7th and 8th grade team of roughly twelve athletes through a full season, running practices, managing game-day rotations, and developing players across a wide range of skill levels.",
    ],
  },
  {
    role: "Product Engineering Intern",
    org: "Peak Innovations LLC",
    location: "Remote",
    period: "Sep to Dec 2024",
    points: [
      "Eight-week Work-Based Learning Alliance consulting engagement.",
      "Led CAD development for a redesigned lacrosse helmet prototype in a four-person team.",
      "Conducted product and competitor research and design reviews, presenting recommendations directly to the company founder.",
    ],
  },
  {
    role: "USSF Certified Soccer Referee",
    org: "U.S. Soccer Federation",
    location: "Weymouth, MA",
    period: "Sep 2019 to May 2025",
    points: [
      "Seven seasons and several hundred matches, usually the only official on the field.",
      "Made real-time calls under pressure and de-escalated disputes among players, coaches, and spectators.",
    ],
  },
] as const;

export const activities = [
  "DATA Club",
  "AI Northeastern",
  "NU Votes Ambassador",
  "NU|ACES Civic Engagement",
  "Lead360 Blueprint",
  "Junior Economic Club of Boston (2024 to 2025)",
] as const;
