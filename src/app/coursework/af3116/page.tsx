"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  artifactGridClassName,
  StaticArtifactCard,
  SyllabusHeaderButton,
  type CourseAccent,
} from "@/components/coursework/artifact-cards";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: "/#resume" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Greece study abroad accent — page-local only */
const ACCENT = "#8045da";
const ACCENT_LIGHT = "#a67eef";
const ACCENT_GLOW = "rgba(128, 69, 218, 0.35)";
const ACCENT_RGB = "128, 69, 218";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/af3116-syllabus.pdf";

const skills = [
  "Cost-Volume-Profit Analysis",
  "Break-Even Analysis",
  "Budgetary Planning",
  "Variance Analysis",
  "Relevant Cost Analysis",
  "Transfer Pricing",
  "Responsibility Accounting",
  "Managerial Decision Making",
] as const;

const keyMetrics = [
  { value: "8", label: "Core Topics" },
  { value: "2", label: "Exams" },
  { value: "15", label: "ECTS Credits" },
  { value: "3", label: "US Credits" },
] as const;

const keyConcepts = [
  {
    title: "Cost-Volume-Profit Analysis",
    description:
      "Understanding how sales volume, costs, and pricing interact to affect profitability.",
  },
  {
    title: "Break-Even Analysis",
    description:
      "Determining the sales level required to cover costs and begin generating profit.",
  },
  {
    title: "Relevant Cost Decision Making",
    description:
      "Identifying which costs matter when evaluating alternative business decisions.",
  },
  {
    title: "Budgetary Control",
    description:
      "Using budgets and variance analysis to monitor performance and support planning.",
  },
] as const;

const artifacts = [
  { label: "Case Study Exercises", icon: "case" },
  { label: "Budget Analysis", icon: "budget" },
  { label: "Cost Planning Models", icon: "model" },
] as const;

const takeaways = [
  {
    title: "Accounting supports strategy, not just reporting.",
    description:
      "Managerial accounting provides information that helps leaders make better operational and long-term decisions.",
  },
  {
    title: "Not all costs matter equally.",
    description:
      "Relevant cost analysis showed how decision quality depends on identifying information that actually changes outcomes.",
  },
  {
    title: "Budgets are management tools.",
    description:
      "Budgeting and variance analysis provide a framework for planning, monitoring performance, and adapting strategy.",
  },
] as const;

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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const viewport = { once: true, margin: "-100px" as const };

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

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function CaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 14h6M9 18h4" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M11 15h4" />
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-px w-8 shrink-0"
        style={{ backgroundColor: ACCENT }}
        aria-hidden
      />
      <p className="text-[13px] font-medium tracking-[0.22em] text-muted uppercase">
        {children}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-[-0.03em] text-foreground">
      {children}
    </h2>
  );
}

function artifactIcon(type: string) {
  switch (type) {
    case "case":
      return <CaseIcon />;
    case "budget":
      return <BudgetIcon />;
    case "model":
      return <ModelIcon />;
    default:
      return <DocumentIcon />;
  }
}

export default function AF3116Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="ambient-grid absolute inset-0" />
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
        {/* Hero */}
        <section className="px-6 pt-36 pb-16 lg:px-8 lg:pt-44 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div custom={0} variants={fadeUp}>
                <Link
                  href="/coursework"
                  className="group mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-muted transition-colors hover:text-foreground"
                >
                  <BackIcon />
                  Back to Coursework
                </Link>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUp}
                className="flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                <span
                  className="text-[13px] font-medium tracking-[0.22em] uppercase"
                  style={{ color: ACCENT_LIGHT }}
                >
                  AF 3116
                </span>
                <span className="hidden text-muted/50 sm:inline" aria-hidden>
                  •
                </span>
                <SyllabusHeaderButton
                  href={SYLLABUS_PDF}
                  accent={courseAccent}
                />
              </motion.div>

              <motion.h1
                custom={2}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Management Accounting
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Using accounting information to evaluate performance, guide
                planning, and strengthen business decision making.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-6 pb-32 lg:space-y-24 lg:px-8">
          {/* Course Overview */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Course Overview</SectionLabel>
            <SectionHeading>
              The financial lens for managerial decision making.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                AF3116 explored how managers use accounting information to make
                operational and strategic decisions. Rather than focusing on
                external financial reporting, the course emphasized internal
                decision support through cost analysis, budgeting, profitability
                evaluation, and performance measurement.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Major topics included Cost-Volume-Profit (CVP) analysis,
                break-even analysis, relevant cost decision making, transfer
                pricing, budgetary planning and control, responsibility
                accounting, and cost behavior analysis. Through applied
                business scenarios and quantitative exercises, I learned how
                accounting data supports planning, resource allocation, and
                long-term organizational performance.
              </p>
            </div>
          </motion.section>

          {/* Skills Learned */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Skills Learned</SectionLabel>
              <SectionHeading>Core competencies from this course.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass flex items-center gap-4 rounded-2xl px-6 py-5 transition-colors duration-300 hover:bg-card-hover"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                      color: ACCENT,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                  </span>
                  <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Major Coursework */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Major Coursework</SectionLabel>
            <SectionHeading>
              Applied analysis through real business cases.
            </SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                  color: ACCENT_LIGHT,
                }}
              >
                Decision Analysis
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Management Accounting Decision Analysis
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div>
                  <p className="text-[17px] leading-[1.75] text-muted">
                    Throughout the course, I analyzed business scenarios
                    involving pricing decisions, production planning, budgeting,
                    and profitability assessment. Using managerial accounting
                    techniques, I evaluated cost structures, identified relevant
                    financial information, and developed recommendations
                    designed to improve organizational performance.
                  </p>
                  <p className="mt-4 text-[17px] leading-[1.75] text-muted">
                    Case exercises required interpreting financial data,
                    performing break-even and contribution margin analysis,
                    evaluating alternative courses of action, and assessing how
                    managerial decisions affect profitability and resource
                    allocation.
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
                    Key Metrics
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {keyMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="glass rounded-2xl border border-border px-5 py-5 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(128,69,218,0.1)]"
                      >
                        <p
                          className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-none tracking-[-0.03em]"
                          style={{ color: ACCENT_LIGHT }}
                        >
                          {metric.value}
                        </p>
                        <p className="mt-2 text-[12px] font-medium tracking-[0.1em] text-muted uppercase">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>

          {/* Key Concepts */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Key Concepts</SectionLabel>
              <SectionHeading>Managerial accounting frameworks.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {keyConcepts.map((concept, i) => (
                <motion.div
                  key={concept.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    scale: 1.015,
                    transition: { duration: 0.3 },
                  }}
                  className="glass-strong relative overflow-hidden rounded-3xl border border-[#8045da]/20 p-7 transition-all duration-500 sm:p-8"
                  style={{ boxShadow: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 24px 60px rgba(128, 69, 218, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(${ACCENT_RGB},0.5), transparent)`,
                    }}
                  />
                  <h3
                    className="text-[17px] font-semibold tracking-[-0.02em] text-foreground"
                  >
                    {concept.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {concept.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Artifacts */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Artifacts</SectionLabel>
              <SectionHeading>Course deliverables and outputs.</SectionHeading>
            </motion.div>

            <div className={artifactGridClassName(artifacts.length)}>
              {artifacts.map((artifact, i) => {
                const iconStyle = {
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                  color: ACCENT,
                };

                return (
                  <motion.div
                    key={artifact.label}
                    custom={i + 1}
                    variants={fadeUp}
                    className="h-full"
                    whileHover={{ y: -2, transition: { duration: 0.25 } }}
                  >
                    <StaticArtifactCard
                      label={artifact.label}
                      icon={artifactIcon(artifact.icon)}
                      iconStyle={iconStyle}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Key Takeaways */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Key Takeaways</SectionLabel>
              <SectionHeading>
                What I carried forward from this course.
              </SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {takeaways.map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <div
                    className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                      color: ACCENT,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
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
