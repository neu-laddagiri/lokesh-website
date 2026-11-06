/**
 * Every scene boundary of the intro, in seconds, for the desktop cut (about
 * 20 s, a 360 degree orbit) and the phone cut (about 16 s, 180 degrees). The
 * intro is a pure function of time against this table, which is what makes
 * Skip, pause, and seeking trivial.
 */

export type Variant = "desktop" | "phone";
export type Span = readonly [number, number];

export type Timing = {
  total: number;
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
  mapIn: Span;
  flagIn: Span;
  peel: Span;
  flight: Span;
  zoom: Span;
  pin: Span;
  orbit: Span;
  orbitDegrees: number;
  morph: Span;
  /** The card starts rising here. */
  landing: number;
  fadeOut: Span;
  /** At most this many logos orbit. */
  maxLogos: number;
  /** How far the orbit tightens. Phones stop sooner so logos stay outside the dot field. */
  tightReach: number;
};

export const TIMINGS: Record<Variant, Timing> = {
  desktop: {
    total: 20.6,
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
    flagIn: [14.8, 15.2],
    peel: [15.2, 15.9],
    flight: [15.4, 17.05],
    zoom: [17.05, 17.95],
    pin: [17.8, 18.15],
    orbit: [17.95, 20.95],
    orbitDegrees: 360,
    morph: [18.25, 19.2],
    landing: 19.2,
    fadeOut: [20.0, 20.6],
    maxLogos: 13,
    tightReach: 0.64,
  },
  phone: {
    total: 16.1,
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
    flagIn: [11.6, 11.95],
    peel: [11.95, 12.5],
    flight: [12.1, 13.4],
    zoom: [13.4, 14.15],
    pin: [14.0, 14.3],
    orbit: [14.15, 16.15],
    orbitDegrees: 180,
    morph: [14.4, 15.2],
    landing: 15.1,
    fadeOut: [15.6, 16.1],
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

/** Fade in over `inSpan`, hold, fade out over `outSpan`. */
export const window01 = (t: number, inSpan: Span, outSpan: Span) =>
  Math.min(progress(t, inSpan), 1 - progress(t, outSpan));

export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
