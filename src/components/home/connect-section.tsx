"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { SectionHeader } from "@/components/home/section";
import { PROFILE_IMAGE, PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import { CO_OP, EMAIL } from "@/lib/site-facts";

function MailIcon() {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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

type ConnectCard = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  icon: React.ReactNode;
  iconClassName: string;
  glowClassName: string;
  buttonClassName: string;
  newTab: boolean;
  avatar?: boolean;
};

const cards: readonly ConnectCard[] = [
  {
    title: "Email",
    description: EMAIL,
    href: "mailto:" + EMAIL,
    buttonText: "Send an email",
    icon: <MailIcon />,
    iconClassName: "text-[#34c759]",
    glowClassName: "bg-[#34c759]/10",
    buttonClassName:
      "group-hover:bg-[#34c759] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(52,199,89,0.3)]",
    newTab: false,
  },
  {
    title: "LinkedIn",
    description: "Experience, coursework, and the same projects listed here.",
    href: PROFILE_LINKS.linkedin,
    buttonText: "View LinkedIn",
    icon: <LinkedInIcon />,
    iconClassName: "text-[#0A66C2]",
    glowClassName: "bg-[#0A66C2]/10",
    buttonClassName:
      "group-hover:bg-[#0A66C2] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(10,102,194,0.35)]",
    newTab: true,
    avatar: true,
  },
  {
    title: "GitHub",
    description: "Source for CardEdge, IG Wrapped, and this site.",
    href: PROFILE_LINKS.github,
    buttonText: "View GitHub",
    icon: <GitHubIcon />,
    iconClassName: "text-foreground",
    glowClassName: "bg-foreground/10",
    buttonClassName:
      "group-hover:bg-cta-bg group-hover:text-cta-text group-hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]",
    newTab: true,
  },
  {
    title: "Resume",
    description: "One page, PDF.",
    href: PROFILE_LINKS.resume,
    buttonText: "Open resume",
    icon: <DocumentIcon />,
    iconClassName: "text-[#2997ff]",
    glowClassName: "bg-[#2997ff]/10",
    buttonClassName:
      "group-hover:bg-[#2997ff] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(41,151,255,0.35)]",
    newTab: true,
  },
];

export function ConnectSection() {
  return (
    <section id="contact" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Contact"
          title="Let's talk about January 2027."
          description={`I am looking for a ${CO_OP.term} co-op in ${CO_OP.industry.toLowerCase()}. The fastest way to reach me is email.`}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              {...(card.newTab ? resumeExternalProps : {})}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            >
              <div
                className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 ${card.glowClassName}`}
              />

              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  {card.avatar ? (
                    <ProfileAvatar />
                  ) : (
                    <div
                      className={`glass flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 group-hover:bg-card-hover ${card.iconClassName}`}
                    >
                      {card.icon}
                    </div>
                  )}
                  <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                    {card.title}
                  </h3>
                </div>

                <p className="mt-4 mb-6 text-[14px] leading-relaxed break-words text-muted">
                  {card.description}
                </p>

                <span
                  className={`mt-auto inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card px-4 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 group-hover:border-transparent ${card.buttonClassName}`}
                >
                  {card.buttonText}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
