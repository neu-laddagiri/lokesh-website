"use client";

import {
  categoryLabel,
  computeTotalJourneyTime,
  formatTime12h,
  greeceAirports,
  sortFlightsByOrder,
  type GreeceFlight,
} from "@/lib/greece-flights";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function FlightCard({
  flight,
  selected,
  previewed,
  onSelect,
  onPreviewStart,
  onPreviewEnd,
  buttonRef,
}: {
  flight: GreeceFlight;
  selected: boolean;
  previewed: boolean;
  onSelect: () => void;
  onPreviewStart: () => void;
  onPreviewEnd: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const from = greeceAirports[flight.from];
  const to = greeceAirports[flight.to];
  const emphasized = selected || previewed;
  const arrivalSuffix = flight.arrivalDayOffset ? ` +${flight.arrivalDayOffset}` : "";
  const photoCount = flight.photos?.length ?? 0;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-flight-id={flight.id}
      onClick={onSelect}
      onPointerEnter={onPreviewStart}
      onPointerLeave={onPreviewEnd}
      onFocus={onPreviewStart}
      onBlur={onPreviewEnd}
      aria-pressed={selected}
      aria-label={`${flight.from} to ${flight.to}, ${flight.airline} ${flight.flightNumber}, ${flight.dateDisplay}`}
      className={`group w-[82vw] max-w-[320px] shrink-0 snap-center rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 sm:w-[300px] xl:w-[286px] ${
        emphasized
          ? "border-white/[0.22] bg-white/[0.085]"
          : "border-white/[0.09] bg-white/[0.035] hover:border-white/[0.15] hover:bg-white/[0.055]"
      } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
      style={{
        boxShadow: emphasized
          ? `0 0 34px ${flight.arcGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`
          : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-[#02040a]"
            style={{ backgroundColor: flight.arcColor }}
          >
            {flight.order}
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.09em] text-white/55 uppercase">
              {flight.dateDisplay}
            </p>
            <p className="mt-0.5 text-[10px] text-white/38">{categoryLabel(flight.category)}</p>
          </div>
        </div>
        {photoCount > 0 ? (
          <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[10px] text-white/55">
            {photoCount} photo{photoCount === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="text-[11px] text-white/35 transition-transform group-hover:translate-x-0.5">→</span>
        )}
      </div>

      <p className="mt-3 text-[1.3rem] font-semibold tracking-[-0.035em] text-white">
        {flight.from} <span style={{ color: flight.arcColor }}>→</span> {flight.to}
      </p>
      <p className="mt-0.5 text-[12px] text-white/50">
        {from.city} to {to.city}
      </p>

      <div className="mt-4 flex items-start gap-2">
        <div className="min-w-[58px] text-left">
          <p className="text-[12px] font-semibold text-white/90">{formatTime12h(flight.departure)}</p>
          <p className="mt-0.5 text-[10px] text-white/42">{flight.from}</p>
        </div>
        <div className="relative mt-2 flex flex-1 flex-col items-center px-1">
          <div className="h-px w-full border-t border-dashed border-white/25" />
          <PlaneIcon className="absolute -top-[7px] text-white/60" />
          <p className="mt-2 text-[10px] font-medium text-white/48">{flight.duration}</p>
        </div>
        <div className="min-w-[58px] text-right">
          <p className="text-[12px] font-semibold text-white/90">
            {formatTime12h(flight.arrival)}
            {arrivalSuffix && <sup className="ml-0.5 text-[8px] text-white/55">{arrivalSuffix}</sup>}
          </p>
          <p className="mt-0.5 text-[10px] text-white/42">{flight.to}</p>
        </div>
      </div>
    </button>
  );
}

export function FlightItinerary({
  flights,
  selectedId,
  previewId,
  onSelect,
  onPreviewStart,
  onPreviewEnd,
  className = "",
}: {
  flights: GreeceFlight[];
  selectedId: string | null;
  previewId: string | null;
  onSelect: (id: string) => void;
  onPreviewStart: (id: string) => void;
  onPreviewEnd: (id: string) => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const sorted = sortFlightsByOrder(flights);
  const totalTime = computeTotalJourneyTime(sorted);

  useEffect(() => {
    if (!selectedId) return;
    const scroller = scrollerRef.current;
    const card = cardRefs.current.get(selectedId);
    if (!scroller || !card) return;
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion, selectedId]);

  const scroll = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * Math.min(scrollerRef.current.clientWidth * 0.82, 640),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      className={`flex h-full flex-col border-white/[0.09] bg-[rgba(4,6,10,0.94)] backdrop-blur-2xl ${className}`}
      aria-labelledby="flight-itinerary-heading"
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 xl:px-8">
        <div>
          <p
            id="flight-itinerary-heading"
            className="text-[10px] font-semibold tracking-[0.18em] text-white/52 uppercase"
          >
            Route itinerary
          </p>
          <p className="mt-1 text-[11px] text-white/38">
            {sorted.length} flight{sorted.length === 1 ? "" : "s"} · {totalTime} in the air
          </p>
        </div>
        <div className="flex items-center gap-1" aria-label="Scroll flight itinerary">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.09] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Earlier flights"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.09] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Later flights"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar mt-3 flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-6 xl:px-8"
      >
        {sorted.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            selected={selectedId === flight.id}
            previewed={previewId === flight.id}
            onSelect={() => onSelect(flight.id)}
            onPreviewStart={() => onPreviewStart(flight.id)}
            onPreviewEnd={() => onPreviewEnd(flight.id)}
            buttonRef={(node) => {
              if (node) cardRefs.current.set(flight.id, node);
              else cardRefs.current.delete(flight.id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
