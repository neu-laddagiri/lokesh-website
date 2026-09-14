"use client";

import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/components/home/motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-medium tracking-[0.22em] text-muted uppercase">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.04em] text-foreground">
      {children}
    </h2>
  );
}

type SectionHeaderProps = {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function SectionHeader({
  label,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      custom={0}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="max-w-2xl">
        <SectionLabel>{label}</SectionLabel>
        <SectionTitle>{title}</SectionTitle>
        {description && (
          <p className="mt-3 text-[15px] leading-[1.6] text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}

export function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

export function ArrowIcon() {
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
      className="shrink-0 transition-transform duration-300 group-hover/link:translate-x-0.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
