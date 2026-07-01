"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { resumeExternalProps } from "@/lib/profile-links";
import { subpageNavLinks as navLinks } from "@/lib/site-nav";
import {
  SyllabusHeaderButton,
  type CourseAccent,
} from "@/components/coursework/artifact-cards";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Deep finance blue & cyan — page-local accent only */
const ACCENT = "#2563EB";
const ACCENT_LIGHT = "#60A5FA";
const ACCENT_CYAN = "#22D3EE";
const ACCENT_GLOW = "rgba(37, 99, 235, 0.35)";
const ACCENT_RGB = "37, 99, 235";
const CYAN_RGB = "34, 211, 238";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/fina2201-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Corporate Finance",
  "DCF Valuation",
  "CAPM",
  "Capital Budgeting",
  "Financial Modeling",
] as const;

const skills = [
  "Financial Statement Analysis",
  "Time Value of Money",
  "Discounted Cash Flow",
  "Corporate Valuation",
  "Capital Budgeting",
  "CAPM",
  "Bond Valuation",
  "Stock Valuation",
  "Cost of Capital",
  "Risk & Return",
  "Excel Financial Modeling",
  "Investment Decision Making",
] as const;

const financeConcepts = [
  { title: "Time Value of Money", icon: "tvm" },
  { title: "Discounted Cash Flow", icon: "dcf" },
  { title: "Bond Valuation", icon: "bond" },
  { title: "Stock Valuation", icon: "stock" },
  { title: "Capital Budgeting", icon: "budget" },
  { title: "CAPM", icon: "capm" },
  { title: "Cost of Capital", icon: "wacc" },
  { title: "Financial Markets", icon: "markets" },
  { title: "Risk & Return", icon: "risk" },
  { title: "Corporate Financing", icon: "finance" },
] as const;

const learningOutcomes = [
  {
    title: "Time Value of Money",
    description:
      "Applying present and future value calculations to evaluate cash flows across time.",
  },
  {
    title: "Financial Statement Analysis",
    description:
      "Reading balance sheets, income statements, and cash flows to assess firm performance.",
  },
  {
    title: "Bond Pricing",
    description:
      "Valuing fixed-income securities using yield, coupon rates, and interest rate dynamics.",
  },
  {
    title: "Stock Valuation",
    description:
      "Estimating equity value through dividend models and earnings-based approaches.",
  },
  {
    title: "Capital Budgeting",
    description:
      "Evaluating long-term projects using NPV, IRR, and payback decision criteria.",
  },
  {
    title: "Discounted Cash Flow",
    description:
      "Building DCF models to estimate intrinsic firm and project value.",
  },
  {
    title: "CAPM",
    description:
      "Measuring systematic risk and expected return using the capital asset pricing model.",
  },
  {
    title: "Cost of Capital",
    description:
      "Calculating weighted average cost of capital for investment and valuation decisions.",
  },
  {
    title: "Risk Assessment",
    description:
      "Analyzing uncertainty, diversification, and return trade-offs in financial decisions.",
  },
  {
    title: "Corporate Financing",
    description:
      "Understanding how firms raise capital through debt, equity, and hybrid instruments.",
  },
  {
    title: "Excel Modeling",
    description:
      "Building spreadsheet models for valuation, forecasting, and scenario analysis.",
  },
  {
    title: "Investment Decision Making",
    description:
      "Applying quantitative frameworks to accept or reject investment opportunities.",
  },
] as const;

const downloads = [
  {
    title: "Course Syllabus",
    description:
      "Official Northeastern University syllabus outlining learning objectives, course topics, grading, and semester schedule.",
    href: SYLLABUS_PDF,
    actionLabel: "Open PDF",
  },
] as const;

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.07, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
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

function ConceptIcon({ type }: { type: (typeof financeConcepts)[number]["icon"] }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "tvm":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "dcf":
      return (
        <svg {...props}>
          <path d="M4 18V6" />
          <path d="M4 18h16" />
          <path d="M8 14l3-4 3 3 4-6" />
        </svg>
      );
    case "bond":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 10h2M7 14h2M15 10h2M15 14h2" />
        </svg>
      );
    case "stock":
      return (
        <svg {...props}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l3-6 3 4 5-8" />
        </svg>
      );
    case "budget":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "capm":
      return (
        <svg {...props}>
          <path d="M4 18h16" />
          <path d="M6 16l4-8 4 5 4-10" />
        </svg>
      );
    case "wacc":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "markets":
      return (
        <svg {...props}>
          <path d="M3 20h18" />
          <path d="M6 16V8M10 16V5M14 16v-6M18 16v-9" />
        </svg>
      );
    case "risk":
      return (
        <svg {...props}>
          <path d="M12 3l9 16H3L12 3z" />
          <path d="M12 10v4M12 16h.01" />
        </svg>
      );
    case "finance":
      return (
        <svg {...props}>
          <path d="M12 3v18" />
          <path d="M7 8h10a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h10" />
        </svg>
      );
  }
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

function AccentLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
      style={{
        borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
        backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = ACCENT;
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.06)`;
        e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.25)`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </a>
  );
}

function DownloadCard({
  item,
  index,
}: {
  item: (typeof downloads)[number];
  index: number;
}) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 sm:p-8"
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
      />
      <span
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
          color: ACCENT,
        }}
      >
        <DocumentIcon />
      </span>
      <h3 className="relative z-10 mt-5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
        {item.title}
      </h3>
      <p className="relative z-10 mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
        {item.description}
      </p>
      <span
        className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(37,99,235,0.35)]"
        style={{
          borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
          backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
        }}
      >
        {item.actionLabel}
      </span>
    </motion.a>
  );
}

export default function FINA2201Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div
          className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${CYAN_RGB}, 0.04)` }}
        />
        <div className="ambient-grid absolute inset-0" />
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={
          motionReady ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }
        }
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
        <section className="px-6 pt-36 pb-16 lg:px-8 lg:pt-44 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate={motionReady ? "visible" : "hidden"}
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
                  FINA 2201
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
                Financial Management
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Studying corporate finance, valuation, capital budgeting,
                financial markets, and investment decision making through
                quantitative financial analysis.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-24 px-6 pb-32 lg:space-y-32 lg:px-8">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>About</SectionLabel>
            <SectionHeading>
              Financial decision-making in modern business.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                FINA 2201 introduced the financial principles used by businesses
                to evaluate investments, raise capital, manage risk, and maximize
                firm value.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                The course emphasized discounted cash flow valuation, time value
                of money, financial statement analysis, stock and bond valuation,
                cost of capital, and capital budgeting. Throughout the semester I
                developed stronger spreadsheet modeling skills while learning how
                financial managers evaluate investment opportunities and
                financing decisions.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Skills</SectionLabel>
              <SectionHeading>Core competencies from this course.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
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

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Featured Coursework</SectionLabel>
            <SectionHeading>Corporate finance in practice.</SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12 lg:p-14 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.32)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1"
                style={{
                  background: `linear-gradient(180deg, ${ACCENT_CYAN}, ${ACCENT})`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.14)` }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${CYAN_RGB}, 0.35)`,
                  backgroundColor: `rgba(${CYAN_RGB}, 0.1)`,
                  color: ACCENT_CYAN,
                }}
              >
                Course Toolkit
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                Corporate Finance Toolkit
              </h3>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                A collection of finance concepts, valuation methods, spreadsheet
                modeling techniques, and quantitative decision-making tools
                developed throughout the semester.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={SYLLABUS_PDF}>
                  View Syllabus
                </AccentLinkButton>
              </div>
            </motion.article>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Visual Story</SectionLabel>
            <SectionHeading>Major finance concepts from the semester.</SectionHeading>

            <motion.article
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-10 lg:p-12 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
              style={{ borderColor: `rgba(${ACCENT_RGB}, 0.2)` }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
              />
              <p className="relative max-w-3xl text-[17px] leading-[1.8] text-muted">
                FINA 2201 connected foundational theory with practical
                decision-making — from valuing cash flows across time to
                evaluating how firms finance operations, manage risk, and allocate
                capital across competing investment opportunities.
              </p>

              <div className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {financeConcepts.map((concept) => (
                  <div
                    key={concept.title}
                    className="glass flex flex-col items-center rounded-2xl px-4 py-6 text-center transition-colors duration-300 group-hover:bg-card-hover/50"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                        color: ACCENT_LIGHT,
                      }}
                    >
                      <ConceptIcon type={concept.icon} />
                    </span>
                    <p className="mt-4 text-[13px] font-medium leading-snug tracking-[-0.01em] text-foreground">
                      {concept.title}
                    </p>
                  </div>
                ))}
              </div>
            </motion.article>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Downloads</SectionLabel>
              <SectionHeading>Course files.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid max-w-md grid-cols-1 items-stretch gap-5">
              {downloads.map((item, i) => (
                <DownloadCard key={item.title} item={item} index={i + 1} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Learning Outcomes</SectionLabel>
              <SectionHeading>What this course taught me to do.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {learningOutcomes.map((outcome, i) => (
                <motion.div
                  key={outcome.title}
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
                    {outcome.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {outcome.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Reflection</SectionLabel>
            <SectionHeading>
              Building the financial foundation for business analysis.
            </SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${CYAN_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                FINA 2201 strengthened my understanding of how businesses make
                financial decisions using quantitative analysis. Learning valuation
                methods, discounted cash flow models, and capital budgeting
                frameworks gave me practical tools that directly connect finance
                with data analytics and business strategy.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The course also reinforced spreadsheet modeling, financial
                reasoning, and investment analysis—skills that complement my
                studies in business administration and data science while
                preparing me for future work in corporate finance, consulting,
                and analytics.
              </p>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-[13px] text-muted">
            © {COPYRIGHT_YEAR} Lokesh Addagiri. All rights reserved.
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
