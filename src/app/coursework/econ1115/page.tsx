"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
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

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume },
  { label: "Contact", href: "/#contact" },
] as const;

/** Malaysia flag red & gold — page-local accent only */
const ACCENT = "#CC0001";
const ACCENT_LIGHT = "#E63946";
const GOLD = "#FFCC00";
const GOLD_LIGHT = "#FFD84D";
const NAVY = "#010066";
const ACCENT_GLOW = "rgba(204, 0, 1, 0.35)";
const ACCENT_RGB = "204, 0, 1";
const GOLD_RGB = "255, 204, 0";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const POSTER_PDF = "/documents/econ1115-malaysia-analysis-poster.pdf";
const INSTRUCTIONS_PDF = "/documents/econ1115-project-instructions.pdf";
const SYLLABUS_PDF = "/documents/econ1115-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Macroeconomics",
  "Economic Growth",
  "IMF Data",
  "International Finance",
  "Policy Analysis",
] as const;

const skills = [
  "Macroeconomic Analysis",
  "Economic Growth",
  "Fiscal Policy",
  "Monetary Policy",
  "International Trade",
  "Investment Analysis",
  "Current Account Analysis",
  "Capital Flows",
  "IMF Data",
  "Economic Visualization",
  "Policy Evaluation",
  "Research Communication",
] as const;

const visualStoryItems = [
  {
    title: "Malaysia Analysis Poster",
    src: POSTER_PDF,
    alt: "First page of the Malaysia macroeconomic analysis poster",
    caption:
      "Research poster summarizing savings, investment, and net capital flows in Malaysia (2000–2026).",
    actionLabel: "Open Poster",
  },
  {
    title: "Project Instructions",
    src: INSTRUCTIONS_PDF,
    alt: "First page of the Malaysia macroeconomics project instructions",
    caption:
      "Capstone assignment guidelines, IMF data requirements, and deliverable specifications.",
    actionLabel: "Open Instructions",
  },
  {
    title: "Course Syllabus",
    src: SYLLABUS_PDF,
    alt: "First page of the ECON 1115 course syllabus",
    caption:
      "Principles of Macroeconomics syllabus — topics, grading, and course expectations.",
    actionLabel: "Open Syllabus",
  },
] as const;

const downloads = [
  {
    title: "Malaysia Analysis Poster",
    description:
      "Full research poster on Malaysia's savings, investment, and net capital flows using IMF WEO data.",
    href: POSTER_PDF,
    actionLabel: "Open PDF",
  },
  {
    title: "Project Instructions",
    description:
      "Complete project brief, data sources, and analytical requirements for the capstone.",
    href: INSTRUCTIONS_PDF,
    actionLabel: "Open PDF",
  },
  {
    title: "Course Syllabus",
    description:
      "ECON 1115 syllabus covering macroeconomic theory, policy, and assessment structure.",
    href: SYLLABUS_PDF,
    actionLabel: "Open PDF",
  },
] as const;

const learningOutcomes = [
  {
    title: "GDP Analysis",
    description:
      "Measuring and interpreting national output, growth rates, and living standards over time.",
  },
  {
    title: "Inflation Analysis",
    description:
      "Understanding price-level dynamics and their impact on households and policy.",
  },
  {
    title: "Monetary Policy",
    description:
      "Evaluating how central banks influence interest rates, money supply, and credit conditions.",
  },
  {
    title: "Fiscal Policy",
    description:
      "Analyzing government spending, taxation, and deficits as macroeconomic stabilizers.",
  },
  {
    title: "International Trade",
    description:
      "Explaining comparative advantage, trade balances, and global market integration.",
  },
  {
    title: "Current Account Analysis",
    description:
      "Tracking net exports, income flows, and transfers in open-economy accounting.",
  },
  {
    title: "Saving & Investment",
    description:
      "Connecting domestic saving to capital formation and long-run growth capacity.",
  },
  {
    title: "IMF Data",
    description:
      "Working with World Economic Outlook datasets for cross-country macro research.",
  },
  {
    title: "Economic Indicators",
    description:
      "Reading and comparing standard metrics used by policymakers and institutions.",
  },
  {
    title: "Economic Forecasting",
    description:
      "Interpreting projections and understanding limits of forward-looking macro models.",
  },
  {
    title: "Policy Evaluation",
    description:
      "Assessing whether fiscal and monetary responses achieve stated economic objectives.",
  },
  {
    title: "Research Communication",
    description:
      "Presenting macroeconomic findings clearly through posters and written analysis.",
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

function PdfEmbedPreview({
  src,
  title,
  heightClass = "h-[min(52vw,420px)]",
}: {
  src: string;
  title: string;
  heightClass?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0a0a0a] ${heightClass}`}
    >
      <iframe src={src} title={title} className="h-full w-full" />
    </div>
  );
}

function PdfPreviewCard({
  item,
  index,
}: {
  item: (typeof visualStoryItems)[number];
  index: number;
}) {
  return (
    <motion.a
      href={item.src}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      className="glass-strong group relative block h-full overflow-hidden rounded-3xl transition-all duration-500"
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="border-b border-white/[0.08] px-5 py-4">
        <p className="text-[14px] font-medium tracking-[-0.01em] text-foreground">
          {item.title}
        </p>
      </div>
      <PdfEmbedPreview src={item.src} title={item.alt} />
      <div className="p-5 sm:p-6">
        <p className="text-[14px] leading-relaxed text-muted">{item.caption}</p>
        <p
          className="mt-3 text-[12px] font-medium tracking-wide uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: ACCENT }}
        >
          {item.actionLabel}
        </p>
      </div>
    </motion.a>
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
        className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#CC0001] group-hover:bg-[#CC0001] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(204,0,1,0.35)]"
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

function AccentLinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "gold";
}) {
  const isGold = variant === "gold";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
      style={{
        borderColor: isGold
          ? `rgba(${GOLD_RGB}, 0.35)`
          : `rgba(${ACCENT_RGB}, 0.25)`,
        backgroundColor: isGold
          ? `rgba(${GOLD_RGB}, 0.08)`
          : `rgba(${ACCENT_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        if (isGold) {
          e.currentTarget.style.backgroundColor = GOLD;
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.color = NAVY;
          e.currentTarget.style.boxShadow = `0 0 40px rgba(${GOLD_RGB}, 0.35)`;
        } else {
          e.currentTarget.style.backgroundColor = ACCENT;
          e.currentTarget.style.borderColor = ACCENT;
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "";
        e.currentTarget.style.boxShadow = "none";
        if (isGold) {
          e.currentTarget.style.backgroundColor = `rgba(${GOLD_RGB}, 0.08)`;
          e.currentTarget.style.borderColor = `rgba(${GOLD_RGB}, 0.35)`;
        } else {
          e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.06)`;
          e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.25)`;
        }
      }}
    >
      {children}
    </a>
  );
}

export default function ECON1115Page() {
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
          style={{ backgroundColor: `rgba(${GOLD_RGB}, 0.04)` }}
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
                  ECON 1115
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
                Principles of Macroeconomics
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Studying economic growth, inflation, unemployment, fiscal policy,
                monetary policy, international trade, and global capital flows
                through real-world macroeconomic analysis.
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
              Macroeconomics at the national and global scale.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                ECON 1115 explored how entire economies function — from GDP and
                inflation to unemployment, fiscal policy, monetary policy, and
                long-run economic growth. The course extended into open-economy
                macroeconomics, covering international trade, saving and
                investment, and capital flows across borders.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                The semester culminated in an international macroeconomic
                research project analyzing Malaysia&apos;s economy using IMF
                World Economic Outlook data from 2000–2026 — examining how
                domestic saving finances investment, how policy responded to
                global crises, and how net capital flows shape long-run growth
                trajectories.
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
            <SectionLabel>Featured Project</SectionLabel>
            <SectionHeading>
              Malaysia: savings, investment &amp; capital flows.
            </SectionHeading>

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
                  background: `linear-gradient(180deg, ${GOLD}, ${ACCENT}, ${NAVY})`,
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
                  borderColor: `rgba(${GOLD_RGB}, 0.35)`,
                  backgroundColor: `rgba(${GOLD_RGB}, 0.1)`,
                  color: GOLD_LIGHT,
                }}
              >
                IMF World Economic Outlook
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                Malaysia: Savings, Investment &amp; Net Capital Flows (2000–2026)
              </h3>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                Analyze Malaysia&apos;s long-run economic performance using IMF
                World Economic Outlook data by examining GDP per capita, national
                savings, investment, current account balances, and government
                fiscal policy. Evaluate how domestic saving finances investment,
                how policy responds to global crises, and how international
                capital flows influence long-run economic growth.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={POSTER_PDF}>
                  View Poster
                </AccentLinkButton>
                <AccentLinkButton href={INSTRUCTIONS_PDF} variant="gold">
                  Project Instructions
                </AccentLinkButton>
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
              <SectionLabel>Visual Story</SectionLabel>
              <SectionHeading>Research deliverables at a glance.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
              {visualStoryItems.map((item, i) => (
                <PdfPreviewCard key={item.src} item={item} index={i + 1} />
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
              <SectionLabel>Downloads</SectionLabel>
              <SectionHeading>Course files and deliverables.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
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
              From theory to international economic data.
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
                style={{ backgroundColor: `rgba(${GOLD_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                ECON 1115 strengthened my understanding of national economic
                growth, international capital flows, and the institutions that
                shape global performance. Working with IMF datasets, evaluating
                fiscal and monetary policy responses, and studying open-economy
                macroeconomics gave me a framework for reading economic news
                with far more precision than before.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The Malaysia project provided practical experience using
                real-world international economic data to evaluate investment,
                savings, and policy decisions — not simply learning
                macroeconomic theory in the abstract. That combination of
                institutional data literacy and policy analysis is exactly what
                professional economics and finance environments demand.
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
