import { academicSemesters, inProgressCourses } from "@/lib/coursework-archive";

/**
 * Canonical facts about Lokesh. Everything the site states about availability,
 * education, or counts is derived from here so the homepage, the coursework
 * archive, and page metadata can never contradict each other.
 */

export const EMAIL = "addagiri.l@northeastern.edu";

export const CO_OP = {
  status: "Available for co-op",
  term: "January to June 2027",
  roles: [
    "Data Engineer",
    "Data Analyst",
    "Business Intelligence Analyst",
    "Data Science Intern",
  ],
  industry: "Financial services and investment firms",
  location: "Boston, MA",
} as const;

export const EDUCATION = {
  school: "Northeastern University",
  location: "Boston, MA",
  degree: "Candidate for Bachelor of Science",
  major: "Data Science and Business Administration (combined major)",
  concentrations: ["International Business", "Supply Chain Management"],
  graduation: "May 2029",
  gpa: "3.8 / 4.0",
  honors: ["John Martinson Honors Program", "Dean's List"],
  studyAbroad: "American College of Greece, Athens, May to June 2026",
  languages: [
    "Telugu (native)",
    "Spanish (limited working)",
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

/** Only technologies used in the work linked on this site. */
export const skillGroups: readonly SkillGroup[] = [
  {
    label: "Data and Analysis",
    items: ["Python", "Pandas", "Matplotlib", "REST APIs", "SQL", "SPSS", "Excel"],
  },
  {
    label: "Engineering",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind",
      "Supabase (Postgres)",
      "Web Workers",
    ],
  },
  {
    label: "Testing and Tooling",
    items: ["Vitest", "GitHub Actions", "Git", "Vercel"],
  },
] as const;

export type ExperienceEntry = {
  role: string;
  org: string;
  location: string;
  period: string;
  points: readonly string[];
};

export const experience: readonly ExperienceEntry[] = [
  {
    role: "Product Engineering Intern",
    org: "Peak Innovations LLC",
    location: "Remote",
    period: "Sep to Dec 2024",
    points: [
      "Eight-week Work-Based Learning Alliance consulting engagement.",
      "Led CAD development for a redesigned lacrosse helmet prototype in a four-person team.",
      "Presented recommendations directly to the company founder.",
    ],
  },
  {
    role: "Youth Basketball Coach",
    org: "Milford Biddy Basketball",
    location: "Milford, MA",
    period: "Nov 2024 to Feb 2025",
    points: [
      "Coached a 7th and 8th grade team of roughly twelve athletes through a full season.",
    ],
  },
  {
    role: "Certified Soccer Referee",
    org: "Massachusetts Youth Soccer",
    location: "Massachusetts",
    period: "Sep 2019 to May 2025",
    points: [
      "Seven seasons and several hundred matches, usually the only official on the field.",
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
