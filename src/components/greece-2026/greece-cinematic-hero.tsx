"use client";

import {
  CATEGORY_COLORS,
  NIGHT_EARTH_MAP_STYLE,
  TOTAL_FLIGHTS,
  computeTotalJourneyTime,
  filterFlights,
  flightRouteLabel,
  formatTime12h,
  getFilterViewport,
  getVisibleAirportCodes,
  greeceAirports,
  greeceCinematicHero,
  greeceFlightFilters,
  greeceFlights,
  greatCirclePath,
  sortFlightsByOrder,
  type FlightFilterId,
  type GreeceFlight,
} from "@/lib/greece-flights";
import { AnimatePresence, motion } from "framer-motion";
import type { Map as MaplibreMap } from "maplibre-gl";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GREECE_EASE } from "./motion-presets";
import "maplibre-gl/dist/maplibre-gl.css";

type ScreenPoint = { x: number; y: number };
type ProjectedArc = { flight: GreeceFlight; path: string; midpoint: ScreenPoint };
type ProjectedAirport = {
  code: keyof typeof greeceAirports;
  point: ScreenPoint;
};

const GLASS =
  "rounded-2xl border border-white/[0.12] bg-[rgba(8,12,20,0.55)] shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl";

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 last:border-0">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="text-[13px] font-medium text-white/90">{value}</p>
    </div>
  );
}

function RouteDetailPanel({
  flight,
  flights,
  onNavigate,
  onClose,
  compact,
}: {
  flight: GreeceFlight | null;
  flights: GreeceFlight[];
  onNavigate: (id: string) => void;
  onClose: () => void;
  compact?: boolean;
}) {
  const sorted = sortFlightsByOrder(flights);
  const index = flight ? sorted.findIndex((f) => f.id === flight.id) : -1;
  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;

  if (!flight) {
    return (
      <div className={`${GLASS} flex flex-col items-center justify-center px-6 py-10 text-center ${compact ? "" : "h-full min-h-[340px]"}`}>
        <div className="mb-4 h-10 w-10 rounded-full border border-white/20" />
        <p className="text-[14px] font-medium text-white/70">Select a flight</p>
        <p className="mt-2 max-w-[200px] text-[12px] leading-relaxed text-white/40">
          Click any route on the map or timeline below.
        </p>
      </div>
    );
  }

  const from = greeceAirports[flight.from];
  const to = greeceAirports[flight.to];
  const photos = flight.photos ?? [];

  return (
    <motion.div
      key={flight.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.3, ease: GREECE_EASE }}
      className={`${GLASS} flex flex-col overflow-hidden ${compact ? "max-h-[75vh]" : "h-full"}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
        <button
          type="button"
          disabled={!prev}
          onClick={() => prev && onNavigate(prev.id)}
          className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
          aria-label="Previous flight"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">
          Flight {flight.order} of {sorted.length}
        </p>
        <button
          type="button"
          disabled={!next}
          onClick={() => next && onNavigate(next.id)}
          className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
          aria-label="Next flight"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h3 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-white">
          {flight.from}{" "}
          <span style={{ color: flight.arcColor }}>→</span>{" "}
          {flight.to}
        </h3>
        <p className="mt-1 text-[13px] text-white/50">
          {from.city} to {to.city}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] uppercase"
            style={{
              backgroundColor: `${flight.arcColor}22`,
              color: flight.arcColor,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: flight.arcColor }} />
            {flight.status}
          </span>
        </div>

        <div className="mt-5 space-y-0">
          <DetailRow label="Date" value={flight.dateDisplay} />
          <DetailRow label="Airline" value={flight.airline} />
          <DetailRow label="Flight No." value={flight.flightNumber} />
          <DetailRow label="Duration" value={flight.duration} />
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-medium tracking-[0.12em] text-white/40 uppercase">
            Photos from this flight
          </p>
          {photos.length > 0 ? (
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {photos.map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2.5 flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-1 items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.03]"
                >
                  {i === 2 ? (
                    <span className="text-lg text-white/25">+</span>
                  ) : (
                    <span className="px-1 text-center text-[8px] leading-tight tracking-wide text-white/30 uppercase">
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {compact && (
        <div className="border-t border-white/[0.08] p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-[13px] font-medium text-white/70"
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
}

function TimelineCard({
  flight,
  selected,
  onSelect,
}: {
  flight: GreeceFlight;
  selected: boolean;
  onSelect: () => void;
}) {
  const from = greeceAirports[flight.from];
  const to = greeceAirports[flight.to];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group shrink-0 rounded-2xl border p-5 text-left transition-all duration-300 sm:min-w-[260px] lg:min-w-[280px] ${
        selected ? "border-white/[0.18] bg-white/[0.08]" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
      style={{
        boxShadow: selected ? `0 0 40px ${flight.arcGlow}, inset 0 1px 0 rgba(255,255,255,0.08)` : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-black"
            style={{ backgroundColor: flight.arcColor }}
          >
            {flight.order}
          </span>
          <span className="text-[10px] font-medium tracking-[0.08em] text-white/45 uppercase">
            {flight.dateDisplay}
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 transition-transform group-hover:translate-x-0.5" aria-hidden>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      <p className="mt-4 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">
        {flight.from} → {flight.to}
      </p>
      <p className="mt-1 text-[12px] text-white/45">
        {from.city} to {to.city}
      </p>

      <div className="mt-5 flex items-center gap-2">
        <div className="text-left">
          <p className="text-[13px] font-semibold text-white/90">{formatTime12h(flight.departure)}</p>
          <p className="text-[10px] text-white/40">{flight.from}</p>
        </div>
        <div className="relative flex flex-1 flex-col items-center px-1">
          <div className="h-px w-full border-t border-dashed border-white/20" />
          <PlaneIcon className="absolute -top-[7px] text-white/50" />
          <p className="mt-2 text-[10px] font-medium text-white/45">{flight.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-semibold text-white/90">{formatTime12h(flight.arrival)}</p>
          <p className="text-[10px] text-white/40">{flight.to}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: flight.arcColor }} />
        <span className="text-[10px] font-medium text-white/40">{flight.status}</span>
      </div>
    </button>
  );
}

function projectArc(map: MaplibreMap, flight: GreeceFlight): ProjectedArc | null {
  const coords = greatCirclePath(flight.from, flight.to);
  const points: ScreenPoint[] = [];
  for (const [lng, lat] of coords) {
    const p = map.project([lng, lat]);
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
    points.push({ x: p.x, y: p.y });
  }
  if (points.length < 2) return null;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  return { flight, path, midpoint: points[Math.floor(points.length / 2)] };
}

export function GreeceCinematicHero() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [filter, setFilter] = useState<FlightFilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [arcs, setArcs] = useState<ProjectedArc[]>([]);
  const [airports, setAirports] = useState<ProjectedAirport[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredFlights = useMemo(() => filterFlights(greeceFlights, filter), [filter]);
  const selectedFlight = useMemo(
    () => greeceFlights.find((f) => f.id === selectedId) ?? null,
    [selectedId],
  );
  const hoveredFlight = useMemo(
    () => greeceFlights.find((f) => f.id === hoveredId) ?? null,
    [hoveredId],
  );
  const hoveredArc = useMemo(
    () => (hoveredFlight ? arcs.find((a) => a.flight.id === hoveredFlight.id) ?? null : null),
    [arcs, hoveredFlight],
  );
  const activeId = hoveredId ?? selectedId;
  const totalTime = useMemo(() => computeTotalJourneyTime(filteredFlights), [filteredFlights]);

  const updateOverlay = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const nextArcs: ProjectedArc[] = [];
    for (const f of filteredFlights) {
      const arc = projectArc(map, f);
      if (arc) nextArcs.push(arc);
    }
    setArcs(nextArcs);
    const codes = getVisibleAirportCodes(filteredFlights);
    setAirports(
      codes
        .map((code) => {
          const ap = greeceAirports[code];
          const p = map.project([ap.lng, ap.lat]);
          if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
          return { code, point: { x: p.x, y: p.y } };
        })
        .filter((a): a is ProjectedAirport => a !== null),
    );
  }, [filteredFlights, mapReady]);

  const updateOverlayRef = useRef(updateOverlay);
  updateOverlayRef.current = updateOverlay;

  const flyToFilter = useCallback((map: MaplibreMap, filterId: FlightFilterId) => {
    const viewport = getFilterViewport(filterId);
    const padding = {
      top: 120,
      bottom: 300,
      left: 32,
      right: typeof window !== "undefined" && window.innerWidth >= 1280 ? 320 : 32,
    };
    if (viewport.type === "bounds") {
      map.fitBounds(viewport.bounds, { padding, duration: 2000, essential: true });
    } else {
      map.flyTo({ ...viewport, duration: 2000, essential: true, padding });
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let cancelled = false;

    void import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: NIGHT_EARTH_MAP_STYLE,
        center: [-25, 46],
        zoom: 2.2,
        minZoom: 1.2,
        maxZoom: 8,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

      map.on("load", () => {
        flyToFilter(map, "all");
        setMapReady(true);
      });

      const sync = () => updateOverlayRef.current();
      map.on("move", sync);
      map.on("zoom", sync);
      map.on("resize", sync);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateOverlay();
  }, [updateOverlay, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    flyToFilter(map, filter);
    setSelectedId(null);
    setHoveredId(null);
    setDrawerOpen(false);
  }, [filter, flyToFilter, mapReady]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setDrawerOpen(true);
    }
  }, []);

  return (
    <section id="greece-hero" className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#030508]">
      {/* ── Map canvas ── */}
      <div ref={mapContainerRef} className="absolute inset-0 bottom-[260px] z-0 sm:bottom-[280px]" aria-hidden />

      {/* Light vignette — map stays visible */}
      <div
        className="pointer-events-none absolute inset-0 bottom-[260px] z-[1] sm:bottom-[280px]"
        style={{
          background: `
            linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.35) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 72%, rgba(0,0,0,0.25) 100%)
          `,
        }}
      />

      {/* ── Arc overlay ── */}
      <svg className="pointer-events-none absolute inset-0 bottom-[260px] z-[2] h-auto sm:bottom-[280px]" style={{ top: 0 }} aria-hidden>
        <defs>
          <filter id="arc-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {arcs.map(({ flight, path, midpoint }) => {
          const isActive = activeId === flight.id;
          const dimmed = activeId !== null && !isActive;
          return (
            <g key={flight.id}>
              <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={28}
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={() => setHoveredId(flight.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSelect(flight.id)}
              />
              <path
                d={path}
                fill="none"
                stroke={flight.arcGlow}
                strokeWidth={isActive ? 14 : 9}
                strokeLinecap="round"
                opacity={dimmed ? 0.08 : isActive ? 0.9 : 0.5}
                filter="url(#arc-bloom)"
              />
              <path
                d={path}
                fill="none"
                stroke={flight.arcColor}
                strokeWidth={isActive ? 3 : 2}
                strokeLinecap="round"
                opacity={dimmed ? 0.12 : isActive ? 1 : 0.8}
              />
              <circle r={isActive ? 5 : 3} fill={flight.arcColor} opacity={dimmed ? 0.1 : 0.9}>
                <animateMotion
                  dur={`${3 + (flight.order % 4)}s`}
                  repeatCount="indefinite"
                  path={path}
                />
              </circle>
              {isActive && (
                <circle cx={midpoint.x} cy={midpoint.y} r={6} fill={flight.arcColor} opacity={0.95} />
              )}
            </g>
          );
        })}

        {airports.map(({ code, point }) => {
          const ap = greeceAirports[code];
          return (
            <g key={code} transform={`translate(${point.x}, ${point.y})`}>
              <circle r={18} fill="rgba(255,255,255,0.2)" opacity={0.35} className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle r={6} fill="white" style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.9))" }} />
              <foreignObject x={-60} y={12} width={120} height={44}>
                <div className="text-center">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {code}
                  </p>
                  <p className="text-[9px] text-white/70 drop-shadow-[0_1px_6px_rgba(0,0,0,1)]">
                    {ap.city}, {ap.region}
                  </p>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredFlight && hoveredArc && !drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-[calc(100%+16px)] ${GLASS} px-4 py-3`}
            style={{ left: hoveredArc.midpoint.x, top: hoveredArc.midpoint.y }}
          >
            <p className="text-[12px] font-bold" style={{ color: hoveredFlight.arcColor }}>
              {flightRouteLabel(hoveredFlight)}
            </p>
            <p className="mt-1 text-[11px] text-white/50">{hoveredFlight.dateDisplay}</p>
            <p className="text-[11px] text-white/70">
              {hoveredFlight.airline} · {hoveredFlight.flightNumber}
            </p>
            <p className="text-[11px] text-white/50">
              {hoveredFlight.departure} → {hoveredFlight.arrival}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Title (top-left) ── */}
      <div className="pointer-events-none absolute top-[4.5rem] left-4 z-30 max-w-md sm:left-6 lg:left-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: GREECE_EASE }}
          className="pointer-events-auto"
        >
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/50 uppercase">
            {greeceCinematicHero.eyebrow}
          </p>
          <h1
            className="mt-2 text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {greeceCinematicHero.title}
          </h1>
          <p className="mt-3 text-[13px] leading-[1.7] text-white/55 sm:text-[14px]">
            {greeceCinematicHero.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {greeceFlightFilters.map((f) => {
              const active = filter === f.id;
              const color =
                f.id === "all"
                  ? "#ffffff"
                  : CATEGORY_COLORS[f.id as keyof typeof CATEGORY_COLORS]?.stroke ?? "#fff";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300"
                  style={
                    active
                      ? {
                          borderColor: `${color}99`,
                          backgroundColor: `${color}22`,
                          color,
                          boxShadow: `0 0 24px ${color}44`,
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.5)",
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Route legend (bottom-left) ── */}
      <div className={`pointer-events-none absolute bottom-[290px] left-4 z-30 hidden sm:block sm:bottom-[310px] sm:left-6 ${GLASS} p-4`}>
        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
          Routes
        </p>
        <ul className="mt-3 space-y-2">
          {(Object.keys(CATEGORY_COLORS) as Array<keyof typeof CATEGORY_COLORS>).map((key) => (
            <li key={key} className="flex items-center gap-2.5">
              <span
                className="h-2 w-5 rounded-full"
                style={{
                  backgroundColor: CATEGORY_COLORS[key].stroke,
                  boxShadow: `0 0 10px ${CATEGORY_COLORS[key].glow}`,
                }}
              />
              <span className="text-[11px] text-white/60">{CATEGORY_COLORS[key].label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/[0.08] pt-3 text-[11px] font-semibold text-white/70">
          Total Flights: {TOTAL_FLIGHTS}
        </p>
      </div>

      {/* ── Detail panel (right) ── */}
      <div className="pointer-events-none absolute top-[4.5rem] right-4 z-30 hidden w-[300px] xl:block" style={{ bottom: "300px" }}>
        <div className="pointer-events-auto h-full">
          <AnimatePresence mode="wait">
            <RouteDetailPanel
              key={selectedFlight?.id ?? "empty"}
              flight={selectedFlight}
              flights={filteredFlights}
              onNavigate={handleSelect}
              onClose={() => setSelectedId(null)}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ── Timeline dock ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/[0.08] bg-[rgba(4,6,10,0.88)] backdrop-blur-2xl">
        <div className="px-4 pt-4 pb-3 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">
              Flight Timeline
            </p>
            <p className="hidden text-[11px] text-white/35 sm:block">
              Click any flight to view details and photos
            </p>
          </div>
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2 sm:gap-4">
            {sortFlightsByOrder(filteredFlights).map((flight) => (
              <TimelineCard
                key={flight.id}
                flight={flight}
                selected={selectedId === flight.id}
                onSelect={() => handleSelect(flight.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-white/35">
            Total Journey Time: ~{totalTime} of flight time across {filteredFlights.length} flights
          </p>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {drawerOpen && selectedFlight && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: GREECE_EASE }}
              className="fixed inset-x-0 bottom-0 z-50 p-4 xl:hidden"
            >
              <RouteDetailPanel
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
