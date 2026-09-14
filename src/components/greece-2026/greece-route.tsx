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
import { FlightDetailPanel } from "./flight-detail-panel";
import { FlightItinerary } from "./flight-itinerary";
import { FlightMap } from "./flight-map";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";
import { greeceFadeUp, greeceViewport } from "./motion-presets";

export function GreeceRoute() {
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
    <section id="route" className="scroll-mt-32 px-6 py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <GreeceSectionLabel>The route</GreeceSectionLabel>
            <GreeceSectionTitle>Ten flights, six airports.</GreeceSectionTitle>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 text-[12.5px] text-muted">
            <span>{TOTAL_FLIGHTS} flights</span>
            <span className="h-1 w-1 rounded-full bg-muted/50" aria-hidden />
            <span>{totalJourneyTime} in the air</span>
          </div>
        </motion.div>

        {/* One control bar: the filters double as the route legend. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={1}
          className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1"
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
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  active
                    ? "border-transparent bg-card-hover text-foreground"
                    : "border-border text-muted hover:text-foreground"
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
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={2}
          className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
        >
          <div className="relative h-[340px] overflow-hidden rounded-2xl border border-border sm:h-[420px] lg:h-[460px]">
            <FlightMap
              flights={filteredFlights}
              filter={filter}
              selectedFlight={selectedFlight}
              previewFlight={previewFlight}
              activeId={activeId}
              onSelect={handleSelect}
              onPreviewStart={handlePreviewStart}
              onPreviewEnd={handlePreviewEnd}
            />
          </div>

          <div className="lg:h-[460px]">
            <FlightDetailPanel
              flight={selectedFlight}
              flights={filteredFlights}
              onNavigate={handleSelect}
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={3}
          className="mt-4 overflow-hidden rounded-2xl border border-border"
        >
          <FlightItinerary
            flights={filteredFlights}
            selectedId={selectedId}
            previewId={previewId}
            onSelect={handleSelect}
            onPreviewStart={handlePreviewStart}
            onPreviewEnd={handlePreviewEnd}
          />
        </motion.div>
      </div>
    </section>
  );
}
