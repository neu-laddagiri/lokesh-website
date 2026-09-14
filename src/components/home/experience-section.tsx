"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { SectionHeader } from "@/components/home/section";
import { activities, EDUCATION, experience, skillGroups } from "@/lib/site-facts";

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Experience and toolkit"
          title="Where I have worked, and what I work with."
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="glass-strong h-fit rounded-2xl px-5 py-1 sm:px-6"
          >
            {experience.map((job, i) => (
              <motion.li
                key={job.role}
                custom={i}
                variants={fadeUp}
                className="border-b border-border py-4 last:border-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="text-[16px] leading-tight font-semibold tracking-[-0.025em] text-foreground">
                    {job.role}
                  </h3>
                  <span className="text-[12.5px] font-medium text-muted">
                    {job.period}
                  </span>
                </div>
                <p className="mt-0.5 text-[13.5px] font-medium text-[#2997ff]">
                  {job.org}
                  <span className="text-muted"> ({job.location})</span>
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[13.5px] leading-[1.55] text-muted"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#2997ff]/70" />
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
            className="glass h-fit space-y-4 rounded-2xl p-5"
          >
            {skillGroups.map((group, i) => (
              <motion.div key={group.label} custom={i} variants={fadeUp}>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {group.label}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[12.5px] font-medium tracking-[-0.01em] text-foreground-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          custom={0}
          className="mt-4 grid gap-x-8 gap-y-2 rounded-2xl border border-border bg-card px-5 py-4 text-[13px] leading-[1.6] text-muted sm:grid-cols-2"
        >
          <p>
            <span className="font-semibold text-foreground-secondary">
              Languages:
            </span>{" "}
            {EDUCATION.languages.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-foreground-secondary">
              Activities:
            </span>{" "}
            {activities.join(", ")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
