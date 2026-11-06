"use client";

import { useCoop } from "./coop-provider";

/**
 * Reopens the co-op card from any page. Sits next to the theme toggle in every
 * header, and is where focus returns when the card closes.
 */
export function CoopNewsButton() {
  const { openCard } = useCoop();
  return (
    <button
      type="button"
      data-coop-news
      aria-haspopup="dialog"
      onClick={(event) => openCard(event.currentTarget)}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-[12.5px] font-medium tracking-[-0.01em] whitespace-nowrap text-foreground-secondary transition-colors duration-200 hover:bg-card-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      Co-op news
    </button>
  );
}
