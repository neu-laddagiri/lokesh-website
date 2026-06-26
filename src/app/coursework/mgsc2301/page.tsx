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

/** Analytics dashboard accent — page-local only */
const ACCENT = "#1b698f";
const ACCENT_LIGHT = "#2d8ab8";
const ACCENT_GLOW = "rgba(27, 105, 143, 0.35)";
const ACCENT_RGB = "27, 105, 143";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/mgsc2301-syllabus.pdf";

const skills = [
  "Regression Analysis",
  "ANOVA",
  "Hypothesis Testing",
  "SPSS",
  "Statistical Inference",
] as const;

const projectHighlights = [
  "Analyzed 70 SEC program-seasons",
  "Evaluated athletic department spending from 2020–2024",
  "Built and interpreted a regression model",
  "Conducted hypothesis testing using t and F statistics",
  "Assessed statistical significance and model fit",
  "Generated business and sports management insights",
] as const;

const keyMetrics = [
  { label: "Program Seasons", value: "70", featured: false },
  { label: "Largest Athletic Budget", value: "$285M", featured: false },
  { label: "R²", value: "0.087", featured: false },
  { label: "P-Value", value: "0.013", featured: true },
] as const;

const dataInsights = [
  {
    title: "Statistically Significant",
    lines: ["t = -2.55", "p = .013"],
    footer: "Reject H₀",
  },
  {
    title: "Weak Predictive Power",
    lines: ["R² = 8.74%"],
    footer: "Most variation remains unexplained by spending alone.",
  },
  {
    title: "Real-World Insight",
    lines: [],
    footer:
      "Money helps performance, but coaching, recruiting, facilities, and program culture remain critical factors.",
  },
] as const;

const exploreImages = [
  {
    src: "/images/coursework/mgsc2301/mgsc2301-histogram-spending.png",
    alt: "Histogram of SEC standings distribution",
    caption: "Distribution of SEC standings across all observations.",
    layout: "chart" as const,
  },
  {
    src: "/images/coursework/mgsc2301/mgsc2301-boxplot-spending.png",
    alt: "Boxplot of SEC standings variability",
    caption:
      "Boxplot showing spread, quartiles, and variability within SEC standings.",
    layout: "chart" as const,
  },
] as const;

const scatterplotImage = {
  src: "/images/coursework/mgsc2301/mgsc2301-scatterplot.png",
  alt: "Scatterplot of athletic spending vs SEC standings with regression line",
  caption:
    "Scatterplot showing the relationship between athletic spending and final SEC standings with regression trendline.",
  layout: "landscape" as const,
} as const;

const regressionOutputImage = {
  src: "/images/coursework/mgsc2301/mgsc2301-regression-output.png",
  alt: "SPSS regression output for SEC football spending analysis",
  caption: "Regression model output from SPSS.",
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
    href: "/documents/mgsc2301-sec-regression-project.pdf",
  },
  { label: "Regression Analysis", icon: "regression" },
  { label: "Statistical Evidence", icon: "evidence" },
  { label: "Research Findings", icon: "findings" },
] as const;

const takeaways = [
  {
    title: "Data tells a story — statistics proves it.",
    description:
      "Statistical analysis transforms observations into evidence-based conclusions.",
  },
  {
    title: "Models are only as good as their assumptions.",
    description:
      "Understanding limitations is just as important as interpreting results.",
  },
  {
    title: "Significance does not equal importance.",
    description:
      "A relationship can be statistically significant while still having limited practical predictive power.",
  },
] as const;

const PDF_SRC = "/documents/mgsc2301-sec-regression-project.pdf";

const keyFindings = [
  {
    type: "positive" as const,
    title: "Statistically Significant Relationship",
    value: "p = 0.013",
  },
  {
    type: "positive" as const,
    title: "Reject Null Hypothesis",
    value: "t = -2.5517",
  },
  {
    type: "positive" as const,
    title: "Spending Has Measurable Impact",
    description:
      "Higher spending is associated with improved SEC standings.",
  },
  {
    type: "caution" as const,
    title: "Limited Predictive Power",
    value: "R² = 0.0874",
    description:
      "Spending explains only a small portion of team performance variation.",
  },
] as const;

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

function RegressionIcon() {
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
      <path d="M3 3v18h18" />
      <path d="M7 16l4-6 4 3 5-7" />
    </svg>
  );
}

function EvidenceIcon() {
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
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function FindingsIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
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
    case "regression":
      return <RegressionIcon />;
    case "evidence":
      return <EvidenceIcon />;
    case "findings":
      return <FindingsIcon />;
    default:
      return <DocumentIcon />;
  }
}

function aspectForLayout(
  layout: GalleryImage["layout"],
  variant: "default" | "showcase" = "default",
) {
  if (layout === "landscape") {
    return variant === "showcase" ? "aspect-[16/11.7]" : "aspect-[16/10]";
  }
  if (layout === "chart") return "aspect-[4/3]";
  return "aspect-[3/4]";
}

function GalleryCard({
  image,
  index,
  onOpen,
  variant = "default",
}: {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage) => void;
  variant?: "default" | "showcase";
}) {
  const aspectClass = aspectForLayout(image.layout, variant);
  const isShowcase = variant === "showcase";

  return (
    <motion.button
      type="button"
      custom={index}
      variants={fadeUp}
      whileHover={{
        y: -6,
        scale: 1.012,
        transition: { duration: 0.35 },
      }}
      onClick={() => onOpen(image)}
      className={`glass-strong group relative w-full overflow-hidden rounded-3xl text-left transition-all duration-500 ${
        isShowcase ? "p-2 sm:p-3" : "p-4 sm:p-5"
      }`}
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className={`relative ${aspectClass} overflow-hidden rounded-2xl bg-black/40`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            isShowcase
              ? "(max-width: 1024px) 100vw, 1200px"
              : "(max-width: 1024px) 100vw, 50vw"
          }
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] transition-all duration-300 group-hover:ring-[#1b698f]/30" />
      </div>
      {image.title ? (
        <>
          <p className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {image.title}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-foreground-secondary">
            {image.caption}
          </p>
        </>
      ) : (
        <p className="mt-3 text-[14px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-foreground-secondary">
          {image.caption}
        </p>
      )}
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
              className={`relative mx-auto w-full overflow-hidden rounded-2xl bg-background/60 ${aspectForLayout(image.layout, image.layout === "landscape" ? "showcase" : "default")} max-h-[75vh]`}
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

export default function MGSC2301Page() {
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
          style={{ backgroundColor: "rgba(27, 105, 143, 0.06)" }}
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
                  MGSC 2301
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
                Business Statistics
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Understanding data through statistical analysis, hypothesis
                testing, and predictive modeling.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-24 px-6 pb-32 lg:space-y-32 lg:px-8">
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
              Foundations of data-driven decision making.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                MGSC 2301 introduced the statistical methods that underpin modern
                business analytics — from descriptive summaries and probability
                distributions to inferential techniques used in real-world
                decision-making. The course emphasized both conceptual
                understanding and hands-on application through SPSS.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Across lectures, labs, and a capstone regression project, I
                developed the ability to formulate hypotheses, select appropriate
                tests, interpret results with confidence, and communicate
                findings clearly to non-technical audiences.
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
                    style={{ backgroundColor: "rgba(27, 105, 143, 0.12)" }}
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
            <SectionLabel>Featured Project</SectionLabel>
            <SectionHeading>
              Can money buy wins in SEC football?
            </SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: "rgba(27, 105, 143, 0.1)" }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{
                  borderColor: "rgba(27, 105, 143, 0.25)",
                  backgroundColor: "rgba(27, 105, 143, 0.1)",
                  color: ACCENT_LIGHT,
                }}
              >
                Capstone Project
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                SEC Football Spending vs. Performance Analysis
              </h3>

              <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-muted">
                This project investigated whether athletic department spending
                influences competitive success in SEC football programs. Using
                data from 70 program-seasons between 2020 and 2024, regression
                analysis was used to evaluate the relationship between spending
                and final SEC standings.
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
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {keyMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className={`rounded-2xl px-5 py-5 transition-shadow duration-300 ${
                          metric.featured
                            ? "border border-[#1b698f]/35 bg-[#1b698f]/[0.08] shadow-[0_0_40px_rgba(27,105,143,0.15)]"
                            : "glass border border-border"
                        }`}
                      >
                        <p className="text-[12px] font-medium tracking-wide text-muted">
                          {metric.label}
                        </p>
                        <p
                          className={`mt-2 font-semibold tracking-[-0.02em] ${
                            metric.featured
                              ? "text-[clamp(1.5rem,3vw,2rem)]"
                              : "text-xl"
                          }`}
                          style={{
                            color: metric.featured ? ACCENT_LIGHT : "#f5f5f7",
                          }}
                        >
                          {metric.value}
                        </p>
                        {metric.featured && (
                          <p
                            className="mt-1 text-[11px] font-medium tracking-wide uppercase"
                            style={{ color: ACCENT }}
                          >
                            Statistically Significant
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>

          {/* What the data revealed */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Analysis</SectionLabel>
              <SectionHeading>What the data revealed.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {dataInsights.map((insight, i) => (
                <motion.div
                  key={insight.title}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass-strong rounded-3xl p-8 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                >
                  <p
                    className="text-[13px] font-medium tracking-[0.14em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    {insight.title}
                  </p>
                  {insight.lines.length > 0 && (
                    <div className="mt-5 space-y-2">
                      {insight.lines.map((line) => (
                        <p
                          key={line}
                          className="text-2xl font-semibold tracking-[-0.03em] text-foreground"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-[15px] leading-[1.7] text-muted ${
                      insight.lines.length > 0 ? "mt-4" : "mt-5"
                    }`}
                  >
                    {insight.footer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Exploring the data */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Exploratory Analysis</SectionLabel>
              <SectionHeading>Exploring the data.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {exploreImages.map((image, i) => (
                <GalleryCard
                  key={image.src}
                  image={image}
                  index={i + 1}
                  onOpen={setLightboxImage}
                />
              ))}
            </div>
          </motion.section>

          {/* Regression analysis */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Regression Analysis</SectionLabel>
            <SectionHeading>Regression analysis.</SectionHeading>

            <div
              className="mt-8 rounded-3xl p-px shadow-[0_0_60px_rgba(27,105,143,0.12)]"
              style={{
                background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.4), rgba(${ACCENT_RGB},0.06))`,
              }}
            >
              <GalleryCard
                image={scatterplotImage}
                index={1}
                onOpen={setLightboxImage}
                variant="showcase"
              />
            </div>
          </motion.section>

          {/* Statistical evidence */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Statistical Evidence</SectionLabel>
              <SectionHeading>Statistical evidence.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
              <GalleryCard
                image={regressionOutputImage}
                index={1}
                onOpen={setLightboxImage}
              />

              <motion.div
                custom={2}
                variants={fadeUp}
                className="glass-strong flex flex-col rounded-3xl border border-[#1b698f]/25 p-8 sm:p-10"
                style={{
                  boxShadow: "0 0 40px rgba(27, 105, 143, 0.08)",
                }}
              >
                <p
                  className="text-[13px] font-medium tracking-[0.14em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Key Findings
                </p>

                <div className="mt-8 space-y-4">
                  {keyFindings.map((finding) => (
                    <div
                      key={finding.title}
                      className={`rounded-2xl border px-5 py-4 transition-colors duration-300 ${
                        finding.type === "positive"
                          ? "border-[#1b698f]/20 bg-[#1b698f]/[0.06]"
                          : "border-amber-500/20 bg-amber-500/[0.04]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                            finding.type === "positive"
                              ? "text-[#1b698f]"
                              : "text-amber-400"
                          }`}
                          style={
                            finding.type === "positive"
                              ? { backgroundColor: "rgba(27, 105, 143, 0.15)" }
                              : { backgroundColor: "rgba(245, 158, 11, 0.12)" }
                          }
                        >
                          {finding.type === "positive" ? "✓" : "⚠"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                            {finding.title}
                          </p>
                          {"value" in finding && finding.value && (
                            <p
                              className="mt-1.5 text-xl font-semibold tracking-[-0.02em]"
                              style={{
                                color:
                                  finding.type === "positive"
                                    ? ACCENT_LIGHT
                                    : "#fbbf24",
                              }}
                            >
                              {finding.value}
                            </p>
                          )}
                          {"description" in finding && finding.description && (
                            <p className="mt-1.5 text-[14px] leading-[1.65] text-muted">
                              {finding.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Insight */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Insight</SectionLabel>
            <SectionHeading>What the analysis actually means.</SectionHeading>

            <motion.div
              className="glass-strong relative mt-8 overflow-hidden rounded-3xl border border-[#1b698f]/30 p-8 sm:p-12"
              style={{
                boxShadow: "0 0 80px rgba(27, 105, 143, 0.1)",
              }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: "rgba(27, 105, 143, 0.08)" }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                Although spending showed a statistically significant relationship
                with SEC performance, the low R² value indicates that financial
                investment alone does not explain success. Factors such as
                recruiting quality, coaching effectiveness, player development,
                team culture, and institutional support likely play a much larger
                role in determining outcomes. The analysis demonstrates that
                money matters, but it is only one piece of a much larger
                competitive equation.
              </p>
            </motion.div>
          </motion.section>

          {/* PDF Presentation */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Presentation</SectionLabel>
            <SectionHeading>Full project report.</SectionHeading>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
              Scroll through the complete regression analysis — from data
              exploration and model specification to hypothesis testing and
              business insights.
            </p>

            <motion.div
              whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
              className="glass-strong mt-8 overflow-hidden rounded-3xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <p className="text-[14px] font-medium tracking-[-0.01em] text-foreground">
                  SEC Football Spending vs. Performance Analysis
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
                title="SEC Football Spending vs. Performance Analysis Report"
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
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
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
                      backgroundColor: "rgba(27, 105, 143, 0.12)",
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
