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

/** Northeastern-inspired accent — page-local only */
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

const SYLLABUS_PDF = "/documents/math1231-syllabus.pdf";

const skills = [
  "Business Calculus",
  "Optimization",
  "Derivative Applications",
  "Marginal Revenue",
  "Marginal Cost",
  "Profit Maximization",
  "Demand Modeling",
  "Mathematical Modeling",
  "Market Research",
] as const;

const projectHighlights = [
  "Designed a hockey-themed Northeastern T-shirt product",
  "Estimated reachable target market",
  "Collected survey data from 50 participants",
  "Built demand, revenue, cost, and profit functions",
  "Found revenue-maximizing and profit-maximizing prices",
  "Recommended a final selling price of $20",
] as const;

const keyMetrics = [
  { label: "Poll Participants", value: "50", featured: false },
  { label: "Revenue-Maximizing Price", value: "$17.65", featured: false },
  { label: "Profit-Maximizing Price", value: "$20.39", featured: false },
  { label: "Final Recommended Price", value: "$20", featured: true },
] as const;

const galleryImages = [
  {
    src: "/images/coursework/math1231/math1231-shirt-front.png",
    alt: "Front design of the Northeastern Hockey T-shirt",
    title: "Front Design",
    caption:
      "Minimalist Northeastern Hockey branding used for the primary retail concept.",
    layout: "portrait" as const,
  },
  {
    src: "/images/coursework/math1231/math1231-shirt-back.png",
    alt: "Back design of the Northeastern Hockey T-shirt",
    title: "Back Design",
    caption:
      'Heritage-inspired "Home of the Huskies" design created to increase perceived value and fan appeal.',
    layout: "portrait" as const,
  },
  {
    src: "/images/coursework/math1231/math1231-demand-curve.png",
    alt: "Profit function graph for optimal selling price",
    caption: "Profit function used to identify the optimal selling price.",
    layout: "landscape" as const,
  },
] as const;

type GalleryImage = (typeof galleryImages)[number];

const artifacts = [
  {
    label: "Full Presentation",
    icon: "slides",
    href: "/documents/math1231-tshirt-sales-campaign.pdf",
  },
  { label: "Demand Analysis", icon: "demand" },
  { label: "Optimization Graph", icon: "graph" },
  { label: "Pricing Recommendation", icon: "pricing" },
] as const;

const takeaways = [
  {
    title: "Calculus can directly support pricing strategy",
    description:
      "Derivatives and optimization techniques translated abstract math into a concrete $20 price recommendation grounded in demand and cost functions.",
  },
  {
    title: "Market research improves mathematical models",
    description:
      "Survey data from 50 participants gave the demand model real-world validity — without it, optimization would have been purely theoretical.",
  },
  {
    title: "Profit optimization is different from revenue optimization",
    description:
      "The revenue-maximizing price ($17.65) and profit-maximizing price ($20.39) diverged, reinforcing that maximizing sales volume is not the same as maximizing bottom-line returns.",
  },
] as const;

const PDF_SRC = "/documents/math1231-tshirt-sales-campaign.pdf";

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

function DemandIcon() {
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
      <path d="M7 16l4-8 4 5 6-9" />
    </svg>
  );
}

function GraphIcon() {
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
      <path d="M3 20h18" />
      <path d="M6 16l4-6 4 3 5-8" />
      <circle cx="18" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PricingIcon() {
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
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
    case "slides":
      return <SlidesIcon />;
    case "demand":
      return <DemandIcon />;
    case "graph":
      return <GraphIcon />;
    case "pricing":
      return <PricingIcon />;
    default:
      return <SlidesIcon />;
  }
}

function GalleryCard({
  image,
  index,
  onOpen,
  featured = false,
  compact = false,
}: {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage) => void;
  featured?: boolean;
  compact?: boolean;
}) {
  const aspectClass =
    image.layout === "landscape"
      ? compact
        ? "aspect-[16/6]"
        : "aspect-[16/10]"
      : "aspect-[3/4]";

  return (
    <motion.button
      type="button"
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.35 } }}
      onClick={() => onOpen(image)}
      className={`glass-strong group relative w-full overflow-hidden rounded-3xl text-left transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)] ${
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
      } ${featured ? "lg:col-span-2" : ""}`}
      style={{
        boxShadow: "none",
      }}
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
            featured
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 1024px) 100vw, 33vw"
          }
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] transition-all duration-300 group-hover:ring-[#C8102E]/30" />
      </div>
      {"title" in image && image.title ? (
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
              className={`relative mx-auto w-full overflow-hidden rounded-2xl bg-background/60 ${
                image.layout === "landscape"
                  ? "aspect-[16/10] max-h-[70vh]"
                  : "aspect-[3/4] max-h-[75vh] max-w-md"
              }`}
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

export default function MATH1231Page() {
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

  const shirtImages = galleryImages.filter((img) => img.layout === "portrait");
  const analysisImage = galleryImages.find((img) => img.layout === "landscape");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ImageLightbox image={lightboxImage} onClose={closeLightbox} />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(200, 16, 46, 0.06)" }}
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
                  MATH 1231
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
                Calculus for Business and Economics
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                Applying derivatives, optimization, and mathematical modeling
                to real business decisions.
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
              Mathematics that powers business decisions.
            </SectionHeading>
            <div className="glass-strong mt-8 rounded-3xl p-8 sm:p-10">
              <p className="text-[17px] leading-[1.8] text-foreground-secondary">
                MATH 1231 applied calculus to business and economic problems —
                bridging abstract mathematics with the quantitative tools used
                in finance, marketing, and operations. The course built a
                foundation in how rates of change and accumulation inform
                real-world decision making.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Core topics included derivatives, marginal revenue, marginal
                cost, marginal profit, optimization, antiderivatives, definite
                integrals, and business/economic applications. Through applied
                projects, I learned to model demand, analyze revenue and cost
                functions, and use calculus to find optimal pricing and
                production strategies.
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
                    style={{ backgroundColor: "rgba(200, 16, 46, 0.12)" }}
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
              From survey data to optimal pricing.
            </SectionHeading>

            <motion.article
              whileHover={{ y: -6, transition: { duration: 0.35 } }}
              className="glass-strong group relative mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ backgroundColor: "rgba(200, 16, 46, 0.1)" }}
              />

              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{
                  borderColor: "rgba(200, 16, 46, 0.25)",
                  backgroundColor: "rgba(200, 16, 46, 0.1)",
                  color: ACCENT_LIGHT,
                }}
              >
                Applied Project
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Northeastern Hockey T-Shirt Sales Campaign
              </h3>

              <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-muted">
                Designed and evaluated a Northeastern Hockey T-shirt sales
                campaign using market research, demand modeling, revenue
                analysis, cost analysis, and calculus-based optimization.
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
                            ? "border border-[#C8102E]/35 bg-[#C8102E]/[0.08] shadow-[0_0_40px_rgba(200,16,46,0.15)]"
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
                            Recommended Price
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>

          {/* Project Design & Analysis Gallery */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Project Design &amp; Analysis</SectionLabel>
              <SectionHeading>
                Turning survey data into a complete product and pricing strategy.
              </SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {shirtImages.map((image, i) => (
                <GalleryCard
                  key={image.src}
                  image={image}
                  index={i + 1}
                  onOpen={setLightboxImage}
                />
              ))}
            </div>

            {analysisImage && (
              <>
                <div className="mt-5">
                  <GalleryCard
                    image={analysisImage}
                    index={3}
                    onOpen={setLightboxImage}
                    featured
                    compact
                  />
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  custom={4}
                  className="glass-strong mt-5 rounded-3xl border border-[#C8102E]/20 p-6 sm:p-8"
                >
                  <p
                    className="text-[13px] font-medium tracking-[0.14em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    Optimization Result
                  </p>
                  <p className="mt-4 text-[17px] leading-[1.75] text-muted">
                    Using demand, revenue, cost, and profit functions derived
                    from survey data, the profit-maximizing price was calculated
                    at $20.39, while the revenue-maximizing price was $17.65.
                    After balancing profitability and practical consumer pricing
                    considerations, a final recommended selling price of $20 was
                    selected.
                  </p>
                </motion.div>
              </>
            )}
          </motion.section>

          {/* Embedded Slideshow — unchanged structure */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>Presentation</SectionLabel>
            <SectionHeading>Full project slideshow.</SectionHeading>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
              Scroll through the complete campaign presentation — from market
              research and demand modeling to optimization results and the final
              pricing recommendation.
            </p>

            <motion.div
              whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
              className="glass-strong mt-8 overflow-hidden rounded-3xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <p className="text-[14px] font-medium tracking-[-0.01em] text-foreground">
                  Northeastern Hockey T-Shirt Sales Campaign
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
                title="Northeastern Hockey T-Shirt Sales Campaign Presentation"
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
                  backgroundColor: "rgba(200, 16, 46, 0.12)",
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
                      backgroundColor: "rgba(200, 16, 46, 0.12)",
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
