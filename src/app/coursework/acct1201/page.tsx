"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
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
  { label: "Resume", href: PROFILE_LINKS.resume },
  { label: "Contact", href: "/#contact" },
] as const;

/** Northeastern red accent — page-local only */
const ACCENT = "#C8102E";
const ACCENT_LIGHT = "#E8324A";
const ACCENT_GLOW = "rgba(200, 16, 46, 0.35)";
const ACCENT_RGB = "200, 16, 46";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const SYLLABUS_PDF = "/documents/acct1201-syllabus.pdf";
const EXCEL_MODEL = "/documents/acct1201-financial-model.xlsx";
const FINANCIAL_REPORT = "/documents/acct1201-financial-report.pdf";
const AI_REFLECTION = "/documents/acct1201-deliverable-2.pdf";
const ALUMNI_PANEL = "/documents/acct1201-accounting-alumni-panel.pdf";

const heroMetadata = [
  "Northeastern University",
  "Fall 2025",
  "Professor Patrick Hurley",
] as const;

const skills = [
  "Financial Statement Analysis",
  "Ratio Analysis",
  "Excel Modeling",
  "SEC EDGAR",
  "Corporate Valuation",
  "GAAP",
  "Cash Flow Analysis",
  "Balance Sheet Analysis",
  "Income Statement Analysis",
  "Professional Communication",
  "AI-assisted Financial Analysis",
] as const;

/** Centers incomplete last rows without stretching cards (3 → 2 → 1 columns). */
const SKILLS_GRID_ITEM =
  "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]";
const DOWNLOADS_GRID_ITEM =
  "w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)]";

const EXCEL_MODEL_IMAGE =
  "/images/coursework/acct1201/acct1201-financial-data.png";
const RATIO_ANALYSIS_IMAGE =
  "/images/coursework/acct1201/acct1201-ratio-analysis.png";

const projectHighlights = [
  {
    kind: "image" as const,
    title: "Excel Financial Model",
    src: EXCEL_MODEL_IMAGE,
    alt: "Excel financial model with linked statements and ratio calculations",
    caption:
      "Integrated workbook connecting income statement, balance sheet, and cash flow data.",
    layout: "chart" as const,
  },
  {
    kind: "pdf" as const,
    title: "Final Report Preview",
    src: FINANCIAL_REPORT,
    alt: "First page of the Tesla vs Ford financial reporting analysis",
    caption:
      "Written investment analysis synthesizing SEC research, ratio trends, and valuation conclusions.",
  },
  {
    kind: "pdf" as const,
    title: "Accounting Alumni Panel Flyer",
    src: ALUMNI_PANEL,
    alt: "First page of the Northeastern Accounting Alumni Panel event flyer",
    caption:
      "Event overview featuring alumni from Deloitte, PwC, EY, and KPMG.",
  },
  {
    kind: "image" as const,
    title: "Financial Ratio Analysis",
    src: RATIO_ANALYSIS_IMAGE,
    alt: "Financial ratio analysis spreadsheet comparing Tesla and Ford",
    caption:
      "Ratio worksheet evaluating liquidity, profitability, efficiency, and leverage.",
    layout: "chart" as const,
  },
] as const;

const downloadItems = [
  {
    title: "Tesla vs Ford Final Report",
    description:
      "Semester capstone report comparing Tesla and Ford through SEC filings, financial modeling, and ratio-based investment analysis.",
    href: FINANCIAL_REPORT,
    icon: "report",
    actionLabel: "Open PDF",
  },
  {
    title: "Financial Reporting Analysis Workbook",
    description:
      "Excel model with linked financial statements, ratio calculations, competitor benchmarking, and SEC 10-K analysis.",
    href: EXCEL_MODEL,
    icon: "spreadsheet",
    actionLabel: "Download Excel",
    download: true,
  },
  {
    title: "AI Financial Reflection",
    description:
      "Reflection on AI-assisted accounting analysis, prompt engineering, accuracy limits, and professional judgement.",
    href: AI_REFLECTION,
    icon: "reflection",
    actionLabel: "Open PDF",
  },
  {
    title: "Accounting Alumni Panel Flyer",
    description:
      "Event flyer from Northeastern's Accounting Alumni Panel on public accounting careers and recruiting.",
    href: ALUMNI_PANEL,
    icon: "event",
    actionLabel: "Open PDF",
  },
] as const;

const learningOutcomes = [
  {
    title: "Reading SEC Filings",
    description:
      "Navigating EDGAR, locating 10-K reports, and extracting relevant financial disclosures.",
  },
  {
    title: "Financial Modeling",
    description:
      "Building structured Excel models that connect statements, assumptions, and forecasts.",
  },
  {
    title: "Ratio Analysis",
    description:
      "Calculating and interpreting liquidity, profitability, efficiency, and leverage ratios.",
  },
  {
    title: "Investment Analysis",
    description:
      "Evaluating public companies using quantitative evidence and qualitative business context.",
  },
  {
    title: "Corporate Decision Making",
    description:
      "Connecting accounting outputs to strategy, risk, and stakeholder decision making.",
  },
  {
    title: "Excel",
    description:
      "Using spreadsheets to organize data, automate calculations, and present findings clearly.",
  },
  {
    title: "Business Writing",
    description:
      "Communicating financial analysis in a clear, professional, evidence-based format.",
  },
  {
    title: "Professional Accounting",
    description:
      "Understanding how accountants support transparency, compliance, and business reporting.",
  },
  {
    title: "AI-assisted Accounting",
    description:
      "Evaluating when AI tools help analysis and when professional judgement remains essential.",
  },
] as const;

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  title: string;
  layout: "chart" | "landscape" | "portrait";
};

type GalleryImageItem = Extract<
  (typeof projectHighlights)[number],
  { kind: "image" }
>;

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

function SpreadsheetIcon() {
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function ReflectionIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function EventIcon() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
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
    case "spreadsheet":
      return <SpreadsheetIcon />;
    case "report":
      return <ReportIcon />;
    case "reflection":
      return <ReflectionIcon />;
    case "event":
      return <EventIcon />;
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
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
      />
    </div>
  );
}

function HighlightCard({
  item,
  index,
  onOpenImage,
}: {
  item: (typeof projectHighlights)[number];
  index: number;
  onOpenImage: (image: GalleryImage) => void;
}) {
  if (item.kind === "pdf") {
    return (
      <motion.a
        href={item.src}
        target="_blank"
        rel="noopener noreferrer"
        custom={index}
        variants={fadeUp}
        whileHover={{ y: -6, transition: { duration: 0.35 } }}
        className="glass-strong group relative block overflow-hidden rounded-3xl transition-all duration-500"
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
            style={{ color: ACCENT }}
          >
            Click to open
          </p>
        </div>
      </motion.a>
    );
  }

  const imageItem = item as GalleryImageItem;

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
      onClick={() =>
        onOpenImage({
          src: imageItem.src,
          alt: imageItem.alt,
          caption: imageItem.caption,
          title: imageItem.title,
          layout: imageItem.layout,
        })
      }
      className="glass-strong group relative w-full overflow-hidden rounded-3xl p-4 text-left transition-all duration-500 sm:p-5"
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <p className="mb-3 text-[14px] font-medium tracking-[-0.01em] text-foreground">
        {imageItem.title}
      </p>
      <div
        className={`relative ${aspectForLayout(imageItem.layout)} overflow-hidden rounded-2xl bg-black/40`}
      >
        <Image
          src={imageItem.src}
          alt={imageItem.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] transition-all duration-300 group-hover:ring-[#C8102E]/30" />
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-foreground-secondary">
        {imageItem.caption}
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

function DownloadCard({
  title,
  description,
  href,
  icon,
  actionLabel,
  download,
  index,
  className = "",
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  actionLabel: string;
  download?: boolean;
  index: number;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download ? true : undefined}
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      className={`glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 sm:p-8 ${className}`}
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
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
        {icon}
      </span>
      <h3 className="relative z-10 mt-5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="relative z-10 mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
        {description}
      </p>
      <span
        className="relative z-10 mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#C8102E]/25 bg-[#C8102E]/[0.06] text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-[#C8102E] group-hover:bg-[#C8102E] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(200,16,46,0.35)]"
      >
        {actionLabel}
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

function ProjectButton({
  href,
  children,
  download,
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download ? true : undefined}
      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
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
    </a>
  );
}

export default function ACCT1201Page() {
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

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="ambient-grid absolute inset-0" />
      </div>

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
                  ACCT 1201
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
                Financial Accounting &amp;
                <br />
                Reporting
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Analyzing public companies using financial statements, SEC
                filings, Excel financial modeling, ratio analysis, and
                professional reporting.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                {heroMetadata.map((item) => (
                  <span
                    key={item}
                    className="glass rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-foreground-secondary"
                  >
                    {item}
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
              Accounting as the language of business.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                ACCT 1201 introduced the foundations of financial accounting and
                reporting — how organizations measure performance, communicate
                results, and support decisions through standardized financial
                information. The course built fluency in reading balance sheets,
                income statements, and cash flow statements under GAAP, while
                connecting accounting outputs to real business interpretation.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Across lectures, Excel modeling, SEC EDGAR research, ratio
                analysis, and written deliverables, I developed the ability to
                extract meaningful insights from public filings, evaluate
                corporate performance with discipline, and communicate financial
                conclusions with clarity. Topics spanned financial statement
                analysis, corporate reporting, accounting ethics, business
                decision making, and professional communication — including
                thoughtful use of AI-assisted financial analysis.
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

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i + 1}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className={`glass flex items-center gap-4 rounded-2xl px-6 py-5 transition-colors duration-300 hover:bg-card-hover ${SKILLS_GRID_ITEM}`}
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
                From SEC filings to professional financial analysis.
              </SectionHeading>
            </motion.div>

            <div className="mt-8">
              <motion.article
                custom={1}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.35 } }}
                className="glass-strong group relative overflow-hidden rounded-3xl border p-10 sm:p-12 transition-shadow duration-500 hover:shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
                  boxShadow: `0 0 60px rgba(${ACCENT_RGB}, 0.12)`,
                }}
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-60"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.14)` }}
                />
                <span
                  className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                  style={{
                    borderColor: `rgba(${ACCENT_RGB}, 0.35)`,
                    backgroundColor: `rgba(${ACCENT_RGB}, 0.14)`,
                    color: ACCENT_LIGHT,
                  }}
                >
                  Featured Semester Project
                </span>
                <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                  Financial Reporting Analysis — Tesla vs Ford
                </h3>
                <p className="mt-5 max-w-3xl text-[18px] leading-[1.75] text-muted">
                  Semester-long financial analysis comparing Tesla and Ford
                  using SEC 10-K filings, ratio analysis, financial modeling,
                  and investment evaluation.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ProjectButton href={FINANCIAL_REPORT}>
                    View Report
                  </ProjectButton>
                  <ProjectButton href={EXCEL_MODEL} download>
                    Open Workbook
                  </ProjectButton>
                </div>
              </motion.article>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Project Highlights</SectionLabel>
              <SectionHeading>Key visuals from the semester project.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
              {projectHighlights.map((item, i) => (
                <HighlightCard
                  key={item.title}
                  item={item}
                  index={i + 1}
                  onOpenImage={setLightboxImage}
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
              <SectionHeading>Course files and deliverables.</SectionHeading>
            </motion.div>

            <div className="mt-8 flex flex-wrap items-stretch justify-center gap-5">
              {downloadItems.map((item, i) => (
                <DownloadCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  icon={artifactIcon(item.icon)}
                  actionLabel={item.actionLabel}
                  download={"download" in item ? item.download : undefined}
                  index={i + 1}
                  className={DOWNLOADS_GRID_ITEM}
                />
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
            <SectionLabel>Professional Engagement</SectionLabel>
            <SectionHeading>Beyond the classroom.</SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
              style={{ borderColor: `rgba(${ACCENT_RGB}, 0.22)` }}
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.1)` }}
              />
              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.25)`,
                  backgroundColor: `rgba(${ACCENT_RGB}, 0.1)`,
                  color: ACCENT_LIGHT,
                }}
              >
                Industry Event
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Accounting Alumni Panel
              </h3>
              <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-muted">
                Attended Northeastern University&apos;s Accounting Alumni Panel
                featuring professionals from Deloitte, PwC, EY, and KPMG
                discussing public accounting careers, internships, recruiting,
                and industry expectations.
              </p>
              <div className="mt-8 sm:max-w-xs">
                <ProjectButton href={ALUMNI_PANEL}>View Flyer</ProjectButton>
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
            <SectionHeading>Carrying accounting forward into my work.</SectionHeading>

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
                ACCT 1201 reshaped how I think about business information. Before
                this course, financial statements felt like abstract tables; by
                the end, they read as structured stories about strategy, risk,
                and performance. The Tesla vs Ford project was especially
                formative — it pushed me to move from simply collecting numbers
                to building an argument grounded in SEC filings, ratio trends,
                Excel models, and disciplined professional writing.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The course strengthened my analytical thinking, spreadsheet
                fluency, and confidence in financial decision making. It also
                clarified the limits of automation: AI can accelerate research
                and drafting, but accounting still demands judgement,
                verification, and ethical responsibility. That combination of
                technical skill and professional communication is what I will
                carry into co-op experiences, analytics work, and future
                business leadership.
              </p>
            </motion.div>
          </motion.section>
        </div>
      </main>

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
