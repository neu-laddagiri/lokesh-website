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
import { useState } from "react";
import { courseColors } from "@/lib/course-colors";
import { useMounted } from "@/lib/use-mounted";

/** Deep emerald / teal: page-local only */
const ACCENT = courseColors.cs1800.accent;
const ACCENT_LIGHT = courseColors.cs1800.light;
const ACCENT_GLOW = "rgba(23, 163, 152, 0.35)";
const ACCENT_RGB = courseColors.cs1800.rgb;

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/cs1800-syllabus.pdf";
const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Khoury College",
  "Mathematics",
  "Computer Science",
  "Proofs",
  "Graph Theory",
] as const;

const skills = [
  "Mathematical Logic",
  "Proof Writing",
  "Predicate Logic",
  "Set Theory",
  "Counting",
  "Combinatorics",
  "Probability",
  "Mathematical Induction",
  "Graph Theory",
  "Big-O Analysis",
  "Problem Solving",
  "Analytical Thinking",
] as const;

const courseTopics = [
  {
    title: "Logic & Proofs",
    badge: "Foundations",
    description:
      "Propositional logic, truth tables, logical equivalence, and predicate logic formed the language of rigorous reasoning. I learned to construct direct proofs, proofs by contradiction and contraposition, and arguments grounded in formal structure rather than intuition alone.",
    points: [
      "Propositional & predicate logic",
      "Logical equivalence",
      "Direct proof & contradiction",
      "Contraposition",
      "Mathematical induction",
    ],
  },
  {
    title: "Discrete Mathematics",
    badge: "Structures",
    description:
      "Sets, combinatorics, and probability provided the counting tools behind algorithm analysis. From the product and sum rules to permutations, combinations, and conditional probability, this block built fluency in quantifying discrete possibilities.",
    points: [
      "Sets & set operations",
      "Product & sum rules",
      "Permutations & combinations",
      "Pigeonhole principle",
      "Probability & expected value",
    ],
  },
  {
    title: "Graph Theory & Algorithms",
    badge: "Connections",
    description:
      "Graphs modeled relationships between entities: vertices, edges, trees, traversals, and connectivity. Asymptotic analysis tied these structures to efficiency, asking how algorithms scale as inputs grow.",
    points: [
      "Graph definitions & structure",
      "Trees & traversals",
      "Connectivity",
      "Graph proofs",
      "Asymptotic time complexity",
    ],
  },
] as const;

const timelineSteps = [
  "Logic",
  "Sets",
  "Counting",
  "Probability",
  "Induction",
  "Graph Theory",
  "Asymptotic Analysis",
] as const;

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
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
      <p className="text-[12px] font-medium tracking-[0.2em] text-muted uppercase">
        {children}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-[clamp(1.375rem,3vw,1.875rem)] font-semibold tracking-[-0.03em] text-foreground">
      {children}
    </h2>
  );
}

function GraphMesh() {
  const nodes = [
    { cx: 120, cy: 80 },
    { cx: 280, cy: 60 },
    { cx: 440, cy: 100 },
    { cx: 600, cy: 70 },
    { cx: 180, cy: 200 },
    { cx: 360, cy: 180 },
    { cx: 520, cy: 220 },
    { cx: 700, cy: 190 },
    { cx: 240, cy: 320 },
    { cx: 480, cy: 340 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 5],
    [5, 6],
    [6, 7],
    [4, 8],
    [6, 9],
    [8, 9],
    [5, 8],
  ];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 820 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={`rgba(${ACCENT_RGB}, 0.12)`}
          strokeWidth="1"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="4"
          fill={`rgba(${ACCENT_RGB}, 0.18)`}
          stroke={`rgba(${ACCENT_RGB}, 0.35)`}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function AmbientParticles() {
  const particles = [
    { top: "18%", left: "12%", delay: 0 },
    { top: "42%", left: "86%", delay: 1.4 },
    { top: "68%", left: "8%", delay: 2.1 },
    { top: "78%", left: "72%", delay: 0.7 },
  ] as const;

  return (
    <>
      {particles.map((particle, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
            backgroundColor: ACCENT,
            boxShadow: `0 0 8px rgba(${ACCENT_RGB}, 0.4)`,
          }}
          animate={{ opacity: [0.1, 0.35, 0.1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function CS1800Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const motionReady = useMounted();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          animate={{ opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.07)` }}
        />
        <div className="absolute inset-0 opacity-60">
          <GraphMesh />
        </div>
        <AmbientParticles />
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
        <section className="px-6 pt-28 pb-10 lg:px-8 lg:pt-32 lg:pb-12">
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
                  CS 1800
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
                Discrete Structures
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Building the mathematical foundations behind computer science,
                algorithms, proofs, graph theory, probability, and logical
                reasoning.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-6 flex flex-wrap gap-3"
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

        <div className="mx-auto max-w-6xl space-y-12 px-6 pb-16 lg:space-y-14 lg:px-8">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>About</SectionLabel>
            <SectionHeading>
              The mathematical backbone of computer science.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-2xl p-6 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                CS 1800 introduces the abstract discrete structures that underpin
                computing. Per the Fall 2025 syllabus, the course begins with
                mathematical notation, logic, and sets, then progresses through
                proof techniques, combinatorics, probability, mathematical
                induction, graph theory, and asymptotic notation, building
                familiarity with structures used throughout computer science.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Topics including logic, predicate logic, sets, proof techniques,
                induction, counting, probability, graph theory, and asymptotic
                analysis appear far beyond the classroom. They shape how
                software engineers reason about correctness, how data scientists
                model uncertainty, and how algorithms are evaluated for
                efficiency at scale. This course established the rigorous
                vocabulary I still use when approaching technical problems.
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

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
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
              <SectionLabel>Course Topics</SectionLabel>
              <SectionHeading>
                Three pillars of discrete structures.
              </SectionHeading>
            </motion.div>

            <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courseTopics.map((topic, i) => (
                <motion.article
                  key={topic.title}
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
                  <span
                    className="inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.1em] uppercase"
                    style={{
                      borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.08)`,
                      color: ACCENT_LIGHT,
                    }}
                  >
                    {topic.badge}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {topic.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[15px] leading-[1.75] text-muted">
                    {topic.description}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-6">
                    {topic.points.map((point) => (
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
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Course Structure</SectionLabel>
            <SectionHeading>How the semester progressed.</SectionHeading>

            <div className="glass-strong mt-8 rounded-3xl p-6 sm:p-8">
              <p className="mb-6 max-w-2xl text-[15px] leading-[1.7] text-muted">
                Following the syllabus topic sequence, CS 1800 moved from formal
                logic through sets and counting, into probability and induction,
                and concluded with graph theory and asymptotic analysis.
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5">
                {timelineSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className="glass rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium tracking-[-0.01em] text-foreground"
                      style={{ borderColor: `rgba(${ACCENT_RGB}, 0.2)` }}
                    >
                      {step}
                    </span>
                    {i < timelineSteps.length - 1 && (
                      <span
                        className="text-[12px]"
                        style={{ color: ACCENT_LIGHT }}
                        aria-hidden
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Documents</SectionLabel>
            <SectionHeading>Course files.</SectionHeading>

            <div className="mt-6 flex justify-center">
              <motion.a
                href={SYLLABUS_PDF}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="glass-strong group relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 sm:p-8 hover:shadow-[0_24px_60px_rgba(23, 163, 152,0.18)]"
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
                  CS 1800 Syllabus
                </h3>
                <p className="relative z-10 mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
                  Fall 2025 Khoury syllabus covering course objectives, topic
                  sequence, evaluation structure, and CS 1802 recitation details.
                </p>
                <span
                  className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#17A398] group-hover:bg-[#17A398] group-hover:text-[#0a0f0e] group-hover:shadow-[0_0_40px_rgba(23, 163, 152,0.35)]"
                  style={{
                    borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
                  }}
                >
                  Open PDF
                </span>
              </motion.a>
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
              Proofs before code.
            </SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-6 sm:p-8"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.28)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.08)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.07)` }}
              />
              <p className="relative text-[15px] leading-[1.7] text-foreground-secondary">
                CS 1800 fundamentally changed how I approach technical problems.
                Before this course, I could follow instructions and write code,
                but I had not yet learned to think rigorously about whether a
                solution was actually correct. Discrete Structures pushed me to
                slow down, define terms precisely, and prove claims instead of
                relying on intuition alone.
              </p>
              <p className="relative mt-5 text-[15px] leading-[1.7] text-muted">
                That shift matters for everything that comes next:{" "}
                <span className="font-medium text-foreground">CS 2500</span>,{" "}
                <span className="font-medium text-foreground">Algorithms</span>,{" "}
                <span className="font-medium text-foreground">
                  Data Structures
                </span>
                ,{" "}
                <span className="font-medium text-foreground">
                  Machine Learning
                </span>
                ,{" "}
                <span className="font-medium text-foreground">
                  Software Engineering
                </span>
                , and{" "}
                <span className="font-medium text-foreground">
                  Data Science
                </span>
                . Understanding why an algorithm works, not just how to
                implement it, is the difference between writing code and
                reasoning like a computer scientist. That foundation started
                here.
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
