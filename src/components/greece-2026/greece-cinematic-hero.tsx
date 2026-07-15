"use client";

import {
  CATEGORY_COLORS,
  TOTAL_FLIGHTS,
  computeTotalJourneyTime,
  filterFlights,
  flightRouteLabel,
  greeceCinematicHero,
  greeceFlightFilters,
  greeceFlights,
  type FlightFilterId,
} from "@/lib/greece-flights";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlightDetailPanel } from "./flight-detail-panel";
import { FlightItinerary } from "./flight-itinerary";
import { FlightMap } from "./flight-map";
import { GREECE_EASE } from "./motion-presets";

export function GreeceCinematicHero() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FlightFilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(greeceFlights[0]?.id ?? null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const filteredFlights = useMemo(() => filterFlights(greeceFlights, filter), [filter]);
  const selectedFlight = useMemo(
    () => greeceFlights.find((flight) => flight.id === selectedId) ?? null,
    [selectedId],
  );
  const previewFlight = useMemo(
    () => filteredFlights.find((flight) => flight.id === previewId) ?? null,
    [filteredFlights, previewId],
  );
  const activeId = previewFlight?.id ?? selectedFlight?.id ?? null;
  const totalJourneyTime = useMemo(() => computeTotalJourneyTime(greeceFlights), []);

  const handleFilter = (nextFilter: FlightFilterId) => {
    const nextFlights = filterFlights(greeceFlights, nextFilter);
    setFilter(nextFilter);
    setPreviewId(null);
    setSelectedId((current) =>
      nextFlights.some((flight) => flight.id === current) ? current : (nextFlights[0]?.id ?? null),
    );
    setDrawerOpen(false);
  };

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setPreviewId(null);
    if (window.innerWidth < 1180) setDrawerOpen(true);
  }, []);

  const handlePreviewStart = useCallback((id: string) => {
    setPreviewId(id);
  }, []);

  const handlePreviewEnd = useCallback((id: string) => {
    setPreviewId((current) => (current === id ? null : current));
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (dialog && event.target instanceof Node && !dialog.contains(event.target)) {
        dialog.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      restoreFocusRef.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <section
      id="greece-hero"
      className="relative overflow-hidden bg-[#030508] text-white"
      aria-labelledby="greece-flight-map-title"
    >
      <div className="relative min-[1180px]:h-[max(100svh,820px)] min-[1180px]:min-h-[820px]">
        <header className="relative z-30 px-4 pt-24 sm:px-6 min-[1180px]:pointer-events-none min-[1180px]:absolute min-[1180px]:top-0 min-[1180px]:left-0 min-[1180px]:max-w-[500px] min-[1180px]:px-8 min-[1180px]:pt-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: GREECE_EASE }}
            className="min-[1180px]:pointer-events-auto"
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
              {greeceCinematicHero.eyebrow}
            </p>
            <h1
              id="greece-flight-map-title"
              className="mt-2 max-w-[460px] text-[clamp(2.55rem,6vw,4rem)] leading-[1.02] font-medium tracking-[-0.025em] text-white"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {greeceCinematicHero.title}
            </h1>
            <p className="mt-3 max-w-[430px] text-[13px] leading-[1.65] text-white/62 sm:text-[14px]">
              {greeceCinematicHero.description}
            </p>
            <p className="mt-2 max-w-[430px] text-[11px] leading-5 tracking-[0.04em] text-white/38">
              {greeceCinematicHero.routeSubtitle}
            </p>

            <div className="mt-4 flex items-center gap-3 text-[11px] text-white/48">
              <span>{TOTAL_FLIGHTS} flights</span>
              <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
              <span>{totalJourneyTime} in the air</span>
              <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
              <span>May 16–Jun 19</span>
            </div>

            <div
              className="hide-scrollbar -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 min-[1180px]:flex-wrap min-[1180px]:overflow-visible"
              role="group"
              aria-label="Filter routes"
            >
              {greeceFlightFilters.map((item) => {
                const active = filter === item.id;
                const color =
                  item.id === "all"
                    ? "#ffffff"
                    : CATEGORY_COLORS[item.id as keyof typeof CATEGORY_COLORS].stroke;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFilter(item.id)}
                    aria-pressed={active}
                    className="min-h-11 shrink-0 rounded-full border px-3.5 text-[11px] font-semibold transition-[border-color,background-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={
                      active
                        ? {
                            borderColor: `${color}99`,
                            backgroundColor: `${color}20`,
                            color,
                            boxShadow: `0 0 22px ${color}35`,
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.13)",
                            backgroundColor: "rgba(0,0,0,0.34)",
                            color: "rgba(255,255,255,0.58)",
                          }
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </header>

        <div className="relative mx-4 mt-5 h-[430px] overflow-hidden rounded-[1.4rem] border border-white/[0.11] shadow-[0_24px_90px_rgba(0,0,0,0.5)] sm:mx-6 sm:h-[520px] lg:h-[580px] min-[1180px]:absolute min-[1180px]:inset-x-0 min-[1180px]:top-0 min-[1180px]:bottom-[252px] min-[1180px]:mx-0 min-[1180px]:mt-0 min-[1180px]:h-auto min-[1180px]:rounded-none min-[1180px]:border-x-0 min-[1180px]:border-t-0">
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

          <div className="pointer-events-none absolute top-5 right-5 bottom-5 z-20 hidden w-[320px] min-[1180px]:block">
            <div className="pointer-events-auto h-full">
              <AnimatePresence mode="wait">
                <FlightDetailPanel
                  key={selectedFlight?.id ?? "empty"}
                  flight={selectedFlight}
                  flights={filteredFlights}
                  onNavigate={handleSelect}
                  onClose={() => setSelectedId(null)}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="relative mx-4 mt-5 mb-8 h-[246px] overflow-hidden rounded-[1.4rem] border border-white/[0.1] sm:mx-6 min-[1180px]:absolute min-[1180px]:inset-x-0 min-[1180px]:bottom-0 min-[1180px]:mx-0 min-[1180px]:mb-0 min-[1180px]:mt-0 min-[1180px]:h-[252px] min-[1180px]:rounded-none min-[1180px]:border-x-0 min-[1180px]:border-b-0">
          <FlightItinerary
            flights={filteredFlights}
            selectedId={selectedId}
            previewId={previewId}
            onSelect={handleSelect}
            onPreviewStart={handlePreviewStart}
            onPreviewEnd={handlePreviewEnd}
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {selectedFlight ? `Selected ${flightRouteLabel(selectedFlight)}, ${selectedFlight.flightNumber}` : ""}
      </p>

      <AnimatePresence>
        {drawerOpen && selectedFlight && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="fixed inset-0 z-40 bg-black/68 backdrop-blur-sm min-[1180px]:hidden"
              onClick={() => setDrawerOpen(false)}
              tabIndex={-1}
              aria-label="Close flight details"
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="flight-detail-dialog-title"
              tabIndex={-1}
              initial={reduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: "100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.38, ease: GREECE_EASE }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto h-[85dvh] max-w-[640px] overflow-hidden p-3 outline-none sm:p-4 min-[1180px]:hidden"
            >
              <FlightDetailPanel
                flight={selectedFlight}
                flights={filteredFlights}
                onNavigate={handleSelect}
                onClose={() => setDrawerOpen(false)}
                compact
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
