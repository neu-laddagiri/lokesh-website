"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  greeceAcademicsMeta,
  greeceCourses,
  greeceTheme,
} from "@/lib/greece-2026";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";
import { greeceFadeUp, greeceStagger, greeceViewport } from "./motion-presets";

function hexToRgb(hex: string): string {
  const value = parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
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
      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const facts = [
  { label: "Campus", value: greeceAcademicsMeta.campus },
  { label: "Neighborhood", value: greeceAcademicsMeta.neighborhood },
  { label: "Term", value: greeceAcademicsMeta.term },
] as const;

export function GreeceAcademics() {
  return (
    <section id="academics" className="scroll-mt-32 px-6 py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
        >
          <GreeceSectionLabel>Academics</GreeceSectionLabel>
          <GreeceSectionTitle>Three courses, one 4.0.</GreeceSectionTitle>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-muted">
            {greeceAcademicsMeta.note}
          </p>
        </motion.div>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              custom={i}
              variants={greeceFadeUp}
              className="rounded-2xl border px-5 py-4"
              style={{
                borderColor: `rgba(${greeceTheme.accentRgb}, 0.22)`,
                backgroundColor: `rgba(${greeceTheme.accentRgb}, 0.06)`,
              }}
            >
              <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-[14px] leading-snug font-semibold tracking-[-0.02em] text-foreground">
                {fact.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          {greeceCourses.map((course, i) => {
            const rgb = hexToRgb(course.accent);
            return (
              <motion.article
                key={course.id}
                custom={i}
                variants={greeceFadeUp}
                className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.7), transparent)`,
                  }}
                  aria-hidden
                />

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.08em] uppercase"
                    style={{
                      backgroundColor: `rgba(${rgb}, 0.14)`,
                      color: course.accent,
                    }}
                  >
                    {course.neuCode}
                  </span>
                  {course.acgCode && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted">
                      Taken as {course.acgCode}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-[17px] leading-tight font-semibold tracking-[-0.025em] text-foreground">
                  {course.neuTitle}
                </h3>

                <p className="mt-1 text-[12.5px] text-muted">
                  {course.institution}
                </p>
                <p className="text-[12.5px] text-muted">
                  {course.mode} · {course.credits}
                </p>

                <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-foreground-secondary">
                  {course.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] font-medium text-foreground-secondary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <Link
                  href={course.href}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border text-[13.5px] font-medium text-foreground transition-colors duration-300"
                  style={{
                    borderColor: `rgba(${rgb}, 0.3)`,
                    backgroundColor: `rgba(${rgb}, 0.08)`,
                  }}
                >
                  Syllabus and graded work
                  <ArrowIcon />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
