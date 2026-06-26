"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import {
  artifactGridClassName,
  InteractiveArtifactCard,
  StaticArtifactCard,
  SyllabusHeaderButton,
  type CourseAccent,
} from "@/components/coursework/artifact-cards";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume },
  { label: "Contact", href: "/#contact" },
] as const;

/** Project management accent — page-local only */
const ACCENT = "#8045da";
const ACCENT_LIGHT = "#a67eef";
const ACCENT_GLOW = "rgba(128, 69, 218, 0.35)";
const ACCENT_GLOW_STRONG = "rgba(128, 69, 218, 0.45)";
const ACCENT_GLOW_HERO = "rgba(128, 69, 218, 0.55)";
const ACCENT_RGB = "128, 69, 218";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/mg4057-syllabus.pdf";

const skills = [
  "Work Breakdown Structures",
  "Gantt Scheduling",
  "Stakeholder Analysis",
  "Risk Management",
  "Project Planning",
  "Scope Management",
  "Project Governance",
  "Resource Planning",
  "Implementation Strategy",
] as const;

const projectHighlights = [
  "Defined project scope and governance structure",
  "Created a detailed Work Breakdown Structure",
  "Built a full project schedule using Microsoft Project",
  "Developed stakeholder engagement strategies",
  "Conducted risk identification and prioritization",
  "Planned deployment, training, and go-live activities",
] as const;

const keyMetrics = [
  { value: "195", label: "Days" },
  { value: "55", label: "Tasks" },
  { value: "5", label: "Phases" },
  { value: "10", label: "Risks" },
] as const;

const projectInsights = [
  {
    title: "Stakeholder Alignment",
    description:
      "Successful projects require managing people and expectations as carefully as schedules and budgets.",
  },
  {
    title: "Risk Awareness",
    description:
      "Early identification of high-impact risks improves project resilience and decision-making.",
  },
  {
    title: "Structured Planning",
    description:
      "Breaking complex initiatives into manageable tasks creates clarity and improves execution.",
  },
] as const;

const wbsImage = {
  src: "/images/coursework/mg4057/mg4057-wbs.png",
  alt: "Work Breakdown Structure for SHMS implementation",
  caption:
    "Work Breakdown Structure defining all phases, deliverables, and implementation activities.",
  layout: "chart" as const,
} as const;

const ganttImage = {
  src: "/images/coursework/mg4057/mg4057-gantt.png",
  alt: "Microsoft Project Gantt schedule for SHMS",
  caption:
    "Microsoft Project schedule showing dependencies, milestones, critical activities, and project timeline.",
  layout: "landscape" as const,
} as const;

const stakeholderImage = {
  src: "/images/coursework/mg4057/mg4057-stakeholder-matrix.png",
  alt: "Stakeholder power-interest matrix for SHMS",
  title: "Stakeholder Management",
  caption:
    "Power-interest framework used to prioritize stakeholder engagement and communication strategies throughout the project lifecycle.",
  layout: "chart" as const,
} as const;

const riskImage = {
  src: "/images/coursework/mg4057/mg4057-risk-matrix.png",
  alt: "Governance and risk framework for SHMS",
  title: "Governance Framework",
  caption:
    "Governance and oversight framework used to coordinate stakeholders, reporting structures, and project execution.",
  layout: "chart" as const,
} as const;

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  layout: "chart" | "landscape" | "portrait";
  title?: string;
};

const artifacts = [
  {
    label: "Final Report",
    icon: "document",
    href: "/documents/mg4057-shms-final-report.pdf",
  },
  { label: "Work Breakdown Structure", icon: "wbs" },
  { label: "Gantt Schedule", icon: "gantt" },
  { label: "Risk Assessment", icon: "risk" },
] as const;

const takeaways = [
  {
    title: "Projects succeed through planning",
    description:
      "Strong planning creates clarity, alignment, and accountability.",
  },
  {
    title: "Stakeholders drive outcomes",
    description:
      "Managing stakeholder expectations is critical to project success.",
  },
  {
    title: "Risk management creates resilience",
    description:
      "Projects perform better when risks are identified and addressed early.",
  },
] as const;

const PDF_SRC = "/documents/mg4057-shms-final-report.pdf";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const viewport = { once: true, margin: "-100px" as const };

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-300 group-hover:-translate-x-0.5"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function WbsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="8.5" y="16" width="7" height="5" rx="1" />
      <path d="M6.5 8v3.5H12v4.5M17.5 8v3.5H12" />
    </svg>
  );
}

function GanttIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
      <rect x="5" y="4.5" width="8" height="3" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <rect x="9" y="10.5" width="10" height="3" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <rect x="7" y="16.5" width="6" height="3" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-px w-8 shrink-0"
        style={{ backgroundColor: ACCENT }}
        aria-hidden
      />
      <p className="text-[13px] font-medium tracking-[0.22em] text-muted uppercase">
        {children}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-[-0.03em] text-foreground">
      {children}
    </h2>
  );
}

function artifactIcon(type: string) {
  switch (type) {
    case "document":
      return <DocumentIcon />;
    case "wbs":
      return <WbsIcon />;
    case "gantt":
      return <GanttIcon />;
    case "risk":
      return <RiskIcon />;
    default:
      return <DocumentIcon />;
  }
}

function aspectForLayout(
  layout: GalleryImage["layout"],
  variant: "default" | "showcase" | "large" | "emphasized" | "compact" = "default",
) {
  if (layout === "landscape") {
    if (variant === "showcase") return "aspect-[16/14]";
    return "aspect-[16/10]";
  }
  if (layout === "chart") {
    if (variant === "large") return "aspect-[16/11]";
    if (variant === "compact") return "aspect-[16/9]";
    if (variant === "emphasized") return "aspect-[10/9]";
    return "aspect-[4/3]";
  }
  return "aspect-[3/4]";
}

function GalleryCard({
  image,
  index,
  onOpen,
  variant = "default",
  glow = "default",
}: {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage) => void;
  variant?: "default" | "showcase" | "large" | "emphasized" | "compact";
  glow?: "default" | "strong" | "hero";
}) {
  const aspectClass = aspectForLayout(image.layout, variant);
  const isShowcase = variant === "showcase";

  const paddingClass = {
    showcase: "p-1 sm:p-1.5",
    large: "p-3 sm:p-4",
    compact: "p-2.5 sm:p-3",
    emphasized: "p-2.5 sm:p-3",
    default: "p-4 sm:p-5",
  }[variant];

  const hoverGlow = {
    default: ACCENT_GLOW,
    strong: ACCENT_GLOW_STRONG,
    hero: ACCENT_GLOW_HERO,
  }[glow];

  const hoverScale = isShowcase ? 1.015 : 1.012;

  return (
    <motion.button
      type="button"
      custom={index}
      variants={fadeUp}
      whileHover={{
        y: -6,
        scale: hoverScale,
        transition: { duration: 0.35 },
      }}
      onClick={() => onOpen(image)}
      className={`glass-strong group relative w-full overflow-hidden rounded-3xl text-left transition-all duration-500 ${paddingClass}`}
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 28px 70px ${hoverGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {image.title ? (
        <p className="mb-3 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
          {image.title}
        </p>
      ) : null}
      <div
        className={`relative ${aspectClass} overflow-hidden rounded-2xl bg-black/40`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            isShowcase || variant === "large" || variant === "emphasized" || variant === "compact"
              ? "(max-width: 1024px) 100vw, 1200px"
              : "(max-width: 1024px) 100vw, 50vw"
          }
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] transition-all duration-300 group-hover:ring-[#8045da]/30" />
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-foreground-secondary">
        {image.caption}
      </p>
      <p
        className="mt-2 text-[12px] font-medium tracking-wide uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: ACCENT }}
      >
        Click to enlarge
      </p>
    </motion.button>
  );
}

function ImageLightbox({
  image,
  onClose,
}: {
  image: GalleryImage | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
        >
          <motion.button
            type="button"
            aria-label="Close lightbox"
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-strong relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl p-4 sm:p-6"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-black/50 text-foreground transition-colors hover:bg-border"
            >
              <CloseIcon />
            </button>
            <div
              className={`relative mx-auto w-full overflow-hidden rounded-2xl bg-background/60 ${aspectForLayout(
                image.layout,
                image.layout === "landscape" ? "showcase" : "default",
              )} max-h-[75vh]`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1024px"
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 text-center text-[15px] leading-relaxed text-foreground-secondary">
              {image.caption}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MG4057Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  const closeLightbox = useCallback(() => setLightboxImage(null), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImage, closeLightbox]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ImageLightbox image={lightboxImage} onClose={closeLightbox} />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(128, 69, 218, 0.06)" }}
        />
        <div className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div
          className="ambient-grid absolute inset-0"
        />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "border-b border-border bg-background/60 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
          >
            Lokesh Addagiri
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.label === "Resume" ? resumeExternalProps : {})}
                className={`text-[13px] transition-colors duration-200 ${
                  link.label === "Coursework"
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              className="glass flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
            >
              <span className="block h-[1.5px] w-4 bg-muted" />
              <span className="block h-[1.5px] w-4 bg-muted" />
            </button>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 pt-36 pb-16 lg:px-8 lg:pt-44 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div custom={0} variants={fadeUp}>
                <Link
                  href="/coursework"
                  className="group mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-muted transition-colors hover:text-foreground"
                >
                  <BackIcon />
                  Back to Coursework
                </Link>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUp}
                className="flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                <span
                  className="text-[13px] font-medium tracking-[0.22em] uppercase"
                  style={{ color: ACCENT }}
                >
                  MG 4057
                </span>
                <span className="hidden text-muted/50 sm:inline" aria-hidden>
                  •
                </span>
                <SyllabusHeaderButton
                  href={SYLLABUS_PDF}
                  accent={courseAccent}
                />
              </motion.div>

              <motion.h1
                custom={2}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Project Management
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Planning, scheduling, stakeholder coordination, and risk
                management for large-scale organizational projects.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-6 pb-24 lg:space-y-24 lg:px-8">
          {/* Course Overview */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Course Overview</SectionLabel>
            <SectionHeading>
              Delivering projects through structured planning and execution.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                MG4057 introduced project management methodologies used to plan,
                execute, monitor, and close complex projects. The course
                emphasized scope definition, stakeholder engagement, scheduling,
                risk management, governance, and project delivery frameworks.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Through the Smart Health Monitoring System (SHMS) implementation
                project, I developed practical experience creating work breakdown
                structures, project schedules, stakeholder analyses, risk
                assessments, and implementation plans.
              </p>
            </div>
          </motion.section>

          {/* Skills Learned */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Skills Learned</SectionLabel>
              <SectionHeading>Core competencies from this course.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass flex items-center gap-4 rounded-2xl px-6 py-5 transition-colors duration-300 hover:bg-card-hover"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(128, 69, 218, 0.12)" }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                  </span>
                  <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Featured Project */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Capstone Project</SectionLabel>
            <SectionHeading>
              How do you successfully implement a hospital-wide smart health
              monitoring system?
            </SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: "rgba(128, 69, 218, 0.1)" }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{
                  borderColor: "rgba(128, 69, 218, 0.25)",
                  backgroundColor: "rgba(128, 69, 218, 0.1)",
                  color: ACCENT_LIGHT,
                }}
              >
                Capstone Project
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Smart Health Monitoring System (SHMS) Implementation
              </h3>

              <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-muted">
                Developed a comprehensive project plan for implementing a Smart
                Health Monitoring System across a healthcare network, including
                stakeholder management, risk assessment, scheduling, governance,
                and deployment planning.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div>
                  <p className="text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
                    Project Highlights
                  </p>
                  <ul className="mt-4 space-y-3">
                    {projectHighlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground-secondary"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
                    Key Metrics
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {keyMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="glass rounded-2xl border border-border px-5 py-5 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(128,69,218,0.1)]"
                      >
                        <p
                          className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-none tracking-[-0.03em]"
                          style={{ color: ACCENT_LIGHT }}
                        >
                          {metric.value}
                        </p>
                        <p className="mt-2 text-[12px] font-medium tracking-[0.1em] text-muted uppercase">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>

          {/* Project Structure — WBS */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Project Structure</SectionLabel>
            <SectionHeading>Building the project foundation.</SectionHeading>

            <div className="mt-5">
              <GalleryCard
                image={wbsImage}
                index={1}
                onOpen={setLightboxImage}
                variant="compact"
                glow="default"
              />
            </div>
          </motion.section>

          {/* Schedule & Timeline — Gantt centerpiece */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Schedule &amp; Timeline</SectionLabel>
            <SectionHeading>
              Project scheduling and execution planning.
            </SectionHeading>

            <div
              className="mt-6 rounded-3xl p-px shadow-[0_0_80px_rgba(128,69,218,0.22)]"
              style={{
                background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.55), rgba(${ACCENT_RGB},0.08))`,
              }}
            >
              <GalleryCard
                image={ganttImage}
                index={1}
                onOpen={setLightboxImage}
                variant="showcase"
                glow="hero"
              />
            </div>
          </motion.section>

          {/* Project Governance & Risk Management */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Governance &amp; Risk</SectionLabel>
              <SectionHeading>Project Governance &amp; Risk Management</SectionHeading>
              <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-muted">
                Stakeholder prioritization, governance structures, and oversight
                frameworks used to support communication, risk management, and
                decision-making throughout the SHMS implementation.
              </p>
            </motion.div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <GalleryCard
                image={stakeholderImage}
                index={1}
                onOpen={setLightboxImage}
                variant="compact"
                glow="strong"
              />
              <GalleryCard
                image={riskImage}
                index={2}
                onOpen={setLightboxImage}
                variant="compact"
                glow="strong"
              />
            </div>
          </motion.section>

          {/* Project Insights */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Project Insights</SectionLabel>
              <SectionHeading>Project Management Insights</SectionHeading>
            </motion.div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {projectInsights.map((insight, i) => (
                <motion.div
                  key={insight.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    scale: 1.015,
                    transition: { duration: 0.3 },
                  }}
                  className="glass-strong relative overflow-hidden rounded-3xl border border-[#8045da]/20 p-7 transition-all duration-500 sm:p-8"
                  style={{ boxShadow: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 24px 60px rgba(128, 69, 218, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(${ACCENT_RGB},0.5), transparent)`,
                    }}
                  />
                  <p
                    className="text-[13px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: ACCENT_LIGHT }}
                  >
                    {insight.title}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.7] text-foreground-secondary">
                    {insight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Full Project Report */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Full Project Report</SectionLabel>
            <SectionHeading>Complete project documentation.</SectionHeading>
            <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-muted">
              This report contains the complete project plan, stakeholder
              analysis, risk assessment, work breakdown structure,
              implementation schedule, governance framework, and deployment
              strategy developed for the Smart Health Monitoring System case
              study.
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted/80">
              Scroll through the complete SHMS implementation plan — from scope
              definition and scheduling to stakeholder management, risk
              assessment, and deployment strategy.
            </p>

            <motion.div
              whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
              className="glass-strong mt-8 overflow-hidden rounded-3xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <p className="text-[14px] font-medium tracking-[-0.01em] text-foreground">
                  Smart Health Monitoring System (SHMS) Implementation
                </p>
                <a
                  href={PDF_SRC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium transition-colors"
                  style={{ color: ACCENT }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = ACCENT_LIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ACCENT;
                  }}
                >
                  Open in new tab
                </a>
              </div>
              <iframe
                src={PDF_SRC}
                title="SHMS Implementation Final Report"
                className="h-[min(85vh,900px)] w-full bg-[#0a0a0a]"
              />
            </motion.div>
          </motion.section>

          {/* Artifacts */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Artifacts</SectionLabel>
              <SectionHeading>Course deliverables and outputs.</SectionHeading>
            </motion.div>

            <div className={artifactGridClassName(artifacts.length)}>
              {artifacts.map((artifact, i) => {
                const iconStyle = {
                  backgroundColor: "rgba(128, 69, 218, 0.12)",
                  color: ACCENT,
                };

                return (
                  <motion.div
                    key={artifact.label}
                    custom={i + 1}
                    variants={fadeUp}
                    className="h-full"
                    whileHover={
                      "href" in artifact && artifact.href
                        ? { y: -6, scale: 1.02, transition: { duration: 0.3 } }
                        : { y: -2, transition: { duration: 0.25 } }
                    }
                  >
                    {"href" in artifact && artifact.href ? (
                      <InteractiveArtifactCard
                        label={artifact.label}
                        icon={artifactIcon(artifact.icon)}
                        href={artifact.href}
                        accent={courseAccent}
                        iconStyle={iconStyle}
                      />
                    ) : (
                      <StaticArtifactCard
                        label={artifact.label}
                        icon={artifactIcon(artifact.icon)}
                        iconStyle={iconStyle}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Key Takeaways */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Key Takeaways</SectionLabel>
              <SectionHeading>What I carried forward from this course.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {takeaways.map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <div
                    className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: "rgba(128, 69, 218, 0.12)",
                      color: ACCENT,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} Lokesh Addagiri. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.label === "Resume" ? resumeExternalProps : {})}
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
