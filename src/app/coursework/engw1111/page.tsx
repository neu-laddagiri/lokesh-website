"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  SyllabusHeaderButton,
  type CourseAccent,
} from "@/components/coursework/artifact-cards";
import {
  ENGW1111_STORYMAP_EMBED_URL,
  ENGW1111_STORYMAP_PUBLIC_URL,
} from "@/lib/engw1111-storymap";
import { resumeExternalProps } from "@/lib/profile-links";
import { subpageNavLinks as navLinks } from "@/lib/site-nav";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/** Northeastern red — page-local accent only */
const ACCENT = "#C8102E";
const ACCENT_LIGHT = "#E8324A";
const NAVY = "#1E3A5F";
const NAVY_LIGHT = "#3B6EA5";
const ACCENT_GLOW = "rgba(200, 16, 46, 0.35)";
const ACCENT_RGB = "200, 16, 46";
const NAVY_RGB = "30, 58, 95";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/engw1111-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Professional Writing",
  "Digital Storytelling",
  "Rhetorical Analysis",
  "Research",
  "Communication",
] as const;

const skills = [
  "Professional Writing",
  "Digital Storytelling",
  "Knight Lab StoryMap",
  "Rhetorical Analysis",
  "Audience Awareness",
  "Research Writing",
  "Multimedia Communication",
  "Critical Reading",
  "Persuasive Writing",
  "Genre Analysis",
  "Source Integration",
  "Revision & Editing",
] as const;

const writingPrinciples = [
  {
    title: "Clear Communication",
    description:
      "Write clearly and efficiently without unnecessary complexity.",
  },
  {
    title: "Audience Awareness",
    description:
      "Adapt writing style for different readers and purposes.",
  },
  {
    title: "Storytelling",
    description: "Use narrative to communicate ideas effectively.",
  },
  {
    title: "Persuasion",
    description:
      "Apply rhetorical strategies to strengthen arguments.",
  },
  {
    title: "Research",
    description: "Locate and integrate credible academic sources.",
  },
  {
    title: "Revision",
    description:
      "Improve organization and clarity through iterative editing.",
  },
  {
    title: "Critical Reading",
    description: "Analyze author intent and rhetorical choices.",
  },
  {
    title: "Organization",
    description:
      "Structure ideas logically from introduction to conclusion.",
  },
  {
    title: "Professional Tone",
    description:
      "Communicate appropriately in academic and workplace settings.",
  },
  {
    title: "Grammar",
    description: "Strengthen clarity through careful editing.",
  },
  {
    title: "Collaboration",
    description: "Provide and incorporate constructive peer feedback.",
  },
  {
    title: "Confidence",
    description:
      "Present ideas effectively in both written and spoken communication.",
  },
] as const;

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.07, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
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

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

function StoryMapBrowserFrame({
  children,
  urlLabel = "storymap.knightlab.com",
}: {
  children: React.ReactNode;
  urlLabel?: string;
}) {
  return (
    <div className="glass-strong overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-1.5 text-[11px] text-muted sm:text-[12px]">
            <GlobeIcon />
            <span className="truncate">{urlLabel}</span>
          </div>
        </div>
        <div className="hidden w-[52px] sm:block" aria-hidden />
      </div>
      <div className="relative bg-[#0a0a0f]">{children}</div>
    </div>
  );
}

function StoryMapLaunchFallback() {
  return (
    <div className="relative flex min-h-[min(70vh,640px)] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,58,95,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,58,95,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(30,58,95,0.45), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-8 right-0 left-0 h-24 opacity-30"
        style={{
          background:
            "linear-gradient(180deg, rgba(200,16,46,0.2), transparent)",
        }}
        aria-hidden
      />
      <svg
        viewBox="0 0 400 80"
        className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 opacity-20"
        aria-hidden
      >
        <path
          d="M0 80 L40 50 L80 60 L120 35 L160 45 L200 25 L240 40 L280 20 L320 35 L360 15 L400 30 L400 80 Z"
          fill={`rgba(${NAVY_RGB}, 0.8)`}
        />
      </svg>

      <div className="relative z-10 max-w-xl">
        <p
          className="text-[11px] font-semibold tracking-[0.14em] uppercase"
          style={{ color: NAVY_LIGHT }}
        >
          External Interactive Experience
        </p>
        <h3 className="mt-4 text-[clamp(1.25rem,3vw,1.75rem)] font-semibold tracking-[-0.03em] text-foreground">
          More Than a Game
        </h3>
        <p className="mt-4 text-[15px] leading-[1.75] text-muted">
          This Knight Lab StoryMap maps Boston&apos;s iconic sports venues —
          Fenway Park, TD Garden, Gillette Stadium, and more — tracing how
          place, history, and culture shape the city&apos;s identity. Launch the
          full interactive experience in a new tab for maps, media, and
          narrative slides.
        </p>
        <a
          href={ENGW1111_STORYMAP_PUBLIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full border px-8 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
          style={{
            borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
            backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = ACCENT;
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.1)`;
            e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.35)`;
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.color = "";
          }}
        >
          Launch Interactive StoryMap ↗
        </a>
      </div>
    </div>
  );
}

function StoryMapEmbed() {
  const [embedBlocked, setEmbedBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(ENGW1111_STORYMAP_EMBED_URL, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && !res.ok) setEmbedBlocked(true);
      })
      .catch(() => {
        /* CORS or network — keep iframe; embed may still work */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (embedBlocked) {
    return <StoryMapLaunchFallback />;
  }

  return (
    <iframe
      src={ENGW1111_STORYMAP_EMBED_URL}
      title="ENGW 1111 More Than a Game StoryMap"
      className="h-[min(70vh,640px)] w-full border-0"
      allowFullScreen
    />
  );
}

function StoryMapFullscreenModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen StoryMap"
        >
          <motion.button
            type="button"
            aria-label="Close fullscreen StoryMap"
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 flex h-[min(92vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#1a1a22]/95 px-4 py-3 backdrop-blur-xl sm:px-5">
              <div className="flex gap-2" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <p className="text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary">
                More Than a Game — StoryMap
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.12] text-muted transition-colors hover:bg-card-hover hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <iframe
              src={ENGW1111_STORYMAP_EMBED_URL}
              title="ENGW 1111 StoryMap fullscreen"
              className="h-full w-full border-0 bg-[#0a0a0f]"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AccentLinkButton({
  href,
  children,
  variant = "primary",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) {
  const isSecondary = variant === "secondary";
  const className =
    "inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white";

  const style = {
    borderColor: isSecondary
      ? `rgba(${NAVY_RGB}, 0.35)`
      : `rgba(${ACCENT_RGB}, 0.25)`,
    backgroundColor: isSecondary
      ? `rgba(${NAVY_RGB}, 0.08)`
      : `rgba(${ACCENT_RGB}, 0.06)`,
  };

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (isSecondary) {
      e.currentTarget.style.backgroundColor = NAVY;
      e.currentTarget.style.borderColor = NAVY;
      e.currentTarget.style.boxShadow = `0 0 40px rgba(${NAVY_RGB}, 0.35)`;
    } else {
      e.currentTarget.style.backgroundColor = ACCENT;
      e.currentTarget.style.borderColor = ACCENT;
      e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
    }
    e.currentTarget.style.color = "#ffffff";
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "";
    e.currentTarget.style.boxShadow = "none";
    if (isSecondary) {
      e.currentTarget.style.backgroundColor = `rgba(${NAVY_RGB}, 0.08)`;
      e.currentTarget.style.borderColor = `rgba(${NAVY_RGB}, 0.35)`;
    } else {
      e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.06)`;
      e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.25)`;
    }
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        style={style}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </a>
  );
}

export default function ENGW1111Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [storymapFullscreen, setStorymapFullscreen] = useState(false);
  const { scrollY } = useScroll();

  const openStorymapFullscreen = useCallback(() => {
    setStorymapFullscreen(true);
  }, []);

  const closeStorymapFullscreen = useCallback(() => {
    setStorymapFullscreen(false);
  }, []);

  const scrollToStorymap = useCallback(() => {
    document
      .getElementById("explore-the-story")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <StoryMapFullscreenModal
        open={storymapFullscreen}
        onClose={closeStorymapFullscreen}
      />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div
          className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${NAVY_RGB}, 0.05)` }}
        />
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
                  ENGW 1111
                </span>
                <span className="hidden text-muted/50 sm:inline" aria-hidden>
                  •
                </span>
                <SyllabusHeaderButton
                  href={SYLLABUS_PDF}
                  accent={courseAccent}
                />
              </motion.div>

              <motion.span
                custom={2}
                variants={fadeUp}
                className="mt-4 inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                  color: ACCENT_LIGHT,
                }}
              >
                Writing &amp; Communication
              </motion.span>

              <motion.h1
                custom={3}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                First-Year Writing
              </motion.h1>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Developing professional communication through storytelling,
                rhetoric, research, digital media, and audience-focused writing.
              </motion.p>

              <motion.div
                custom={5}
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
            <SectionHeading>Writing beyond the classroom.</SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                ENGW 1111 introduced writing as a process of communication rather
                than simply producing essays. Throughout the semester I developed
                skills in rhetorical analysis, audience awareness, storytelling,
                revision, and research-based writing while learning how effective
                communication changes depending on purpose and audience.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                The capstone Knight Lab StoryMap project pushed that work further —
                combining long-form research, historical analysis, and multimedia
                storytelling into one interactive narrative about how Boston&apos;s
                sports spaces shape the city&apos;s identity. Building the project
                taught me that strong writing extends beyond the page into digital
                environments where readers explore ideas through maps, images, and
                place-based narrative.
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
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Featured Project</SectionLabel>
            <SectionHeading>
              A semester-long journey in digital storytelling.
            </SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12 lg:p-14 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.32)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1"
                style={{
                  background: `linear-gradient(180deg, ${NAVY}, ${ACCENT})`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: `rgba(${NAVY_RGB}, 0.14)` }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${NAVY_RGB}, 0.35)`,
                  backgroundColor: `rgba(${NAVY_RGB}, 0.1)`,
                  color: NAVY_LIGHT,
                }}
              >
                Knight Lab StoryMap
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                More Than a Game: How Sports Spaces Shape Boston&apos;s Identity
              </h3>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                This interactive StoryMap explores how Fenway Park, TD Garden,
                Gillette Stadium, and other iconic sports locations have
                influenced Boston&apos;s identity, neighborhoods, history, and
                culture. Built using Knight Lab StoryMap, the project combines
                research, writing, geography, historical analysis, and multimedia
                storytelling into one interactive experience.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={ENGW1111_STORYMAP_PUBLIC_URL}>
                  Launch StoryMap ↗
                </AccentLinkButton>
                <AccentLinkButton onClick={scrollToStorymap} variant="secondary">
                  Project Overview
                </AccentLinkButton>
              </div>
            </motion.article>
          </motion.section>

          <motion.section
            id="explore-the-story"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Interactive StoryMap</SectionLabel>
            <SectionHeading>Explore the Story.</SectionHeading>

            <div className="mt-8">
              <StoryMapBrowserFrame>
                <StoryMapEmbed />
              </StoryMapBrowserFrame>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton onClick={openStorymapFullscreen}>
                  Open Fullscreen StoryMap
                </AccentLinkButton>
                <AccentLinkButton
                  href={ENGW1111_STORYMAP_PUBLIC_URL}
                  variant="secondary"
                >
                  Launch Interactive StoryMap ↗
                </AccentLinkButton>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Writing Principles</SectionLabel>
              <SectionHeading>What this course taught me to do.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {writingPrinciples.map((principle, i) => (
                <motion.div
                  key={principle.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
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
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                    {principle.description}
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
            <SectionHeading>Communication as a technical skill.</SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${NAVY_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                Building the StoryMap changed how I think about writing for digital
                audiences. Rather than delivering a single linear essay, I had to
                organize a long-form narrative across slides, maps, and media —
                deciding what readers see first, how geography anchors each
                argument, and how visual storytelling keeps complex ideas
                accessible. Combining research with interactive storytelling forced
                me to think about audience engagement at every step, not just in
                the final draft.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The project also showed me that technical writing extends into
                web-based environments. Communicating Boston&apos;s sports history
                through Knight Lab meant balancing credibility, concision, and
                multimedia design — skills I now carry into data reports, project
                documentation, and this portfolio. ENGW 1111 proved that clear
                communication is one of the most transferable skills I have
                developed at Northeastern, whether the medium is a page, a
                presentation, or an interactive map.
              </p>
            </motion.div>
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
