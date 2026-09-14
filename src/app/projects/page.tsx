"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { ProjectCard } from "@/components/home/project-card";
import { SubpageFooter, SubpageNav } from "@/components/subpage-nav";
import { projects } from "@/lib/projects";
import { CO_OP, EMAIL } from "@/lib/site-facts";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-grid absolute inset-0" />
      </div>

      <SubpageNav />

      <main className="relative z-10">
        <section className="relative overflow-hidden px-6 pt-36 pb-16 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-gradient-shift absolute top-[-30%] left-1/2 h-[50vh] w-[80vw] max-w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.14)_0%,transparent_70%)] blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative mx-auto max-w-6xl"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-[12px] font-medium tracking-[0.22em] text-muted uppercase"
            >
              Projects
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.045em] text-foreground"
            >
              What I have built, in full detail.
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-muted"
            >
              Every project below links to the thing itself: a live app, a
              repository, or the report I wrote. Nothing here is a course
              exercise I never finished.
            </motion.p>
          </motion.div>
        </section>

        <section className="px-6 pb-24 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="mx-auto max-w-6xl space-y-5"
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                variant="full"
              />
            ))}
          </motion.div>
        </section>

        <section className="px-6 pb-28 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
            className="glass-strong mx-auto max-w-3xl rounded-[2rem] px-8 py-14 text-center sm:px-14"
          >
            <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold tracking-[-0.04em] text-foreground">
              {CO_OP.status}, {CO_OP.term}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted">
              Looking for {CO_OP.roles.slice(0, 3).join(", ")}, or similar roles
              in {CO_OP.industry.toLowerCase()}.
            </p>
            <a
              href={"mailto:" + EMAIL}
              className="mt-8 inline-flex h-[50px] items-center justify-center rounded-full bg-cta-bg px-9 text-[15px] font-medium tracking-[-0.02em] text-cta-text transition-all duration-300 hover:opacity-90"
            >
              Get in touch
            </a>
          </motion.div>
        </section>
      </main>

      <SubpageFooter />
    </div>
  );
}
