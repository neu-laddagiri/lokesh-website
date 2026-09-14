"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowIcon, ExternalIcon } from "@/components/home/section";
import { fadeUp } from "@/components/home/motion";
import type { Project } from "@/lib/projects";

function hexToRgb(hex: string): string {
  const value = parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

type ProjectCardProps = {
  project: Project;
  index: number;
  /** "compact" trims the bullet list for the homepage scan. */
  variant?: "compact" | "full";
};

export function ProjectCard({
  project,
  index,
  variant = "compact",
}: ProjectCardProps) {
  const rgb = hexToRgb(project.accent);
  const bullets =
    variant === "compact" ? project.bullets.slice(0, 3) : project.bullets;
  const hiddenBullets = project.bullets.length - bullets.length;

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.6), transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ backgroundColor: `rgba(${rgb}, 0.14)` }}
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[21px] leading-tight font-semibold tracking-[-0.03em] text-foreground">
            {project.name}
          </h3>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.06em] uppercase"
            style={{
              backgroundColor: `rgba(${rgb}, 0.12)`,
              color: project.accent,
            }}
          >
            {project.period}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] text-muted">{project.role}</p>

        <p className="mt-4 text-[16px] leading-[1.65] text-foreground-secondary">
          {project.premise}
        </p>

        <ul className="mt-5 space-y-2.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-[14px] leading-[1.6] text-muted">
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: `rgba(${rgb}, 0.8)` }}
              />
              {bullet}
            </li>
          ))}
        </ul>

        {hiddenBullets > 0 && (
          <p className="mt-3 text-[13px] text-muted">
            Plus {hiddenBullets} more detail{hiddenBullets > 1 ? "s" : ""} on the
            projects page.
          </p>
        )}

        {project.note && (
          <p
            className="mt-5 rounded-xl border px-4 py-3 text-[13px] leading-[1.55] text-foreground-secondary"
            style={{
              borderColor: `rgba(${rgb}, 0.22)`,
              backgroundColor: `rgba(${rgb}, 0.07)`,
            }}
          >
            {project.note}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] font-medium tracking-[-0.01em] text-foreground-secondary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2.5 pt-1">
          {project.links.map((link) => {
            const className = link.primary
              ? "group/link inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-[-0.01em] text-white transition-transform duration-300 hover:scale-[1.03]"
              : "group/link inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-[14px] font-medium tracking-[-0.01em] text-foreground-secondary transition-colors duration-300 hover:bg-card-hover hover:text-foreground";
            const style = link.primary
              ? {
                  backgroundColor: project.accent,
                  boxShadow: `0 0 30px rgba(${rgb}, 0.25)`,
                }
              : undefined;

            if (link.internal) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={className}
                  style={style}
                >
                  {link.label}
                  <ArrowIcon />
                </Link>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={style}
              >
                {link.label}
                <ExternalIcon />
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
