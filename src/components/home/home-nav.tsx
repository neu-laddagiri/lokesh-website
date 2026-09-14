"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { EASE } from "@/components/home/motion";
import { resumeExternalProps } from "@/lib/profile-links";
import { homeNavLinks } from "@/lib/site-nav";

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/60 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
        <a
          href="#"
          className="text-sm font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
        >
          Lokesh Addagiri
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {homeNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? resumeExternalProps : {})}
              className="text-[13px] text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="glass relative flex h-9 w-9 flex-col items-center justify-center rounded-full md:hidden"
          >
            <span
              className={`absolute block h-[1.5px] w-4 bg-muted transition-all duration-300 ${mobileOpen ? "rotate-45" : "-translate-y-[3px]"}`}
            />
            <span
              className={`absolute block h-[1.5px] w-4 bg-muted transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute block h-[1.5px] w-4 bg-muted transition-all duration-300 ${mobileOpen ? "-rotate-45" : "translate-y-[3px]"}`}
            />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-2xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {homeNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? resumeExternalProps : {})}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-foreground-secondary transition-colors hover:bg-card-hover"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <p className="text-[13px] text-muted">
          © {new Date().getFullYear()} Lokesh Addagiri. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {homeNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? resumeExternalProps : {})}
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
