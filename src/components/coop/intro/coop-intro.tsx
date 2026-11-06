"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  CARD_STATS,
  COOP_CAPTIONS,
  COOP_MAP,
  FUNNEL,
  ORBIT_LOGOS,
  PHONE_ORBIT_LOGOS,
  SEARCH_COUNTERS,
  TIMELINE,
  type CoopLogo,
} from "@/lib/coop";
import { lockScroll } from "../scroll-lock";
import { OFFICE, ORIGIN, cameraAt, loadIntroMap, routeLngLat, zooms, type Camera, type IntroMap } from "./coop-map";
import { drawField, layoutDots, makeGlowSprite, type FieldLayout } from "./dots";
import { Journey, loadLogoImages, type LogoImages, type Point, type Rect } from "./journey";
import { ATLANTIC_ATHENS, ATLANTIC_BOSTON, MapFallback, arcPoint, atlanticToScreen } from "./map-fallback";
import {
  TIMINGS,
  clamp01,
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  lerp,
  progress,
  window01,
  type Timing,
  type Variant,
} from "./timing";

type Props = {
  /** True once the card is up; the intro then steps out of the way of the keyboard and the mouse. */
  cardOpen: boolean;
  /** The card's map panel has its map ready under the intro's. */
  panelReady: boolean;
  /** The card appears; the camera is where the intro's map will end up, for the panel to start from. */
  onLanding: (camera: Camera | null) => void;
  onLogoLanded: () => void;
  onSkip: () => void;
  onEnd: () => void;
};

const TITLE = "Fall 2026. One co-op search.";
const YES = CARD_STATS.find((stat) => stat.label === "yes");
/** The card's map panel is rounded at 20 px; the shrinking map matches it. */
const SLOT_RADIUS = 20;
/** If the panel's map never reports in, the intro still lets go. */
const MAX_WAIT_S = 1.8;
const END_FADE_S = 0.32;

type Layout = {
  vw: number;
  vh: number;
  field: FieldLayout;
  orbit: { rx: number; ry: number };
  /** The surviving dot steps left and up so the timeline below it is centered. */
  timelineX: number;
  timelineY: number;
};

function computeLayout(variant: Variant, vw: number, vh: number): Layout {
  if (variant === "phone") {
    const radius = Math.min(vw * 0.33, vh * 0.19);
    const width = Math.min(360, vw - 40);
    return {
      vw,
      vh,
      field: { cx: vw / 2, cy: vh * 0.41, radius, dotRadius: 2.5 },
      orbit: { rx: Math.min(radius * 1.55, vw / 2 - 26), ry: radius * 1.6 },
      timelineX: (vw - width) / 2 + 4,
      timelineY: vh * 0.5 - 125,
    };
  }
  const radius = Math.min(vw * 0.17, vh * 0.21);
  const width = Math.min(440, vw - 64);
  return {
    vw,
    vh,
    field: { cx: vw / 2, cy: vh * 0.43, radius, dotRadius: 3.3 },
    orbit: { rx: radius * 2.3, ry: radius * 1.4 },
    timelineX: (vw - width) / 2 + 4,
    timelineY: vh * 0.5 - 105,
  };
}

/**
 * QA only: ?intro=1&introAt=15&introHold=1 starts at 15 s and holds there, and
 * introMap=1 draws the map even on software WebGL (headless browsers).
 */
function readQa(): { start: number; hold: boolean; forceMap: boolean } {
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") !== "1") return { start: 0, hold: false, forceMap: false };
  const at = Number(params.get("introAt"));
  return {
    start: Number.isFinite(at) && at > 0 ? at : 0,
    hold: params.get("introHold") === "1",
    forceMap: params.get("introMap") === "1",
  };
}

function setText(el: HTMLElement | undefined, text: string) {
  if (el && el.textContent !== text) el.textContent = text;
}

const SIZES = {
  desktop: { logo: 48, pinW: 30, pinH: 42 },
  phone: { logo: 40, pinW: 26, pinH: 36 },
} as const;

function LogoBadge({ logo, size }: { logo: CoopLogo; size: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      data-logo
      className="absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-[30%] bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.9)] ring-1 ring-white/20 will-change-transform"
      style={{ width: failed ? "auto" : size, height: size, opacity: 0, padding: failed ? "0 12px" : 0 }}
    >
      {failed ? (
        <span className="max-w-[150px] truncate text-[11px] font-semibold tracking-[-0.01em] text-neutral-800">
          {logo.name.split(",")[0]}
        </span>
      ) : (
        <Image
          src={logo.src}
          alt=""
          width={96}
          height={96}
          sizes={`${size}px`}
          loading="eager"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

/** A screen rect for a DOM slot in the card, or null before the card has laid out. */
function slotRect(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
}

/**
 * The co-op announcement intro: the search as 132 dots that compress into one;
 * a Greek flag planted on Athens whose stripes blow off and stream across the
 * Atlantic; the stripes becoming the Verisk logo over Lafayette City Center;
 * and the map shrinking into the card's map panel while the logo flies onto
 * the card. React renders the structure once; a single loop drives every
 * frame from one clock, so Skip and pause are just changes to that clock.
 */
export function CoopIntro({ cardOpen, panelReady, onLanding, onLogoLanded, onSkip, onEnd }: Props) {
  const [variant] = useState<Variant>(() => (window.innerWidth < 640 ? "phone" : "desktop"));
  const [qa] = useState(readQa);
  const [mapMode, setMapMode] = useState<"pending" | "map" | "fallback">("pending");
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const panelReadyRef = useRef(panelReady);
  const T: Timing = TIMINGS[variant];
  const size = SIZES[variant];
  const logos = (variant === "phone" ? PHONE_ORBIT_LOGOS : ORBIT_LOGOS).slice(0, T.maxLogos);

  useEffect(() => {
    panelReadyRef.current = panelReady;
  }, [panelReady]);

  // Skip is focused first, Esc skips, and the page behind stops scrolling.
  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    return lockScroll();
  }, []);

  useEffect(() => {
    if (cardOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cardOpen, onSkip]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = root?.querySelector<HTMLCanvasElement>("[data-field]");
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const all = <E extends Element>(selector: string) => [...root.querySelectorAll<E>(selector)];
    const one = <E extends Element>(selector: string) => root.querySelector<E>(selector) ?? undefined;

    const dots = layoutDots();
    const sprite = makeGlowSprite();
    const journey = new Journey();
    let images: LogoImages | null = null;
    void loadLogoImages()
      .then((loaded) => {
        images = loaded;
      })
      .catch(() => {});

    const logoEls = all<HTMLElement>("[data-logo]");
    const counterEls = all<HTMLElement>("[data-counter]");
    const counterValues = all<HTMLElement>("[data-counter-value]");
    const title = one<HTMLElement>("[data-title]");
    const funnelDim = one<HTMLElement>("[data-funnel='dim']");
    const funnelGlow = one<HTMLElement>("[data-funnel='glow']");
    const funnelDimValue = one<HTMLElement>("[data-funnel-value='dim']");
    const funnelGlowValue = one<HTMLElement>("[data-funnel-value='glow']");
    const timeline = one<HTMLElement>("[data-timeline]");
    const timelineRows = all<HTMLElement>("[data-timeline-row]");
    const timelineLine = one<HTMLElement>("[data-timeline-line]");
    const yesLabel = one<HTMLElement>("[data-yes-label]");
    const mapEl = one<HTMLElement>("[data-map]");
    const fallbackWrap = one<HTMLElement>("[data-fallback-wrap]");
    const pin = one<HTMLElement>("[data-pin]");
    const ring = one<HTMLElement>("[data-ring]");
    const officeLabel = one<HTMLElement>("[data-office-label]");
    const caption1 = one<HTMLElement>("[data-caption='1']");
    const caption2 = one<HTMLElement>("[data-caption='2']");
    const skip = one<HTMLElement>("[data-skip]");

    let layout = computeLayout(variant, window.innerWidth, window.innerHeight);
    let dpr = 1;
    const sizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(layout.vw * dpr);
      canvas.height = Math.round(layout.vh * dpr);
      canvas.style.width = `${layout.vw}px`;
      canvas.style.height = `${layout.vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();
    const onResize = () => {
      layout = computeLayout(variant, window.innerWidth, window.innerHeight);
      sizeCanvas();
    };
    window.addEventListener("resize", onResize);

    let mode: "pending" | "map" | "fallback" = "pending";
    let map: IntroMap | null = null;
    let stopMap: (() => void) | null = null;
    const startMap = () => {
      const host = one<HTMLElement>("[data-map-host]");
      if (!host) return;
      stopMap = loadIntroMap(host, variant, {
        onReady: (handle) => {
          map = handle;
          mode = "map";
          setMapMode("map");
        },
        onFail: () => {
          mode = "fallback";
          setMapMode("fallback");
        },
        allowSoftware: qa.forceMap,
      });
    };
    /** A GPU that cannot keep up with the globe hands the scene to the drawn fallback. */
    const dropMap = () => {
      stopMap?.();
      stopMap = null;
      map = null;
      mode = "fallback";
      setMapMode("fallback");
    };

    // Fallback nodes mount after the mode switch, so they are looked up lazily.
    let fb: { atlantic?: SVGElement; boston?: SVGElement; city?: SVGElement } | null = null;
    const fallbackNodes = () => {
      if (fb?.atlantic) return fb;
      const atlantic = one<SVGElement>("[data-fb='atlantic']");
      if (!atlantic) return null;
      fb = { atlantic, boston: one<SVGElement>("[data-fb='boston']"), city: one<SVGElement>("[data-fb='city']") };
      return fb;
    };

    const { panel: panelZoom } = zooms(variant);
    const endCamera = cameraAt(T.landing, T, variant);
    const handoffCamera: Camera = {
      center: [OFFICE[0], OFFICE[1]],
      zoom: panelZoom,
      pitch: 0,
      bearing: endCamera.bearing,
    };

    let logoSignalled = false;
    let endFadeAt: number | null = null;

    const render = (t: number) => {
      const { vw, vh, field, orbit } = layout;
      const cx = vw / 2;
      const cy = vh / 2;
      const handing = easeInOutCubic(progress(t, T.handoff));
      const ending = endFadeAt === null ? 0 : clamp01((t - endFadeAt) / END_FADE_S);

      root.style.opacity = String(easeOutCubic(progress(t, T.mountIn)));
      // After the landing the intro's own background is gone: the card shows around the shrinking map.
      root.style.backgroundColor = t >= T.landing ? "transparent" : "#02040a";
      if (title) title.style.opacity = String(window01(t, T.title.in, T.title.out));

      // Logos fly in, orbit, tighten as the search narrows, then fold into the center.
      const spin = 0.11 * Math.max(0, t - T.logosIn[0]);
      const tight = lerp(1, T.tightReach, easeInOutCubic(progress(t, T.tighten)));
      const fold = easeInCubic(progress(t, T.logosOut));
      const far = Math.max(vw, vh) * 0.85;
      logoEls.forEach((el, i) => {
        const angle = (i / logoEls.length) * Math.PI * 2 - Math.PI / 2 + spin;
        const reach = tight * (1 - 0.88 * fold);
        const tx = field.cx + Math.cos(angle) * orbit.rx * reach;
        const ty = field.cy + Math.sin(angle) * orbit.ry * reach;
        const delay = (i / Math.max(1, logoEls.length - 1)) * (T.logosIn[1] - T.logosIn[0] - 1.2);
        const arrive = easeOutCubic(progress(t, [T.logosIn[0] + delay, T.logosIn[0] + delay + 1.2]));
        const x = lerp(field.cx + Math.cos(angle) * far, tx, arrive);
        const y = lerp(field.cy + Math.sin(angle) * far, ty, arrive);
        const depth = 0.84 + 0.16 * ((Math.sin(angle) + 1) / 2);
        const w = el.offsetWidth;
        el.style.transform = `translate3d(${x - w / 2}px, ${y - size.logo / 2}px, 0) scale(${depth * (1 - 0.5 * fold)})`;
        el.style.opacity = String(arrive * (1 - fold) * (0.5 + 0.42 * depth));
      });

      // ---- Where things are on screen during the map scene ----
      const nodes = mode === "fallback" ? fallbackNodes() : null;
      const dive = easeInOutCubic(progress(t, T.zoom));
      let athens: Point | null = null;
      let office: Point | null = null;
      let route: ((s: number) => Point) | null = null;
      if (mode === "map" && map) {
        const m: IntroMap = map;
        athens = m.project(ORIGIN);
        office = m.project(OFFICE);
        route = (s) => m.project(routeLngLat(s));
      } else if (nodes) {
        const a = atlanticToScreen(ATLANTIC_ATHENS.x, ATLANTIC_ATHENS.y, vw, vh, variant);
        const b = atlanticToScreen(ATLANTIC_BOSTON.x, ATLANTIC_BOSTON.y, vw, vh, variant);
        athens = { x: a.x, y: a.y };
        office = { x: lerp(b.x, cx, dive), y: lerp(b.y, cy, dive) };
        route = (s) => {
          const p = arcPoint(s);
          const q = atlanticToScreen(p.x, p.y, vw, vh, variant);
          return { x: q.x, y: q.y };
        };
      }

      // ---- The map, or its fallback, and the handoff onto the card's map panel ----
      const mapIn = easeInOutCubic(progress(t, T.mapIn));
      const leave = 1 - ending;
      if (mapEl) mapEl.style.opacity = String(mode === "map" ? mapIn * leave : 0);
      if (fallbackWrap) fallbackWrap.style.opacity = String(mode === "fallback" ? mapIn * leave : 0);
      const target = t >= T.landing ? slotRect("[data-coop-slot='map']") : null;
      let padding = { top: 0, right: 0, bottom: 0, left: 0 };
      let clipPath = "none";
      if (target && handing > 0) {
        padding = {
          top: target.y * handing,
          right: (vw - target.x - target.w) * handing,
          bottom: (vh - target.y - target.h) * handing,
          left: target.x * handing,
        };
        clipPath = `inset(${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px round ${SLOT_RADIUS * handing}px)`;
      }
      if (mapEl) mapEl.style.clipPath = clipPath;
      if (fallbackWrap) fallbackWrap.style.clipPath = clipPath;
      if (mode === "map" && map && t >= T.mapIn[0] - 0.1) {
        const camera = cameraAt(t, T, variant);
        if (handing > 0) {
          map.setCamera({
            center: [lerp(camera.center[0], OFFICE[0], handing), lerp(camera.center[1], OFFICE[1], handing)],
            zoom: lerp(camera.zoom, handoffCamera.zoom, handing),
            pitch: lerp(camera.pitch, 0, handing),
            bearing: camera.bearing,
            padding,
          });
        } else map.setCamera(camera);
      }
      if (nodes) {
        const turn = easeInOutSine(progress(t, T.orbit));
        if (nodes.atlantic) nodes.atlantic.style.opacity = String(1 - easeInOutCubic(progress(t, [T.zoom[0], T.zoom[0] + 0.5])));
        if (nodes.boston) nodes.boston.style.opacity = String(dive);
        if (nodes.city) {
          const bearing = -20 * dive + T.orbitDegrees * turn;
          nodes.city.style.transform = `rotate(${-bearing}deg) scale(${0.55 + 0.45 * dive + 0.06 * turn})`;
        }
      }

      // ---- The dots, the flag, the stripes, and the logo, on one canvas ----
      ctx.clearRect(0, 0, vw, vh);
      ctx.save();
      ctx.globalAlpha = leave;
      const story = journey.draw(
        ctx,
        {
          t,
          T,
          variant,
          athens,
          office,
          route,
          images,
          slot: t >= T.landing ? slotRect("[data-coop-slot='logo']") : null,
        },
        dpr,
      );
      ctx.restore();
      if (story.logoLanded && !logoSignalled) {
        logoSignalled = true;
        onLogoLanded();
      }

      // Where the surviving dot is: lifted beside the timeline, then over Athens.
      const lift = easeInOutCubic(progress(t, [T.collapse[0] + 0.3, T.timeline.start + 0.15]));
      const center = easeInOutCubic(progress(t, T.timeline.out));
      const home = nodes ? atlanticToScreen(ATLANTIC_ATHENS.x, ATLANTIC_ATHENS.y, vw, vh, variant) : { x: cx, y: cy };
      let yesX = lerp(lerp(field.cx, layout.timelineX, lift), home.x, center);
      let yesY = lerp(lerp(field.cy, layout.timelineY, lift), home.y, center);
      let yesFade = 0;
      if (story.dot) {
        yesX = story.dot.x;
        yesY = story.dot.y;
        yesFade = 1 - story.dotAlpha;
      }
      drawField(ctx, dots, field, t, T, sprite, { x: yesX, y: yesY, fade: yesFade });

      // The search in numbers. The first counter rolls with the dots.
      counterEls.forEach((el, i) => {
        const stat = SEARCH_COUNTERS[i];
        const start = i === 0 ? T.dots[0] : T.counters.start + (i - 1) * T.counters.stagger;
        const end = i === 0 ? T.dots[1] : start + T.counters.roll;
        el.style.opacity = String(Math.min(clamp01((t - start) / 0.35), 1 - progress(t, T.counters.out)));
        if (stat.kind === "number") {
          setText(counterValues[i], String(Math.round(stat.value * easeOutCubic(progress(t, [start, end])))));
        }
      });

      if (funnelDim && funnelGlow) {
        funnelDim.style.opacity = String(window01(t, [T.dim[0], T.dim[0] + 0.35], T.funnelOut));
        funnelGlow.style.opacity = String(window01(t, [T.glow[0], T.glow[0] + 0.35], T.funnelOut));
        setText(funnelDimValue, String(Math.round(FUNNEL.dimmed.value * easeOutCubic(progress(t, T.dim)))));
        setText(funnelGlowValue, String(Math.round(FUNNEL.glowing.value * easeOutCubic(progress(t, T.glow)))));
      }

      // The yes, and the five steps that unfold from it.
      if (timeline) {
        timeline.style.transform = `translate3d(${layout.timelineX}px, ${layout.timelineY}px, 0)`;
        timeline.style.opacity = String(1 - progress(t, T.timeline.out));
      }
      const rowsDone = T.timeline.start + T.timeline.stagger * timelineRows.length + 0.3;
      if (timelineLine) {
        timelineLine.style.transform = `scaleY(${easeOutCubic(progress(t, [T.timeline.start, rowsDone]))})`;
      }
      timelineRows.forEach((row, i) => {
        const at = T.timeline.start + 0.1 + i * T.timeline.stagger;
        row.style.opacity = String(clamp01((t - at) / 0.3));
      });
      if (yesLabel) yesLabel.style.opacity = String(window01(t, [T.collapse[1] - 0.1, T.collapse[1] + 0.25], T.timeline.out));

      // The pin drops on the office and rides it into the card's map panel.
      const pinP = progress(t, T.pin);
      const pinAt = office ?? { x: cx, y: cy };
      if (pin) {
        pin.style.opacity = String(clamp01(pinP * 3) * leave);
        pin.style.transform = `translate3d(${pinAt.x - size.pinW / 2}px, ${pinAt.y - size.pinH + lerp(-70, 0, easeOutBack(pinP))}px, 0) scale(${lerp(1, 0.86, handing)})`;
      }
      if (ring) {
        const r = progress(t, [T.pin[1] - 0.05, T.pin[1] + 0.9]);
        ring.style.opacity = String(r > 0 && r < 1 ? 0.6 * (1 - r) : 0);
        ring.style.transform = `translate3d(${pinAt.x - 20}px, ${pinAt.y - 20}px, 0) scale(${0.3 + 2.2 * r})`;
      }
      if (officeLabel) {
        officeLabel.style.opacity = String(window01(t, [T.pin[1], T.pin[1] + 0.35], [T.landing - 0.2, T.landing + 0.2]));
        officeLabel.style.transform = `translate3d(-50%, 0, 0) translate3d(${pinAt.x}px, ${pinAt.y + 14}px, 0)`;
      }

      // Two captions, one sentence across the trip.
      const away = 1 - progress(t, [T.landing, T.landing + 0.4]);
      if (caption1) {
        const shown = easeOutCubic(progress(t, T.caption1));
        caption1.style.opacity = String(shown * lerp(1, 0.5, progress(t, T.caption2)) * away);
        caption1.style.clipPath = `inset(-20% ${(1 - shown) * 100}% -20% 0)`;
      }
      if (caption2) {
        const shown = easeOutCubic(progress(t, T.caption2));
        caption2.style.opacity = String(shown * away);
        caption2.style.clipPath = `inset(-20% ${(1 - shown) * 100}% -20% 0)`;
      }

      // Once the card is up, Skip has nothing left to skip.
      if (skip) {
        const gone = progress(t, [T.landing, T.landing + 0.35]);
        skip.style.opacity = String(1 - gone);
        skip.style.pointerEvents = gone > 0 ? "none" : "auto";
      }
    };

    let t = qa.start;
    let last = performance.now();
    let raf = 0;
    let mapStarted = false;
    let landed = false;
    let slowFrames = 0;
    let readySince: number | null = null;
    const frame = (now: number) => {
      const gap = now - last;
      // Real time down to 4 frames a second; longer stalls do not jump the story ahead.
      const dt = Math.min(0.25, gap / 1000);
      last = now;
      if (!document.hidden && !qa.hold) t += dt;
      if (mode === "map" && !qa.hold && t >= T.mapIn[0] && t < T.landing) {
        slowFrames = gap > 250 ? slowFrames + 1 : gap < 120 ? 0 : slowFrames;
        if (slowFrames >= 4) dropMap();
      }
      if (!mapStarted && t >= T.mapLoad) {
        mapStarted = true;
        startMap();
      }
      // The intro lets go once the panel's map is ready under it (or after a short wait).
      if (endFadeAt === null && t >= T.handoff[1]) {
        if (panelReadyRef.current && readySince === null) readySince = t;
        if (readySince !== null || t >= T.handoff[1] + MAX_WAIT_S) endFadeAt = Math.max(t, T.total - END_FADE_S);
      }
      render(t);
      if (!landed && t >= T.landing) {
        landed = true;
        onLanding(mode === "map" ? handoffCamera : null);
      }
      if (endFadeAt !== null && t >= endFadeAt + END_FADE_S) {
        if (!logoSignalled) onLogoLanded();
        onEnd();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      stopMap?.();
    };
  }, [variant, qa, T, size, onLanding, onLogoLanded, onEnd]);

  return (
    <div
      ref={rootRef}
      role={cardOpen ? undefined : "dialog"}
      aria-modal={cardOpen ? undefined : true}
      aria-label={cardOpen ? undefined : "Co-op announcement"}
      aria-hidden={cardOpen || undefined}
      className={`fixed inset-0 z-[120] overflow-hidden text-white ${cardOpen ? "pointer-events-none" : ""}`}
      style={{ opacity: 0, backgroundColor: "#02040a" }}
    >
      <p className="sr-only">
        An animated intro about my fall 2026 co-op search is playing. Skip intro goes straight to the
        announcement.
      </p>

      <div aria-hidden className="absolute inset-0">
        {/* MapLibre sets position: relative on its container, so it gets its own inner host. */}
        <div data-map className="absolute inset-0" style={{ opacity: 0 }}>
          <div data-map-host className="h-full w-full" />
        </div>
        <div data-fallback-wrap className="absolute inset-0" style={{ opacity: 0 }}>
          {mapMode === "fallback" && <MapFallback variant={variant} />}
        </div>

        <canvas data-field className="absolute inset-0" />

        {logos.map((logo) => (
          <LogoBadge key={logo.file} logo={logo} size={size.logo} />
        ))}

        <p
          data-title
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-[clamp(1.75rem,4.6vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.04em]"
          style={{ opacity: 0 }}
        >
          {TITLE}
        </p>

        <div className="absolute inset-x-0 bottom-[max(4vh,20px)] mx-auto grid max-w-[1100px] grid-cols-3 gap-x-4 gap-y-4 px-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10">
          {SEARCH_COUNTERS.map((stat) => (
            <div key={stat.label} data-counter className="text-center sm:min-w-[120px]" style={{ opacity: 0 }}>
              <p className="text-[clamp(1.4rem,3vw,2.15rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                <span data-counter-value>{stat.kind === "date" ? (variant === "phone" ? stat.short : stat.value) : "0"}</span>
              </p>
              <p className="mt-1.5 text-[clamp(11px,1.2vw,13px)] leading-snug text-white/65">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[max(5vh,24px)] flex justify-center gap-10 px-5 sm:gap-16">
          <div data-funnel="dim" className="text-center sm:flex sm:items-center sm:gap-3 sm:text-left" style={{ opacity: 0 }}>
            <p className="flex items-center justify-center gap-2.5 sm:contents">
              <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              <span data-funnel-value="dim" className="text-[clamp(1.4rem,3vw,2.15rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">0</span>
            </p>
            <p className="mt-1.5 text-[clamp(12px,1.3vw,14px)] text-white/65 sm:mt-0">{FUNNEL.dimmed.label}</p>
          </div>
          <div data-funnel="glow" className="text-center sm:flex sm:items-center sm:gap-3 sm:text-left" style={{ opacity: 0 }}>
            <p className="flex items-center justify-center gap-2.5 sm:contents">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9ccbff] shadow-[0_0_12px_3px_rgba(41,151,255,0.7)]" />
              <span data-funnel-value="glow" className="text-[clamp(1.4rem,3vw,2.15rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">0</span>
            </p>
            <p className="mt-1.5 text-[clamp(12px,1.3vw,14px)] text-white/65 sm:mt-0">{FUNNEL.glowing.label}</p>
          </div>
        </div>

        <div data-timeline className="absolute top-0 left-0" style={{ opacity: 0 }}>
          <p data-yes-label className="absolute top-0 left-6 -translate-y-1/2 text-[17px] font-semibold tracking-[-0.02em] whitespace-nowrap" style={{ opacity: 0 }}>
            {YES ? `${YES.value} ${YES.label}` : ""}
          </p>
          <span data-timeline-line className="absolute top-3 left-0 h-[calc(100%+4px)] w-px origin-top -translate-x-1/2 bg-white/25" style={{ transform: "scaleY(0)" }} />
          <ol className="relative mt-9 w-[min(440px,calc(100vw-64px))] space-y-3 pl-6">
            {TIMELINE.map((step, i) => (
              <li key={`${step.iso}-${step.label}`} data-timeline-row className="relative flex gap-3 text-[14px] leading-[1.45]" style={{ opacity: 0 }}>
                <span
                  className={`absolute top-[7px] -left-6 h-2 w-2 -translate-x-1/2 rounded-full ${
                    i === TIMELINE.length - 1 ? "bg-[#9ccbff] shadow-[0_0_10px_2px_rgba(41,151,255,0.75)]" : "bg-white/70"
                  }`}
                />
                <span className="w-12 shrink-0 font-medium tabular-nums">{step.date}</span>
                <span className="text-white/75">{step.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <span data-ring className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 border-[#2997ff]" style={{ opacity: 0 }} />
        <svg data-pin className="absolute top-0 left-0 origin-bottom" width={size.pinW} height={size.pinH} viewBox="0 0 30 42" style={{ opacity: 0 }}>
          <path d="M15 41C15 41 28 25.6 28 15A13 13 0 0 0 2 15C2 25.6 15 41 15 41Z" fill="#2997ff" stroke="#fff" strokeWidth="2" />
          <circle cx="15" cy="15" r="5" fill="#fff" />
        </svg>
        <p data-office-label className="absolute top-0 left-0 text-[12.5px] font-medium whitespace-nowrap text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]" style={{ opacity: 0 }}>
          {COOP_MAP.officeLabel}
        </p>

        <div className="absolute inset-x-0 bottom-[max(9vh,56px)] flex flex-col items-center gap-1.5 px-6 text-center">
          <p data-caption="1" className="text-[clamp(1.15rem,2.3vw,1.7rem)] leading-tight font-semibold tracking-[-0.03em] [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]" style={{ opacity: 0 }}>
            {COOP_CAPTIONS.origin}
          </p>
          <p data-caption="2" className="text-[clamp(1.15rem,2.3vw,1.7rem)] leading-tight font-semibold tracking-[-0.03em] [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]" style={{ opacity: 0 }}>
            {COOP_CAPTIONS.destination}
          </p>
        </div>
      </div>

      <button
        ref={skipRef}
        data-skip
        type="button"
        onClick={onSkip}
        tabIndex={cardOpen ? -1 : 0}
        className="absolute top-4 right-4 z-10 inline-flex h-10 items-center rounded-full border border-white/20 bg-black/40 px-4 text-[14px] font-medium text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-6 sm:right-6"
      >
        Skip intro
      </button>
    </div>
  );
}
