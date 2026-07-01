"use client";

import { greeceAcademicCourses, greeceTheme } from "@/lib/greece-2026";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GreeceSectionLabel,
  GreeceSectionTitle,
} from "./section-label";
import {
  greeceFadeUp,
  greeceStagger,
  greeceViewport,
} from "./motion-presets";

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
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function AcademicCard({
  course,
  index,
}: {
  course: (typeof greeceAcademicCourses)[number];
  index: number;
}) {
  return (
    <motion.article
      custom={index}
      variants={greeceFadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-7 transition-all duration-500 sm:p-8"
      style={{
        borderColor: `rgba(${greeceTheme.accentRgb}, 0.14)`,
        background: `linear-gradient(165deg, rgba(${greeceTheme.aegeanRgb}, 0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `rgba(${greeceTheme.accentRgb}, 0.15)` }}
      />

      <p
        className="text-[11px] font-medium tracking-[0.14em] uppercase"
        style={{ color: greeceTheme.accent }}
      >
        {course.institution}
      </p>

      <h3 className="mt-4 text-[1.35rem] font-semibold leading-[1.25] tracking-[-0.03em] text-foreground">
        {course.title}
      </h3>

      <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-muted">
        {course.note}
      </p>

      {course.transferLabel && course.transferCode && (
        <div
          className="mt-6 rounded-xl border px-4 py-3"
          style={{ borderColor: `rgba(${greeceTheme.accentRgb}, 0.18)` }}
        >
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
            {course.transferLabel}
          </p>
          <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
            {course.transferCode}
          </p>
        </div>
      )}

      <Link
        href={course.href}
        className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
        style={{ color: greeceTheme.accent }}
      >
        View coursework
        <ArrowIcon />
      </Link>
    </motion.article>
  );
}

export function GreeceAcademics() {
  return (
    <section
      id="academics"
      className="scroll-mt-32 border-t border-white/[0.04] px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
          className="max-w-2xl"
        >
          <GreeceSectionLabel>Academics</GreeceSectionLabel>
          <GreeceSectionTitle>Academic Experience</GreeceSectionTitle>
          <p className="mt-5 text-[16px] leading-[1.75] text-muted">
            Courses completed during the Greece program — on campus, remotely,
            and through transfer credit.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {greeceAcademicCourses.map((course, i) => (
            <AcademicCard key={course.id} course={course} index={i + 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
