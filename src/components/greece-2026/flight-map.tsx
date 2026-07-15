"use client";

import {
  CATEGORY_COLORS,
  NIGHT_EARTH_MAP_STYLE,
  categoryLabel,
  flightRouteLabel,
  formatTime12h,
  getFilterViewport,
  getVisibleAirportCodes,
  greeceAirports,
  greatCirclePath,
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

const AIRPORT_LABEL_OFFSETS: Partial<
  Record<keyof typeof greeceAirports, { x: number; y: number }>
> = {
  ATH: { x: -64, y: -47 },
  JTR: { x: 3, y: 7 },
  CHQ: { x: -131, y: 7 },
  FCO: { x: -126, y: -33 },
};

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

function fitMapToFilter(
  map: MaplibreMap,
  filter: FlightFilterId,
  reduceMotion: boolean,
) {
  const viewport = getFilterViewport(filter);
  const rect = map.getContainer().getBoundingClientRect();
  const desktop = rect.width >= 1180;
  const horizontal = Math.max(20, Math.min(44, rect.width * 0.08));
  const vertical = Math.max(24, Math.min(58, rect.height * 0.1));
  const padding = {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: desktop ? Math.min(370, rect.width * 0.31) : horizontal,
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

function ControlIcon({ type }: { type: "plus" | "minus" | "reset" | "globe" | "map" }) {
  if (type === "plus" || type === "minus") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M5 12h14" />
        {type === "plus" && <path d="M12 5v14" />}
      </svg>
    );
  }

  if (type === "reset") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    );
  }

  if (type === "map") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    );
  }

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9" />
    </svg>
  );
}

function MapControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
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
}: {
  flights: GreeceFlight[];
  filter: FlightFilterId;
  selectedFlight: GreeceFlight | null;
  previewFlight: GreeceFlight | null;
  activeId: string | null;
  onSelect: (id: string) => void;
  onPreviewStart: (id: string) => void;
  onPreviewEnd: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const frameRef = useRef<number | null>(null);
  const updateOverlayRef = useRef<() => void>(() => undefined);
  const [mapReady, setMapReady] = useState(false);
  const [mapStatus, setMapStatus] = useState<MapStatus>("loading");
  const [projection, setProjection] = useState<ProjectionMode>("globe");
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
    }, 9000);

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
    fitMapToFilter(map, filter, Boolean(reduceMotion));
    scheduleOverlay();
  }, [filter, mapReady, projection, reduceMotion, scheduleOverlay]);

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
    const rightReserve = overlay.width >= 1180 ? Math.min(370, overlay.width * 0.31) : 16;
    const minX = Math.min(140, overlay.width / 2);
    const maxX = Math.max(minX, overlay.width - rightReserve - 140);
    return {
      x: Math.max(minX, Math.min(maxX, previewArc.midpoint.x)),
      y: Math.max(112, Math.min(Math.max(112, overlay.height - 24), previewArc.midpoint.y)),
    };
  }, [overlay.height, overlay.width, previewArc]);
  const controlsDisabled = mapStatus !== "ready";

  const zoom = (direction: 1 | -1) => {
    const map = mapRef.current;
    if (!map) return;
    const options = { duration: reduceMotion ? 0 : 320 };
    if (direction === 1) map.zoomIn(options);
    else map.zoomOut(options);
  };

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
        <defs aria-hidden>
          <filter id="greece-flight-arc-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
                strokeWidth={active ? 13 : 8}
                strokeLinecap="round"
                opacity={dimmed ? 0.16 : active ? 0.86 : 0.42}
                filter="url(#greece-flight-arc-bloom)"
                pointerEvents="none"
                aria-hidden
              />
              <path
                d={path}
                fill="none"
                stroke={flight.arcColor}
                strokeWidth={active ? 3.4 : 2}
                strokeLinecap="round"
                opacity={dimmed ? 0.26 : active ? 1 : 0.78}
                pointerEvents="none"
                aria-hidden
              />

              {active && !reduceMotion ? (
                <g fill={flight.arcColor} pointerEvents="none" aria-hidden>
                  <path d="M-8-3 8 0-8 3-4 0Z" />
                  <animateMotion dur="4s" repeatCount="indefinite" path={path} rotate="auto" />
                </g>
              ) : (
                <g
                  transform={`translate(${midpoint.x} ${midpoint.y}) rotate(${angle})`}
                  fill={flight.arcColor}
                  opacity={dimmed ? 0.28 : active ? 1 : 0.7}
                  pointerEvents="none"
                  aria-hidden
                >
                  <path d="M-5-2 5 0-5 2-2.5 0Z" />
                </g>
              )}
            </g>
          );
        })}

        {overlay.airports.map(({ code, point }) => {
          const airport = greeceAirports[code];
          const labelOffset = AIRPORT_LABEL_OFFSETS[code] ?? { x: -64, y: 11 };
          return (
            <g key={code} transform={`translate(${point.x}, ${point.y})`} pointerEvents="none" aria-hidden>
              <circle
                r={17}
                fill="rgba(255,255,255,0.2)"
                opacity={0.28}
                className={reduceMotion ? undefined : "animate-ping"}
                style={{ animationDuration: "3.4s" }}
              />
              <circle r={5.5} fill="white" style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,.9))" }} />
              <foreignObject x={labelOffset.x} y={labelOffset.y} width={128} height={46}>
                <div className="text-center">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {code}
                  </p>
                  <p className="hidden text-[9px] text-white/72 drop-shadow-[0_1px_6px_rgba(0,0,0,1)] lg:block">
                    {airport.city}, {airport.region}
                  </p>
                </div>
              </foreignObject>
            </g>
          );
        })}
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

      <div className={`absolute top-3 right-3 z-20 flex items-center gap-1 min-[1180px]:top-[88px] min-[1180px]:right-[356px] ${GLASS} p-1`}>
        <MapControlButton
          label="Zoom out"
          onClick={() => zoom(-1)}
          disabled={controlsDisabled}
        >
          <ControlIcon type="minus" />
        </MapControlButton>
        <MapControlButton
          label="Zoom in"
          onClick={() => zoom(1)}
          disabled={controlsDisabled}
        >
          <ControlIcon type="plus" />
        </MapControlButton>
        <MapControlButton
          label="Reset map view"
          onClick={() => {
            const map = mapRef.current;
            if (map) fitMapToFilter(map, filter, Boolean(reduceMotion));
          }}
          disabled={controlsDisabled}
        >
          <ControlIcon type="reset" />
        </MapControlButton>
        <span className="mx-0.5 h-6 w-px bg-white/[0.1]" aria-hidden />
        <MapControlButton
          label={projection === "globe" ? "Switch to flat map" : "Switch to globe"}
          onClick={() => setProjection((current) => (current === "globe" ? "mercator" : "globe"))}
          disabled={controlsDisabled}
        >
          <ControlIcon type={projection === "globe" ? "globe" : "map"} />
          <span className="hidden sm:inline">{projection === "globe" ? "Globe" : "Map"}</span>
        </MapControlButton>
      </div>

      <div className={`pointer-events-none absolute bottom-9 left-4 z-20 hidden sm:block min-[1180px]:bottom-5 min-[1180px]:left-[420px] ${GLASS} px-3.5 py-3`}>
        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">Routes</p>
        <ul className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 min-[1180px]:grid-cols-1">
          {(Object.keys(CATEGORY_COLORS) as Array<keyof typeof CATEGORY_COLORS>).map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span
                className="h-1.5 w-5 rounded-full"
                style={{
                  backgroundColor: CATEGORY_COLORS[key].stroke,
                  boxShadow: `0 0 10px ${CATEGORY_COLORS[key].glow}`,
                }}
              />
              <span className="text-[11px] text-white/58">{categoryLabel(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      {mapStatus !== "ready" && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#02040a]/45 px-6 text-center backdrop-blur-[2px]">
          <div className={`${GLASS} max-w-xs px-5 py-4`} role="status" aria-live="polite">
            {mapStatus === "loading" ? (
              <>
                <span
                  className={`mx-auto block h-5 w-5 rounded-full border-2 border-white/20 border-t-white/80 ${
                    reduceMotion ? "" : "animate-spin"
                  }`}
                />
                <p className="mt-3 text-[12px] font-medium text-white/70">Plotting the flight path…</p>
              </>
            ) : (
              <>
                <p className="text-[12px] font-medium text-white/75">The live map could not load.</p>
                <p className="mt-1 text-[11px] leading-4 text-white/45">
                  Every flight remains available in the itinerary below.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
