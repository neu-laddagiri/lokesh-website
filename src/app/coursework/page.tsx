"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  academicSemesters,
  archiveStats,
  navFilters,
  upcomingCourses,
  type CourseEntry,
  type Semester,
  type UpcomingCourse,
} from "@/lib/coursework-archive";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume },
  { label: "Contact", href: "/#contact" },
] as const;

const ACCENT = "#2997ff";
const ACCENT_RGB = "41, 151, 255";

const COPYRIGHT_YEAR = 2026;

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.06, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const viewport = { once: true, margin: "-80px" as const };

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
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
      className="transition-transform duration-500 group-hover/btn:translate-x-0.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
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
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="py-6" aria-hidden>
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${ACCENT_RGB}, 0.18), transparent)`,
        }}
      />
    </div>
  );
}

function ArchiveNav({ activeId }: { activeId: string }) {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
      className="glass-strong -mx-1 flex gap-2 overflow-x-auto rounded-2xl p-2 scrollbar-none"
      aria-label="Coursework sections"
    >
      {navFilters.map((filter) => {
        const isActive = activeId === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => scrollTo(filter.id)}
            className="shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-all duration-500"
            style={
              isActive
                ? {
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.14)`,
                    color: ACCENT,
                    boxShadow: `0 0 24px rgba(${ACCENT_RGB}, 0.12)`,
                  }
                : { color: "var(--muted)" }
            }
          >
            {filter.label}
          </button>
        );
      })}
    </motion.nav>
  );
}

function CourseCard({
  course,
  index,
}: {
  course: CourseEntry;
  index: number;
}) {
  const rgb = hexToRgb(course.accent);

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: EASE } }}
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-6 transition-all duration-500 sm:p-7"
      style={{
        borderColor: `rgba(${rgb}, 0.14)`,
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.38)`;
        e.currentTarget.style.boxShadow = `0 28px 72px rgba(0,0,0,0.45), 0 0 48px rgba(${rgb}, 0.14)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.14)`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${course.accent}, transparent)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ backgroundColor: `rgba(${rgb}, 0.12)` }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="h-10 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: course.accent }}
          aria-hidden
        />
        <div className="flex flex-wrap justify-end gap-2">
          {course.institution && (
            <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-foreground-secondary">
              {course.institution}
            </span>
          )}
          {course.institutionBadge && (
            <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-foreground-secondary">
              {course.institutionBadge}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase"
            style={{
              borderColor: `rgba(${rgb}, 0.25)`,
              backgroundColor: `rgba(${rgb}, 0.08)`,
              color: course.accent,
            }}
          >
            <CheckIcon />
            Completed
          </span>
        </div>
      </div>

      <p
        className="mt-5 text-[12px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: course.accent }}
      >
        {course.code}
      </p>

      <h3 className="mt-2 text-[clamp(1.35rem,2.5vw,1.65rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
        {course.title}
      </h3>

      {course.transferNote && (
        <p className="mt-1.5 text-[12px] font-medium tracking-[-0.01em] text-muted">
          {course.transferNote}
        </p>
      )}

      {course.subtitle && (
        <p className="mt-2 text-[13px] leading-[1.6] text-muted italic">
          {course.subtitle}
        </p>
      )}

      <p className="mt-4 flex-1 text-[14px] leading-[1.7] text-muted">
        {course.description}
      </p>

      {course.courseComponents && course.courseComponents.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
            Course Components
          </p>
          <ul className="mt-2 space-y-1.5">
            {course.courseComponents.map((component) => (
              <li
                key={component}
                className="flex items-center gap-2 text-[12px] text-foreground-secondary"
              >
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: course.accent }}
                />
                {component}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {course.skills.map((skill, i) => (
          <span
            key={skill}
            className="rounded-full border px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-foreground-secondary transition-all duration-500 group-hover:translate-y-[-1px]"
            style={{
              borderColor: `rgba(${rgb}, 0.15)`,
              backgroundColor: `rgba(${rgb}, 0.05)`,
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      <Link
        href={course.href}
        className="group/btn mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-500 hover:text-white"
        style={{
          borderColor: `rgba(${rgb}, 0.22)`,
          backgroundColor: `rgba(${rgb}, 0.05)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = course.accent;
          e.currentTarget.style.borderColor = course.accent;
          e.currentTarget.style.boxShadow = `0 0 36px rgba(${rgb}, 0.3)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `rgba(${rgb}, 0.05)`;
          e.currentTarget.style.borderColor = `rgba(${rgb}, 0.22)`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        View Course
        <ArrowIcon />
      </Link>
    </motion.article>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  const isGpa = label === "Current GPA";

  return (
    <div className="glass-strong rounded-2xl px-4 py-5 text-center transition-all duration-500 hover:shadow-[0_16px_48px_rgba(41,151,255,0.1)] sm:px-5">
      <p
        className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.04em]"
        style={{ color: ACCENT }}
      >
        {isGpa ? (
          <>
            3.8
            <span className="text-[0.72em] font-medium text-muted/70">~</span>
          </>
        ) : (
          value
        )}
      </p>
      <p className="mt-1.5 text-[10px] font-medium tracking-[0.08em] text-muted uppercase sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

function UpcomingCourseCard({
  course,
  index,
}: {
  course: UpcomingCourse;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const previewFocus = course.focus.slice(0, 4);

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      layout
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-2xl border px-4 py-4 transition-all duration-500"
      style={{
        borderColor: open
          ? `rgba(${ACCENT_RGB}, 0.38)`
          : `rgba(${ACCENT_RGB}, 0.2)`,
        boxShadow: open
          ? `0 0 32px rgba(${ACCENT_RGB}, 0.14)`
          : `0 0 20px rgba(${ACCENT_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        if (!open) {
          e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.32)`;
          e.currentTarget.style.boxShadow = `0 0 28px rgba(${ACCENT_RGB}, 0.12)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!open) {
          e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.2)`;
          e.currentTarget.style.boxShadow = `0 0 20px rgba(${ACCENT_RGB}, 0.06)`;
        }
      }}
    >
      <span
        className="inline-flex w-fit rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase"
        style={{
          borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
          backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
          color: ACCENT,
        }}
      >
        Coming Fall 2026
      </span>

      <p
        className="mt-3 text-[11px] font-semibold tracking-[0.12em] uppercase"
        style={{ color: ACCENT }}
      >
        {course.code}
      </p>

      <h3 className="mt-1.5 line-clamp-3 text-[13px] font-semibold leading-[1.35] tracking-[-0.02em] text-foreground">
        {course.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {previewFocus.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-foreground-secondary"
          >
            {item}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-auto flex w-full items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[11px] font-medium text-muted transition-colors group-hover:text-foreground-secondary">
          {open ? "Hide details" : "View details"}
        </span>
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-[12px] leading-[1.65] text-muted">
              {course.description}
            </p>
            <ul className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
              {course.focus.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[11px] text-foreground-secondary"
                >
                  <span
                    className="h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function SemesterSection({
  semester,
  index,
  alternateBg,
}: {
  semester: Semester;
  index: number;
  alternateBg?: boolean;
}) {
  return (
    <motion.section
      id={semester.id}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
      className={`scroll-mt-32 rounded-[1.75rem] border border-transparent px-5 py-10 sm:px-7 sm:py-12 ${
        alternateBg
          ? "border-white/[0.04] bg-white/[0.02]"
          : "bg-transparent"
      }`}
    >
      <motion.div
        variants={fadeUp}
        custom={0}
        className="flex flex-col gap-4 border-b border-white/[0.06] pb-6"
      >
        <div className="flex items-start gap-4">
          <span
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{
              backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
              color: ACCENT,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            {semester.period && (
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
                {semester.period}
              </p>
            )}
            <h3 className="mt-1.5 text-[clamp(1.35rem,3vw,1.85rem)] font-semibold tracking-[-0.03em] text-foreground">
              {semester.label}
            </h3>
            <p className="mt-1.5 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary">
              {semester.institution}
            </p>
            {semester.location && (
              <p className="mt-1 text-[12px] text-muted">{semester.location}</p>
            )}
            {semester.description && (
              <p className="mt-3 max-w-3xl text-[13px] leading-[1.7] text-muted">
                {semester.description}
              </p>
            )}
          </div>
        </div>

        {semester.contextualBadges && semester.contextualBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-12">
            {semester.contextualBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-medium tracking-[0.04em] text-foreground-secondary uppercase"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {semester.courses.map((course, i) => (
          <CourseCard key={course.code} course={course} index={i + 1} />
        ))}
      </div>
    </motion.section>
  );
}

export default function CourseworkPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [activeSection, setActiveSection] = useState("archive-hero");
  const { scrollY } = useScroll();

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const sectionIds = navFilters.map((f) => f.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[500px] rounded-full bg-purple-500/[0.03] blur-[100px]" />
        <div className="ambient-grid absolute inset-0" />
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={motionReady ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
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
        {/* Hero */}
        <section
          id="archive-hero"
          className="scroll-mt-28 px-6 pt-36 pb-12 lg:px-8 lg:pt-44 lg:pb-14"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate={motionReady ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div custom={0} variants={fadeUp}>
                <Link
                  href="/"
                  className="group mb-8 inline-flex items-center gap-2 text-[14px] font-medium text-muted transition-colors hover:text-foreground"
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
                Northeastern University
              </motion.p>

              <motion.h1
                custom={2}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.75rem,7.5vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-foreground"
              >
                Academic Archive
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.2rem)] leading-[1.8] text-muted"
              >
                A curated collection of every major course, project,
                presentation, report, and technical artifact from my academic
                journey at Northeastern University.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
              >
                {archiveStats.map((stat) => (
                  <StatCard key={stat.label} value={stat.value} label={stat.label} />
                ))}
              </motion.div>

              <motion.div custom={5} variants={fadeUp} className="mt-8">
                <ArchiveNav activeId={activeSection} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-14 px-6 pb-28 lg:space-y-20 lg:px-8">
          {/* Upcoming */}
          <motion.section
            id="upcoming"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="scroll-mt-32"
          >
            <motion.div variants={fadeUp} custom={0}>
              <p className="text-[12px] font-medium tracking-[0.2em] text-muted uppercase">
                Upcoming Coursework
              </p>
              <h2 className="mt-2 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.03em] text-foreground">
                Courses beginning Fall 2026
              </h2>
            </motion.div>

            <div className="mt-5 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {upcomingCourses.map((course, i) => (
                <UpcomingCourseCard key={course.code} course={course} index={i + 1} />
              ))}
            </div>
          </motion.section>

          <SectionDivider />

          {/* Academic timeline */}
          <div id="academic-timeline" className="scroll-mt-32 space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0}
              className="pb-2"
            >
              <p className="text-[12px] font-semibold tracking-[0.2em] text-muted uppercase">
                Academic Timeline
              </p>
              <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-foreground">
                Completed Coursework
              </h2>
            </motion.div>

            {academicSemesters.map((semester, i) => (
              <SemesterSection
                key={semester.id}
                semester={semester}
                index={i}
                alternateBg={i % 2 === 1}
              />
            ))}
          </div>
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
