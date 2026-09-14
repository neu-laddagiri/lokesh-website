"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { SectionHeader } from "@/components/home/section";
import { experience, skillGroups } from "@/lib/site-facts";

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Experience and toolkit"
          title="Where I have worked, and what I work with."
          description="Only technologies I have used in the work linked on this page."
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="space-y-3"
          >
            {experience.map((job, i) => (
              <motion.li
                key={job.role}
                custom={i}
                variants={fadeUp}
                className="glass-strong rounded-2xl p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.025em] text-foreground">
                    {job.role}
                  </h3>
                  <span className="text-[13px] font-medium text-muted">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-[14px] font-medium text-[#2997ff]">
                  {job.org}
                  <span className="text-muted"> ({job.location})</span>
                </p>
                <ul className="mt-3.5 space-y-2">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[14px] leading-[1.6] text-muted"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2997ff]/70" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="space-y-3"
          >
            {skillGroups.map((group, i) => (
              <motion.div
                key={group.label}
                custom={i}
                variants={fadeUp}
                className="glass rounded-2xl p-6"
              >
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {group.label}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
