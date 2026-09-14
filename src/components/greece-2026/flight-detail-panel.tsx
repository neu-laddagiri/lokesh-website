"use client";

import {
  categoryLabel,
  formatTime12h,
  greeceAirports,
  sortFlightsByOrder,
  type GreeceFlight,
} from "@/lib/greece-flights";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { GREECE_EASE } from "./motion-presets";

const GLASS =
  "rounded-2xl border border-white/[0.12] bg-[rgba(8,12,20,0.72)] shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
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

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-start gap-3 border-b border-white/[0.07] py-2.5 last:border-0">
      <dt className="text-[12px] leading-5 text-white/50">{label}</dt>
      <dd className="text-right text-[13px] leading-5 font-medium text-white/90">{value}</dd>
    </div>
  );
}

function FlightPhotos({ flight }: { flight: GreeceFlight }) {
  const photos = flight.photos ?? [];

  if (photos.length === 0) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-white/[0.13] bg-white/[0.035] px-3.5 py-3 text-white/55">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/55">
          <CameraIcon />
        </span>
        <div>
          <p className="text-[12px] font-medium text-white/70">Flight photos ready</p>
          <p className="mt-0.5 text-[11px] leading-4 text-white/40">
            Cabin, window, and airport photos can drop in here later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
      {photos.map((photo) => {
        const focalPoint = photo.focalPoint
          ? `${photo.focalPoint.x * 100}% ${photo.focalPoint.y * 100}%`
          : "center";

        return (
          <a
            key={photo.id}
            href={photo.src}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square w-[calc((100%_-_1rem)/3)] shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={`Open photo: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ objectPosition: focalPoint }}
              sizes="(min-width: 1280px) 96px, 30vw"
            />
          </a>
        );
      })}
    </div>
  );
}

export function FlightDetailPanel({
  flight,
  flights,
  onNavigate,
  onClose,
  compact = false,
}: {
  flight: GreeceFlight | null;
  flights: GreeceFlight[];
  onNavigate: (id: string) => void;
  /** Only needed for the compact drawer variant. */
  onClose?: () => void;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const sorted = sortFlightsByOrder(flights);
  const index = flight ? sorted.findIndex((item) => item.id === flight.id) : -1;
  const previous = index > 0 ? sorted[index - 1] : null;
  const next = index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;

  if (!flight) {
    return (
      <div className={`${GLASS} flex h-full min-h-72 items-center justify-center p-8 text-center`}>
        <p className="text-sm text-white/55">Choose a route to see its details.</p>
      </div>
    );
  }

  const from = greeceAirports[flight.from];
  const to = greeceAirports[flight.to];
  const arrivalSuffix = flight.arrivalDayOffset ? ` +${flight.arrivalDayOffset} day` : "";

  return (
    <motion.article
      key={flight.id}
      initial={reduceMotion ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: GREECE_EASE }}
      className={`${GLASS} flex h-full max-h-full min-h-0 flex-col overflow-hidden`}
    >
      <div className="flex min-h-14 items-center justify-between border-b border-white/[0.08] px-3">
        <button
          type="button"
          disabled={!previous}
          onClick={() => previous && onNavigate(previous.id)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-25"
          aria-label="Previous flight"
        >
          <ChevronIcon direction="left" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Flight {index + 1} of {sorted.length}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">Journey #{flight.order}</p>
        </div>
        <button
          type="button"
          disabled={!next}
          onClick={() => next && onNavigate(next.id)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-25"
          aria-label="Next flight"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={compact ? "flight-detail-dialog-title" : undefined}
              className="text-[1.65rem] font-semibold tracking-[-0.035em] text-white"
            >
              {flight.from} <span style={{ color: flight.arcColor }}>→</span> {flight.to}
            </h2>
            <p className="mt-1 text-[13px] text-white/55">
              {from.city} to {to.city}
            </p>
          </div>
          <span
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] uppercase"
            style={{ backgroundColor: `${flight.arcColor}20`, color: flight.arcColor }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {categoryLabel(flight.category)}
          </span>
        </div>

        <dl className="mt-5">
          <DetailRow label="Date" value={flight.dateDisplay} />
          <DetailRow label="Departure" value={`${formatTime12h(flight.departure)} · ${flight.from}`} />
          <DetailRow
            label="Arrival"
            value={`${formatTime12h(flight.arrival)}${arrivalSuffix} · ${flight.to}`}
          />
          <DetailRow label="Duration" value={flight.duration} />
          <DetailRow label="Airline" value={flight.airline} />
          <DetailRow label="Flight no." value={flight.flightNumber} />
          {flight.seat && <DetailRow label="Seat" value={flight.seat} />}
        </dl>

        {flight.notes && (
          <p className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-[12px] leading-5 text-white/55">
            {flight.notes}
          </p>
        )}

        <section className="mt-5" aria-label="Flight photos">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">
              Photos from this flight
            </p>
            {(flight.photos?.length ?? 0) > 0 && (
              <span className="text-[11px] text-white/40">{flight.photos?.length}</span>
            )}
          </div>
          <FlightPhotos flight={flight} />
        </section>
      </div>

      {compact && (
        <div className="border-t border-white/[0.08] p-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Close details
          </button>
        </div>
      )}
    </motion.article>
  );
}
