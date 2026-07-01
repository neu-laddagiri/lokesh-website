"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { resumeExternalProps } from "@/lib/profile-links";
import { subpageNavLinks as navLinks } from "@/lib/site-nav";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Marketing blue — page-local accent */
const ACCENT = "#007AFF";
const ACCENT_LIGHT = "#47A3FF";
const ACCENT_SKY = "#5AC8FA";
const SPOTIFY = "#1DB954";
const ACCENT_GLOW = "rgba(0, 122, 255, 0.35)";
const ACCENT_RGB = "0, 122, 255";
const SPOTIFY_RGB = "29, 185, 84";
const SKY_RGB = "90, 200, 250";

const DOCS = "/documents";

const COPYRIGHT_YEAR = 2026;

const courseMeta = [
  { label: "Semester", value: "Spring 2026" },
  { label: "Professor", value: "D'Amore-McKim School of Business" },
  { label: "Credits", value: "4" },
] as const;

const heroSkillTags = [
  "Market Research",
  "Consumer Behavior",
  "Segmentation",
  "Targeting",
  "Positioning",
  "SWOT Analysis",
  "Branding",
  "Product Strategy",
  "Pricing Strategy",
  "Promotion Mix",
  "Digital Marketing",
  "Distribution Strategy",
  "Marketing Simulation",
  "Presentation Design",
  "Strategic Thinking",
] as const;

const courseStats = [
  { value: "11", label: "Course Deliverables" },
  { value: "5", label: "Presentation Projects" },
  { value: "1", label: "Semester Simulation" },
  { value: "30+", label: "Marketing Concepts" },
] as const;

const semesterProjects = [
  {
    title: "Calyx Flowers Case Study",
    badge: "Case Study",
    description:
      "Developed a strategic recommendation for Calyx Flowers using segmentation, targeting, positioning, competitive analysis, value proposition development, and growth strategy frameworks.",
    file: `${DOCS}/mktg2201-calyx-flowers-case-study.pdf`,
    caseMaterials: {
      label: "Case Materials",
      file: `${DOCS}/mktg2201-calyx-flowers-case.pdf`,
      title: "Calyx Flowers Case",
    },
  },
  {
    title: "Market Research Proposal",
    badge: "Research",
    description:
      "Designed a complete market research proposal including research design, sampling strategy, data collection methods, and managerial recommendations.",
    file: `${DOCS}/mktg2201-dunkin-vs-starbucks-market-research.pdf`,
  },
  {
    title: "Super Bowl Advertising Analysis",
    badge: "Advertising",
    description:
      "Analyzed a Super Bowl advertising campaign through segmentation, positioning, branding, promotion mix, and value proposition.",
    file: `${DOCS}/mktg2201-super-bowl-ad-analysis.pdf`,
  },
  {
    title: "Digital Marketing Audit",
    badge: "Digital Marketing",
    description:
      "Performed a digital marketing audit by evaluating online advertising, targeting, personalization, customer profiling, and platform strategies.",
    file: `${DOCS}/mktg2201-digital-marketing-audit.pdf`,
  },
] as const;

const featuredAppleProject = {
  title: "Apple Promotion & Place Strategy",
  badge: "Branding",
  description:
    "Presented an analysis of Apple's promotion strategy, retail experience, omnichannel distribution, and competitive positioning.",
  file: `${DOCS}/mktg2201-apple-promotion-and-place-strategy.pdf`,
  highlights: [
    "Final live presentation",
    "Promotion strategy",
    "Distribution strategy",
    "Consumer targeting",
    "Positioning analysis",
  ],
} as const;

/** Understated silver accent for Apple featured card */
const APPLE_MUTED_RGB = "168, 168, 174";

const spotifyFeatures = [
  {
    title: "Product Idea",
    description:
      "AI-powered music compatibility matching integrated directly into Spotify Premium.",
    icon: "product" as const,
  },
  {
    title: "Target Market",
    description:
      "Social listeners and friend groups seeking shared discovery experiences.",
    icon: "target" as const,
  },
  {
    title: "Value Proposition",
    description:
      "Turn taste overlap into meaningful connection through personalized compatibility scores.",
    icon: "value" as const,
  },
  {
    title: "Revenue Model",
    description:
      "Premium feature adoption, retention lift, and partnership-driven monetization.",
    icon: "revenue" as const,
  },
  {
    title: "Marketing Strategy",
    description:
      "Launch sequencing, influencer partnerships, and in-app promotion across the funnel.",
    icon: "strategy" as const,
  },
  {
    title: "Innovation",
    description:
      "Ethical AI recommendations, privacy safeguards, and experiential differentiation.",
    icon: "innovation" as const,
  },
] as const;

const SPOTIFY_PDF = `${DOCS}/mktg2201-spotify-match-marketing-strategy.pdf`;

const simulationStats = [
  { label: "Duration", value: "Entire Semester" },
  { label: "Role", value: "Marketing Strategy Team" },
  { label: "Focus", value: "Strategic Decision Making" },
  {
    label: "Topics",
    value: "Segmentation · Pricing · Promotion · Product Strategy · Competitive Analysis",
  },
] as const;

const simulationTimeline = [
  "Market Entry",
  "Expansion",
  "Optimization",
  "Final Defense",
] as const;

const simulationSummaries = [
  {
    phase: "Market Entry",
    title: "Simulation Summary 1",
    description:
      "Initial market positioning, customer segmentation, and early strategic decisions.",
    file: `${DOCS}/mktg2201-marketing-simulation-summary-1.pdf`,
  },
  {
    phase: "Expansion",
    title: "Simulation Summary 2",
    description:
      "Pricing refinement, competitive adjustments, advertising strategy, and expansion.",
    file: `${DOCS}/mktg2201-marketing-simulation-summary-2.pdf`,
  },
  {
    phase: "Optimization",
    title: "Simulation Summary 3",
    description:
      "Final strategic performance review and business outcomes.",
    file: `${DOCS}/mktg2201-marketing-simulation-summary-3.pdf`,
  },
] as const;

/** Preview heights — ~35% larger than original */
const PREVIEW = {
  project: "h-[min(62vw,448px)]",
  simulation: "h-[min(58vw,390px)]",
  spotify: "h-[min(75vw,680px)]",
  defense: "h-[min(68vw,600px)]",
  appleFeatured: "h-[min(58vw,480px)] sm:h-[min(42vw,520px)]",
} as const;

const defenseFiles = {
  presentation: `${DOCS}/mktg2201-marketing-strategy-defense-presentation.pdf`,
  script: `${DOCS}/mktg2201-marketing-strategy-defense-script.pdf`,
} as const;

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.06, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardHover = {
  y: -8,
  transition: { duration: 0.45, ease: EASE },
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

function ChevronIcon({ open }: { open: boolean }) {
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
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
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

function SectionDivider() {
  return (
    <div
      className="flex items-center gap-4 py-1"
      aria-hidden
    >
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${ACCENT_RGB}, 0.22), transparent)`,
        }}
      />
    </div>
  );
}

function ProjectBadge({ children }: { children: string }) {
  return (
    <span
      className="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase"
      style={{
        borderColor: `rgba(${ACCENT_RGB}, 0.22)`,
        backgroundColor: `rgba(${ACCENT_RGB}, 0.07)`,
        color: ACCENT_LIGHT,
      }}
    >
      {children}
    </span>
  );
}

function CourseStatsStrip() {
  return (
    <motion.div
      custom={6}
      variants={fadeUp}
      className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {courseStats.map((stat) => (
        <div
          key={stat.label}
          className="glass-strong rounded-2xl px-4 py-4 text-center transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,122,255,0.12)] sm:px-5 sm:py-5"
        >
          <p
            className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.04em]"
            style={{ color: ACCENT_LIGHT }}
          >
            {stat.value}
          </p>
          <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-muted uppercase sm:text-[12px]">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

function SimulationTimeline() {
  return (
    <motion.div custom={2} variants={fadeUp} className="mt-8">
      <div className="hidden items-center gap-2 sm:flex">
        {simulationTimeline.map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className="glass w-full rounded-2xl px-3 py-3 text-center transition-colors duration-300"
              style={
                i === simulationTimeline.length - 1
                  ? {
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.08)`,
                    }
                  : undefined
              }
            >
              <p
                className={`text-[12px] font-semibold tracking-[-0.01em] lg:text-[13px] ${
                  i === simulationTimeline.length - 1
                    ? "text-foreground"
                    : "text-foreground-secondary"
                }`}
              >
                {step}
              </p>
            </div>
            {i < simulationTimeline.length - 1 && (
              <span className="shrink-0 text-muted/50" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 sm:hidden">
        {simulationTimeline.map((step, i) => (
          <div key={step} className="flex w-full flex-col items-center gap-2">
            <div
              className="glass w-full rounded-2xl px-4 py-3 text-center"
              style={
                i === simulationTimeline.length - 1
                  ? {
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: `rgba(${ACCENT_RGB}, 0.3)`,
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.08)`,
                    }
                  : undefined
              }
            >
              <p className="text-[13px] font-semibold tracking-[-0.01em] text-foreground-secondary">
                {step}
              </p>
            </div>
            {i < simulationTimeline.length - 1 && (
              <span className="text-muted/50" aria-hidden>
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PdfEmbedPreview({
  src,
  title,
  heightClass = "h-[min(52vw,380px)]",
}: {
  src: string;
  title: string;
  heightClass?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] ${heightClass}`}
    >
      <iframe src={src} title={title} className="h-full w-full" />
    </div>
  );
}

function MarketingIcon({ type }: { type: (typeof spotifyFeatures)[number]["icon"] }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "product":
      return (
        <svg {...props}>
          <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" />
          <path d="M12 12l9-5M12 12v9M12 12L3 7" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case "value":
      return (
        <svg {...props}>
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "revenue":
      return (
        <svg {...props}>
          <path d="M12 3v18" />
          <path d="M7 8h10a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h10" />
        </svg>
      );
    case "strategy":
      return (
        <svg {...props}>
          <path d="M4 18h16" />
          <path d="M6 15l4-8 4 5 5-9" />
        </svg>
      );
    case "innovation":
      return (
        <svg {...props}>
          <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 11v1h6v-1a6 6 0 0 0-3-11z" />
        </svg>
      );
  }
}

function ActionButton({
  href,
  children,
  download,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
  variant?: "primary" | "secondary" | "spotify";
  className?: string;
}) {
  const isSpotify = variant === "spotify";
  const isSecondary = variant === "secondary";

  const rgb = isSpotify ? SPOTIFY_RGB : ACCENT_RGB;
  const color = isSpotify ? SPOTIFY : ACCENT;
  const glow = isSpotify
    ? "rgba(29, 185, 84, 0.35)"
    : ACCENT_GLOW;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download ? true : undefined}
      className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-500 hover:text-white ${className}`}
      style={{
        borderColor: isSecondary
          ? `rgba(${SKY_RGB}, 0.35)`
          : `rgba(${rgb}, 0.28)`,
        backgroundColor: isSecondary
          ? `rgba(${SKY_RGB}, 0.08)`
          : `rgba(${rgb}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 36px ${glow}`;
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSecondary
          ? `rgba(${SKY_RGB}, 0.08)`
          : `rgba(${rgb}, 0.06)`;
        e.currentTarget.style.borderColor = isSecondary
          ? `rgba(${SKY_RGB}, 0.35)`
          : `rgba(${rgb}, 0.28)`;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.color = "";
      }}
    >
      {children}
    </a>
  );
}

function CaseMaterialsPanel({
  label,
  title,
  file,
}: {
  label: string;
  title: string;
  file: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 border-t border-white/[0.08] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-foreground-secondary">
          {label}
        </span>
        <ChevronIcon open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[14px] font-medium text-foreground">{title}</p>
              <p className="mt-1 text-[13px] text-muted">
                Supporting case document used for strategic analysis.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton href={file} className="flex-1">
                  View PDF
                </ActionButton>
                <ActionButton href={file} download className="flex-1" variant="secondary">
                  Download
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({
  title,
  badge,
  description,
  file,
  index,
  caseMaterials,
}: {
  title: string;
  badge: string;
  description: string;
  file: string;
  index: number;
  caseMaterials?: { label: string; title: string; file: string };
}) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      whileHover={cardHover}
      className="glass-strong group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-700"
      style={{ boxShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 56px rgba(0, 122, 255, 0.18)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="p-4 pb-0 sm:p-5 sm:pb-0">
        <PdfEmbedPreview
          src={file}
          title={`Preview of ${title}`}
          heightClass={PREVIEW.project}
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <ProjectBadge>{badge}</ProjectBadge>
        <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h3>
        <p className="mt-2.5 flex-1 text-[13px] leading-[1.65] text-muted">
          {description}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ActionButton href={file} className="flex-1">
            View PDF
          </ActionButton>
          <ActionButton href={file} download className="flex-1" variant="secondary">
            Download
          </ActionButton>
        </div>
        {caseMaterials && (
          <CaseMaterialsPanel
            label={caseMaterials.label}
            title={caseMaterials.title}
            file={caseMaterials.file}
          />
        )}
      </div>
    </motion.article>
  );
}

function FeaturedAppleProject({ index }: { index: number }) {
  const { title, badge, description, file, highlights } = featuredAppleProject;

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE } }}
      className="glass-strong group relative col-span-1 overflow-hidden rounded-[2rem] border transition-all duration-700 sm:col-span-2"
      style={{
        borderColor: `rgba(${APPLE_MUTED_RGB}, 0.22)`,
        boxShadow: `0 0 48px rgba(${APPLE_MUTED_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 64px rgba(0, 122, 255, 0.12), 0 0 40px rgba(${APPLE_MUTED_RGB}, 0.1)`;
        e.currentTarget.style.borderColor = `rgba(${APPLE_MUTED_RGB}, 0.32)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 48px rgba(${APPLE_MUTED_RGB}, 0.06)`;
        e.currentTarget.style.borderColor = `rgba(${APPLE_MUTED_RGB}, 0.22)`;
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1"
        style={{
          background: `linear-gradient(180deg, rgba(${APPLE_MUTED_RGB}, 0.5), rgba(${ACCENT_RGB}, 0.35))`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70"
        style={{ backgroundColor: `rgba(${APPLE_MUTED_RGB}, 0.08)` }}
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="p-5 pb-0 sm:p-7 sm:pb-0 lg:p-8 lg:pb-8">
          <PdfEmbedPreview
            src={file}
            title={`Preview of ${title}`}
            heightClass={PREVIEW.appleFeatured}
          />
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8 lg:pl-4">
          <span
            className="inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
            style={{
              borderColor: `rgba(${APPLE_MUTED_RGB}, 0.3)`,
              backgroundColor: `rgba(${APPLE_MUTED_RGB}, 0.08)`,
              color: "#c4c4c8",
            }}
          >
            Featured Assignment
          </span>
          <ProjectBadge>{badge}</ProjectBadge>
          <h3 className="mt-4 text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tracking-[-0.03em] text-foreground">
            {title}
          </h3>
          <p className="mt-3 text-[14px] leading-[1.75] text-muted">
            {description}
          </p>
          <ul className="mt-5 space-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[13px] text-foreground-secondary"
              >
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: `rgba(${APPLE_MUTED_RGB}, 0.8)` }}
                />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <ActionButton href={file} className="flex-1">
              View PDF
            </ActionButton>
            <ActionButton href={file} download className="flex-1" variant="secondary">
              Download
            </ActionButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SimulationCard({
  phase,
  title,
  description,
  file,
  index,
}: {
  phase: string;
  title: string;
  description: string;
  file: string;
  index: number;
}) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      whileHover={cardHover}
      className="glass-strong group flex flex-col overflow-hidden rounded-3xl border transition-all duration-700"
      style={{
        borderColor: `rgba(${ACCENT_RGB}, 0.14)`,
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 18px 48px rgba(0, 122, 255, 0.14)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="p-4 pb-0 sm:p-5 sm:pb-0">
        <PdfEmbedPreview
          src={file}
          title={`Preview of ${title}`}
          heightClass={PREVIEW.simulation}
        />
      </div>
      <div className="p-4 sm:p-5">
        <ProjectBadge>{phase}</ProjectBadge>
        <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h3>
        <p className="mt-2.5 text-[13px] leading-[1.65] text-muted">
          {description}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ActionButton href={file} className="flex-1">
            View PDF
          </ActionButton>
          <ActionButton href={file} download className="flex-1" variant="secondary">
            Download
          </ActionButton>
        </div>
      </div>
    </motion.article>
  );
}

export default function MKTG2201Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.07)` }}
        />
        <div
          className="absolute right-0 bottom-1/4 h-[400px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${SKY_RGB}, 0.05)` }}
        />
        <div
          className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${SPOTIFY_RGB}, 0.04)` }}
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
        <section className="px-6 pt-36 pb-6 lg:px-8 lg:pt-44 lg:pb-8">
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

              <motion.div custom={1} variants={fadeUp}>
                <span
                  className="text-[13px] font-medium tracking-[0.22em] uppercase"
                  style={{ color: ACCENT_LIGHT }}
                >
                  MKTG 2201 — Marketing
                </span>
              </motion.div>

              <motion.h1
                custom={2}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Marketing
              </motion.h1>

              <motion.div
                custom={3}
                variants={fadeUp}
                className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {courseMeta.map((item) => (
                  <div
                    key={item.label}
                    className="glass rounded-2xl px-5 py-4"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-8 max-w-3xl text-[clamp(1rem,2vw,1.125rem)] leading-[1.8] text-muted"
              >
                This course explored marketing strategy, consumer behavior,
                branding, positioning, pricing, promotion, digital marketing,
                product strategy, and marketing simulations through
                presentations, case studies, and applied projects.
              </motion.p>

              <motion.div
                custom={5}
                variants={fadeUp}
                className="mt-6 flex flex-wrap gap-2.5"
              >
                {heroSkillTags.map((tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-foreground-secondary sm:px-4 sm:py-2 sm:text-[13px]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <CourseStatsStrip />
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-6 pb-32 lg:space-y-20 lg:px-8">
          {/* Semester Projects */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Semester Projects</SectionLabel>
              <SectionHeading>
                Strategy, research, and real-world marketing analysis.
              </SectionHeading>
              <p className="mt-3 max-w-3xl text-[15px] leading-[1.7] text-muted">
                From case studies to digital audits, each project applied core
                marketing frameworks to real companies, campaigns, and consumer
                decisions.
              </p>
            </motion.div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {semesterProjects.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  badge={project.badge}
                  description={project.description}
                  file={project.file}
                  index={i + 1}
                  caseMaterials={
                    "caseMaterials" in project
                      ? project.caseMaterials
                      : undefined
                  }
                />
              ))}
              <FeaturedAppleProject index={semesterProjects.length + 1} />
            </div>
          </motion.section>

          <SectionDivider />

          {/* Featured Innovation Project */}
          <motion.section
            id="spotify-match"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
            className="relative -mx-6 overflow-hidden rounded-[2rem] px-6 py-20 lg:-mx-8 lg:px-10 lg:py-24"
            style={{
              background: `linear-gradient(180deg, rgba(${ACCENT_RGB}, 0.08) 0%, rgba(${SPOTIFY_RGB}, 0.06) 45%, rgba(${ACCENT_RGB}, 0.03) 100%)`,
            }}
          >
            <motion.div
              className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[120px]"
              style={{ backgroundColor: `rgba(${SPOTIFY_RGB}, 0.14)` }}
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full blur-[100px]"
              style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              aria-hidden
            />

            <div className="relative">
              <span
                className="inline-flex rounded-full border px-4 py-2 text-[11px] font-bold tracking-[0.16em] uppercase shadow-[0_0_32px_rgba(29,185,84,0.2)]"
                style={{
                  borderColor: `rgba(${SPOTIFY_RGB}, 0.45)`,
                  backgroundColor: `rgba(${SPOTIFY_RGB}, 0.14)`,
                  color: SPOTIFY,
                }}
              >
                ★ Featured Project
              </span>
              <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.04em] text-foreground">
                Spotify Match
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-[1.75] text-muted">
                One of my strongest projects from the course — an AI-powered music
                compatibility platform designed as a premium Spotify feature.
              </p>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE } }}
              className="glass-strong group relative mt-10 overflow-hidden rounded-3xl border p-6 sm:p-10 lg:p-14"
              style={{
                borderColor: `rgba(${SPOTIFY_RGB}, 0.32)`,
                boxShadow: `0 0 100px rgba(${SPOTIFY_RGB}, 0.14), 0 32px 80px rgba(0,0,0,0.35)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
                style={{
                  background: `linear-gradient(180deg, ${SPOTIFY}, ${ACCENT})`,
                }}
                aria-hidden
              />
              <motion.div
                className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${SPOTIFY_RGB}, 0.16)` }}
                animate={{ opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />

              <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:gap-14">
                <div>
                  <PdfEmbedPreview
                    src={SPOTIFY_PDF}
                    title="Spotify Match marketing strategy presentation preview"
                    heightClass={PREVIEW.spotify}
                  />
                </div>

                <div className="flex flex-col">
                  <span
                    className="inline-flex w-fit rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
                    style={{
                      borderColor: `rgba(${SPOTIFY_RGB}, 0.35)`,
                      backgroundColor: `rgba(${SPOTIFY_RGB}, 0.1)`,
                      color: SPOTIFY,
                    }}
                  >
                    Innovation · Presentation
                  </span>

                  <h3 className="mt-5 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                    Spotify Match
                  </h3>

                  <p className="mt-5 text-[16px] leading-[1.8] text-muted">
                    Developed Spotify Match, an AI-powered music compatibility
                    platform integrated into Spotify Premium. The project
                    explored product strategy, market sizing, pricing, SWOT
                    analysis, positioning, promotion strategy, launch planning,
                    and ethical considerations.
                  </p>

                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {spotifyFeatures.map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                        className="glass rounded-2xl px-4 py-4 transition-all duration-500 hover:bg-card-hover hover:shadow-[0_12px_32px_rgba(29,185,84,0.08)]"
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `rgba(${SPOTIFY_RGB}, 0.12)`,
                            color: SPOTIFY,
                          }}
                        >
                          <MarketingIcon type={feature.icon} />
                        </span>
                        <h4 className="mt-3 text-[14px] font-semibold tracking-[-0.01em] text-foreground">
                          {feature.title}
                        </h4>
                        <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <ActionButton
                      href={SPOTIFY_PDF}
                      variant="spotify"
                      className="h-12 w-full px-8 text-[15px] sm:w-auto"
                    >
                      View Presentation
                    </ActionButton>
                  </div>
                </div>
              </div>
            </motion.article>
            </div>
          </motion.section>

          <SectionDivider />
          {/* Marketing Strategy Simulation */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="relative -mx-6 rounded-[2rem] px-6 py-20 lg:-mx-8 lg:px-10 lg:py-24"
            style={{
              background: `linear-gradient(180deg, rgba(${SKY_RGB}, 0.06) 0%, rgba(${ACCENT_RGB}, 0.05) 100%)`,
            }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Marketing Strategy Simulation</SectionLabel>
              <SectionHeading>
                Semester-Long Competitive Business Simulation
              </SectionHeading>
              <p className="mt-4 max-w-3xl text-[16px] leading-[1.75] text-muted">
                Participated in a semester-long competitive marketing simulation
                where our team managed a bicycle company by making strategic
                decisions involving pricing, segmentation, product development,
                advertising, budgeting, distribution, expansion, and competitive
                positioning while responding to evolving market conditions.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {simulationStats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-strong rounded-2xl px-5 py-5"
                >
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-[14px] font-medium leading-[1.6] tracking-[-0.01em] text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </motion.div>

            <SimulationTimeline />

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {simulationSummaries.map((summary, i) => (
                <SimulationCard
                  key={summary.title}
                  phase={summary.phase}
                  title={summary.title}
                  description={summary.description}
                  file={summary.file}
                  index={i + 3}
                />
              ))}
            </div>

            <motion.article
              custom={6}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl border"
              style={{
                borderColor: `rgba(${ACCENT_RGB}, 0.38)`,
                boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.14), 0 28px 72px rgba(0,0,0,0.3)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
                style={{
                  background: `linear-gradient(180deg, ${ACCENT}, ${ACCENT_SKY})`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full blur-3xl"
                style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }}
                aria-hidden
              />

              <div className="p-5 pb-0 sm:p-8 sm:pb-0">
                <PdfEmbedPreview
                  src={defenseFiles.presentation}
                  title="Marketing Strategy Defense presentation preview"
                  heightClass={PREVIEW.defense}
                />
              </div>

              <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex rounded-full border px-4 py-2 text-[11px] font-bold tracking-[0.14em] uppercase"
                    style={{
                      borderColor: `rgba(${ACCENT_RGB}, 0.4)`,
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.12)`,
                      color: ACCENT_LIGHT,
                    }}
                  >
                    Simulation Capstone
                  </span>
                  <ProjectBadge>Final Defense</ProjectBadge>
                </div>
                <h3 className="mt-5 text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-[-0.04em] text-foreground">
                  Marketing Strategy Defense
                </h3>
                <p className="mt-4 max-w-3xl text-[16px] leading-[1.8] text-muted">
                  Concluded the semester by presenting and defending every
                  strategic decision in a courtroom-style mock trial titled
                  &ldquo;The People v. Scuderia AddaDaas,&rdquo; using
                  marketing theory, pricing strategy, segmentation,
                  positioning, and simulation performance data.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <ActionButton
                    href={defenseFiles.presentation}
                    className="flex-1 sm:flex-[1.2]"
                  >
                    View Presentation
                  </ActionButton>
                  <ActionButton
                    href={defenseFiles.script}
                    className="flex-1"
                    variant="secondary"
                  >
                    View Script
                  </ActionButton>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <ActionButton
                    href={defenseFiles.presentation}
                    download
                    className="flex-1"
                    variant="secondary"
                  >
                    Download Presentation
                  </ActionButton>
                  <ActionButton
                    href={defenseFiles.script}
                    download
                    className="flex-1"
                    variant="secondary"
                  >
                    Download Script
                  </ActionButton>
                </div>
              </div>
            </motion.article>
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
