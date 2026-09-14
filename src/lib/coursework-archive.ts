import { courseColors } from "@/lib/course-colors";

export type CourseEntry = {
  code: string;
  title: string;
  href: string;
  description: string;
  skills: readonly string[];
  accent: string;
  courseComponents?: readonly string[];
  institution?: string;
  subtitle?: string;
  transferNote?: string;
  institutionBadge?: string;
};

export type Semester = {
  id: string;
  label: string;
  institution: string;
  location?: string;
  period?: string;
  description?: string;
  contextualBadges?: readonly string[];
  courses: readonly CourseEntry[];
};

export type InProgressCourse = {
  code: string;
  title: string;
  description: string;
  focus: readonly string[];
};

export type NavFilter = {
  id: string;
  label: string;
};

export const navFilters: readonly NavFilter[] = [
  { id: "archive-hero", label: "All" },
  { id: "summer-full-2025", label: "Summer Full 2025" },
  { id: "fall-2025", label: "Fall 2025" },
  { id: "spring-2026", label: "Spring 2026" },
  { id: "summer-i-2026", label: "Summer I" },
  { id: "in-progress", label: "In Progress" },
];

export const inProgressCourses: readonly InProgressCourse[] = [
  {
    code: "DS 3500",
    title: "Advanced Programming with Data",
    description:
      "Builds on intermediate data programming with emphasis on production-quality software, pipeline architecture, and scalable analytics systems.",
    focus: [
      "Software Architecture",
      "Data Pipelines",
      "APIs",
      "Testing",
      "Scalable Systems",
      "Data Visualization",
    ],
  },
  {
    code: "DS 3000",
    title: "Mathematical Foundations of Artificial Intelligence",
    description:
      "Develops the mathematical toolkit underlying modern machine learning and artificial intelligence applications.",
    focus: [
      "Linear Algebra",
      "Probability",
      "Machine Learning",
      "AI Mathematics",
      "Numerical Computing",
      "Tensor Operations",
    ],
  },
  {
    code: "CS 3200",
    title: "Introduction to Databases",
    description:
      "Covers relational database design, SQL querying, normalization, and performance considerations for real-world data systems.",
    focus: [
      "SQL",
      "Database Design",
      "ER Modeling",
      "Normalization",
      "Query Optimization",
      "Stored Procedures",
    ],
  },
  {
    code: "INTB 1203",
    title: "International Business and Global Social Responsibility",
    description:
      "Examines how firms operate across borders while navigating ethics, corporate social responsibility, and global strategy.",
    focus: [
      "Global Markets",
      "International Strategy",
      "Ethics",
      "CSR",
      "Globalization",
      "Cross-Cultural Management",
    ],
  },
  {
    code: "CS 1210",
    title: "Professional Development for Khoury Co-op",
    description:
      "Prepares students for the co-op search through resumes, interviewing, professional communication, and career planning.",
    focus: [
      "Resume Development",
      "Interviewing",
      "Career Preparation",
      "Co-op Process",
      "Professional Communication",
    ],
  },
];

export const academicSemesters: readonly Semester[] = [
  {
    id: "summer-full-2025",
    label: "Summer Full 2025",
    institution: "Northeastern University",
    period: "May to August 2025",
    contextualBadges: ["First Semester"],
    courses: [
      {
        code: "MATH 1231",
        title: "Calculus for Business and Economics",
        href: "/coursework/math1231",
        description:
          "Derivatives, optimization, marginal analysis, and business calculus applications.",
        skills: [
          "Optimization",
          "Marginal Analysis",
          "Demand Modeling",
          "Integration",
          "Business Calculus",
        ],
        accent: courseColors.math1231.accent,
      },
    ],
  },
  {
    id: "fall-2025",
    label: "Fall 2025",
    institution: "Northeastern University",
    period: "September to December 2025",
    contextualBadges: ["Boston Campus", "Honors"],
    courses: [
      {
        code: "ACCT 1201",
        title: "Financial Accounting & Reporting",
        href: "/coursework/acct1201",
        description:
          "Financial statements, SEC filings, ratio analysis, Excel modeling, and corporate valuation.",
        skills: [
          "Financial Statements",
          "Ratio Analysis",
          "Excel Modeling",
          "SEC EDGAR",
          "Valuation",
        ],
        accent: courseColors.acct1201.accent,
      },
      {
        code: "CS 1200",
        title: "First Year Seminar",
        href: "/coursework/cs1200",
        description:
          "Developer fundamentals including Git, GitHub, and professional CS workflow.",
        skills: ["Git", "GitHub", "Version Control", "Markdown", "Dev Workflow"],
        accent: courseColors.cs1200.accent,
      },
      {
        code: "CS 1800",
        title: "Discrete Structures",
        href: "/coursework/cs1800",
        description:
          "Mathematical logic, proof writing, graph theory, combinatorics, and algorithmic analysis.",
        skills: [
          "Logic",
          "Proof Writing",
          "Graph Theory",
          "Combinatorics",
          "Big-O Analysis",
        ],
        accent: courseColors.cs1800.accent,
        courseComponents: [
          "Lecture: CS 1800",
          "Required Seminar: CS 1802",
        ],
      },
      {
        code: "ECON 1115",
        title: "Principles of Macroeconomics",
        href: "/coursework/econ1115",
        description:
          "Macroeconomic theory, fiscal policy, IMF data, and international trade analysis.",
        skills: [
          "Macro Analysis",
          "Fiscal Policy",
          "IMF Data",
          "Trade",
          "Policy Evaluation",
        ],
        accent: courseColors.econ1115.accent,
      },
      {
        code: "HONR 1102",
        title: "Honors Discovery",
        href: "/coursework/honr1102",
        description:
          "Honors seminar on leadership, community engagement, and digital storytelling.",
        skills: [
          "Leadership",
          "Storytelling",
          "Community Engagement",
          "Research",
          "Systems Thinking",
        ],
        accent: courseColors.honr1102.accent,
      },
    ],
  },
  {
    id: "spring-2026",
    label: "Spring 2026",
    institution: "Northeastern University",
    period: "January to April 2026",
    contextualBadges: ["Boston Campus", "Global Learning"],
    courses: [
      {
        code: "DS 2500",
        title: "Intermediate Programming with Data",
        href: "/coursework/ds2500",
        description:
          "Python, Pandas, APIs, data visualization, and introductory machine learning.",
        skills: ["Python", "Pandas", "APIs", "Data Viz", "Machine Learning"],
        accent: courseColors.ds2500.accent,
        courseComponents: [
          "Lecture: DS 2500",
          "Required Lab: DS 2501",
        ],
      },
      {
        code: "ENGW 1111",
        title: "First-Year Writing",
        href: "/coursework/engw1111",
        description:
          "Professional writing, rhetoric, research, and interactive digital storytelling.",
        skills: [
          "Professional Writing",
          "Digital Storytelling",
          "Rhetoric",
          "Research",
          "Communication",
        ],
        accent: courseColors.engw1111.accent,
      },
      {
        code: "FINA 2201",
        title: "Financial Management",
        href: "/coursework/fina2201",
        description:
          "Corporate finance, DCF valuation, CAPM, capital budgeting, and investment decision making.",
        skills: [
          "Corporate Finance",
          "DCF Valuation",
          "CAPM",
          "Capital Budgeting",
          "Financial Modeling",
        ],
        accent: courseColors.fina2201.accent,
      },
      {
        code: "GBST 1012",
        title: "Global Learning Experience",
        href: "/coursework/gbst1012",
        description:
          "Global citizenship, intercultural communication, and collaborative international research.",
        skills: [
          "Global Citizenship",
          "Intercultural Communication",
          "Research",
          "Globalization",
          "Ethics",
        ],
        accent: courseColors.gbst1012.accent,
      },
      {
        code: "MKTG 2201",
        title: "Marketing",
        href: "/coursework/mktg2201",
        description:
          "Marketing strategy, consumer behavior, branding, and competitive positioning.",
        skills: [
          "Market Research",
          "Consumer Behavior",
          "Branding",
          "Positioning",
          "Digital Marketing",
        ],
        accent: courseColors.mktg2201.accent,
      },
    ],
  },
  {
    id: "summer-i-2026",
    label: "Summer I 2026",
    institution: "Northeastern University + American College of Greece",
    location: "Boston, MA • Athens, Greece",
    period: "May to June 2026",
    description:
      "A combination of Northeastern coursework completed while studying abroad and courses taken directly at the American College of Greece.",
    contextualBadges: [
      "Study Abroad Experience",
      "American College of Greece",
    ],
    courses: [
      {
        code: "MGSC 2301",
        title: "Business Statistics",
        href: "/coursework/mgsc2301",
        description:
          "Regression analysis, ANOVA, hypothesis testing, and statistical inference with SPSS.",
        skills: [
          "Regression",
          "ANOVA",
          "Hypothesis Testing",
          "SPSS",
          "Inference",
        ],
        accent: courseColors.mgsc2301.accent,
        institution: "Northeastern University",
        subtitle: "Completed remotely while studying in Athens, Greece.",
      },
      {
        code: "ACCT 2301",
        title: "Profit Analysis for Managers and Advisors",
        href: "/coursework/af3116",
        description:
          "Cost analysis, budgeting, variance analysis, and managerial decision support.",
        skills: [
          "Cost Analysis",
          "Budgeting",
          "Variance Analysis",
          "CVP",
          "Planning",
        ],
        accent: courseColors.af3116.accent,
        transferNote: "Completed as AF 3116",
        institutionBadge: "American College of Greece",
      },
      {
        code: "MGMT 3530",
        title: "Project Management",
        href: "/coursework/mg4057",
        description:
          "WBS, Gantt scheduling, risk management, and stakeholder engagement.",
        skills: [
          "WBS",
          "Gantt Charts",
          "Risk Management",
          "Stakeholders",
          "Planning",
        ],
        accent: courseColors.mg4057.accent,
        transferNote: "Completed as MG 4057",
        institutionBadge: "American College of Greece",
      },
    ],
  },
];
