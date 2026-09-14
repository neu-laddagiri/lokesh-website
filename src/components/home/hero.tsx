"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, staggerContainer } from "@/components/home/motion";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import { CO_OP, EDUCATION, EMAIL, HEADLINE_EVIDENCE } from "@/lib/site-facts";

function BriefcaseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6z" />
      <path d="M15 2v4h4M9 13h6M9 17h4" />
    </svg>
  );
}

const snapshot = [
  { label: "Co-op term", value: CO_OP.term },
  { label: "Based in", value: CO_OP.location },
  { label: "Graduating", value: EDUCATION.graduation },
  { label: "GPA", value: EDUCATION.gpa },
] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[60svh] items-center overflow-hidden px-6 pt-24 pb-12 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="animate-gradient-shift absolute top-[-25%] left-[-10%] h-[70vh] w-[80vw] max-w-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.16)_0%,transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="animate-gradient-shift-alt absolute right-[-10%] bottom-[-15%] h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.12)_0%,transparent_70%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-fade" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12"
      >
        <div>
          <motion.div custom={0} variants={fadeUp}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#34c759]/30 bg-[#34c759]/10 py-1.5 pr-4 pl-3 text-[13px] font-medium tracking-[-0.01em] text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34c759] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34c759]" />
              </span>
              {CO_OP.status}, {CO_OP.term}
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mt-6 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.97] font-semibold tracking-[-0.045em] text-foreground"
          >
            Lokesh Addagiri
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-4 text-[clamp(1.0625rem,2.3vw,1.375rem)] leading-[1.3] font-medium tracking-[-0.025em] text-foreground-secondary"
          >
            Data Science and Business Administration at Northeastern University
          </motion.p>

          <motion.p
            custom={3}
            variants={fadeUp}
            className="mt-3 text-[15px] leading-[1.6] text-muted"
          >
            Concentrations in {EDUCATION.concentrations.join(" and ")}.{" "}
            {EDUCATION.honors.join(" and ")}.
          </motion.p>

          <motion.p
            custom={4}
            variants={fadeUp}
            className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-foreground-secondary"
          >
            {HEADLINE_EVIDENCE}
          </motion.p>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="#projects"
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-cta-bg px-7 text-[15px] font-medium tracking-[-0.02em] text-cta-text transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_50px_rgba(255,255,255,0.14)]"
            >
              <BriefcaseIcon />
              See the work
            </Link>
            <a
              href={PROFILE_LINKS.resume}
              {...resumeExternalProps}
              className="glass inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-[-0.02em] text-foreground transition-all duration-300 hover:bg-card-hover"
            >
              <ResumeIcon />
              Resume
            </a>
            <a
              href={"mailto:" + EMAIL}
              className="glass inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-[-0.02em] text-foreground transition-all duration-300 hover:bg-card-hover"
            >
              <MailIcon />
              Email me
            </a>
          </motion.div>
        </div>

        <motion.div
          custom={6}
          variants={fadeUp}
          className="glass-strong rounded-3xl p-6 sm:p-7"
        >
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Looking for
          </p>
          <ul className="mt-4 space-y-2.5">
            {CO_OP.roles.map((role) => (
              <li
                key={role}
                className="flex items-center gap-2.5 text-[15px] leading-snug font-medium tracking-[-0.01em] text-foreground"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2997ff]" />
                {role}
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-border pt-5 text-[14px] leading-[1.6] text-muted">
            Ideally in {CO_OP.industry.toLowerCase()}, where the combined major
            and both concentrations matter.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border pt-6">
            {snapshot.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-[14px] font-semibold tracking-[-0.02em] text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
