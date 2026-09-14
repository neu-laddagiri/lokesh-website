"use client";

import {
  NIGHT_EARTH_MAP_STYLE,
  categoryLabel,
  flightRouteLabel,
  formatTime12h,
  getFilterViewport,
  getVisibleAirportCodes,
  greeceAirports,
  greatCirclePath,
  type AirportCode,
  type FlightFilterId,
  type GreeceFlight,
} from "@/lib/greece-flights";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Map as MaplibreMap } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

type ScreenPoint = { x: number; y: number };
type ProjectedArc = {
  flight: GreeceFlight;
  path: string;
  midpoint: ScreenPoint;
  angle: number;
};
type ProjectedAirport = {
  code: keyof typeof greeceAirports;
  point: ScreenPoint;
};
type ProjectionMode = "globe" | "mercator";
type MapStatus = "loading" | "ready" | "error";

const GLASS =
  "rounded-2xl border border-white/[0.12] bg-[rgba(8,12,20,0.72)] shadow-[0_12px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl";

/** Hubs get their label first; anything that would overlap keeps only its dot. */
const LABEL_PRIORITY: readonly AirportCode[] = ["BOS", "ATH", "FCO", "DUB", "CHQ", "JTR"];

type PlacedLabel = {
  dx: number;
  dy: number;
  anchor: "start" | "end";
  showCity: boolean;
};

function placeAirportLabels(
  airports: readonly ProjectedAirport[],
  width: number,
  height: number,
): Array<ProjectedAirport & { label: PlacedLabel | null }> {
  const showCity = airports.length <= 4;
  const boxWidth = showCity ? 104 : 42;
  const boxHeight = 16;
  const taken: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  const overlaps = (x1: number, y1: number) =>
    taken.some(
      (box) =>
        x1 < box.x2 + 4 &&
        x1 + boxWidth > box.x1 - 4 &&
        y1 < box.y2 + 3 &&
        y1 + boxHeight > box.y1 - 3,
    );

  const byPriority = [...airports].sort(
    (a, b) => LABEL_PRIORITY.indexOf(a.code) - LABEL_PRIORITY.indexOf(b.code),
  );

  const placements = new Map<AirportCode, PlacedLabel | null>();
  for (const airport of byPriority) {
    const { x, y } = airport.point;
    // Try right then left, above then below, and take the first clear slot.
    const candidates: PlacedLabel[] = [
      { dx: 12, dy: -9, anchor: "start", showCity },
      { dx: -12, dy: -9, anchor: "end", showCity },
      { dx: 12, dy: 19, anchor: "start", showCity },
      { dx: -12, dy: 19, anchor: "end", showCity },
    ];
    let placed: PlacedLabel | null = null;
    for (const candidate of candidates) {
      const left =
        candidate.anchor === "start" ? x + candidate.dx : x + candidate.dx - boxWidth;
      const top = y + candidate.dy - boxHeight + 4;
      if (left < 6 || left + boxWidth > width - 6) continue;
      if (top < 6 || top + boxHeight > height - 24) continue;
      if (overlaps(left, top)) continue;
      taken.push({ x1: left, y1: top, x2: left + boxWidth, y2: top + boxHeight });
      placed = candidate;
      break;
    }
    placements.set(airport.code, placed);
  }

  return airports.map((airport) => ({
    ...airport,
    label: placements.get(airport.code) ?? null,
  }));
}

function projectArc(
  map: MaplibreMap,
  flight: GreeceFlight,
  visibleFlights: GreeceFlight[],
): ProjectedArc | null {
  const points: ScreenPoint[] = [];
  for (const [lng, lat] of greatCirclePath(flight.from, flight.to)) {
    const point = map.project([lng, lat]);
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
    points.push({ x: point.x, y: point.y });
  }
  if (points.length < 2) return null;

  const parallelRoutes = visibleFlights.filter(
    (item) =>
      (item.from === flight.from && item.to === flight.to) ||
      (item.from === flight.to && item.to === flight.from),
  ).length;
  const first = points[0];
  const last = points[points.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  const curveAmount = parallelRoutes > 1 ? 18 : 8;
  const curved = points.map((point, index) => {
    const progress = index / (points.length - 1);
    const offset = Math.sin(Math.PI * progress) * curveAmount;
    return {
      x: point.x + normal.x * offset,
      y: point.y + normal.y * offset,
    };
  });

  const middleIndex = Math.floor(curved.length / 2);
  const before = curved[Math.max(0, middleIndex - 1)];
  const after = curved[Math.min(curved.length - 1, middleIndex + 1)];
  const angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
  const path = curved
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  return { flight, path, midpoint: curved[middleIndex], angle };
}

export type MapInsets = { top?: number; bottom?: number; left?: number; right?: number };

function fitMapToFilter(
  map: MaplibreMap,
  filter: FlightFilterId,
  reduceMotion: boolean,
  insets: MapInsets = {},
) {
  const viewport = getFilterViewport(filter);
  const rect = map.getContainer().getBoundingClientRect();
  const horizontal = Math.max(26, Math.min(56, rect.width * 0.1));
  const vertical = Math.max(30, Math.min(64, rect.height * 0.12));
  const padding = {
    top: Math.min(insets.top ?? vertical, rect.height * 0.42),
    bottom: Math.min(insets.bottom ?? vertical, rect.height * 0.42),
    left: Math.min(insets.left ?? horizontal, rect.width * 0.4),
    right: Math.min(insets.right ?? horizontal, rect.width * 0.4),
  };
  const duration = reduceMotion ? 0 : 1100;

  if (viewport.type === "bounds") {
    map.fitBounds(viewport.bounds, {
      padding,
      duration,
      essential: false,
      maxZoom: filter === "all" || filter === "main" ? 4.8 : 6.3,
    });
  } else {
    map.flyTo({
      ...viewport,
      padding,
      duration,
      essential: false,
    });
  }
}

export function FlightMap({
  flights,
  filter,
  selectedFlight,
  previewFlight,
  activeId,
  onSelect,
  onPreviewStart,
  onPreviewEnd,
  insets,
}: {
  flights: GreeceFlight[];
  filter: FlightFilterId;
  selectedFlight: GreeceFlight | null;
  previewFlight: GreeceFlight | null;
  activeId: string | null;
  onSelect: (id: string) => void;
  onPreviewStart: (id: string) => void;
  onPreviewEnd: (id: string) => void;
  /** Screen-space room to leave for overlaid UI. */
  insets?: MapInsets;
}) {
  const reduceMotion = useReducedMotion();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const frameRef = useRef<number | null>(null);
  const updateOverlayRef = useRef<() => void>(() => undefined);
  const [mapReady, setMapReady] = useState(false);
  const [mapStatus, setMapStatus] = useState<MapStatus>("loading");
  const projection: ProjectionMode = "globe";
  const [overlay, setOverlay] = useState<{
    arcs: ProjectedArc[];
    airports: ProjectedAirport[];
    width: number;
    height: number;
  }>({ arcs: [], airports: [], width: 0, height: 0 });

  const updateOverlay = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const arcs = flights
      .map((flight) => projectArc(map, flight, flights))
      .filter((arc): arc is ProjectedArc => arc !== null);
    const airports = getVisibleAirportCodes(flights)
      .map((code) => {
        const airport = greeceAirports[code];
        const point = map.project([airport.lng, airport.lat]);
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
        return { code, point: { x: point.x, y: point.y } };
      })
      .filter((airport): airport is ProjectedAirport => airport !== null);
    const container = map.getContainer();

    setOverlay({
      arcs,
      airports,
      width: container.clientWidth,
      height: container.clientHeight,
    });
  }, [flights, mapReady]);

  useEffect(() => {
    updateOverlayRef.current = updateOverlay;
  }, [updateOverlay]);

  const scheduleOverlay = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateOverlayRef.current();
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let cancelled = false;
    let map: MaplibreMap | null = null;
    let didLoad = false;
    const loadingTimer = window.setTimeout(() => {
      if (!didLoad) setMapStatus("error");
    }, 20000);

    void import("maplibre-gl")
      .then((maplibregl) => {
        if (cancelled || !mapContainerRef.current) return;

        map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: NIGHT_EARTH_MAP_STYLE,
          center: [-24, 44],
          zoom: 2.15,
          minZoom: 1.2,
          maxZoom: 8,
          attributionControl: false,
          cooperativeGestures: true,
          renderWorldCopies: false,
        });
        map
          .getCanvas()
          .setAttribute(
            "aria-label",
            "Flight map basemap. Use the arrow keys to pan and the map controls to zoom.",
          );
        mapRef.current = map;
        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

        map.on("load", () => {
          if (!map) return;
          didLoad = true;
          window.clearTimeout(loadingTimer);
          setMapReady(true);
          setMapStatus("ready");
        });
        map.on("error", () => {
          if (!didLoad) setMapStatus("error");
        });
        map.on("move", scheduleOverlay);
        map.on("resize", scheduleOverlay);
        map.on("idle", scheduleOverlay);
      })
      .catch(() => {
        window.clearTimeout(loadingTimer);
        setMapStatus("error");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(loadingTimer);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      map?.remove();
      mapRef.current = null;
    };
  }, [scheduleOverlay]);

  useEffect(() => {
    if (mapReady) scheduleOverlay();
  }, [mapReady, scheduleOverlay, flights]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.setProjection({ type: projection });
    fitMapToFilter(map, filter, Boolean(reduceMotion), insets);
    scheduleOverlay();
  }, [filter, insets, mapReady, projection, reduceMotion, scheduleOverlay]);

  const displayedArcs = overlay.arcs;
  const previewArc = useMemo(
    () =>
      previewFlight
        ? overlay.arcs.find((arc) => arc.flight.id === previewFlight.id) ?? null
        : null,
    [overlay.arcs, previewFlight],
  );
  const tooltipPosition = useMemo(() => {
    if (!previewArc) return null;
    const minX = Math.min(140, overlay.width / 2);
    const maxX = Math.max(minX, overlay.width - 140);
    return {
      x: Math.max(minX, Math.min(maxX, previewArc.midpoint.x)),
      y: Math.max(112, Math.min(Math.max(112, overlay.height - 24), previewArc.midpoint.y)),
    };
  }, [overlay.height, overlay.width, previewArc]);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#02040a]"
      role="region"
      aria-label={`Interactive map of ${flights.length} ${flights.length === 1 ? "flight" : "flights"}${filter === "all" ? " across Boston, Dublin, Greece, and Rome" : ` for ${categoryLabel(filter)}`}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 48% 46%, rgba(31,74,137,0.2), transparent 42%), radial-gradient(circle at 70% 70%, rgba(29,78,216,0.12), transparent 36%), #02040a",
        }}
      />
      <div className="absolute inset-0">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.52) 0%, transparent 30%, transparent 74%, rgba(0,0,0,.36) 100%), linear-gradient(180deg, rgba(0,0,0,.36) 0%, transparent 26%, transparent 70%, rgba(0,0,0,.34) 100%)",
        }}
      />

      <svg
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
        role="group"
        aria-label="Selectable flight routes"
      >
        {displayedArcs.map(({ flight, path, midpoint, angle }) => {
          const active = activeId === flight.id;
          const selected = selectedFlight?.id === flight.id;
          const dimmed = activeId !== null && !active;
          const routeLabel = `${flightRouteLabel(flight)}, ${flight.airline} ${flight.flightNumber}, ${flight.dateDisplay}, ${formatTime12h(flight.departure)} to ${formatTime12h(flight.arrival)}${flight.arrivalDayOffset ? ", arriving the next day" : ""}`;

          return (
            <g key={flight.id}>
              <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                strokeLinecap="round"
                className="pointer-events-auto cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                focusable="true"
                aria-label={routeLabel}
                aria-pressed={selected}
                onPointerEnter={() => onPreviewStart(flight.id)}
                onPointerLeave={() => onPreviewEnd(flight.id)}
                onFocus={() => onPreviewStart(flight.id)}
                onBlur={() => onPreviewEnd(flight.id)}
                onClick={() => onSelect(flight.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(flight.id);
                  }
                }}
              />
              <path
                d={path}
                fill="none"
                stroke={flight.arcGlow}
                strokeWidth={active ? 9 : 6}
                strokeLinecap="round"
                opacity={dimmed ? 0.1 : active ? 0.5 : 0.22}
                pointerEvents="none"
                aria-hidden
              />
              <path
                d={path}
                fill="none"
                stroke={flight.arcColor}
                strokeWidth={active ? 2.8 : 1.6}
                strokeLinecap="round"
                opacity={dimmed ? 0.26 : active ? 1 : 0.78}
                pointerEvents="none"
                aria-hidden
              />

              <g
                transform={`translate(${midpoint.x} ${midpoint.y}) rotate(${angle})`}
                fill={flight.arcColor}
                opacity={dimmed ? 0.25 : active ? 1 : 0.65}
                pointerEvents="none"
                aria-hidden
              >
                <path d="M-4.5-2 4.5 0-4.5 2-2 0Z" />
              </g>
            </g>
          );
        })}

        {placeAirportLabels(overlay.airports, overlay.width, overlay.height).map(
          ({ code, point, label }) => {
            const airport = greeceAirports[code];
            return (
              <g
                key={code}
                transform={`translate(${point.x}, ${point.y})`}
                pointerEvents="none"
                aria-hidden
              >
                <circle r={4.5} fill="#ffffff" />
                <circle
                  r={8.5}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={1}
                />
                {label && (
                  <text
                    x={label.dx}
                    y={label.dy}
                    textAnchor={label.anchor}
                    className="text-[11px] font-semibold"
                    fill="#ffffff"
                    stroke="rgba(2,6,14,0.9)"
                    strokeWidth={3.5}
                    strokeLinejoin="round"
                    style={{ letterSpacing: "0.06em", paintOrder: "stroke" }}
                  >
                    {code}
                    {label.showCity ? (
                      <tspan
                        dx={6}
                        className="text-[10px] font-normal"
                        fill="rgba(255,255,255,0.6)"
                      >
                        {airport.city}
                      </tspan>
                    ) : null}
                  </text>
                )}
              </g>
            );
          },
        )}
      </svg>

      <AnimatePresence>
        {previewFlight && previewArc && tooltipPosition && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className={`pointer-events-none absolute z-30 w-[min(260px,calc(100%-24px))] -translate-x-1/2 -translate-y-[calc(100%+16px)] ${GLASS} px-4 py-3`}
            style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-bold" style={{ color: previewFlight.arcColor }}>
                {flightRouteLabel(previewFlight)}
              </p>
              <span className="text-[10px] text-white/42">{previewFlight.duration}</span>
            </div>
            <p className="mt-1 text-[11px] text-white/55">{previewFlight.dateDisplay}</p>
            <p className="mt-1 text-[11px] text-white/78">
              {previewFlight.airline} · {previewFlight.flightNumber}
            </p>
            <p className="mt-0.5 text-[11px] text-white/55">
              {formatTime12h(previewFlight.departure)} → {formatTime12h(previewFlight.arrival)}
              {previewFlight.arrivalDayOffset ? " · +1 day" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {mapStatus !== "ready" && (
        <div
          className={`pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full px-3 py-1.5 ${GLASS}`}
          role="status"
          aria-live="polite"
        >
          {mapStatus === "loading" ? (
            <>
              <span
                className={`block h-3 w-3 shrink-0 rounded-full border-2 border-white/20 border-t-white/70 ${
                  reduceMotion ? "" : "animate-spin"
                }`}
              />
              <span className="text-[11px] font-medium text-white/60">
                Loading the basemap
              </span>
            </>
          ) : (
            <span className="text-[11px] font-medium text-white/55">
              Basemap unavailable. The route is listed below.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
