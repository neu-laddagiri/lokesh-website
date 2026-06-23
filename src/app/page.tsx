"use client";

import {
  HeroConstructionTape,
  HeroDevelopmentLabel,
} from "@/components/hero-construction-tape";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Coursework", href: "#coursework" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
] as const;

const infoCards = [
  { label: "University", value: "Northeastern University" },
  {
    label: "Combined Major",
    value: "Data Science + Business Administration",
  },
  { label: "Study Abroad", value: "Greece" },
  { label: "Graduation Year", value: "2029" },
] as const;

const journeyTimeline = [
  { year: "2025", event: "Began at Northeastern University" },
  { year: "2026", event: "Studied Abroad in Greece" },
  { year: "2026", event: "Built First Analytics Portfolio Projects" },
  { year: "2027", event: "First Co-op Experience" },
  { year: "2029", event: "Graduation" },
] as const;

const courseworkHighlights = [
  "Statistics & Probability",
  "Data Structures & Algorithms",
  "Business Analytics",
  "Machine Learning Foundations",
  "Financial Accounting",
  "Marketing Strategy",
] as const;

const courseworkStats = [
  { label: "Courses Documented", value: "4+" },
  { label: "Projects Featured", value: "3+" },
  { label: "Reports & Presentations", value: "10+" },
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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

function CourseworkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M8.5 16.5c.6-1.5 2-2.5 3.5-2.5s2.9 1 3.5 2.5" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-medium tracking-[0.22em] text-muted uppercase">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
      {children}
    </h2>
  );
}

export default function Home() {
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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.55], [0, 60]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Global ambient layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
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
          <a
            href="#"
            className="text-sm font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
          >
            Lokesh Addagiri
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-muted transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
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
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-32 text-center"
        >
          {/* Animated hero gradient */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="animate-gradient-shift absolute top-[-20%] left-1/2 h-[70vh] w-[90vw] max-w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.18)_0%,transparent_70%)] blur-3xl"
            />
            <motion.div
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="animate-gradient-shift-alt absolute right-[-10%] bottom-[-10%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.12)_0%,transparent_70%)] blur-3xl"
            />
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
              className="animate-gradient-shift absolute top-[30%] left-[-15%] h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-fade" />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="relative z-10 mx-auto max-w-5xl"
          >
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-8 text-[13px] font-medium tracking-[0.25em] text-muted uppercase"
            >
              Personal Website
            </motion.p>

            <HeroDevelopmentLabel />

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[clamp(3.5rem,11vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-foreground"
            >
              Lokesh Addagiri
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 text-[clamp(1.25rem,3.5vw,2rem)] font-medium tracking-[-0.03em] text-foreground-secondary"
            >
              Data Science × Business Administration
            </motion.p>

            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-3 text-[clamp(1rem,2.5vw,1.375rem)] tracking-[-0.02em] text-muted"
            >
              Northeastern University
            </motion.p>

            <motion.p
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mx-auto mt-12 max-w-xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.7] text-muted"
            >
              Building at the intersection of data, business, and technology.
            </motion.p>

            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/coursework"
                className="inline-flex h-[52px] min-w-[180px] items-center justify-center gap-2 rounded-full bg-cta-bg px-10 text-[16px] font-medium tracking-[-0.02em] text-cta-text transition-all duration-300 hover:bg-white hover:shadow-[0_0_60px_rgba(255,255,255,0.18)]"
              >
                <CourseworkIcon />
                View Coursework
              </Link>
              {/* TODO: Re-enable when resume PDF is added at public/documents/resume.pdf */}
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Resume coming soon"
                className="glass inline-flex h-[52px] min-w-[180px] cursor-not-allowed items-center justify-center gap-2 rounded-full px-10 text-[16px] font-medium tracking-[-0.02em] text-foreground opacity-50 transition-all duration-300"
              >
                <ResumeIcon />
                View Resume
              </button>
            </motion.div>
          </motion.div>

          <HeroConstructionTape scrollYProgress={scrollYProgress} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 z-40 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[11px] tracking-[0.2em] text-muted uppercase">
                Scroll
              </span>
              <div className="h-10 w-px bg-gradient-to-b from-muted/60 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── About Me ── */}
        <section id="about" className="px-6 py-32 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
            >
              <SectionLabel>About Me</SectionLabel>
              <SectionTitle>
                Turning data into
                <br />
                <span className="text-muted">decisions that matter.</span>
              </SectionTitle>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.p
                custom={0}
                variants={fadeUp}
                className="text-[17px] leading-[1.75] text-foreground-secondary"
              >
                I&apos;m a student at Northeastern University pursuing a combined
                major in Data Science and Business Administration — a path built
                on the belief that the best insights come from understanding both
                the numbers and the people behind them.
              </motion.p>
              <motion.p
                custom={1}
                variants={fadeUp}
                className="text-[17px] leading-[1.75] text-muted"
              >
                From studying abroad in Greece to building analytics portfolio
                projects, I&apos;m constantly exploring how data, strategy, and
                technology intersect. I&apos;m driven by curiosity, precision,
                and the ambition to make an impact through co-op experiences and
                real-world problem solving.
              </motion.p>
              <motion.div custom={2} variants={fadeUp} className="pt-2">
                <a
                  href="#journey"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#2997ff] transition-colors hover:text-[#64b5ff]"
                >
                  See my journey
                  <ArrowIcon />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Info Cards ── */}
        <section className="px-6 pb-32 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {infoCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong group relative overflow-hidden rounded-3xl p-7 transition-shadow duration-500 hover:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                    {card.label}
                  </p>
                  <p className="mt-4 text-[17px] leading-snug font-semibold tracking-[-0.02em] text-foreground">
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── My Journey Timeline ── */}
        <section id="journey" className="py-32">
          <div className="px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
              className="mx-auto mb-16 max-w-6xl"
            >
              <SectionLabel>My Journey</SectionLabel>
              <SectionTitle>A path still unfolding.</SectionTitle>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                Key milestones from my academic and professional growth — from
                arriving at Northeastern to graduation and beyond.
              </p>
            </motion.div>
          </div>

          <div className="relative">
            {/* Edge fades */}
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-fade to-transparent sm:w-24" />
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-gradient-to-l from-surface-fade to-transparent sm:w-24" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="hide-scrollbar flex gap-5 overflow-x-auto px-6 pb-4 lg:gap-6 lg:px-8"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {journeyTimeline.map((item, i) => (
                <motion.div
                  key={`${item.year}-${item.event}`}
                  custom={i}
                  variants={slideInLeft}
                  className="glass-strong w-[min(85vw,320px)] shrink-0 rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-semibold tracking-[-0.04em] text-[#2997ff]">
                      {item.year}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <p className="mt-6 text-[17px] leading-[1.6] font-medium tracking-[-0.01em] text-foreground">
                    {item.event}
                  </p>
                </motion.div>
              ))}
              <div className="w-6 shrink-0 lg:w-8" aria-hidden />
            </motion.div>
          </div>
        </section>

        {/* ── Coursework ── */}
        <section id="coursework" className="px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
              className="glass-strong relative overflow-hidden rounded-[2rem] p-10 sm:p-14 lg:p-16"
            >
              <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#2997ff]/[0.08] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/[0.06] blur-3xl" />

              <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div>
                  <SectionLabel>Coursework</SectionLabel>
                  <SectionTitle>
                    Every course, project, report, and presentation documented.
                  </SectionTitle>
                  <p className="mt-6 text-[17px] leading-[1.75] text-muted">
                    A comprehensive academic archive spanning data science,
                    statistics, business, and international coursework —
                    including reports, presentations, dashboards, analyses, and
                    projects.
                  </p>
                  <Link
                    href="/coursework"
                    className="mt-10 inline-flex h-[52px] items-center justify-center rounded-full bg-[#2997ff] px-8 text-[15px] font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#0077ed] hover:shadow-[0_0_50px_rgba(41,151,255,0.35)]"
                  >
                    Browse Coursework
                  </Link>
                </div>

                <div className="flex flex-col gap-6">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={staggerContainer}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                  >
                    {courseworkStats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        custom={i}
                        variants={fadeUp}
                        className="glass rounded-2xl px-5 py-5 text-center transition-colors duration-300 hover:bg-card-hover"
                      >
                        <p className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-foreground">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-[11px] font-medium tracking-[0.1em] text-muted uppercase">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={staggerContainer}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {courseworkHighlights.map((course, i) => (
                      <motion.div
                        key={course}
                        custom={i}
                        variants={fadeIn}
                        className="glass flex items-center rounded-2xl px-5 py-4 transition-colors duration-300 hover:bg-card-hover"
                      >
                        <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2997ff]" />
                        <span className="text-[14px] font-medium tracking-[-0.01em] text-foreground-secondary">
                          {course}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Temporarily hidden — restore when portfolio projects are ready */}
        {false && (
        <section id="projects" className="px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
              className="mb-16 max-w-2xl"
            >
              <SectionLabel>Projects</SectionLabel>
              <SectionTitle>Work that speaks for itself.</SectionTitle>
              <p className="mt-5 text-[17px] leading-relaxed text-muted">
                Data-driven applications, analytics dashboards, and technical
                builds designed to solve real problems with clarity and impact.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {[
                {
                  title: "Analytics Portfolio",
                  description:
                    "End-to-end data projects showcasing statistical analysis, visualization, and storytelling with real datasets.",
                  tag: "Data Science",
                },
                {
                  title: "Business Intelligence Dashboards",
                  description:
                    "Interactive dashboards translating complex metrics into actionable insights for strategic decision-making.",
                  tag: "Analytics",
                },
              ].map((project, i) => (
                <motion.a
                  key={project.title}
                  href="#projects"
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.35 } }}
                  className="glass-strong group relative flex flex-col overflow-hidden rounded-3xl p-9 transition-all duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                >
                  <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#2997ff]/[0.08] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="inline-flex w-fit rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] text-muted uppercase">
                    {project.tag}
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[16px] leading-[1.7] text-muted">
                    {project.description}
                  </p>
                  <div className="mt-10 flex items-center gap-2 text-[14px] font-medium text-[#2997ff]">
                    <span>View project</span>
                    <ArrowIcon />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
        )}

        {/* ── Contact ── */}
        <section id="contact" className="px-6 py-32 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
            className="glass-strong mx-auto max-w-3xl rounded-[2rem] px-8 py-20 text-center sm:px-16"
          >
            <SectionLabel>Contact</SectionLabel>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.04em] text-foreground">
              Let&apos;s connect
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-muted">
              Open to collaborations, co-op opportunities, and conversations
              about data, analytics, and business.
            </p>
            <a
              href="mailto:lokesh.addagiri@northeastern.edu"
              className="mt-10 inline-flex h-[52px] items-center justify-center rounded-full bg-cta-bg px-10 text-[16px] font-medium tracking-[-0.02em] text-cta-text transition-all duration-300 hover:bg-white hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            >
              Get in Touch
            </a>
          </motion.div>
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
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <div id="resume" className="sr-only" aria-hidden />
    </div>
  );
}
