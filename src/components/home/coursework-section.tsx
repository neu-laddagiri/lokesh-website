"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeIn, fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { ArrowIcon, SectionHeader } from "@/components/home/section";
import { academicSemesters, inProgressCourses } from "@/lib/coursework-archive";
import { courseworkTopics, siteStats } from "@/lib/site-facts";

export function CourseworkSection() {
  return (
    <section id="coursework" className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Coursework"
          title="Every course, report, and presentation, published."
          action={
            <Link
              href="/coursework"
              className="group/link inline-flex h-10 items-center gap-2 rounded-full bg-[#2997ff] px-5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#0077ed] hover:shadow-[0_0_40px_rgba(41,151,255,0.3)]"
            >
              Browse the archive
              <ArrowIcon />
            </Link>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {siteStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              className="glass rounded-2xl px-4 py-4 text-center"
            >
              <p className="text-[clamp(1.375rem,2.6vw,1.75rem)] font-semibold tracking-[-0.03em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[10.5px] font-medium tracking-[0.1em] text-muted uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2997ff] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2997ff]" />
              </span>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                In progress, Fall 2026
              </p>
            </div>

            <ul className="mt-4 space-y-2.5">
              {inProgressCourses.map((course) => (
                <li key={course.code} className="flex items-baseline gap-3">
                  <span className="w-[68px] shrink-0 text-[11px] font-semibold tracking-[0.08em] text-[#2997ff] uppercase">
                    {course.code}
                  </span>
                  <span className="text-[14px] leading-snug font-medium tracking-[-0.02em] text-foreground">
                    {course.title}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={1}
              className="glass-strong rounded-2xl p-6"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Completed
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {academicSemesters.map((semester) => (
                  <li
                    key={semester.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="text-[14px] font-medium tracking-[-0.02em] text-foreground">
                      {semester.label}
                    </span>
                    <span className="shrink-0 text-[12.5px] text-muted">
                      {semester.courses.length}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="glass rounded-2xl p-6"
            >
              <motion.p
                custom={0}
                variants={fadeUp}
                className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase"
              >
                Topics covered
              </motion.p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {courseworkTopics.map((topic, i) => (
                  <motion.span
                    key={topic}
                    custom={i}
                    variants={fadeIn}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[12.5px] font-medium tracking-[-0.01em] text-foreground-secondary"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
