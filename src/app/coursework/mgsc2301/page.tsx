"use client";

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

const skills = [
  "Regression Analysis",
  "ANOVA",
  "Hypothesis Testing",
  "SPSS",
  "Statistical Inference",
] as const;

const artifacts = [
  { label: "Final Report", icon: "document" },
  { label: "Presentation", icon: "slides" },
  { label: "SPSS Outputs", icon: "data" },
] as const;

const takeaways = [
  {
    title: "Data tells a story — statistics proves it",
    description:
      "Learned to move beyond intuition and support business decisions with rigorous, evidence-based analysis.",
  },
  {
    title: "Models are only as good as their assumptions",
    description:
      "Understanding when regression and inference methods apply — and when they don't — is critical to valid conclusions.",
  },
  {
    title: "Tools amplify thinking, not replace it",
    description:
      "SPSS streamlined computation, but interpreting output and communicating findings remained the core skill.",
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

function SunMoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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

function SlidesIcon() {
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
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function DataIcon() {
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
      <path d="M3 3v18h18" />
      <path d="M7 16l4-6 4 3 5-7" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-medium tracking-[0.22em] text-[#86868b] uppercase">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
      {children}
    </h2>
  );
}

function artifactIcon(type: string) {
  switch (type) {
    case "document":
      return <DocumentIcon />;
    case "slides":
      return <SlidesIcon />;
    case "data":
      return <DataIcon />;
    default:
      return <DocumentIcon />;
  }
}

export default function MGSC2301Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-[#f5f5f7]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#2997ff]/[0.06] blur-[120px]" />
        <div className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[-0.02em] text-[#f5f5f7] transition-opacity hover:opacity-70"
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
                    ? "text-[#f5f5f7]"
                    : "text-[#86868b] hover:text-[#f5f5f7]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle dark/light mode"
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-[#86868b] transition-all duration-200 hover:text-[#f5f5f7]"
            >
              <SunMoonIcon />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              className="glass flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
            >
              <span className="block h-[1.5px] w-4 bg-[#86868b]" />
              <span className="block h-[1.5px] w-4 bg-[#86868b]" />
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
                  className="group mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#86868b] transition-colors hover:text-[#f5f5f7]"
                >
                  <BackIcon />
                  Back to Coursework
                </Link>
              </motion.div>

              <motion.p
                custom={1}
                variants={fadeUp}
                className="text-[13px] font-medium tracking-[0.22em] text-[#2997ff] uppercase"
              >
                MGSC 2301
              </motion.p>

              <motion.h1
                custom={2}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-[#f5f5f7]"
              >
                Business Statistics
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-[#86868b]"
              >
                Understanding data through statistical analysis, hypothesis
                testing, and predictive modeling.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-24 px-6 pb-32 lg:space-y-32 lg:px-8">
          {/* Course Overview */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Course Overview</SectionLabel>
            <SectionHeading>Foundations of data-driven decision making.</SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-[#d2d2d7]">
                MGSC 2301 introduced the statistical methods that underpin modern
                business analytics — from descriptive summaries and probability
                distributions to inferential techniques used in real-world
                decision-making. The course emphasized both conceptual
                understanding and hands-on application through SPSS.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-[#86868b]">
                Across lectures, labs, and a capstone regression project, I
                developed the ability to formulate hypotheses, select appropriate
                tests, interpret results with confidence, and communicate
                findings clearly to non-technical audiences.
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

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass flex items-center gap-4 rounded-2xl px-6 py-5 transition-colors duration-300 hover:bg-white/[0.07]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2997ff]/10 text-[#2997ff]">
                    <span className="h-2 w-2 rounded-full bg-[#2997ff]" />
                  </span>
                  <span className="text-[15px] font-medium tracking-[-0.01em] text-[#f5f5f7]">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Projects */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Projects</SectionLabel>
            <SectionHeading>Applied statistical analysis in practice.</SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#2997ff]/[0.08] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <span className="inline-flex rounded-full border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] text-[#86868b] uppercase">
                Capstone Project
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                Sports Analytics Regression Project
              </h3>

              <p className="mt-4 max-w-2xl text-[17px] leading-[1.75] text-[#86868b]">
                Applied regression analysis to evaluate relationships between
                sports performance metrics and outcomes. Built and interpreted
                multiple regression models, assessed model fit and significance,
                and presented actionable insights backed by statistical evidence.
              </p>
            </motion.article>
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

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {artifacts.map((artifact, i) => (
                <motion.button
                  key={artifact.label}
                  type="button"
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass-strong group flex flex-col items-center gap-4 rounded-3xl px-6 py-8 transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2997ff]/10 text-[#2997ff] transition-colors duration-300 group-hover:bg-[#2997ff]/20">
                    {artifactIcon(artifact.icon)}
                  </span>
                  <span className="text-[15px] font-medium tracking-[-0.01em] text-[#f5f5f7]">
                    {artifact.label}
                  </span>
                </motion.button>
              ))}
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
              <SectionHeading>What I carried forward from this course.</SectionHeading>
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
                  <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#2997ff]/10 text-sm font-semibold text-[#2997ff]">
                    {i + 1}
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[#f5f5f7]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[#86868b]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-[13px] text-[#86868b]">
            © {new Date().getFullYear()} Lokesh Addagiri. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] text-[#86868b] transition-colors hover:text-[#f5f5f7]"
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
