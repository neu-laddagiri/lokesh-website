"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { resumeExternalProps } from "@/lib/profile-links";
import { subpageNavLinks as navLinks } from "@/lib/site-nav";
import {
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

/** GitHub / VS Code inspired accent — page-local only */
const ACCENT = "#58A6FF";
const ACCENT_LIGHT = "#79B8FF";
const ACCENT_GLOW = "rgba(88, 166, 255, 0.35)";
const ACCENT_RGB = "88, 166, 255";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/cs1200-syllabus.pdf";
const ODYSSEY_IMAGE = "/images/coursework/cs1200/cs1200-khoury-odyssey.png";
const GITHUB_README_IMAGE =
  "/images/coursework/cs1200/cs1200-github-profile.jpeg";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "CS 1200",
  "Khoury College",
  "Git",
  "GitHub",
  "Software Foundations",
] as const;

const skills = [
  "Git",
  "GitHub",
  "Version Control",
  "Markdown",
  "Software Collaboration",
  "Developer Workflow",
  "Repository Management",
  "Open Source",
  "Technical Documentation",
] as const;

const odysseyTopics = [
  "Web Development",
  "Algorithms",
  "Data Science",
  "Cybersecurity",
  "Swift UI",
  "Internet Basics",
  "Threat Modeling",
] as const;

const courseHighlights = [
  "Computer Science",
  "Data Science",
  "Cybersecurity",
  "Information Science",
  "GitHub & version control",
  "Industry tools",
  "Campus resources",
  "Portfolio development",
  "Khoury Odyssey modules",
  "Academic & career planning",
] as const;

const learningOutcomes = [
  {
    title: "Git",
    description:
      "Staging, committing, branching, and tracking project history with confidence.",
  },
  {
    title: "GitHub",
    description:
      "Publishing repositories, managing remotes, and presenting work professionally online.",
  },
  {
    title: "Repositories",
    description:
      "Organizing codebases, README files, and project structure for long-term maintainability.",
  },
  {
    title: "Markdown",
    description:
      "Writing clean technical documentation that renders beautifully on GitHub.",
  },
  {
    title: "Version Control",
    description:
      "Understanding why disciplined change tracking is essential in modern software teams.",
  },
  {
    title: "Developer Collaboration",
    description:
      "Working asynchronously, reviewing contributions, and communicating through shared repos.",
  },
  {
    title: "Documentation",
    description:
      "Explaining projects clearly so others — and future you — can understand the work.",
  },
  {
    title: "Professional Software Workflow",
    description:
      "Adopting habits used across industry: commits, issues, READMEs, and reproducible setup.",
  },
  {
    title: "Problem Solving",
    description:
      "Breaking unfamiliar tooling challenges into steps and learning through hands-on exploration.",
  },
  {
    title: "Technical Communication",
    description:
      "Presenting technical identity and project work in a polished, recruiter-ready format.",
  },
] as const;

const BALANCED_GRID_ITEM =
  "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]";

const ambientParticles = [
  { top: "14%", left: "10%", size: 4, delay: 0 },
  { top: "32%", left: "88%", size: 3, delay: 0.8 },
  { top: "58%", left: "6%", size: 3, delay: 1.6 },
  { top: "72%", left: "92%", size: 4, delay: 2.2 },
  { top: "22%", left: "48%", size: 2, delay: 1.1 },
  { top: "84%", left: "38%", size: 3, delay: 3 },
] as const;

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  title: string;
};

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

function MarkdownFileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="opacity-70"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
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

function AccentButton({
  onClick,
  children,
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white ${className}`}
      style={{
        borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
        backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = ACCENT;
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.06)`;
        e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.25)`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

function VSCodeFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#2d2d2d] px-4 py-3">
        <div className="flex gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="inline-flex items-center gap-2 rounded-t-md border border-b-0 border-white/[0.08] bg-[#1e1e1e] px-4 py-1.5 text-[12px] text-foreground-secondary">
            <MarkdownFileIcon />
            README.md
          </div>
        </div>
        <div className="w-[52px]" aria-hidden />
      </div>
      <div className="relative bg-[#1e1e1e]">{children}</div>
    </div>
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
            <div className="relative mx-auto aspect-[16/10] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-[#0d1117]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1024px"
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 text-center text-[15px] font-medium text-foreground">
              {image.title}
            </p>
            <p className="mt-2 text-center text-[15px] leading-relaxed text-foreground-secondary">
              {image.caption}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AmbientParticles() {
  return (
    <>
      {ambientParticles.map((particle, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            backgroundColor: ACCENT,
            boxShadow: `0 0 ${particle.size * 3}px rgba(${ACCENT_RGB}, 0.45)`,
          }}
          animate={{
            opacity: [0.12, 0.45, 0.12],
            y: [0, -14, 0],
          }}
          transition={{
            duration: 4.5 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function CS1200Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  const closeLightbox = useCallback(() => setLightboxImage(null), []);

  const openLightbox = useCallback((image: GalleryImage) => {
    setLightboxImage(image);
  }, []);

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

      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          animate={{ opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.08)` }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute right-0 bottom-1/4 h-[350px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(35, 134, 54, 0.05)" }}
        />
        <AmbientParticles />
        <div className="ambient-grid absolute inset-0" />
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={
          motionReady ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }
        }
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
        <section className="px-6 pt-36 pb-16 lg:px-8 lg:pt-44 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate={motionReady ? "visible" : "hidden"}
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
                  style={{ color: ACCENT_LIGHT }}
                >
                  CS 1200
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
                First Year Seminar
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                The course that introduced me to software development, Git,
                GitHub, professional collaboration, and the Khoury computing
                community.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-24 px-6 pb-32 lg:space-y-32 lg:px-8">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>About</SectionLabel>
            <SectionHeading>
              Where my software engineering journey began.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                Although CS 1200 was a first-year seminar, it became the
                foundation of my technical workflow. The course was designed to
                support students entering Khoury and Northeastern — exploring
                the college&apos;s curriculum, connecting with campus resources,
                and building early portfolio-ready experience through interactive
                modules and hands-on projects.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Through asynchronous modules, Odyssey droplets, and GitHub
                assignments, I learned how professional developers organize work:
                version control with Git, collaboration through GitHub,
                repository management, Markdown documentation, open source
                concepts, and the developer tooling that still shapes every
                project I build today — from my portfolio to analytics apps and
                product experiments.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Skills</SectionLabel>
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
                    style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
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

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Projects</SectionLabel>
              <SectionHeading>
                Hands-on work that shaped my developer identity.
              </SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
              <motion.article
                custom={1}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.35 } }}
                className="glass-strong group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-shadow duration-500 sm:p-10 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                style={{ borderColor: `rgba(${ACCENT_RGB}, 0.22)` }}
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
                />
                <span
                  className="inline-flex w-fit rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                  style={{
                    borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                    color: ACCENT_LIGHT,
                  }}
                >
                  Khoury Odyssey
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  Khoury Odyssey Learning Platform
                </h3>
                <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                  Odyssey introduced modern computing topics through interactive
                  modules and droplets — a hands-on way to explore Khoury
                  pathways before committing to a major.
                </p>
                <ul className="mt-5 space-y-2">
                  {odysseyTopics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-center gap-3 text-[15px] text-foreground-secondary"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
                <div
                  className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl bg-[#0d1117] ring-1 ring-white/[0.08] transition-transform duration-500 group-hover:scale-[1.02]"
                >
                  <Image
                    src={ODYSSEY_IMAGE}
                    alt="Khoury Odyssey learning platform interface"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-8">
                  <AccentButton
                    onClick={() =>
                      openLightbox({
                        src: ODYSSEY_IMAGE,
                        alt: "Khoury Odyssey learning platform interface",
                        title: "Khoury Odyssey Learning Platform",
                        caption:
                          "Interactive Odyssey modules covering web development, algorithms, data science, cybersecurity, and more.",
                      })
                    }
                  >
                    View Screenshot
                  </AccentButton>
                </div>
              </motion.article>

              <motion.article
                custom={2}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.35 } }}
                className="glass-strong group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-shadow duration-500 sm:p-10 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                style={{ borderColor: `rgba(${ACCENT_RGB}, 0.22)` }}
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
                />
                <span
                  className="inline-flex w-fit rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                  style={{
                    borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                    color: ACCENT_LIGHT,
                  }}
                >
                  GitHub
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  GitHub Profile README
                </h3>
                <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                  CS 1200 required building a personal GitHub presence — a
                  profile README that introduces who you are, what you build, and
                  how you collaborate. This assignment made version control feel
                  real, not theoretical.
                </p>
                <div className="mt-8 flex-1">
                  <VSCodeFrame>
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={GITHUB_README_IMAGE}
                        alt="GitHub profile README displayed in a code editor"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e1e1e]/40" />
                    </div>
                  </VSCodeFrame>
                </div>
                <div className="mt-8">
                  <AccentButton
                    onClick={() =>
                      openLightbox({
                        src: GITHUB_README_IMAGE,
                        alt: "GitHub profile README screenshot",
                        title: "GitHub Profile README",
                        caption:
                          "Personal README built as part of CS 1200's version control and GitHub onboarding modules.",
                      })
                    }
                  >
                    View Full Screenshot
                  </AccentButton>
                </div>
              </motion.article>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Documents</SectionLabel>
            <SectionHeading>Course files and deliverables.</SectionHeading>

            <div className="mt-8 flex justify-center">
              <motion.a
                href={SYLLABUS_PDF}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6, transition: { duration: 0.35 } }}
                className="glass-strong group relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 sm:p-8 hover:shadow-[0_24px_60px_rgba(88,166,255,0.2)]"
              >
                <div
                  className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
                />
                <span
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                    color: ACCENT,
                  }}
                >
                  <DocumentIcon />
                </span>
                <h3 className="relative z-10 mt-5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                  CS 1200 Syllabus
                </h3>
                <p className="relative z-10 mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
                  Fall 2025 Khoury first-year seminar syllabus covering course
                  structure, Odyssey modules, GitHub assignments, and campus
                  resources.
                </p>
                <span
                  className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:text-white"
                  style={{
                    borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
                  }}
                >
                  Open PDF
                </span>
              </motion.a>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Learning Outcomes</SectionLabel>
              <SectionHeading>What this course taught me to do.</SectionHeading>
            </motion.div>

            <div className="mt-8 flex flex-wrap justify-center gap-5">
              {learningOutcomes.map((outcome, i) => (
                <motion.div
                  key={outcome.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className={`glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)] ${BALANCED_GRID_ITEM}`}
                >
                  <div
                    className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                      color: ACCENT,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {outcome.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Reflection</SectionLabel>
            <SectionHeading>
              The starting point for every project that followed.
            </SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                CS 1200 became the starting point for every software project
                that followed. Before this course, I had never committed code,
                opened a pull request, or thought about how developers present
                their work publicly. Learning Git and GitHub gave me a repeatable
                workflow I still use daily — branch, commit, push, document,
                iterate.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                That foundation directly enabled projects like my{" "}
                <span className="font-medium text-foreground">
                  Personal Portfolio Website
                </span>
                ,{" "}
                <span className="font-medium text-foreground">
                  Instagram Wrapped
                </span>
                , and{" "}
                <span className="font-medium text-foreground">CardEdge</span>.
                . The habits CS 1200 introduced — README-driven development,
                clean repository structure, and professional technical
                communication — are not academic exercises. They are the same
                workflows I rely on every time I ship something new.
              </p>
            </motion.div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Course Highlights</SectionLabel>
            <SectionHeading>What the syllabus introduced.</SectionHeading>

            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                CS 1200 is an asynchronous first-year seminar designed to
                support students entering Khoury and Northeastern. Per the
                syllabus, the course explores Khoury&apos;s curriculum through
                interactive projects, connects students with academic advisors
                and campus resources, and builds early portfolio experience
                through module completion and Odyssey droplets.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Key learning goals include navigating university resources,
                understanding foundational differences between computing
                disciplines, and gaining exposure to modern industry tools —
                including GitHub assignments such as First Flight, Version
                Control, and a personal profile README submission.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {courseHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <span className="text-[15px] text-foreground-secondary">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-[13px] text-muted">
            © {COPYRIGHT_YEAR} Lokesh Addagiri. All rights reserved.
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
