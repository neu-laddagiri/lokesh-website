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

/** Northeastern red — page-local accent only */
const ACCENT = "#C8102E";
const ACCENT_LIGHT = "#E8324A";
const ACCENT_GLOW = "rgba(200, 16, 46, 0.35)";
const ACCENT_RGB = "200, 16, 46";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/engw1111-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Professional Writing",
  "Storytelling",
  "Rhetorical Analysis",
  "Research",
  "Communication",
] as const;

const skills = [
  "Professional Writing",
  "Storytelling",
  "Rhetorical Analysis",
  "Audience Awareness",
  "Research Writing",
  "Revision",
  "Critical Reading",
  "Persuasive Writing",
  "Genre Analysis",
  "Source Integration",
  "Professional Communication",
  "Editing & Proofreading",
] as const;

const writingToolkit = [
  {
    title: "Planning",
    points: [
      "Brainstorming ideas",
      "Audience analysis",
      "Organizing arguments",
    ],
  },
  {
    title: "Drafting",
    points: [
      "Narrative structure",
      "Persuasive writing",
      "Thesis development",
    ],
  },
  {
    title: "Revision",
    points: [
      "Signposting",
      "Sentence variety",
      "Clarity",
      "Strong transitions",
    ],
  },
  {
    title: "Editing",
    points: [
      "Active vs passive voice",
      "Grammar",
      "Conciseness",
      "Professional tone",
    ],
  },
] as const;

const writingPrinciples = [
  {
    title: "Clear Communication",
    description:
      "Write clearly and efficiently without unnecessary complexity.",
  },
  {
    title: "Audience Awareness",
    description:
      "Adapt writing style for different readers and purposes.",
  },
  {
    title: "Storytelling",
    description: "Use narrative to communicate ideas effectively.",
  },
  {
    title: "Persuasion",
    description:
      "Apply rhetorical strategies to strengthen arguments.",
  },
  {
    title: "Research",
    description: "Locate and integrate credible academic sources.",
  },
  {
    title: "Revision",
    description:
      "Improve organization and clarity through iterative editing.",
  },
  {
    title: "Critical Reading",
    description: "Analyze author intent and rhetorical choices.",
  },
  {
    title: "Organization",
    description:
      "Structure ideas logically from introduction to conclusion.",
  },
  {
    title: "Professional Tone",
    description:
      "Communicate appropriately in academic and workplace settings.",
  },
  {
    title: "Grammar",
    description: "Strengthen clarity through careful editing.",
  },
  {
    title: "Collaboration",
    description: "Provide and incorporate constructive peer feedback.",
  },
  {
    title: "Confidence",
    description:
      "Present ideas effectively in both written and spoken communication.",
  },
] as const;

const downloads = [
  {
    title: "ENGW 1111 Syllabus",
    description:
      "First-Year Writing syllabus covering course objectives, assignments, and assessment expectations.",
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
        className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#C8102E] group-hover:bg-[#C8102E] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(200,16,46,0.35)]"
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

export default function ENGW1111Page() {
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
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.04)` }}
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
                  ENGW 1111
                </span>
                <span className="hidden text-muted/50 sm:inline" aria-hidden>
                  •
                </span>
                <SyllabusHeaderButton
                  href={SYLLABUS_PDF}
                  accent={courseAccent}
                />
              </motion.div>

              <motion.span
                custom={2}
                variants={fadeUp}
                className="mt-4 inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                  color: ACCENT_LIGHT,
                }}
              >
                Writing &amp; Communication
              </motion.span>

              <motion.h1
                custom={3}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                First-Year Writing
              </motion.h1>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Developing professional communication through storytelling,
                rhetoric, research, and audience-focused writing.
              </motion.p>

              <motion.div
                custom={5}
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
            <SectionHeading>Writing beyond the classroom.</SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                ENGW 1111 introduced writing as a process of communication rather
                than simply producing essays. Throughout the semester I developed
                skills in rhetorical analysis, audience awareness, storytelling,
                revision, and research-based writing while learning how effective
                communication changes depending on purpose and audience.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Rather than focusing only on grammar, the course emphasized
                organizing ideas, constructing persuasive arguments, integrating
                evidence, and revising drafts through multiple iterations. These
                communication principles have since influenced every technical
                report, project presentation, and portfolio page I&apos;ve
                created.
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
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Writing Toolkit</SectionLabel>
              <SectionHeading>Building better communication.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
              {writingToolkit.map((card, i) => (
                <motion.article
                  key={card.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass-strong group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-shadow duration-500 sm:p-9 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                  style={{ borderColor: `rgba(${ACCENT_RGB}, 0.18)` }}
                >
                  <div
                    className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
                  />
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {card.title}
                  </h3>
                  <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-6">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 text-[14px] text-foreground-secondary"
                      >
                        <span
                          className="h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.article>
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
              <SectionLabel>Writing Principles</SectionLabel>
              <SectionHeading>What this course taught me to do.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {writingPrinciples.map((principle, i) => (
                <motion.div
                  key={principle.title}
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
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {principle.description}
                  </p>
                </motion.div>
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
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Reflection</SectionLabel>
            <SectionHeading>Communication as a technical skill.</SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                ENGW 1111 reshaped how I think about communication. Rather than
                viewing writing as simply producing essays, I learned that
                effective communication is one of the most valuable technical
                skills across every discipline. Whether presenting data analyses,
                documenting software projects, writing reports, or building this
                portfolio website, the ability to organize ideas, understand
                audiences, and communicate clearly has become one of the most
                transferable skills I have developed at Northeastern.
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
