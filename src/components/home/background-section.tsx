"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { SectionHeader } from "@/components/home/section";
import { activities, EDUCATION, siteStats } from "@/lib/site-facts";

const facts = [
  {
    label: "Degree",
    value: "B.S. Data Science and Business Administration",
    detail: `${EDUCATION.school}, ${EDUCATION.location}. Expected ${EDUCATION.graduation}.`,
  },
  {
    label: "Concentrations",
    value: EDUCATION.concentrations.join(" and "),
    detail: "Both officially declared.",
  },
  {
    label: "Honors",
    value: EDUCATION.honors.join(", "),
    detail: `GPA ${EDUCATION.gpa}.`,
  },
  {
    label: "Study abroad",
    value: "American College of Greece, Athens",
    detail: "May to June 2026. 4.0 GPA across three courses.",
  },
  {
    label: "Languages",
    value: EDUCATION.languages.join(", "),
  },
  {
    label: "Activities",
    value: activities.join(", "),
  },
] as const;

export function BackgroundSection() {
  return (
    <section id="about" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Background"
          title="Data science on one side, business on the other."
          description="The combined major means I learn the pipeline and the P&L in the same term. Business Statistics and Profit Analysis in one summer, Databases and Mathematical Foundations of AI in the next."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {siteStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              className="glass rounded-2xl px-5 py-5 text-center"
            >
              <p className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[11px] font-medium tracking-[0.1em] text-muted uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              custom={i}
              variants={fadeUp}
              className="glass-strong rounded-2xl p-6"
            >
              <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2.5 text-[15px] leading-snug font-semibold tracking-[-0.02em] text-foreground">
                {fact.value}
              </dd>
              {"detail" in fact && fact.detail && (
                <p className="mt-2 text-[13px] leading-[1.55] text-muted">
                  {fact.detail}
                </p>
              )}
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
