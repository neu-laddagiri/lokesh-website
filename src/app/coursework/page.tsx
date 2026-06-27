"use client";

import {
  HeroConstructionTape,
  HeroDevelopmentLabel,
} from "@/components/hero-construction-tape";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import Link from "next/link";
import { useRef, useState } from "react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume },
  { label: "Contact", href: "/#contact" },
] as const;

const courses = [
  {
    code: "ACCT 1201",
    title: "Financial Accounting & Reporting",
    href: "/coursework/acct1201",
    skills: [
      "Financial Statement Analysis",
      "Ratio Analysis",
      "Excel Modeling",
      "SEC EDGAR Research",
      "Corporate Valuation",
    ],
  },
  {
    code: "FINA 2201",
    title: "Financial Management",
    href: "/coursework/fina2201",
    skills: [
      "Corporate Finance",
      "DCF Valuation",
      "CAPM",
      "Capital Budgeting",
      "Financial Modeling",
    ],
  },
  {
    code: "ECON 1115",
    title: "Principles of Macroeconomics",
    href: "/coursework/econ1115",
    skills: [
      "Macroeconomic Analysis",
      "Fiscal Policy",
      "IMF Data",
      "International Trade",
      "Policy Evaluation",
    ],
  },
  {
    code: "HONR 1102",
    title: "Honors Discovery",
    href: "/coursework/honr1102",
    skills: [
      "Leadership",
      "Systems Thinking",
      "Digital Storytelling",
      "Community Engagement",
      "Interdisciplinary Research",
    ],
  },
  {
    code: "GBST 1012",
    title: "Global Learning Experience",
    href: "/coursework/gbst1012",
    skills: [
      "Global Citizenship",
      "Intercultural Communication",
      "Research",
      "Cross-Cultural Analysis",
      "Globalization",
    ],
  },
  {
    code: "ENGW 1111",
    title: "First-Year Writing",
    href: "/coursework/engw1111",
    skills: [
      "Professional Writing",
      "Storytelling",
      "Rhetorical Analysis",
      "Research",
      "Communication",
    ],
  },
  {
    code: "CS 1200",
    title: "First Year Seminar",
    href: "/coursework/cs1200",
    skills: [
      "Git",
      "GitHub",
      "Version Control",
      "Markdown",
      "Developer Workflow",
    ],
  },
  {
    code: "CS 1800",
    title: "Discrete Structures",
    href: "/coursework/cs1800",
    skills: [
      "Mathematical Logic",
      "Proof Writing",
      "Graph Theory",
      "Combinatorics",
      "Big-O Analysis",
    ],
  },
  {
    code: "DS 2500",
    title: "Intermediate Programming with Data",
    href: "/coursework/ds2500",
    skills: [
      "Python",
      "Pandas",
      "APIs",
      "Data Visualization",
      "Machine Learning",
    ],
  },
  {
    code: "MGSC 2301",
    title: "Business Statistics",
    href: "/coursework/mgsc2301",
    skills: [
      "Regression Analysis",
      "ANOVA",
      "Hypothesis Testing",
      "SPSS",
    ],
  },
  {
    code: "MG 4057",
    title: "Project Management",
    href: "/coursework/mg4057",
    skills: [
      "WBS",
      "Gantt Charts",
      "Risk Management",
      "Stakeholder Analysis",
    ],
  },
  {
    code: "AF 3116",
    title: "Management Accounting",
    href: "/coursework/af3116",
    skills: ["Cost Analysis", "Budgeting", "Variance Analysis"],
  },
  {
    code: "MATH 1231",
    title: "Calculus for Business and Economics",
    href: "/coursework/math1231",
    skills: [
      "Optimization",
      "Demand Modeling",
      "Marginal Analysis",
      "Profit Maximization",
    ],
  },
] as const;

const courseAccents: Partial<Record<(typeof courses)[number]["code"], string>> =
  {
    "HONR 1102": "#312E81",
    "GBST 1012": "#183A63",
    "FINA 2201": "#2563EB",
    "ENGW 1111": "#C8102E",
    "ECON 1115": "#CC0001",
  };

const DEFAULT_COURSE_ACCENT = "#2997ff";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const viewport = { once: true, margin: "-100px" as const };

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-300 group-hover:-translate-x-0.5"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function CourseworkPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#2997ff]/[0.06] blur-[120px]" />
        <div className="absolute right-0 bottom-1/4 h-[350px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div
          className="ambient-grid absolute inset-0"
        />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "border-b border-border bg-background/60 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
          >
            Lokesh Addagiri
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.label === "Resume" ? resumeExternalProps : {})}
                className={`text-[13px] transition-colors duration-200 ${
                  link.label === "Coursework"
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              className="glass flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
            >
              <span className="block h-[1.5px] w-4 bg-muted" />
              <span className="block h-[1.5px] w-4 bg-muted" />
            </button>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10">
        {/* Page header */}
        <section
          ref={heroRef}
          className="relative overflow-hidden px-6 pt-36 pb-20 lg:px-8 lg:pt-44 lg:pb-28"
        >
          <HeroConstructionTape scrollYProgress={scrollYProgress} />

          <div className="relative z-10 mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div custom={0} variants={fadeUp}>
                <Link
                  href="/"
                  className="group mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-muted transition-colors hover:text-foreground"
                >
                  <BackIcon />
                  Back to Home
                </Link>
              </motion.div>

              <motion.p
                custom={1}
                variants={fadeUp}
                className="text-[13px] font-medium tracking-[0.22em] text-muted uppercase"
              >
                Coursework
              </motion.p>

              <motion.div custom={2} variants={fadeUp}>
                <HeroDevelopmentLabel />
              </motion.div>

              <motion.h1
                custom={3}
                variants={fadeUp}
                className="mt-2 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Academic Archive
              </motion.h1>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Every course, project, report, presentation, and major
                assignment documented throughout my academic journey.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Course cards */}
        <section className="px-6 pb-32 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
            >
              {courses.map((course, i) => {
                const accent =
                  courseAccents[course.code] ?? DEFAULT_COURSE_ACCENT;

                return (
                <motion.article
                  key={course.code}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.35 } }}
                  className="glass-strong group relative flex flex-col overflow-hidden rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                >
                  <div
                    className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ backgroundColor: `${accent}12` }}
                  />

                  <p
                    className="text-[13px] font-medium tracking-[0.12em] uppercase"
                    style={{ color: accent }}
                  >
                    {course.code}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {course.title}
                  </h2>

                  <div className="mt-8 flex-1">
                    <p className="text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
                      Skills
                    </p>
                    <ul className="mt-4 space-y-3">
                      {course.skills.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-center gap-3 text-[15px] text-foreground-secondary"
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: `${accent}cc` }}
                          />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={course.href}
                    className="group/btn mt-10 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:border-white/[0.2] hover:bg-card-hover"
                  >
                    View Details
                    <ArrowIcon />
                  </Link>
                </motion.article>
                );
              })}
            </motion.div>

            {/* Archive note */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
              className="glass mt-16 rounded-3xl px-8 py-10 text-center sm:px-12"
            >
              <p className="text-[17px] leading-relaxed text-muted">
                More courses will be added as they are completed. Each entry
                will include projects, reports, presentations, and key
                assignments.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} Lokesh Addagiri. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.label === "Resume" ? resumeExternalProps : {})}
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
