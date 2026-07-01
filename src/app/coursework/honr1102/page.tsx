"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  HONR1102_STORYMAP_EMBED_URL,
  HONR1102_STORYMAP_PUBLIC_URL,
} from "@/lib/honr1102-storymap";
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
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/** Deep indigo, violet & Northeastern red — page-local accent only */
const ACCENT = "#312E81";
const ACCENT_LIGHT = "#6366F1";
const VIOLET = "#7C3AED";
const VIOLET_LIGHT = "#A78BFA";
const RED = "#C8102E";
const ACCENT_GLOW = "rgba(49, 46, 129, 0.38)";
const ACCENT_RGB = "49, 46, 129";
const VIOLET_RGB = "124, 58, 237";
const RED_RGB = "200, 16, 46";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const REFLECTION_PDF = "/documents/honr1102-reflection-essay.pdf";
const SYLLABUS_PDF = "/documents/honr1102-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Honors Program",
  "Leadership",
  "Community Engagement",
  "Storytelling",
  "Systems Thinking",
] as const;

const skills = [
  "Self-Exploration & Values",
  "Impact Area Research",
  "Knight Lab StoryMap",
  "Interdisciplinary Collaboration",
  "Source Evaluation",
  "Asset-Based Community Development",
  "Place-Based Storytelling",
  "Reflection Journaling",
  "Stakeholder Analysis",
  "Global Citizenship",
  "Professional Networking",
  "Scholarly Attribution",
] as const;

const assignmentOverview = [
  {
    title: "Personal Biography",
    description:
      "Introduce who you are — the values, experiences, and locations that shape how you see the world.",
  },
  {
    title: "Exploring an Impact Area",
    description:
      "Define a social or environmental issue aligned with your values and examine who it affects.",
  },
  {
    title: "Organizations Creating Change",
    description:
      "Map the institutions, nonprofits, and community partners working to address your impact area.",
  },
] as const;

const reflectionPreview = {
  title: "Reflection Essay",
  src: REFLECTION_PDF,
  alt: "First page of the HONR 1102 Honors Discovery reflection essay",
  caption:
    "Final reflection on how the StoryMap reshaped my understanding of youth mental health, digital access, and community-based solutions.",
  actionLabel: "Open PDF",
} as const;

const learningOutcomes = [
  {
    title: "Interdisciplinary Thinking",
    description:
      "Analyzing how two or more fields collaborate to address complex social and environmental challenges.",
  },
  {
    title: "Community Engagement",
    description:
      "Identifying stakeholders affected by an impact area and recognizing community strengths through ABCD.",
  },
  {
    title: "Asset-Based Community Development",
    description:
      "Focusing on what communities do well rather than deficit-based narratives when researching local issues.",
  },
  {
    title: "Research",
    description:
      "Locating academic and non-academic sources, annotating them, and evaluating reliability with proper attribution.",
  },
  {
    title: "Digital Storytelling",
    description:
      "Communicating findings through a Knight Lab StoryMap that links narrative, media, and geography.",
  },
  {
    title: "Systems Thinking",
    description:
      "Seeing how schools, nonprofits, hospitals, and policy actors interact within a single impact area.",
  },
  {
    title: "Reflective Learning",
    description:
      "Using journal prompts and the final reflection essay to connect coursework with personal growth.",
  },
  {
    title: "Ethical Reasoning",
    description:
      "Considering privacy, equity, and social responsibility when researching vulnerable populations.",
  },
  {
    title: "Global Citizenship",
    description:
      "Applying GlobeSmart cultural dimensions to communicate and make impact across diverse communities.",
  },
  {
    title: "Communication",
    description:
      "Presenting research clearly through maps, discussion posts, and the Honors Resource Fair.",
  },
  {
    title: "Leadership",
    description:
      "Examining personal goals and values to understand how you can lead through service and discovery.",
  },
  {
    title: "Professional Growth",
    description:
      "Building networks, exploring Honors resources, and planning pathways toward the Honors Impact Badge.",
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
        style={{ backgroundColor: ACCENT_LIGHT }}
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
                Interactive Honors StoryMap
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
              src={HONR1102_STORYMAP_EMBED_URL}
              title="HONR 1102 Honors StoryMap fullscreen"
              className="h-full w-full border-0 bg-[#0a0a0f]"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PdfEmbedPreview({
  src,
  title,
  heightClass = "h-[min(52vw,420px)]",
}: {
  src: string;
  title: string;
  heightClass?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0a0a0a] ${heightClass}`}
    >
      <iframe src={src} title={title} className="h-full w-full" />
    </div>
  );
}

function PdfPreviewCard({
  item,
  index,
}: {
  item: typeof reflectionPreview;
  index: number;
}) {
  return (
    <motion.a
      href={item.src}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      className="glass-strong group relative block h-full overflow-hidden rounded-3xl transition-all duration-500"
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="border-b border-white/[0.08] px-5 py-4">
        <p className="text-[14px] font-medium tracking-[-0.01em] text-foreground">
          {item.title}
        </p>
      </div>
      <PdfEmbedPreview src={item.src} title={item.alt} />
      <div className="p-5 sm:p-6">
        <p className="text-[14px] leading-relaxed text-muted">{item.caption}</p>
        <p
          className="mt-3 text-[12px] font-medium tracking-wide uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: VIOLET_LIGHT }}
        >
          {item.actionLabel}
        </p>
      </div>
    </motion.a>
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
  variant?: "primary" | "violet";
  onClick?: () => void;
}) {
  const isViolet = variant === "violet";
  const className =
    "inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white";

  const style = {
    borderColor: isViolet
      ? `rgba(${VIOLET_RGB}, 0.35)`
      : `rgba(${ACCENT_RGB}, 0.25)`,
    backgroundColor: isViolet
      ? `rgba(${VIOLET_RGB}, 0.08)`
      : `rgba(${ACCENT_RGB}, 0.06)`,
  };

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (isViolet) {
      e.currentTarget.style.backgroundColor = VIOLET;
      e.currentTarget.style.borderColor = VIOLET;
      e.currentTarget.style.boxShadow = `0 0 40px rgba(${VIOLET_RGB}, 0.35)`;
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
    if (isViolet) {
      e.currentTarget.style.backgroundColor = `rgba(${VIOLET_RGB}, 0.08)`;
      e.currentTarget.style.borderColor = `rgba(${VIOLET_RGB}, 0.35)`;
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
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </a>
  );
}

export default function HONR1102Page() {
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
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.07)` }}
        />
        <div
          className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${VIOLET_RGB}, 0.05)` }}
        />
        <div
          className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${RED_RGB}, 0.04)` }}
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
                  HONR 1102
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
                  borderColor: `rgba(${VIOLET_RGB}, 0.35)`,
                  backgroundColor: `rgba(${VIOLET_RGB}, 0.1)`,
                  color: VIOLET_LIGHT,
                }}
              >
                Honors Discovery
              </motion.span>

              <motion.h1
                custom={3}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Honors Discovery
              </motion.h1>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                An interdisciplinary Honors seminar exploring leadership, systems
                thinking, digital storytelling, community engagement,
                interdisciplinary research, and reflective learning.
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
            <SectionHeading>Developing a global perspective.</SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                Honors Discovery is designed to help first-year Honors students
                understand how to make a socially conscious impact in the
                communities they inhabit. Rather than jumping straight into
                advocacy, the course began with self-exploration — examining
                personal goals, values, and lived experiences to understand what
                kinds of change feel authentic. From there, I selected an impact
                area aligned with those values and used interdisciplinary
                thinking to study its complexity from multiple angles.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                The capstone Honors StoryMap assignment asked us to translate that
                learning into digital storytelling: introducing ourselves as
                Honors students, defining our impact area, and mapping
                organizations creating change in real places. Along the way,
                coursework in Asset-Based Community Development, source
                evaluation, GlobeSmart cultural dimensions, and reflective
                journaling pushed me to engage communities with care — not as
                subjects to study, but as partners whose strengths should shape
                how research is communicated.
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
                      style={{ backgroundColor: ACCENT_LIGHT }}
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
                  background: `linear-gradient(180deg, ${VIOLET}, ${ACCENT}, ${RED})`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: `rgba(${VIOLET_RGB}, 0.14)` }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${RED_RGB}, 0.35)`,
                  backgroundColor: `rgba(${RED_RGB}, 0.1)`,
                  color: "#E8324A",
                }}
              >
                Honors StoryMap Capstone
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                Interactive Honors StoryMap
              </h3>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                My Honors StoryMap unfolds in three movements. It opens with my
                Honors student biography — the personal background that led me to
                youth mental health and digital access as an impact area. The
                narrative then explores that issue in depth, examining who is
                affected and why geography matters when access is uneven. The final
                section maps organizations creating change, from Boston
                Children&apos;s Hospital and the Digital Wellness Lab to JED,
                Crisis Text Line, and community programs across Massachusetts —
                showing how interdisciplinary teams address a challenge no single
                institution can solve alone.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={HONR1102_STORYMAP_PUBLIC_URL}>
                  Open StoryMap ↗
                </AccentLinkButton>
                <AccentLinkButton href={REFLECTION_PDF} variant="violet">
                  Reflection Essay
                </AccentLinkButton>
              </div>
            </motion.article>
          </motion.section>

          <motion.section
            id="interactive-storymap"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Interactive StoryMap</SectionLabel>
            <SectionHeading>
              Explore the capstone project in full.
            </SectionHeading>

            <div className="mt-8">
              <motion.div
                variants={fadeUp}
                custom={0}
                className="glass-strong mb-6 overflow-hidden rounded-3xl border p-6 sm:p-8"
                style={{ borderColor: `rgba(${VIOLET_RGB}, 0.2)` }}
              >
                <p
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: VIOLET_LIGHT }}
                >
                  Assignment Overview
                </p>
                <p className="mt-3 max-w-3xl text-[15px] leading-[1.75] text-muted">
                  The Honors StoryMap capstone unfolded across three major
                  components — each building on the last to move from personal
                  narrative toward community-centered research.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {assignmentOverview.map((item, i) => (
                    <div
                      key={item.title}
                      className="glass rounded-2xl px-5 py-5"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold"
                        style={{
                          backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                          color: ACCENT_LIGHT,
                        }}
                      >
                        {i + 1}
                      </span>
                      <h4 className="mt-4 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-[14px] leading-[1.65] text-muted">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <StoryMapBrowserFrame>
                <iframe
                  src={HONR1102_STORYMAP_EMBED_URL}
                  title="HONR 1102 Interactive Honors StoryMap"
                  className="h-[min(70vh,640px)] w-full border-0"
                  allowFullScreen
                />
              </StoryMapBrowserFrame>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton onClick={openStorymapFullscreen}>
                  Open Fullscreen StoryMap
                </AccentLinkButton>
                <AccentLinkButton
                  href={HONR1102_STORYMAP_PUBLIC_URL}
                  variant="violet"
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
              <SectionLabel>Reflection Essay</SectionLabel>
              <SectionHeading>
                Connecting research to personal growth.
              </SectionHeading>
            </motion.div>

            <div className="mt-8 grid max-w-2xl grid-cols-1">
              <PdfPreviewCard item={reflectionPreview} index={1} />
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

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {learningOutcomes.map((outcome, i) => (
                <motion.div
                  key={outcome.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <div
                    className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                      color: ACCENT_LIGHT,
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
              Seeing global issues through multiple perspectives.
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
                style={{ backgroundColor: `rgba(${VIOLET_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                Creating the StoryMap changed how I understand youth mental
                health and digital access. What began as a broad interest became
                concrete once I chose meaningful locations — Weymouth, Milford,
                Boston, and Northeastern — and mapped the organizations operating
                in each place. Connecting personal memories from my hometowns
                with community-level barriers made the issue feel less abstract and
                far more urgent.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The project also clarified where I hope to contribute next, whether
                through research at the Digital Wellness Lab, data roles at
                organizations like JED or Crisis Text Line, or co-ops in
                ed-tech. It left real questions I still carry: how schools evaluate
                digital mental-health tools, how youth data privacy is protected,
                and how to ensure access reaches students who need it most. Those
                questions — and the interdisciplinary habits Honors Discovery
                built — are shaping my long-term path in data science and business
                administration.
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
