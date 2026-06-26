"use client";

import { ThemeToggle } from "@/components/theme-toggle";
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

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: "/#resume" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Deep blue / cyan — data science accent, page-local only */
const ACCENT = "#0EA5E9";
const ACCENT_LIGHT = "#38BDF8";
const ACCENT_CYAN = "#22D3EE";
const ACCENT_GLOW = "rgba(14, 165, 233, 0.38)";
const ACCENT_RGB = "14, 165, 233";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/ds2500-syllabus.pdf";
const FINAL_REPORT = "/documents/ds2500-banking-fraud-final-report.pdf";
const PRESENTATION = "/documents/ds2500-banking-fraud-presentation.pdf";
const PROJECT_SPEC = "/documents/ds2500-project-spec.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Python",
  "Data Science",
  "Pandas",
  "APIs",
  "Machine Learning",
] as const;

const skills = [
  "Python",
  "Pandas",
  "Matplotlib",
  "JSON APIs",
  "Data Cleaning",
  "Feature Engineering",
  "Exploratory Data Analysis",
  "Statistical Analysis",
  "Machine Learning Foundations",
  "Git Collaboration",
  "Object-Oriented Programming",
  "Research Communication",
] as const;

const projectPreviews = [
  {
    src: "/images/coursework/ds2500/ds2500-project-cover.png",
    title: "Project Cover",
    alt: "Banking fraud and corporate misconduct research project cover",
    caption:
      "Capstone deliverable overview — CFPB consumer complaint analysis across major financial institutions.",
  },
  {
    src: "/images/coursework/ds2500/ds2500-top-complaints.png",
    title: "Top Complaint Categories",
    alt: "Chart of top consumer banking complaint categories",
    caption:
      "Exploratory breakdown of the most frequent complaint types in the collected CFPB dataset.",
  },
  {
    src: "/images/coursework/ds2500/ds2500-wells-fargo-analysis.png",
    title: "Wells Fargo Analysis",
    alt: "Wells Fargo complaint analysis visualization",
    caption:
      "Institution-level comparison examining Wells Fargo complaint patterns around enforcement events.",
  },
  {
    src: "/images/coursework/ds2500/ds2500-td-bank-trends.png",
    title: "TD Bank Trends",
    alt: "TD Bank complaint volume trends over time",
    caption:
      "Time-series visualization tracking TD Bank complaint volume and behavioral shifts across periods.",
  },
] as const;

const downloads = [
  {
    title: "Final Report",
    description:
      "Full written research report on regulatory penalties and consumer complaint patterns across major banks.",
    href: FINAL_REPORT,
    actionLabel: "Open PDF",
    icon: "report",
  },
  {
    title: "Presentation Slides",
    description:
      "Team presentation summarizing methodology, findings, and conclusions for the capstone project.",
    href: PRESENTATION,
    actionLabel: "Open PDF",
    icon: "slides",
  },
  {
    title: "Project Specification",
    description:
      "Original project requirements, deliverable expectations, and grading criteria for the semester capstone.",
    href: PROJECT_SPEC,
    actionLabel: "Open PDF",
    icon: "spec",
  },
  {
    title: "Course Syllabus",
    description:
      "DS 2500 syllabus covering Python programming, data analysis, machine learning, and project milestones.",
    href: SYLLABUS_PDF,
    actionLabel: "Open PDF",
    icon: "syllabus",
  },
] as const;

const learningOutcomes = [
  {
    title: "API Development",
    description:
      "Querying external data sources programmatically and handling paginated JSON responses.",
  },
  {
    title: "JSON Processing",
    description:
      "Parsing, filtering, and restructuring nested API payloads into analysis-ready tables.",
  },
  {
    title: "Data Visualization",
    description:
      "Communicating patterns clearly with Matplotlib charts tuned for technical audiences.",
  },
  {
    title: "Exploratory Analysis",
    description:
      "Investigating distributions, outliers, and relationships before formal modeling.",
  },
  {
    title: "Object-Oriented Programming",
    description:
      "Designing reusable Python classes that organize data pipelines and project logic.",
  },
  {
    title: "Python Programming",
    description:
      "Writing intermediate-level scripts with functions, modules, and disciplined structure.",
  },
  {
    title: "Machine Learning Concepts",
    description:
      "Applying foundational ML ideas to real datasets with appropriate skepticism and validation.",
  },
  {
    title: "Team Software Development",
    description:
      "Dividing responsibilities, integrating contributions, and shipping a shared codebase.",
  },
  {
    title: "Professional Research",
    description:
      "Framing questions, citing sources, and defending conclusions with evidence.",
  },
  {
    title: "Git Collaboration",
    description:
      "Branching, merging, and reviewing teammate changes on a shared repository.",
  },
  {
    title: "Statistical Thinking",
    description:
      "Comparing groups, interpreting variation, and avoiding overclaiming from noisy data.",
  },
  {
    title: "Technical Presentation",
    description:
      "Distilling complex analysis into slides that non-specialists can follow.",
  },
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

function ReportIcon() {
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

function SlidesIcon() {
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
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function SpecIcon() {
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
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function downloadIcon(type: string) {
  switch (type) {
    case "slides":
      return <SlidesIcon />;
    case "spec":
      return <SpecIcon />;
    default:
      return <ReportIcon />;
  }
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

function DataAmbientLayer() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.14]"
      aria-hidden
    >
      <defs>
        <pattern
          id="ds-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke={`rgba(${ACCENT_RGB}, 0.35)`}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ds-grid)" />
      {[
        [140, 120],
        [280, 200],
        [420, 90],
        [560, 240],
        [700, 160],
        [200, 320],
        [480, 360],
        [640, 300],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={3}
          fill={`rgba(34, 211, 238, ${0.25 + (i % 3) * 0.1})`}
        />
      ))}
    </svg>
  );
}

function AccentLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
      style={{
        borderColor: `rgba(${ACCENT_RGB}, 0.28)`,
        backgroundColor: `rgba(${ACCENT_RGB}, 0.07)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = ACCENT;
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.07)`;
        e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.28)`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </a>
  );
}

function PreviewCard({
  item,
  index,
  onOpen,
}: {
  item: (typeof projectPreviews)[number];
  index: number;
  onOpen: (image: GalleryImage) => void;
}) {
  return (
    <motion.button
      type="button"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      onClick={() =>
        onOpen({
          src: item.src,
          alt: item.alt,
          title: item.title,
          caption: item.caption,
        })
      }
      className="glass-strong group w-full overflow-hidden rounded-3xl text-left transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(14,165,233,0.18)]"
    >
      <p className="border-b border-white/[0.06] px-5 py-4 text-[14px] font-medium tracking-[-0.01em] text-foreground">
        {item.title}
      </p>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a1628]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <p className="px-5 py-4 text-[14px] leading-relaxed text-muted">
        {item.caption}
      </p>
      <p
        className="px-5 pb-5 text-[12px] font-medium tracking-wide uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: ACCENT_LIGHT }}
      >
        Click to enlarge
      </p>
    </motion.button>
  );
}

function DownloadCard({
  item,
  index,
}: {
  item: (typeof downloads)[number];
  index: number;
}) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 sm:p-8"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
          color: ACCENT,
        }}
      >
        {downloadIcon(item.icon)}
      </span>
      <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
        {item.title}
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
        {item.description}
      </p>
      <span
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(14,165,233,0.35)]"
        style={{
          borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
          backgroundColor: `rgba(${ACCENT_RGB}, 0.06)`,
        }}
      >
        {item.actionLabel}
      </span>
    </motion.a>
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
            className="absolute inset-0 bg-black/88 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
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
            <div className="relative mx-auto aspect-[16/10] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-[#0a1628]">
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

export default function DS2500Page() {
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
          animate={{ opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 h-[520px] w-[840px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(ellipse, rgba(${ACCENT_RGB}, 0.09) 0%, rgba(34, 211, 238, 0.04) 50%, transparent 72%)`,
          }}
        />
        <DataAmbientLayer />
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
                  DS 2500
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
                Intermediate Programming
                <br />
                with Data
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Intermediate Python programming, APIs, exploratory data analysis,
                statistical modeling, machine learning foundations, and
                collaborative software development.
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
              Programming with data, not just for data.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                DS 2500 focused on intermediate Python programming for data
                science — object-oriented design, working with APIs, cleaning
                messy real-world datasets, building visualizations, and
                introducing machine learning fundamentals within a collaborative
                software engineering workflow.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                The semester culminated in a team research project analyzing
                consumer banking complaints using live CFPB data. We collected
                roughly 35,000 records through the CFPB API, explored complaint
                patterns across major institutions, and evaluated whether
                regulatory enforcement actions appear to change harmful consumer
                outcomes — my first complete end-to-end data science pipeline.
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
                      style={{ backgroundColor: ACCENT_CYAN }}
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
              Banking fraud &amp; corporate misconduct.
            </SectionHeading>

            <motion.article
              whileHover={{ y: -4, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12 lg:p-14"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.32)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.1)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1"
                style={{
                  background: `linear-gradient(180deg, ${ACCENT_CYAN}, ${ACCENT})`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.14)` }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                  color: ACCENT_LIGHT,
                }}
              >
                Capstone Research Project
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                Banking Fraud &amp; Corporate Misconduct
              </h3>
              <p
                className="mt-3 text-[18px] font-medium tracking-[-0.02em]"
                style={{ color: ACCENT_LIGHT }}
              >
                Do Regulatory Penalties Change Bank Behavior?
              </p>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                Using roughly 35,000 CFPB consumer complaints collected through
                the CFPB API, our team investigated whether major enforcement
                actions against large banks appear to reduce harmful consumer
                complaint patterns. The project combined API-based data
                collection, exploratory analysis, visualization, and statistical
                comparisons across multiple financial institutions.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={FINAL_REPORT}>
                  View Final Report
                </AccentLinkButton>
                <AccentLinkButton href={PRESENTATION}>
                  View Presentation
                </AccentLinkButton>
              </div>
            </motion.article>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Project Preview</SectionLabel>
              <SectionHeading>Visuals from the capstone analysis.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
              {projectPreviews.map((item, i) => (
                <PreviewCard
                  key={item.src}
                  item={item}
                  index={i + 1}
                  onOpen={setLightboxImage}
                />
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
              <SectionLabel>Downloads</SectionLabel>
              <SectionHeading>Reports, slides, and course files.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
              {downloads.map((item, i) => (
                <DownloadCard key={item.title} item={item} index={i + 1} />
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
              <SectionLabel>Learning Outcomes</SectionLabel>
              <SectionHeading>What this course taught me to do.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {learningOutcomes.map((outcome, i) => (
                <motion.div
                  key={outcome.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
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
              My first end-to-end data science workflow.
            </SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-12"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.28)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.08)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                DS 2500 significantly strengthened my programming abilities
                beyond introductory Python. I learned to work with real-world
                APIs, clean messy datasets that never arrive in tidy CSV form,
                and build reproducible analysis pipelines my teammates could
                trust. Creating professional visualizations and communicating
                technical findings through written reports and presentations
                became as important as writing the code itself.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The CFPB banking project was my first complete end-to-end data
                science workflow — from API collection through exploratory
                analysis to a defended conclusion. Collaborating with Git,
                dividing analytical responsibilities, and integrating our work
                into a single narrative taught me how data science actually
                happens in teams. That foundation directly prepared me for
                future machine learning and analytics coursework, where rigor,
                reproducibility, and clear communication are non-negotiable.
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
