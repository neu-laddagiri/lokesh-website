"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { isNavLinkActive, subpageNavLinks } from "@/lib/site-nav";
import { resumeExternalProps } from "@/lib/profile-links";
import { greeceTheme } from "@/lib/greece-2026";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GREECE_EASE } from "./motion-presets";

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

export function GreeceNav() {
  const pathname = usePathname();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 40);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: GREECE_EASE }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        navScrolled
          ? "border-b border-border bg-background/70 backdrop-blur-2xl"
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

        <div className="hidden items-center gap-8 md:flex">
          {subpageNavLinks.map((link) => {
            const active = isNavLinkActive(link, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? resumeExternalProps : {})}
                className="text-[13px] transition-colors duration-200"
                style={{
                  color: active ? greeceTheme.accent : "var(--muted)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
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
            {subpageNavLinks.map((link) => {
              const active = isNavLinkActive(link, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.external ? resumeExternalProps : {})}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium transition-colors"
                  style={{
                    color: active ? greeceTheme.accent : "var(--foreground-secondary)",
                    backgroundColor: active
                      ? `rgba(${greeceTheme.accentRgb}, 0.1)`
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export function GreeceFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-foreground"
        >
          <BackIcon />
          Back to Home
        </Link>
        <p className="text-[13px] text-muted">
          © {new Date().getFullYear()} Lokesh Addagiri. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {subpageNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...(link.external ? resumeExternalProps : {})}
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
