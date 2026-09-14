"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeIn, fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { ArrowIcon, SectionHeader } from "@/components/home/section";
import { academicSemesters, inProgressCourses } from "@/lib/coursework-archive";
import { courseworkTopics, documentsPublished } from "@/lib/site-facts";

export function CourseworkSection() {
  return (
    <section id="coursework" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Coursework"
          title="Every course, report, and presentation, published."
          description={`Each course below has its own page with the syllabus and the work I turned in. ${documentsPublished} documents are linked in total.`}
          action={
            <Link
              href="/coursework"
              className="group/link inline-flex h-11 items-center gap-2 rounded-full bg-[#2997ff] px-6 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#0077ed] hover:shadow-[0_0_40px_rgba(41,151,255,0.3)]"
            >
              Browse the archive
              <ArrowIcon />
            </Link>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
            className="glass-strong rounded-3xl p-7 sm:p-8"
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

            <ul className="mt-5 space-y-3.5">
              {inProgressCourses.map((course) => (
                <li key={course.code} className="border-b border-border pb-3.5 last:border-0 last:pb-0">
                  <p className="text-[11px] font-semibold tracking-[0.1em] text-[#2997ff] uppercase">
                    {course.code}
                  </p>
                  <p className="mt-0.5 text-[15px] leading-snug font-medium tracking-[-0.02em] text-foreground">
                    {course.title}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={1}
              className="glass-strong rounded-3xl p-7 sm:p-8"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Completed
              </p>
              <ul className="mt-5 space-y-3">
                {academicSemesters.map((semester) => (
                  <li
                    key={semester.id}
                    className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-[15px] font-medium tracking-[-0.02em] text-foreground">
                      {semester.label}
                    </span>
                    <span className="shrink-0 text-[13px] text-muted">
                      {semester.courses.length}{" "}
                      {semester.courses.length === 1 ? "course" : "courses"}
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
              className="glass rounded-3xl p-7 sm:p-8"
            >
              <motion.p
                custom={0}
                variants={fadeUp}
                className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase"
              >
                Topics covered
              </motion.p>
              <div className="mt-4 flex flex-wrap gap-2">
                {courseworkTopics.map((topic, i) => (
                  <motion.span
                    key={topic}
                    custom={i}
                    variants={fadeIn}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary"
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
