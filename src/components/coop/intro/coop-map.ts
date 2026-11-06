import type { Map as MaplibreMap, PaddingOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { COOP_MAP } from "@/lib/coop";
import { greatCirclePoint } from "@/lib/geo";
import {
  NIGHT_LIGHTS_ATTRIBUTION,
  NIGHT_LIGHTS_TILES,
  OPENFREEMAP_DARK_STYLE,
} from "@/lib/map-tiles";
import { easeInOutCubic, easeInOutSine, lerp, progress, type Timing, type Variant } from "./timing";

export type Camera = {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  padding?: PaddingOptions;
};

export const ORIGIN = COOP_MAP.origin;
export const OFFICE = COOP_MAP.office;

/** Degrees of latitude the camera rides south of the route by the time it reaches Boston. */
const SAG = 9;

/** The spec: no WebGL, or tiles not in within 4 s, means the drawn fallback instead. */
const LOAD_BUDGET_MS = 4000;

/**
 * "software" is WebGL drawn on the CPU (SwiftShader, llvmpipe, Microsoft Basic
 * Render): it works, but the globe can stall the page for seconds, so it gets
 * the drawn fallback like no WebGL at all.
 */
export function webglSupport(): "hardware" | "software" | "none" {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) ? "software" : "hardware";
  } catch {
    return "none";
  }
}

export function zooms(variant: Variant) {
  return variant === "phone"
    ? { near: 3.7, far: 2.25, city: 15.3, panel: 15.15 }
    : { near: 4.15, far: 2.85, city: 15.9, panel: 15.4 };
}

/**
 * The camera for time t: close over Athens and tilted for the planted flag,
 * pulled back as the stripes take off, along the great circle (riding south
 * of it so it reads as an arc), down into Lafayette City Center, and a slow
 * orbit around the pin. The handoff to the card's map panel is layered on top
 * by the intro, which owns the padding.
 */
export function cameraAt(t: number, T: Timing, variant: Variant): Camera {
  const { near, far, city } = zooms(variant);
  if (t < T.flight[0]) {
    const back = easeInOutCubic(progress(t, T.zoomOut));
    return { center: [ORIGIN[0], ORIGIN[1]], zoom: lerp(near, far, back), pitch: 34 * (1 - back), bearing: 0 };
  }
  if (t < T.zoom[0]) {
    const back = easeInOutCubic(progress(t, T.zoomOut));
    const f = easeInOutCubic(progress(t, T.flight));
    const [lng, lat] = greatCirclePoint(ORIGIN, OFFICE, f);
    return {
      center: [lng, lat - SAG * Math.sin((Math.PI / 2) * f)],
      zoom: lerp(near, far, back) - 0.75 * Math.sin(Math.PI * f),
      pitch: 34 * (1 - back),
      bearing: 0,
    };
  }
  const dive = easeInOutCubic(progress(t, T.zoom));
  const orbit = easeInOutSine(progress(t, T.orbit));
  const zoom = lerp(far, city, dive) + 0.25 * orbit;
  // The leftover southward offset shrinks with the zoom, so the office slides into the
  // center at a steady pace on screen while the camera dives.
  const offset = SAG * (1 - dive) * 2 ** (far - zoom);
  return {
    center: [OFFICE[0], OFFICE[1] - offset],
    zoom,
    pitch: 52 * dive + 6 * orbit,
    bearing: -20 * dive + T.orbitDegrees * orbit,
  };
}

/** A route point: 0 is Athens, 1 is the office. */
export function routeLngLat(s: number): [number, number] {
  return greatCirclePoint(ORIGIN, OFFICE, Math.min(1, Math.max(0, s)));
}

/**
 * Water that reads as water, 3D buildings, labels only near street level, and
 * (for the intro's globe) NASA night lights. Shared by the intro and the card's
 * map panel so the handoff between them is seamless.
 */
export function applyCoopStyle(map: MaplibreMap, { night }: { night: boolean }) {
  if (night) map.setProjection({ type: "globe" });
  const layers = map.getStyle().layers ?? [];
  const firstSymbol = layers.find((layer) => layer.type === "symbol")?.id;
  const firstLine = layers.find((layer) => layer.type === "line")?.id;

  if (map.getLayer("background")) map.setPaintProperty("background", "background-color", "#04070d");
  if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#0b1a2e");
  if (map.getLayer("waterway")) map.setPaintProperty("waterway", "line-color", "#0b1a2e");

  if (night) {
    map.addSource("coop-night", {
      type: "raster",
      tiles: [NIGHT_LIGHTS_TILES],
      tileSize: 256,
      maxzoom: 8,
      attribution: NIGHT_LIGHTS_ATTRIBUTION,
    });
    map.addLayer(
      {
        id: "coop-night",
        type: "raster",
        source: "coop-night",
        paint: { "raster-opacity": ["interpolate", ["linear"], ["zoom"], 2, 0.85, 5, 0.45, 7, 0] },
      },
      firstLine,
    );
  }

  map.addLayer(
    {
      id: "coop-buildings",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 13.5,
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "render_height"], 0],
          0,
          "#1b2435",
          50,
          "#26344d",
          150,
          "#3a527c",
        ],
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.95,
      },
    },
    firstSymbol,
  );

  // Labels stay off the globe shots and fade in near street level, where street names help.
  const nearStreetLevel = ["interpolate", ["linear"], ["zoom"], 10, 0, 12, 0.9] as const;
  for (const layer of layers) {
    if (layer.type !== "symbol") continue;
    map.setPaintProperty(layer.id, "text-opacity", nearStreetLevel);
    map.setPaintProperty(layer.id, "icon-opacity", nearStreetLevel);
  }
}

export type IntroMap = {
  setCamera(camera: Camera): void;
  project(lngLat: readonly [number, number]): { x: number; y: number };
  destroy(): void;
};

type Options = {
  onReady: (map: IntroMap) => void;
  onFail: () => void;
  /** QA only: render the map even on software WebGL, for screenshots in headless browsers. */
  allowSoftware?: boolean;
};

/**
 * Starts MapLibre in a hidden container during scene 2. Street-level Boston is
 * loaded first because it is the hardest view to fill in late; the warm-up
 * then backs out along the route until the intro takes the camera.
 */
export function loadIntroMap(container: HTMLElement, variant: Variant, { onReady, onFail, allowSoftware }: Options) {
  let map: MaplibreMap | null = null;
  let settled = false;
  let cancelled = false;
  let driving = false;

  const fail = () => {
    if (settled || cancelled) return;
    settled = true;
    window.clearTimeout(timer);
    map?.remove();
    map = null;
    onFail();
  };
  const timer = window.setTimeout(fail, LOAD_BUDGET_MS);

  const support = webglSupport();
  if (support === "none" || (support === "software" && !allowSoftware)) {
    fail();
    return () => {
      cancelled = true;
    };
  }

  const { near, far, city } = zooms(variant);

  void import("maplibre-gl")
    .then((maplibregl) => {
      if (cancelled || settled) return;
      const instance = new maplibregl.Map({
        container,
        style: OPENFREEMAP_DARK_STYLE,
        center: [OFFICE[0], OFFICE[1]],
        zoom: city,
        pitch: 52,
        bearing: -20,
        maxPitch: 70,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0,
      });
      map = instance;
      instance.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-left");
      instance.getCanvas().setAttribute("aria-hidden", "true");
      instance.on("style.load", () => applyCoopStyle(instance, { night: true }));

      const handle: IntroMap = {
        setCamera(camera) {
          driving = true;
          instance.jumpTo(camera);
        },
        project(lngLat) {
          const point = instance.project([lngLat[0], lngLat[1]]);
          return { x: point.x, y: point.y };
        },
        destroy() {
          instance.remove();
        },
      };

      instance.once("idle", () => {
        if (settled || cancelled) return;
        settled = true;
        window.clearTimeout(timer);
        onReady(handle);

        // Back out along the route so the dive and the flight find their tiles cached.
        const [midLng, midLat] = greatCirclePoint(ORIGIN, OFFICE, 0.5);
        const warmups: Camera[] = [
          { center: [OFFICE[0], OFFICE[1]], zoom: 12, pitch: 30, bearing: -10 },
          { center: [OFFICE[0], OFFICE[1]], zoom: 8, pitch: 0, bearing: 0 },
          { center: [OFFICE[0], OFFICE[1] - SAG], zoom: far, pitch: 0, bearing: 0 },
          { center: [midLng, midLat - SAG * Math.SQRT1_2], zoom: far - 0.75, pitch: 0, bearing: 0 },
          { center: [ORIGIN[0], ORIGIN[1]], zoom: near, pitch: 34, bearing: 0 },
        ];
        const next = () => {
          const view = warmups.shift();
          if (!view || driving || cancelled) return;
          instance.jumpTo(view);
          instance.once("idle", next);
        };
        next();
      });
    })
    .catch(fail);

  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    map?.remove();
    map = null;
  };
}
