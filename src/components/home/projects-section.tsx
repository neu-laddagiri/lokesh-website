"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectCard } from "@/components/home/project-card";
import { staggerContainer, viewport } from "@/components/home/motion";
import { ArrowIcon, SectionHeader } from "@/components/home/section";
import { projects } from "@/lib/projects";

/**
 * Six equal tiles fill two rows of three (three rows of two on tablets). The
 * portfolio itself stays on /projects, since the reader is already on it.
 * Adding or removing a project leaves a short row, so rebalance the grid then.
 */
const tiles = projects.filter((project) => project.id !== "portfolio");

export function ProjectsSection() {
  return (
    <section id="projects" className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Projects"
          title="Evidence that I can build."
          action={
            <Link
              href="/projects"
              className="group/link inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-[14px] font-medium text-foreground transition-colors duration-300 hover:bg-card-hover"
            >
              Full write-ups
              <ArrowIcon />
            </Link>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tiles.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
