"use client";

import {
  PROFILE_IMAGE,
  PROFILE_LINKS,
} from "@/lib/profile-links";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const viewport = { once: true, margin: "-100px" as const };

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

function LinkedInIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function ProfileAvatar() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new window.Image();
    image.src = PROFILE_IMAGE;
    image.onload = () => setImageLoaded(true);
  }, []);

  if (!imageLoaded) {
    return (
      <div className="glass flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[15px] font-semibold tracking-[-0.02em] text-foreground">
        LA
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border">
      <Image
        src={PROFILE_IMAGE}
        alt="Lokesh Addagiri"
        fill
        sizes="56px"
        className="object-cover"
      />
    </div>
  );
}

type PresenceCardProps = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  icon: React.ReactNode;
  iconClassName: string;
  glowClassName: string;
  buttonClassName: string;
  index: number;
  id?: string;
  download?: boolean;
  avatar?: boolean;
};

function PresenceCard({
  title,
  description,
  href,
  buttonText,
  icon,
  iconClassName,
  glowClassName,
  buttonClassName,
  index,
  id,
  download,
  avatar,
}: PresenceCardProps) {
  return (
    <motion.a
      id={id}
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
      download={download ? true : undefined}
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -8, transition: { duration: 0.35 } }}
      className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_28px_80px_rgba(0,0,0,0.5)] sm:p-9"
    >
      <div
        className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${glowClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start gap-4">
          {avatar ? (
            <ProfileAvatar />
          ) : (
            <div
              className={`glass flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 group-hover:bg-card-hover ${iconClassName}`}
            >
              {icon}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-center gap-2.5">
              {avatar && (
                <span className={`shrink-0 ${iconClassName}`}>{icon}</span>
              )}
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                {title}
              </h3>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {description}
            </p>
          </div>
        </div>

        <span
          className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card px-5 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-transparent ${buttonClassName}`}
        >
          {buttonText}
        </span>
      </div>
    </motion.a>
  );
}

const presenceCards: PresenceCardProps[] = [
  {
    title: "LinkedIn",
    description: "Professional background, experience, and network.",
    href: PROFILE_LINKS.linkedin,
    buttonText: "View LinkedIn",
    icon: <LinkedInIcon />,
    iconClassName: "text-[#0A66C2]",
    glowClassName: "bg-[#0A66C2]/10",
    buttonClassName:
      "group-hover:bg-[#0A66C2] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(10,102,194,0.35)]",
    avatar: true,
    index: 0,
  },
  {
    title: "GitHub",
    description: "Code repositories, projects, and technical work.",
    href: PROFILE_LINKS.github,
    buttonText: "View GitHub",
    icon: <GitHubIcon />,
    iconClassName: "text-foreground",
    glowClassName: "bg-foreground/10",
    buttonClassName:
      "group-hover:bg-cta-bg group-hover:text-cta-text group-hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]",
    index: 1,
  },
  {
    title: "Resume",
    description: "Download a PDF overview of my experience and skills.",
    href: PROFILE_LINKS.resume,
    buttonText: "Download Resume",
    icon: <DocumentIcon />,
    iconClassName: "text-[#2997ff]",
    glowClassName: "bg-[#2997ff]/10",
    buttonClassName:
      "group-hover:bg-[#2997ff] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(41,151,255,0.35)]",
    id: "resume",
    index: 2,
  },
];

export function ProfessionalPresence() {
  return (
    <section id="professional-presence" className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          custom={0}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
            Professional Presence
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Connect with my professional work, experience, and technical
            portfolio.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {presenceCards.map((card) => (
            <PresenceCard key={card.title} {...card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
