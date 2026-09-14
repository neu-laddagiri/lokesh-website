"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import {
  CATEGORY_COLORS,
  TOTAL_FLIGHTS,
  categoryLabel,
  computeTotalJourneyTime,
  filterFlights,
  greeceFlightFilters,
  greeceFlights,
  type FlightFilterId,
} from "@/lib/greece-flights";
import { greeceHero, greeceTheme } from "@/lib/greece-2026";
import { FlightDetailPanel } from "./flight-detail-panel";
import { FlightItinerary } from "./flight-itinerary";
import { FlightMap } from "./flight-map";
import { GREECE_EASE } from "./motion-presets";

const BLUE = greeceTheme.accent;

function GreekFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 18" className={className} role="img" aria-label="Flag of Greece">
      <rect width="27" height="18" fill="#ffffff" />
      {[0, 2, 4, 6, 8].map((y) => (
        <rect key={y} y={y * 2} width="27" height="2" fill={BLUE} />
      ))}
      <rect width="10" height="10" fill={BLUE} />
      <rect x="4" width="2" height="10" fill="#ffffff" />
      <rect y="4" width="10" height="2" fill="#ffffff" />
    </svg>
  );
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="pointer-events-none absolute bottom-[calc(var(--rail-h)+14px)] left-1/2 z-20 hidden -translate-x-1/2 lg:block"
    >
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="h-8 w-px bg-gradient-to-b from-white/45 to-transparent"
      />
    </motion.div>
  );
}

export function GreeceRouteHero() {
  const [filter, setFilter] = useState<FlightFilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    greeceFlights[0]?.id ?? null,
  );
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filteredFlights = useMemo(
    () => filterFlights(greeceFlights, filter),
    [filter],
  );
  const selectedFlight = useMemo(
    () => filteredFlights.find((flight) => flight.id === selectedId) ?? null,
    [filteredFlights, selectedId],
  );
  const previewFlight = useMemo(
    () => filteredFlights.find((flight) => flight.id === previewId) ?? null,
    [filteredFlights, previewId],
  );
  const activeId = previewFlight?.id ?? selectedFlight?.id ?? null;
  const totalJourneyTime = useMemo(
    () => computeTotalJourneyTime(greeceFlights),
    [],
  );

  /**
   * The title sits over the top of the map and the rail over the bottom, so the
   * route is fitted into the band between them rather than the whole viewport.
   */
  const insets = useMemo(() => ({ top: 176, bottom: 268, left: 40, right: 356 }), []);

  const handleFilter = (next: FlightFilterId) => {
    const nextFlights = filterFlights(greeceFlights, next);
    setFilter(next);
    setPreviewId(null);
    setSelectedId((current) =>
      nextFlights.some((flight) => flight.id === current)
        ? current
        : (nextFlights[0]?.id ?? null),
    );
  };

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setPreviewId(null);
  }, []);
  const handlePreviewStart = useCallback((id: string) => setPreviewId(id), []);
  const handlePreviewEnd = useCallback(
    (id: string) =>
      setPreviewId((current) => (current === id ? null : current)),
    [],
  );

  return (
    <section
      id="route"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[#02040a]"
      style={{ ["--rail-h" as string]: "244px" }}
    >
      <div className="absolute inset-0">
        <FlightMap
          flights={filteredFlights}
          filter={filter}
          selectedFlight={selectedFlight}
          previewFlight={previewFlight}
          activeId={activeId}
          onSelect={handleSelect}
          onPreviewStart={handlePreviewStart}
          onPreviewEnd={handlePreviewEnd}
          insets={insets}
        />
      </div>

      {/* Legibility scrims only: no panels floating over the middle. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[46%] bg-gradient-to-b from-[#02040a] via-[#02040a]/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[52%] bg-gradient-to-t from-[#02040a] via-[#02040a]/78 to-transparent"
        aria-hidden
      />

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: GREECE_EASE }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-24 lg:px-10 lg:pt-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <GreekFlag className="h-[20px] w-[30px] shrink-0 rounded-[3px] ring-1 ring-white/20" />
            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/60 uppercase">
              {greeceHero.eyebrow}
            </p>
          </div>

          <h1 className="mt-3 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-white">
            {greeceHero.title}
          </h1>
          <p className="mt-2.5 max-w-xl text-[clamp(1rem,2.2vw,1.25rem)] leading-[1.35] font-medium tracking-[-0.02em] text-white/70">
            {greeceHero.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-white/50">
            <span>5 weeks</span>
            <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
            <span>3 courses, 4.0</span>
            <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
            <span>{TOTAL_FLIGHTS} flights</span>
            <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
            <span>{totalJourneyTime} in the air</span>
          </div>
        </div>
      </motion.header>

      {/* Desktop detail panel, sitting in the dead space right of the route. */}
      <div className="pointer-events-none absolute top-1/2 right-6 z-20 hidden w-[300px] -translate-y-1/2 lg:block xl:right-10">
        <div className="pointer-events-auto max-h-[52svh]">
          <FlightDetailPanel
            flight={selectedFlight}
            flights={filteredFlights}
            onNavigate={handleSelect}
          />
        </div>
      </div>

      <ScrollCue />

      <div className="absolute inset-x-0 bottom-0 z-20 pb-5">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div
            className="hide-scrollbar mb-3 flex gap-2 overflow-x-auto pb-0.5"
            role="group"
            aria-label="Filter routes"
          >
            {greeceFlightFilters.map((item) => {
              const active = filter === item.id;
              const color =
                item.id === "all"
                  ? null
                  : CATEGORY_COLORS[item.id as keyof typeof CATEGORY_COLORS]
                      .stroke;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleFilter(item.id)}
                  aria-pressed={active}
                  className={`flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-medium backdrop-blur-xl transition-colors duration-300 ${
                    active
                      ? "border-white/30 bg-white/[0.14] text-white"
                      : "border-white/[0.12] bg-black/30 text-white/55 hover:text-white/85"
                  }`}
                >
                  {color && (
                    <span
                      className="h-1.5 w-4 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  )}
                  {item.id === "all" ? item.label : categoryLabel(item.id)}
                </button>
              );
            })}
          </div>
        </div>

        <FlightItinerary
          flights={filteredFlights}
          selectedId={selectedId}
          previewId={previewId}
          onSelect={handleSelect}
          onPreviewStart={handlePreviewStart}
          onPreviewEnd={handlePreviewEnd}
        />
      </div>
    </section>
  );
}
