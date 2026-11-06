/**
 * Every scene boundary of the intro, in seconds, for the desktop cut (about
 * 24 s) and the phone cut (about 19.5 s). The intro is a pure function of time
 * against this table, which is what makes Skip, pause, and seeking trivial.
 */

export type Variant = "desktop" | "phone";
export type Span = readonly [number, number];

export type Timing = {
  mountIn: Span;
  title: { in: Span; out: Span };
  logosIn: Span;
  /** Dots appear while the application count rolls up: the first counter shares this span. */
  dots: Span;
  counters: { start: number; stagger: number; roll: number; out: Span };
  /** MapLibre starts loading here: still scene 2, but after the dots settle, so its start-up hitch lands on a still frame. */
  mapLoad: number;
  dim: Span;
  glow: Span;
  funnelOut: Span;
  tighten: Span;
  collapse: Span;
  logosOut: Span;
  timeline: { start: number; stagger: number; out: Span };

  /** The globe fades in, close over Athens. */
  mapIn: Span;
  /** The flagpole drops onto Athens and settles. */
  plant: Span;
  unfurl: Span;
  caption1: Span;
  /** The wind picks up before the stripes let go. */
  gust: Span;
  /** The first and last stripe start to blow off the pole. */
  detach: Span;
  /** The camera pulls back from Athens to the whole globe. */
  zoomOut: Span;
  /** The stripes cross the Atlantic; the camera rides along the route. */
  flight: Span;
  /** The dive into Lafayette City Center. */
  zoom: Span;
  /** The stripes settle into a stack above the office. */
  land: Span;
  caption2: Span;
  pin: Span;
  orbit: Span;
  orbitDegrees: number;
  /** The stack becomes the Verisk logo. */
  morph: { clip: Span; plate: Span; radical: Span; wordmark: Span };
  /** The card appears and the handoff begins. */
  landing: number;
  /** The map shrinks onto the card's map panel and the logo flies onto the card. */
  handoff: Span;
  /** The earliest end; the intro also waits for the map panel to be ready. */
  total: number;

  /** At most this many logos orbit. */
  maxLogos: number;
  /** How far the orbit tightens. Phones stop sooner so logos stay outside the dot field. */
  tightReach: number;
};

export const TIMINGS: Record<Variant, Timing> = {
  desktop: {
    mountIn: [0, 0.6],
    title: { in: [0.6, 1.2], out: [3.5, 4.0] },
    logosIn: [0.9, 3.1],
    dots: [4.0, 6.4],
    counters: { start: 4.6, stagger: 0.7, roll: 1.1, out: [8.7, 9.2] },
    mapLoad: 6.6,
    dim: [9.0, 10.0],
    glow: [10.0, 11.0],
    funnelOut: [11.6, 12.05],
    tighten: [9.0, 12.0],
    collapse: [12.0, 13.0],
    logosOut: [12.0, 12.9],
    timeline: { start: 12.9, stagger: 0.18, out: [14.2, 14.6] },

    mapIn: [14.4, 15.0],
    plant: [14.75, 15.4],
    unfurl: [15.2, 15.85],
    caption1: [15.45, 15.95],
    gust: [16.35, 16.95],
    detach: [16.6, 17.2],
    zoomOut: [16.75, 17.6],
    flight: [16.85, 19.35],
    zoom: [19.35, 20.25],
    land: [19.45, 20.3],
    caption2: [19.75, 20.25],
    pin: [20.05, 20.4],
    orbit: [20.2, 22.6],
    orbitDegrees: 90,
    morph: { clip: [20.45, 21.0], plate: [20.55, 20.95], radical: [20.95, 21.55], wordmark: [21.5, 22.05] },
    landing: 22.6,
    handoff: [22.6, 23.8],
    total: 24.1,
    maxLogos: 13,
    tightReach: 0.64,
  },
  phone: {
    mountIn: [0, 0.5],
    title: { in: [0.5, 1.0], out: [2.8, 3.2] },
    logosIn: [0.7, 2.4],
    dots: [3.2, 5.2],
    counters: { start: 3.7, stagger: 0.55, roll: 0.9, out: [6.9, 7.3] },
    mapLoad: 5.4,
    dim: [7.1, 7.9],
    glow: [7.9, 8.7],
    funnelOut: [9.0, 9.4],
    tighten: [7.1, 9.4],
    collapse: [9.4, 10.2],
    logosOut: [9.4, 10.1],
    timeline: { start: 10.1, stagger: 0.15, out: [11.15, 11.5] },

    mapIn: [11.3, 11.8],
    plant: [11.6, 12.2],
    unfurl: [12.0, 12.6],
    caption1: [12.2, 12.65],
    gust: [12.95, 13.5],
    detach: [13.15, 13.7],
    zoomOut: [13.25, 14.0],
    flight: [13.35, 15.4],
    zoom: [15.4, 16.15],
    land: [15.5, 16.2],
    caption2: [15.75, 16.2],
    pin: [16.0, 16.3],
    orbit: [16.15, 18.3],
    orbitDegrees: 60,
    morph: { clip: [16.35, 16.85], plate: [16.45, 16.8], radical: [16.8, 17.35], wordmark: [17.3, 17.8] },
    landing: 18.3,
    handoff: [18.3, 19.4],
    total: 19.7,
    maxLogos: 5,
    tightReach: 0.84,
  },
};

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** 0 before the span, 1 after it, linear inside. */
export const progress = (t: number, [start, end]: Span) => clamp01((t - start) / (end - start));

export const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
export const easeInCubic = (x: number) => x ** 3;
export const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
export const easeOutBack = (x: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
};
/** A bounce at the end, for the flagpole landing. */
export const easeOutBounce = (x: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x - 1.5 / d) ** 2 + 0.75;
  if (x < 2.5 / d) return n * (x - 2.25 / d) ** 2 + 0.9375;
  return n * (x - 2.625 / d) ** 2 + 0.984375;
};

/** Fade in over `inSpan`, hold, fade out over `outSpan`. */
export const window01 = (t: number, inSpan: Span, outSpan: Span) =>
  Math.min(progress(t, inSpan), 1 - progress(t, outSpan));

export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

export const smoothstep = (a: number, b: number, x: number) => {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};
