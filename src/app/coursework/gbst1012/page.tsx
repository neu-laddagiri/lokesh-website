"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { resumeExternalProps } from "@/lib/profile-links";
import { subpageNavLinks as navLinks } from "@/lib/site-nav";
import {
  SyllabusHeaderButton,
  type CourseAccent,
} from "@/components/coursework/artifact-cards";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Navy & gold — page-local accent only */
const ACCENT = "#183A63";
const ACCENT_LIGHT = "#2A5A8F";
const GOLD = "#D4A64A";
const GOLD_LIGHT = "#E4BC6A";
const ACCENT_GLOW = "rgba(24, 58, 99, 0.35)";
const ACCENT_RGB = "24, 58, 99";
const GOLD_RGB = "212, 166, 74";

const courseAccent: CourseAccent = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentRgb: ACCENT_RGB,
  accentGlow: ACCENT_GLOW,
};

const RESEARCH_PDF = "/documents/GBST%20Tourism%20Group.pdf";
const PRESENTATION_PDF = "/documents/Tourism%20Presentation.pdf";
const SYLLABUS_PDF = "/documents/gbst1012-syllabus.pdf";

const COPYRIGHT_YEAR = 2026;

const heroTags = [
  "Global Citizenship",
  "Intercultural Communication",
  "Research",
  "Cross-Cultural Analysis",
  "Globalization",
  "Public Speaking",
] as const;

const skills = [
  "Global Citizenship",
  "Cultural Identity",
  "Globalization",
  "Intercultural Communication",
  "Hofstede Framework",
  "Hall's Context Theory",
  "Intercultural Praxis",
  "Stakeholder Analysis",
  "Global Research",
  "Presentation Design",
  "Team Collaboration",
  "Public Speaking",
] as const;

const projectPreviewItems = [
  {
    title: "Research Paper",
    src: RESEARCH_PDF,
    alt: "First page of the GBST tourism comparative research paper",
    caption:
      "Final interdisciplinary paper comparing how social norms shape local perceptions of tourists in Seoul and New York City.",
    actionLabel: "Open PDF",
  },
  {
    title: "Presentation",
    src: PRESENTATION_PDF,
    alt: "First page of the GBST tourism group presentation",
    caption:
      "Group presentation summarizing stakeholder analysis, comparative findings, and intercultural communication insights.",
    actionLabel: "Open PDF",
  },
] as const;

const learningOutcomes = [
  {
    title: "Global Citizenship",
    description:
      "Understanding responsibilities and ethical engagement in an interconnected world.",
  },
  {
    title: "Intercultural Communication",
    description:
      "Navigating cultural differences through frameworks like Hofstede and Hall's context theory.",
  },
  {
    title: "Globalization",
    description:
      "Analyzing how economic integration and cultural exchange reshape local communities.",
  },
  {
    title: "Cultural Identity",
    description:
      "Examining how heritage, norms, and belonging shape individual and collective perspectives.",
  },
  {
    title: "Research",
    description:
      "Designing and executing interdisciplinary research on comparative global issues.",
  },
  {
    title: "Stakeholder Analysis",
    description:
      "Identifying and evaluating the interests of residents, businesses, governments, and visitors.",
  },
  {
    title: "Historical Analysis",
    description:
      "Connecting past events and policy decisions to present-day global challenges.",
  },
  {
    title: "Ethical Decision Making",
    description:
      "Weighing social justice, equity, and fairness in complex international contexts.",
  },
  {
    title: "Presentation Skills",
    description:
      "Communicating research findings clearly to diverse academic and public audiences.",
  },
  {
    title: "Global Collaboration",
    description:
      "Working effectively across backgrounds, disciplines, and perspectives in team settings.",
  },
  {
    title: "Critical Thinking",
    description:
      "Questioning assumptions and synthesizing evidence from multiple disciplinary lenses.",
  },
  {
    title: "Intercultural Praxis",
    description:
      "Applying theory to real-world intercultural situations through reflection and dialogue.",
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
  item: (typeof projectPreviewItems)[number];
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
          style={{ color: ACCENT_LIGHT }}
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
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "gold";
}) {
  const isGold = variant === "gold";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border px-6 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:text-white"
      style={{
        borderColor: isGold
          ? `rgba(${GOLD_RGB}, 0.35)`
          : `rgba(${ACCENT_RGB}, 0.25)`,
        backgroundColor: isGold
          ? `rgba(${GOLD_RGB}, 0.08)`
          : `rgba(${ACCENT_RGB}, 0.06)`,
      }}
      onMouseEnter={(e) => {
        if (isGold) {
          e.currentTarget.style.backgroundColor = GOLD;
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.color = ACCENT;
          e.currentTarget.style.boxShadow = `0 0 40px rgba(${GOLD_RGB}, 0.35)`;
        } else {
          e.currentTarget.style.backgroundColor = ACCENT;
          e.currentTarget.style.borderColor = ACCENT;
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.boxShadow = `0 0 40px ${ACCENT_GLOW}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "";
        e.currentTarget.style.boxShadow = "none";
        if (isGold) {
          e.currentTarget.style.backgroundColor = `rgba(${GOLD_RGB}, 0.08)`;
          e.currentTarget.style.borderColor = `rgba(${GOLD_RGB}, 0.35)`;
        } else {
          e.currentTarget.style.backgroundColor = `rgba(${ACCENT_RGB}, 0.06)`;
          e.currentTarget.style.borderColor = `rgba(${ACCENT_RGB}, 0.25)`;
        }
      }}
    >
      {children}
    </a>
  );
}

export default function GBST1012Page() {
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
          style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.06)` }}
        />
        <div
          className="absolute right-0 bottom-1/3 h-[350px] w-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${GOLD_RGB}, 0.04)` }}
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
                  GBST 1012
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
                  borderColor: `rgba(${GOLD_RGB}, 0.35)`,
                  backgroundColor: `rgba(${GOLD_RGB}, 0.1)`,
                  color: GOLD_LIGHT,
                }}
              >
                Global Learning Experience
              </motion.span>

              <motion.h1
                custom={3}
                variants={fadeUp}
                className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground"
              >
                Global Learning Experience
              </motion.h1>

              <motion.p
                custom={4}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-muted"
              >
                An interdisciplinary first-year seminar exploring global
                citizenship, intercultural communication, globalization, cultural
                identity, and ethical problem-solving through collaborative
                international research.
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
                GBST 1012 approached global issues not as distant headlines, but
                as lived realities shaped by culture, economics, history, and
                power. The seminar built a foundation in global citizenship —
                understanding how individual choices connect to international
                systems — while examining how globalization accelerates the
                exchange of ideas, capital, and people across borders.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                Through intercultural communication frameworks, including
                Hofstede&apos;s cultural dimensions and Hall&apos;s high- and
                low-context theory, I learned to read cultural identity as
                something dynamic rather than fixed. Intercultural praxis pushed
                that theory into practice: reflecting on my own assumptions,
                listening across difference, and collaborating on interdisciplinary
                research that addressed real global problems — from overtourism to
                social justice — with the rigor and empathy the subject demands.
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
              Tourism, norms, and perception across two global cities.
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
                  background: `linear-gradient(180deg, ${GOLD}, ${ACCENT})`,
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
                  borderColor: `rgba(${GOLD_RGB}, 0.35)`,
                  backgroundColor: `rgba(${GOLD_RGB}, 0.1)`,
                  color: GOLD_LIGHT,
                }}
              >
                Global Learning Final Research Project
              </span>

              <h3 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.04em] text-foreground">
                Comparing Tourism in Seoul and New York City
              </h3>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.8] text-muted">
                Our group investigated a central research question:{" "}
                <span className="font-medium text-foreground-secondary">
                  How do social norms affect locals&apos; perception of tourists
                  in Seoul vs. New York City?
                </span>{" "}
                Drawing on overtourism, globalization, stakeholder analysis,
                social justice, economics, history, and intercultural
                communication, we compared how two major global cities navigate
                the tension between welcoming visitors and preserving local
                quality of life — analyzing resident attitudes, policy responses,
                and the cultural norms that shape everyday interactions between
                hosts and guests.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccentLinkButton href={RESEARCH_PDF}>
                  Research Paper
                </AccentLinkButton>
                <AccentLinkButton href={PRESENTATION_PDF} variant="gold">
                  Presentation
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
              <SectionHeading>Research deliverables at a glance.</SectionHeading>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
              {projectPreviewItems.map((item, i) => (
                <PdfPreviewCard key={item.src} item={item} index={i + 1} />
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
                style={{ backgroundColor: `rgba(${GOLD_RGB}, 0.08)` }}
              />
              <p className="relative text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-foreground-secondary">
                GBST 1012 changed how I approach complex problems. Rather than
                relying on a single disciplinary lens, I learned to combine
                history and economics, culture and ethics, to understand global
                issues from multiple angles. Working in an interdisciplinary team
                on the Seoul–New York tourism project required analyzing
                stakeholder perspectives with care — residents, businesses,
                policymakers, and visitors each hold legitimate but competing
                interests.
              </p>
              <p className="relative mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-[1.85] text-muted">
                The course strengthened my research and presentation skills while
                giving me practical frameworks — Hofstede, Hall, intercultural
                praxis — I still use when communicating across difference. That
                combination of analytical rigor and cultural awareness is
                preparing me for future work in business and data science, where
                understanding people, context, and global systems is just as
                important as the numbers.
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
