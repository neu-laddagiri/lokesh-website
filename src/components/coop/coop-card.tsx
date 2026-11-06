"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { CARD_STATS, COOP, TIMELINE } from "@/lib/coop";
import { PROFILE_LINKS, resumeExternalProps } from "@/lib/profile-links";
import type { Camera } from "./intro/coop-map";
import { lockScroll } from "./scroll-lock";
import { VeriskLogoPlate } from "./verisk-logo";

/** Loaded only when the card opens: MapLibre, the video, and the leaves stay out of every page load. */
const MapPanel = dynamic(() => import("./map-panel").then((m) => m.MapPanel), { ssr: false });
const PumpkinPanel = dynamic(() => import("./pumpkin-panel").then((m) => m.PumpkinPanel), { ssr: false });
const FallingLeaves = dynamic(() => import("./falling-leaves").then((m) => m.FallingLeaves), { ssr: false });

export type CardEntrance = "fade" | "handoff";

type Props = {
  open: boolean;
  /** "handoff" when the intro shrinks its map onto the left panel; "fade" everywhere else. */
  entrance: CardEntrance;
  /** The intro's camera for the map panel to pick up. */
  handoff: Camera | null;
  /** The intro's logo is still flying onto the card. */
  logoPending: boolean;
  /** The intro has let go of the map panel's area. */
  revealMap: boolean;
  onPanelReady: () => void;
  onClose: () => void;
  onReplay: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-4 text-[14px] font-medium sm:gap-2 sm:px-5 text-foreground transition-colors duration-200 hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const TOP_BUTTON =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 text-[13.5px] font-medium text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function ReplayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function PauseIcon({ paused }: { paused: boolean }) {
  return paused ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l12.5-7.5z" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="5.5" y="4.5" width="4.5" height="15" rx="1" />
      <rect x="14" y="4.5" width="4.5" height="15" rx="1" />
    </svg>
  );
}

/**
 * The co-op announcement: a modal dialog with the card in the middle, the live
 * map of the office on the left, and Verisk's jack-o'-lantern on the right,
 * over falling leaves. The intro lands on it, "Co-op news" reopens it, and it
 * works without the intro ever having played.
 */
export function CoopCard({ open, entrance, handoff, logoPending, revealMap, onPanelReady, onClose, onReplay }: Props) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const summaryId = useId();
  const [paused, setPaused] = useState(false);

  // Focus moves into the dialog, and the page behind stops scrolling.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus({ preventScroll: true });
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
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  /** A click on the empty space around the panels closes, like a backdrop. */
  const closeOnEmpty = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handoffIn = entrance === "handoff" && !reduceMotion;
  const rise = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.18 } }
      : handoffIn
        ? { initial: { opacity: 0, y: 56 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] as const } }
        : { initial: { opacity: 0, y: 10, scale: 0.985 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.34, delay: delay * 0.4, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="coop-card"
          className="fixed inset-0 z-[110]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.12 : 0.22 } }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
          />
          <FallingLeaves paused={paused} />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            tabIndex={-1}
            onKeyDown={trapFocus}
            onClick={closeOnEmpty}
            className="absolute inset-0 overflow-y-auto overscroll-contain outline-none"
          >
            <div className="fixed top-3 right-3 z-20 flex gap-2 sm:top-5 sm:right-5">
              {!reduceMotion && (
                <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} className={TOP_BUTTON}>
                  <PauseIcon paused={paused} />
                  {paused ? "Play motion" : "Pause motion"}
                </button>
              )}
              <button type="button" onClick={onClose} aria-label="Close" className={`${TOP_BUTTON} w-10 px-0`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div onClick={closeOnEmpty} className="flex min-h-full items-center justify-center px-3 pt-16 pb-6 sm:px-6 md:py-6">
              <div
                onClick={closeOnEmpty}
                className="grid w-full max-w-[560px] grid-cols-1 gap-3 md:max-w-[1000px] md:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] md:gap-4 xl:max-w-[1340px] xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)_minmax(0,1fr)] xl:items-center"
              >
                {/* The card comes first for screen readers and the keyboard; the grid places it in the middle. */}
                <motion.article
                  {...rise(0.12)}
                  className="relative order-2 flex flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] md:order-none md:col-start-1 md:row-span-2 md:row-start-1 md:max-h-[calc(100svh-3rem)] xl:col-start-2 xl:row-span-1"
                >
                  <div className="min-h-0 flex-1 px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6 md:overflow-y-auto md:overscroll-contain">
                    <VeriskLogoPlate height={46} slot hidden={logoPending} className="mb-6" />
                    <h2
                      id={titleId}
                      className="pr-2 text-[clamp(1.65rem,5vw,2.25rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground"
                    >
                      {COOP.heading}
                    </h2>
                    <p className="mt-3 text-[16px] font-medium tracking-[-0.015em] text-foreground-secondary">{COOP.title}</p>
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
                            <time dateTime={step.iso} className="w-12 shrink-0 text-[13.5px] font-medium text-foreground tabular-nums">
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
                </motion.article>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: handoffIn ? 0.6 : 0.3 }}
                  className="order-1 md:order-none md:col-start-2 md:row-start-1 xl:col-start-1"
                >
                  <MapPanel paused={paused} handoff={handoff} reveal={revealMap} onReady={onPanelReady} />
                </motion.div>

                <motion.div {...rise(0.28)} className="order-3 md:order-none md:col-start-2 md:row-start-2 xl:col-start-3 xl:row-start-1">
                  <PumpkinPanel paused={paused} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
