"use client";

import type { Map as MaplibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { COOP_MAP } from "@/lib/coop";
import { OPENFREEMAP_DARK_STYLE } from "@/lib/map-tiles";
import { OFFICE, applyCoopStyle, webglSupport, zooms, type Camera } from "./intro/coop-map";
import { BostonCity } from "./intro/map-fallback";

/**
 * The live map beside the card: Lafayette City Center in 3D, slowly turning
 * until someone drags it. After the intro it picks up the intro's camera, so
 * the full-screen map appears to shrink straight into it.
 */

const PIN_SVG = `<svg width="26" height="36" viewBox="0 0 30 42" aria-hidden="true"><path d="M15 41C15 41 28 25.6 28 15A13 13 0 0 0 2 15C2 25.6 15 41 15 41Z" fill="#2997ff" stroke="#fff" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#fff"/></svg>`;
const ORBIT_DEG_PER_S = 3.2;
const VIEW = { pitch: 50, bearing: -20 } as const;

type Props = {
  paused: boolean;
  /** The intro's camera at the handoff; absent when the card opens on its own. */
  handoff: Camera | null;
  /** Hide the map until the intro has finished shrinking onto this panel. */
  reveal: boolean;
  onReady: () => void;
  className?: string;
};

export function MapPanel({ paused, handoff, reveal, onReady, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const pausedRef = useRef(paused);
  /** The map stays still under the intro's map until the intro lets go of this panel. */
  const revealRef = useRef(reveal);
  const [mode, setMode] = useState<"loading" | "map" | "fallback">("loading");
  const [moved, setMoved] = useState(false);
  const movedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const handoffRef = useRef(handoff);
  const homeZoomRef = useRef(zooms("desktop").panel);

  useEffect(() => {
    pausedRef.current = paused;
    onReadyRef.current = onReady;
    revealRef.current = reveal;
  }, [paused, onReady, reveal]);

  // Coming from the intro the camera is flat; once revealed, tilt back up into the 3D view.
  useEffect(() => {
    const map = mapRef.current;
    if (!reveal || mode !== "map" || !map || !handoffRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    map.easeTo({ pitch: VIEW.pitch, duration: 1700 });
  }, [reveal, mode]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let raf = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fallback = () => {
      if (cancelled) return;
      setMode("fallback");
      onReadyRef.current();
    };
    if (webglSupport() !== "hardware") {
      fallback();
      return () => {
        cancelled = true;
      };
    }
    const timer = window.setTimeout(fallback, 6000);
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const start = handoffRef.current;
    homeZoomRef.current = zooms(window.innerWidth < 640 ? "phone" : "desktop").panel;

    void import("maplibre-gl")
      .then((maplibregl) => {
        if (cancelled) return;
        const map = new maplibregl.Map({
          container: host,
          style: OPENFREEMAP_DARK_STYLE,
          center: [OFFICE[0], OFFICE[1]],
          zoom: start?.zoom ?? homeZoomRef.current,
          pitch: start ? start.pitch : VIEW.pitch,
          bearing: start ? start.bearing : VIEW.bearing,
          maxPitch: 70,
          minZoom: 11.5,
          maxZoom: 18,
          attributionControl: false,
          cooperativeGestures: touch,
          dragRotate: true,
          fadeDuration: 0,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-right");
        map.getCanvas().setAttribute(
          "aria-label",
          `Map of ${COOP_MAP.officeLabel}. Drag, or use the arrow keys, to look around.`,
        );
        map.on("style.load", () => applyCoopStyle(map, { night: false }));
        const pin = document.createElement("div");
        pin.innerHTML = PIN_SVG;
        new maplibregl.Marker({ element: pin, anchor: "bottom" }).setLngLat([OFFICE[0], OFFICE[1]]).addTo(map);
        // The orbit moves the camera every frame, and any camera move cancels a gesture in
        // progress, so the orbit stops on the first touch of the map, before a drag can begin.
        const stopOrbit = () => {
          if (movedRef.current) return;
          movedRef.current = true;
          setMoved(true);
        };
        map.on("mousedown", stopOrbit);
        map.on("touchstart", stopOrbit);
        map.on("wheel", stopOrbit);
        map.getCanvas().addEventListener("keydown", stopOrbit);

        map.once("idle", () => {
          if (cancelled) return;
          window.clearTimeout(timer);
          setMode("map");
          onReadyRef.current();
          let last = performance.now();
          const spin = (now: number) => {
            raf = requestAnimationFrame(spin);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!revealRef.current || pausedRef.current || movedRef.current || reduceMotion || document.hidden || map.isEasing()) return;
            map.setBearing(map.getBearing() + ORBIT_DEG_PER_S * dt);
          };
          raf = requestAnimationFrame(spin);
        });
      })
      .catch(fallback);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    movedRef.current = false;
    setMoved(false);
    map.flyTo({ center: [OFFICE[0], OFFICE[1]], zoom: homeZoomRef.current, pitch: VIEW.pitch, bearing: VIEW.bearing, duration: 1400 });
  };

  return (
    <section
      aria-label={`Map of ${COOP_MAP.officeLabel}`}
      className={`rounded-[28px] border border-border bg-background p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div data-coop-slot="map" className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#04070d] md:aspect-square">
        {mode === "fallback" && (
          <>
            <BostonCity />
            {/* The office block sits at the drawing's center; the pin marks it like the live map's. */}
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
              dangerouslySetInnerHTML={{ __html: PIN_SVG }}
            />
          </>
        )}
        {/* MapLibre sets position: relative on its container, so it gets an inner host that fills this layer. */}
        <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: mode === "map" ? 1 : 0 }}>
          <div ref={hostRef} className="h-full w-full" />
        </div>
        {mode === "map" && reveal && moved && (
          <button
            type="button"
            onClick={recenter}
            className="absolute top-2.5 right-2.5 inline-flex h-8 items-center rounded-full border border-white/20 bg-black/55 px-3 text-[12.5px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Recenter
          </button>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3 px-2 pt-2.5 pb-1.5">
        <p className="text-[13px] leading-snug font-medium text-foreground">{COOP_MAP.officeLabel}</p>
        {mode === "map" && <p className="shrink-0 text-[12px] text-muted">Drag to look around</p>}
      </div>
    </section>
  );
}
