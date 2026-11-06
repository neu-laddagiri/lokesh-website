import type { GeoJSONSource, Map as MaplibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GREEK_FLAG, stripeColor } from "@/components/greece-2026/greek-flag";
import { COOP_MAP } from "@/lib/coop";
import { greatCircle, greatCirclePoint } from "@/lib/geo";
import {
  NIGHT_LIGHTS_ATTRIBUTION,
  NIGHT_LIGHTS_TILES,
  OPENFREEMAP_DARK_STYLE,
} from "@/lib/map-tiles";
import { easeInOutCubic, easeInOutSine, lerp, progress, type Timing, type Variant } from "./timing";

export type Camera = { center: [number, number]; zoom: number; pitch: number; bearing: number };

const ORIGIN = COOP_MAP.origin;
const OFFICE = COOP_MAP.office;
const ROUTE = greatCircle(ORIGIN, OFFICE, 180);

/** The flag's nine stripes, side by side along the route. The intro's peel squeezes to the same spacing. */
export const STRIPE_SPACING = 2.4;
export const STRIPE_WIDTH = 1.8;
const RIBBON = Array.from({ length: GREEK_FLAG.stripes }, (_, i) => ({
  id: `coop-ribbon-${i}`,
  offset: (i - (GREEK_FLAG.stripes - 1) / 2) * STRIPE_SPACING,
  color: stripeColor(i),
}));

/** The spec: no WebGL, or tiles not in within 4 s, means the SVG Boston instead. */
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

/** Degrees of latitude the camera rides south of the route by the time it reaches Boston. */
const SAG = 9;

function zooms(variant: Variant) {
  return variant === "phone" ? { far: 2.25, city: 15.3 } : { far: 2.85, city: 15.9 };
}

/**
 * The camera for time t: Athens on the globe, then along the great circle with
 * a pull-back over the Atlantic, then down to Lafayette City Center and an
 * orbit around the pin.
 */
export function cameraAt(t: number, T: Timing, variant: Variant): Camera {
  const { far, city } = zooms(variant);
  if (t < T.flight[0]) return { center: [ORIGIN[0], ORIGIN[1]], zoom: far, pitch: 0, bearing: 0 };
  if (t < T.zoom[0]) {
    const f = easeInOutCubic(progress(t, T.flight));
    const [lng, lat] = greatCirclePoint(ORIGIN, OFFICE, f);
    // Riding south of the route lets the great circle read as an arc, instead of
    // the straight line any great circle through the view center draws.
    return {
      center: [lng, lat - SAG * Math.sin((Math.PI / 2) * f)],
      zoom: far - 0.75 * Math.sin(Math.PI * f),
      pitch: 0,
      bearing: 0,
    };
  }
  const dive = easeInOutCubic(progress(t, T.zoom));
  const orbit = easeInOutSine(progress(t, T.orbit));
  const zoom = lerp(far, city, dive) + 0.3 * orbit;
  // The leftover offset shrinks with the zoom, so the office slides into the
  // center at a steady pace on screen while the camera dives.
  const offset = SAG * (1 - dive) * 2 ** (far - zoom);
  return {
    center: [OFFICE[0], OFFICE[1] - offset],
    zoom,
    pitch: 52 * dive + 8 * orbit,
    bearing: -20 * dive + T.orbitDegrees * orbit,
  };
}

/** Share of the route the ribbon covers at time t. */
export function ribbonAt(t: number, T: Timing): number {
  return easeInOutCubic(progress(t, T.flight));
}

/** Where the ribbon's leading tip is: the dot rides it. */
export function tipAt(t: number, T: Timing): [number, number] {
  return greatCirclePoint(ORIGIN, OFFICE, ribbonAt(t, T));
}

/** A point just out of Athens, to aim the peeling flag along the route. */
export const ROUTE_HEADING_POINT = greatCirclePoint(ORIGIN, OFFICE, 0.04);

function routeUpTo(fraction: number): [number, number][] {
  const f = Math.max(0.0005, Math.min(1, fraction));
  const whole = Math.floor(f * (ROUTE.length - 1));
  return [...ROUTE.slice(0, whole + 1), greatCirclePoint(ORIGIN, OFFICE, f)];
}

function line(coordinates: [number, number][]): GeoJSON.Feature<GeoJSON.LineString> {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } };
}

/** Night lights for the globe, water that reads as water, and 3D buildings for the orbit. */
function styleMap(map: MaplibreMap) {
  map.setProjection({ type: "globe" });
  const layers = map.getStyle().layers ?? [];
  const firstSymbol = layers.find((layer) => layer.type === "symbol")?.id;
  const firstLine = layers.find((layer) => layer.type === "line")?.id;

  if (map.getLayer("background")) map.setPaintProperty("background", "background-color", "#04070d");
  if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#0b1a2e");
  if (map.getLayer("waterway")) map.setPaintProperty("waterway", "line-color", "#0b1a2e");

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

  map.addSource("coop-ribbon", { type: "geojson", data: line(routeUpTo(0)) });
  map.addLayer({
    id: "coop-ribbon-glow",
    type: "line",
    source: "coop-ribbon",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#2997ff", "line-width": 28, "line-blur": 16, "line-opacity": 0.32 },
  });
  for (const stripe of RIBBON) {
    map.addLayer({
      id: stripe.id,
      type: "line",
      source: "coop-ribbon",
      layout: { "line-cap": "butt", "line-join": "round" },
      paint: { "line-color": stripe.color, "line-width": STRIPE_WIDTH, "line-offset": stripe.offset },
    });
  }
}

export type IntroMap = {
  setCamera(camera: Camera): void;
  setRibbon(fraction: number, opacity: number): void;
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

  const { far, city } = zooms(variant);

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
      instance.on("style.load", () => styleMap(instance));

      let lastFraction = -1;
      let lastOpacity = -1;
      const handle: IntroMap = {
        setCamera(camera) {
          driving = true;
          instance.jumpTo(camera);
        },
        setRibbon(fraction, opacity) {
          const source = instance.getSource<GeoJSONSource>("coop-ribbon");
          if (!source) return;
          if (Math.abs(fraction - lastFraction) > 0.0004) {
            source.setData(line(routeUpTo(fraction)));
            lastFraction = fraction;
          }
          if (Math.abs(opacity - lastOpacity) > 0.004) {
            for (const stripe of RIBBON) instance.setPaintProperty(stripe.id, "line-opacity", opacity);
            instance.setPaintProperty("coop-ribbon-glow", "line-opacity", 0.32 * opacity);
            lastOpacity = opacity;
          }
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
          { center: [ORIGIN[0], ORIGIN[1]], zoom: far, pitch: 0, bearing: 0 },
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
