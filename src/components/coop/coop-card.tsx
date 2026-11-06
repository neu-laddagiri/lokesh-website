"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { CARD_STATS, COOP, TIMELINE } from "@/lib/coop";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import { lockScroll } from "./scroll-lock";

export type CardEntrance = "fade" | "rise";

type Props = {
  open: boolean;
  /** "rise" when the intro hands off to the card, "fade" everywhere else. */
  entrance: CardEntrance;
  onClose: () => void;
  onReplay: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-4 text-[14px] font-medium sm:gap-2 sm:px-5 text-foreground transition-colors duration-200 hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function ReplayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

/**
 * The co-op announcement as a modal dialog. The intro lands on it, "Co-op
 * news" reopens it, and it works without the intro ever having played. One
 * plain dim sits behind it in every case, so the intro can fade out beneath
 * the card without the backdrop changing.
 */
export function CoopCard({ open, entrance, onClose, onReplay }: Props) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const summaryId = useId();

  // Focus moves into the dialog, and the page behind stops scrolling.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus({ preventScroll: true });
    const unlock = lockScroll();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, onClose]);

  /** Tab and Shift+Tab cycle inside the dialog. */
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const panelFrom =
    reduceMotion
      ? { opacity: 0 }
      : entrance === "rise"
        ? { opacity: 0, y: 64 }
        : { opacity: 0, y: 10, scale: 0.985 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="coop-card"
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.12 : 0.2 } }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            tabIndex={-1}
            onKeyDown={trapFocus}
            initial={panelFrom}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.18 }
                : entrance === "rise"
                  ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
            }
            className="relative flex max-h-[calc(100svh-1.5rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] outline-none sm:max-h-[calc(100svh-3rem)]"
          >
            {/* The story scrolls on short screens; the buttons stay put below it. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
              <h2
                id={titleId}
                className="pr-2 text-[clamp(1.65rem,5vw,2.25rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground"
              >
                {COOP.heading}
              </h2>
              <p className="mt-3 text-[16px] font-medium tracking-[-0.015em] text-foreground-secondary">
                {COOP.title}
              </p>
              <p className="mt-1 text-[14px] text-muted">{COOP.placeAndDates}</p>
              <p id={summaryId} className="mt-4 text-[15px] leading-[1.6] text-foreground-secondary">
                {COOP.summary}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {CARD_STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col bg-background px-4 py-3.5">
                    <dt className="order-2 mt-1.5 text-[13px] leading-snug text-muted">{stat.label}</dt>
                    <dd className="order-1 text-[28px] leading-none font-semibold tracking-[-0.03em] text-foreground tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ol className="mt-6 space-y-2.5">
                {TIMELINE.map((step, i) => {
                  const last = i === TIMELINE.length - 1;
                  return (
                    <li key={`${step.iso}-${step.label}`} className="relative flex gap-3.5 pl-0.5">
                      <span aria-hidden className="relative mt-[7px] flex w-2 shrink-0 justify-center">
                        <span className={`h-2 w-2 rounded-full ${last ? "bg-accent" : "bg-muted/60"}`} />
                        {!last && <span className="absolute top-3 h-[calc(100%+2px)] w-px bg-border" />}
                      </span>
                      <time
                        dateTime={step.iso}
                        className="w-12 shrink-0 text-[13.5px] font-medium text-foreground tabular-nums"
                      >
                        {step.date}
                      </time>
                      <span className="text-[13.5px] leading-[1.5] text-foreground-secondary">{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-2.5 border-t border-border px-6 py-4 sm:flex sm:items-center sm:px-8 sm:py-5">
              <button type="button" onClick={onReplay} className={SECONDARY_BUTTON}>
                <ReplayIcon />
                Replay intro
              </button>
              <a href={PROFILE_LINKS.resume} {...resumeExternalProps} className={SECONDARY_BUTTON}>
                View resume
              </a>
              <button
                type="button"
                onClick={onClose}
                className="col-span-2 inline-flex h-11 items-center justify-center rounded-full bg-cta-bg px-6 text-[14px] font-medium text-cta-text transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:ml-auto"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
