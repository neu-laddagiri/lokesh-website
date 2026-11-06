import { GREEK_FLAG } from "@/components/greece-2026/greek-flag";
import { LOGO, LOGO_PLATE, PLATE } from "../verisk-logo";
import {
  clamp01,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  lerp,
  progress,
  smoothstep,
  type Timing,
  type Variant,
} from "./timing";

/**
 * The map scene's story, drawn on the intro's canvas: a Greek flag planted on
 * Athens, its nine stripes blown off the pole and streaming across the
 * Atlantic, and the same nine stripes settling over Lafayette City Center and
 * rounding into the Verisk mark. The mark is the flag's stripes clipped to a
 * circle, so nothing is swapped: the stripes become the bands, the "yes" dot
 * draws the radical, and the official logo's pixels take over at the end.
 */

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type LogoImages = {
  bands: HTMLImageElement;
  radical: HTMLImageElement;
  wordmark: HTMLImageElement;
};

export function loadLogoImages(): Promise<LogoImages> {
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  return Promise.all([load(LOGO.layers.bands), load(LOGO.layers.radical), load(LOGO.layers.wordmark)]).then(
    ([bands, radical, wordmark]) => ({ bands, radical, wordmark }),
  );
}

const SIZE = {
  desktop: { flagH: 80, poleH: 134, stackH: 72, ribbon: 1.05, spread: 1, drop: 190, pinH: 42, rope: 18 },
  phone: { flagH: 60, poleH: 100, stackH: 58, ribbon: 1.05, spread: 0.62, drop: 140, pinH: 36, rope: 13 },
} as const;

const STRIPES = GREEK_FLAG.stripes;
const SEGMENTS = 34;
/** The canton covers the top five stripes for 10 of the flag's 27 units. */
const CANTON_U = GREEK_FLAG.canton / GREEK_FLAG.width;
const CROSS = { from: 4 / GREEK_FLAG.width, to: 6 / GREEK_FLAG.width };

/** Per-stripe personalities, so the streamers weave instead of moving as a block. */
const PHASE = Array.from({ length: STRIPES }, (_, i) => ({
  a: i * 2.39996,
  b: i * 1.71 + 0.6,
  c: i * 3.07 + 1.9,
  twist: i * 0.77,
}));

// Color ramps: dark to the flag color at 0.5 to a highlight at 1, cached as strings.
const BLUE_RAMP = [
  [8, 63, 126],
  [13, 94, 175],
  [106, 174, 247],
] as const;
const WHITE_RAMP = [
  [168, 184, 205],
  [255, 255, 255],
  [255, 255, 255],
] as const;
const RAMP_STEPS = 32;
const rampCache = new Map<string, string>();
function shade(blue: boolean, light: number): string {
  const step = Math.round(clamp01(light) * RAMP_STEPS);
  const key = `${blue ? "b" : "w"}${step}`;
  const hit = rampCache.get(key);
  if (hit) return hit;
  const ramp = blue ? BLUE_RAMP : WHITE_RAMP;
  const x = step / RAMP_STEPS;
  const [from, to, f] = x < 0.5 ? [ramp[0], ramp[1], x / 0.5] : [ramp[1], ramp[2], (x - 0.5) / 0.5];
  const color = `rgb(${Math.round(lerp(from[0], to[0], f))}, ${Math.round(lerp(from[1], to[1], f))}, ${Math.round(lerp(from[2], to[2], f))})`;
  rampCache.set(key, color);
  return color;
}

function mixHex(a: string, b: string, f: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(lerp((pa >> shift) & 255, (pb >> shift) & 255, f));
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

export type JourneyInput = {
  t: number;
  T: Timing;
  variant: Variant;
  /** Athens on screen: the flagpole's footing. */
  athens: Point | null;
  /** The office on screen: the pin's tip. */
  office: Point | null;
  /** Screen point at a fraction of the route, Athens (0) to the office (1). */
  route: ((s: number) => Point) | null;
  images: LogoImages | null;
  /** The card's logo slot, once the card exists. */
  slot: Rect | null;
};

export type JourneyOutput = {
  /** Where the "yes" dot is during the map scene, or null before the scene starts. */
  dot: Point | null;
  dotAlpha: number;
  /** The flying logo has reached the card. */
  logoLanded: boolean;
};

type Ribbon = { pts: Point[]; widths: number[]; lights: number[]; blue: boolean; glow: number };

/** One canvas, one offscreen mask for drawing the radical. */
export class Journey {
  private mask = document.createElement("canvas");
  private maskCtx = this.mask.getContext("2d");
  private grid: Point[] = [];

  /** Samples the route once per frame; everything else interpolates. */
  private sampleRoute(route: (s: number) => Point) {
    const n = 240;
    this.grid.length = n + 1;
    for (let k = 0; k <= n; k++) this.grid[k] = route(k / n);
  }

  private routeAt(s: number): Point {
    const n = this.grid.length - 1;
    const x = clamp01(s) * n;
    const k = Math.min(n - 1, Math.floor(x));
    const f = x - k;
    const a = this.grid[k];
    const b = this.grid[k + 1];
    return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f) };
  }

  private tangentAt(s: number): Point {
    const a = this.routeAt(s - 0.006);
    const b = this.routeAt(s + 0.006);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  draw(ctx: CanvasRenderingContext2D, input: JourneyInput, dpr: number): JourneyOutput {
    const { t, T, variant, athens, office, route, images, slot } = input;
    const size = SIZE[variant];
    const out: JourneyOutput = { dot: null, dotAlpha: 1, logoLanded: false };
    if (t < T.plant[0] || !athens) return out;
    if (route) this.sampleRoute(route);
    const haveRoute = Boolean(route) && this.grid.length > 1;

    // ---- The planted flag ----
    const drop = 1 - easeOutBounce(progress(t, [T.plant[0], T.plant[1] - 0.12]));
    const ground = { x: athens.x, y: athens.y - drop * size.drop };
    const poleTop = { x: ground.x, y: ground.y - size.poleH };
    const flagTop = poleTop.y + 2;
    const flagH = size.flagH;
    const unfurl = lerp(0.1, 1, easeOutCubic(progress(t, T.unfurl)));
    const flagW = 1.5 * flagH * unfurl;
    const gust = smoothstep(T.gust[0], T.gust[1], t);
    const behind = 1 - smoothstep(T.flight[0] + 0.5, T.flight[0] + 1.1, t);
    const wave = (u: number) => Math.sin(Math.PI * 2 * (1.15 * u - 1.5 * t));
    const flagPoint = (i: number, u: number): Point => {
      const w = wave(u);
      const amp = 0.05 + 0.08 * gust;
      return {
        x: poleTop.x - 1 - u * flagW * (1 - 0.035 * u * (1 + w)),
        y: flagTop + ((i + 0.5) * flagH) / STRIPES + amp * flagH * u ** 1.15 * w + 0.04 * flagH * u * u,
      };
    };
    const flagLight = (u: number) => 0.5 + 0.22 * Math.cos(Math.PI * 2 * (1.15 * u - 1.5 * t)) * u;

    // The ripple where the pole hits the ground.
    const hit = progress(t, [T.plant[1] - 0.2, T.plant[1] + 0.55]);
    if (hit > 0 && hit < 1) {
      ctx.save();
      ctx.globalAlpha = 0.7 * (1 - hit) * behind;
      ctx.strokeStyle = "#9ccbff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(athens.x, athens.y, 6 + 46 * hit, (6 + 46 * hit) * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (behind > 0) {
      ctx.save();
      ctx.globalAlpha = behind;
      // Pole and finial.
      ctx.strokeStyle = "rgba(235, 240, 248, 0.92)";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ground.x, ground.y);
      ctx.lineTo(poleTop.x, poleTop.y);
      ctx.stroke();
      ctx.fillStyle = "#f2f5fa";
      ctx.beginPath();
      ctx.arc(poleTop.x, poleTop.y - 2, 3.2, 0, Math.PI * 2);
      ctx.fill();
      // The canton stays on the pole: the blue square with the white cross.
      for (let i = 0; i < 5; i++) {
        const cuts = [0, CROSS.from, CROSS.to, CANTON_U];
        for (let c = 0; c < cuts.length - 1; c++) {
          const white = i === 2 || c === 1;
          this.fillBand(ctx, flagPoint, i, cuts[c], cuts[c + 1], 3, white, flagLight);
        }
      }
      ctx.restore();
    }

    // ---- The stripes: on the flag, blown off, streaming west, landing over the office ----
    const detachAt = (i: number) => lerp(T.detach[0], T.detach[1], (STRIPES - 1 - i) / (STRIPES - 1));
    const landAt = (i: number) => lerp(T.land[0], T.land[1] - 0.5, i / (STRIPES - 1));
    const lift = { x: poleTop.x - flagW / 2 - athens.x, y: flagTop + flagH / 2 - athens.y };

    // Where the logo forms: centered over the pin, its center sliding as the shape changes.
    const k = size.stackH / LOGO.mark.size;
    const clip = easeInOutCubic(progress(t, T.morph.clip));
    const word = easeInOutCubic(progress(t, T.morph.wordmark));
    const fieldCenter = LOGO.flagField.x + LOGO.flagField.width / 2;
    const markCenter = LOGO.mark.cx;
    const center = word > 0 ? lerp(markCenter, LOGO.width / 2, word) : lerp(fieldCenter, markCenter, clip);
    const anchor = office ?? athens;
    const origin = {
      x: anchor.x - center * k,
      y: anchor.y - size.pinH - 22 - LOGO.mark.size * k,
    };
    const stack: Rect = {
      x: origin.x + LOGO.flagField.x * k,
      y: origin.y,
      w: LOGO.flagField.width * k,
      h: LOGO.mark.size * k,
    };

    const spread = size.spread;
    const ribbons: Ribbon[] = [];
    let lead = 0;
    for (let i = 0; i < STRIPES; i++) {
      const blue = i % 2 === 0;
      const start = detachAt(i);
      const beta = easeInOutCubic(progress(t, [start, start + 0.55]));
      const gamma = easeInOutCubic(progress(t, [landAt(i), landAt(i) + 0.55]));
      if (t >= T.morph.clip[0]) break;
      const p = progress(t, [start, T.flight[1]]);
      const head = easeInOutCubic(progress(t, [start + 0.08, T.flight[1] - 0.02 * i]));
      lead = Math.max(lead, head);
      const length = (0.06 + 0.4 * Math.sin(Math.PI * p) ** 0.7) * (1 - gamma);
      const u0 = i < 5 ? CANTON_U : 0;
      const pts: Point[] = [];
      const widths: number[] = [];
      const lights: number[] = [];
      const ph = PHASE[i];
      for (let j = 0; j <= SEGMENTS; j++) {
        const along = j / SEGMENTS;
        // On the flag: hoist side is the tail, free end is the head.
        const u = u0 + (1 - u0) * along;
        let point = flagPoint(i, u);
        let width = flagH / STRIPES + 0.7;
        let light = flagLight(u);
        if (beta > 0 && haveRoute) {
          const s = head - length * (1 - along);
          const sc = clamp01(s);
          const base = this.routeAt(sc);
          const tan = this.tangentAt(sc);
          const down = { x: tan.y, y: -tan.x };
          const env = Math.sin(Math.PI * sc) ** 0.75;
          // Gentle, long waves: the sideways slope stays well under the forward run, so the
          // ribbons flow and cross instead of scribbling.
          const lane = (i - (STRIPES - 1) / 2) * (lerp(flagH / STRIPES, size.stackH / STRIPES, sc) + 7 * spread * env);
          const waveOff = spread * (70 * Math.sin(Math.PI * 2 * (0.55 * sc - 0.35 * t) + ph.a) + 24 * Math.sin(Math.PI * 2 * (1.25 * sc + 0.5 * t) + ph.b));
          const curl = spread * 10 * Math.sin(Math.PI * 2 * (1.1 * sc - 0.6 * t) + ph.c);
          const rise = 1 - smoothstep(0, 0.16, sc);
          const flow = {
            x: base.x + down.x * (lane + env * waveOff) + tan.x * env * curl + lift.x * rise,
            y: base.y + down.y * (lane + env * waveOff) + tan.y * env * curl + lift.y * rise,
          };
          const tw = Math.cos(Math.PI * 2 * (1.7 * sc - 0.95 * t) + ph.twist);
          const taper = smoothstep(0, 0.2, along) * (1 - 0.3 * smoothstep(0.86, 1, along));
          const flowWidth = (flagH / STRIPES) * size.ribbon * taper * (0.32 + 0.68 * Math.abs(tw));
          point = { x: lerp(point.x, flow.x, beta), y: lerp(point.y, flow.y, beta) };
          width = lerp(width, flowWidth, beta);
          light = lerp(light, 0.5 + 0.5 * tw * tw * (blue ? 1 : 0.6) - (blue ? 0.12 : 0), beta);
        }
        if (gamma > 0) {
          const slot = { x: stack.x + stack.w * (1 - along), y: stack.y + ((i + 0.5) * stack.h) / STRIPES };
          point = { x: lerp(point.x, slot.x, gamma), y: lerp(point.y, slot.y, gamma) };
          width = lerp(width, stack.h / STRIPES + 0.7, gamma);
          light = lerp(light, 0.5, gamma);
        }
        pts.push(point);
        widths.push(width);
        lights.push(light);
      }
      // A rope from the head: no segment longer than the rope step, so a trail still far out
      // on the route during the dive follows the head in instead of shooting across the screen.
      for (let j = SEGMENTS - 1; j >= 0; j--) {
        const a = pts[j];
        const b = pts[j + 1];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d > size.rope) pts[j] = { x: b.x + (dx / d) * size.rope, y: b.y + (dy / d) * size.rope };
      }
      // Stripes 0 to 4 start at the canton's edge; until they detach they are part of the flag.
      ribbons.push({ pts, widths, lights, blue, glow: beta * (1 - gamma) });
    }
    for (const ribbon of ribbons) this.drawRibbon(ctx, ribbon);

    // ---- The "yes" dot ----
    if (t < T.detach[0] || !haveRoute) out.dot = { x: athens.x, y: athens.y };
    else if (t < T.land[1]) {
      const s = Math.min(1, lead + 0.02);
      const p = this.routeAt(s);
      const rise = 1 - smoothstep(0, 0.16, s);
      const toStart = this.logoPoint(origin, k, LOGO.radical[0]);
      const settle = easeInOutCubic(progress(t, [T.land[0], T.land[1]]));
      out.dot = {
        x: lerp(p.x + lift.x * rise, toStart.x, settle),
        y: lerp(p.y + lift.y * rise, toStart.y, settle),
      };
    } else out.dot = this.logoPoint(origin, k, LOGO.radical[0]);

    // ---- The stack becomes the logo ----
    if (t >= T.morph.clip[0]) {
      const flight = progress(t, [T.handoff[0], lerp(T.handoff[0], T.handoff[1], 0.78)]);
      const q = easeInOutCubic(flight);
      out.logoLanded = flight >= 1;
      const radicalProgress = easeInOutCubic(progress(t, T.morph.radical));
      const tip = this.drawLogo(ctx, dpr, {
        origin,
        k,
        clip,
        plate: progress(t, T.morph.plate),
        radical: radicalProgress,
        exact: smoothstep(T.morph.radical[0], T.morph.radical[0] + 0.35, t),
        word,
        images,
        flyTo: slot && q > 0 ? { rect: slot, q } : null,
      });
      if (radicalProgress > 0) out.dot = tip;
      out.dotAlpha = 1 - smoothstep(T.morph.radical[1] - 0.05, T.morph.radical[1] + 0.25, t);
    }
    return out;
  }

  /** A logo-space point on screen. */
  private logoPoint(origin: Point, k: number, [x, y]: readonly [number, number]): Point {
    return { x: origin.x + x * k, y: origin.y + y * k };
  }

  /** One band of the flag between two points along it, in shaded segments. */
  private fillBand(
    ctx: CanvasRenderingContext2D,
    at: (i: number, u: number) => Point,
    i: number,
    from: number,
    to: number,
    steps: number,
    white: boolean,
    light: (u: number) => number,
  ) {
    ctx.lineWidth = 0.6;
    for (let s = 0; s < steps; s++) {
      const u0 = lerp(from, to, s / steps);
      const u1 = lerp(from, to, (s + 1) / steps);
      const top = this.bandEdge(at, i, u0, -1);
      const top1 = this.bandEdge(at, i, u1, -1);
      const bot1 = this.bandEdge(at, i, u1, 1);
      const bot = this.bandEdge(at, i, u0, 1);
      const color = shade(!white, light((u0 + u1) / 2));
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(top1.x, top1.y);
      ctx.lineTo(bot1.x, bot1.y);
      ctx.lineTo(bot.x, bot.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  /** The top (-1) or bottom (+1) edge of stripe i at u: the neighboring stripe centers meet halfway. */
  private bandEdge(at: (i: number, u: number) => Point, i: number, u: number, side: -1 | 1): Point {
    const c = at(i, u);
    const n = at(i + side, u);
    return { x: (c.x + n.x) / 2, y: (c.y + n.y) / 2 };
  }

  private drawRibbon(ctx: CanvasRenderingContext2D, ribbon: Ribbon) {
    const { pts, widths, lights, blue, glow } = ribbon;
    const n = pts.length;
    if (n < 2) return;
    const left: Point[] = [];
    const right: Point[] = [];
    for (let j = 0; j < n; j++) {
      const a = pts[Math.max(0, j - 1)];
      const b = pts[Math.min(n - 1, j + 1)];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const hw = widths[j] / 2;
      left.push({ x: pts[j].x - dy * hw, y: pts[j].y + dx * hw });
      right.push({ x: pts[j].x + dy * hw, y: pts[j].y - dx * hw });
    }
    if (glow > 0.01) {
      ctx.save();
      ctx.globalAlpha = glow * (blue ? 0.32 : 0.16);
      ctx.strokeStyle = blue ? "#2997ff" : "#ffffff";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3 + 2.4 * Math.max(...widths);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < n; j++) ctx.lineTo(pts[j].x, pts[j].y);
      ctx.stroke();
      ctx.restore();
    }
    ctx.lineWidth = 0.6;
    for (let j = 0; j < n - 1; j++) {
      const color = shade(blue, (lights[j] + lights[j + 1]) / 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(left[j].x, left[j].y);
      ctx.lineTo(left[j + 1].x, left[j + 1].y);
      ctx.lineTo(right[j + 1].x, right[j + 1].y);
      ctx.lineTo(right[j].x, right[j].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * The stack rounding into the mark on a white plate, the radical drawn in,
   * the official pixels taking over, and the wordmark wiping in. Returns where
   * the radical's drawing tip is.
   */
  private drawLogo(
    ctx: CanvasRenderingContext2D,
    dpr: number,
    o: {
      origin: Point;
      k: number;
      clip: number;
      plate: number;
      radical: number;
      exact: number;
      word: number;
      images: LogoImages | null;
      flyTo: { rect: Rect; q: number } | null;
    },
  ): Point {
    let { origin, k } = o;
    // Flying onto the card: the whole plate moves and scales to the slot.
    if (o.flyTo) {
      const from: Rect = {
        x: origin.x - LOGO_PLATE.padX * k,
        y: origin.y - LOGO_PLATE.padY * k,
        w: PLATE.width * k,
        h: PLATE.height * k,
      };
      const { rect, q } = o.flyTo;
      const h = lerp(from.h, rect.h, q);
      const x = lerp(from.x, rect.x, q);
      const y = lerp(from.y, rect.y, q);
      k = h / PLATE.height;
      origin = { x: x + LOGO_PLATE.padX * k, y: y + LOGO_PLATE.padY * k };
    }

    ctx.save();
    ctx.translate(origin.x, origin.y);
    ctx.scale(k, k);

    // The plate: from the stripe field, to a plate around the mark, to one around the whole logo.
    if (o.plate > 0) {
      const a = smoothstep(0, 0.45, o.plate);
      const grow = easeInOutCubic(o.plate);
      const fieldRect = { x: LOGO.flagField.x, y: 0, w: LOGO.flagField.width, h: LOGO.mark.size };
      const markRect = {
        x: LOGO.mark.cx - LOGO.mark.r - LOGO_PLATE.padX,
        y: -LOGO_PLATE.padY,
        w: LOGO.mark.r * 2 + LOGO_PLATE.padX * 2,
        h: PLATE.height,
      };
      const fullRect = { x: -LOGO_PLATE.padX, y: -LOGO_PLATE.padY, w: PLATE.width, h: PLATE.height };
      const base = {
        x: lerp(fieldRect.x, markRect.x, grow),
        y: lerp(fieldRect.y, markRect.y, grow),
        w: lerp(fieldRect.w, markRect.w, grow),
        h: lerp(fieldRect.h, markRect.h, grow),
      };
      const rect = {
        x: lerp(base.x, fullRect.x, o.word),
        y: base.y,
        w: lerp(base.w, fullRect.w, o.word),
        h: base.h,
      };
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.w, rect.h, rect.h * LOGO_PLATE.radius * grow);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // The flag's stripes, rounding into the circle and turning Verisk blue.
    const vector = 1 - o.exact;
    if (vector > 0) {
      ctx.save();
      ctx.globalAlpha = vector;
      ctx.beginPath();
      ctx.roundRect(
        LOGO.flagField.x,
        0,
        lerp(LOGO.flagField.width, LOGO.mark.r * 2, o.clip),
        LOGO.mark.size,
        lerp(0, LOGO.mark.r, o.clip),
      );
      ctx.clip();
      const band = LOGO.mark.size / STRIPES;
      const blue = mixHex(GREEK_FLAG.blue, LOGO.colors.blue, o.clip);
      for (let i = 0; i < STRIPES; i++) {
        ctx.fillStyle = i % 2 === 0 ? blue : "#ffffff";
        ctx.fillRect(LOGO.flagField.x, i * band - 0.35, LOGO.flagField.width, band + 0.7);
      }
      ctx.restore();
    }

    // The official bands take over as the radical is drawn.
    if (o.images && o.exact > 0) {
      ctx.globalAlpha = o.exact;
      ctx.drawImage(o.images.bands, 0, 0, LOGO.width, LOGO.height);
      ctx.globalAlpha = 1;
    }

    // The radical, revealed along its own path.
    const path = LOGO.radical;
    const lengths = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
    const total = lengths.reduce((a, b) => a + b, 0);
    let remaining = o.radical * total;
    const drawn: [number, number][] = [[path[0][0], path[0][1]]];
    let tip: [number, number] = [path[0][0], path[0][1]];
    for (let i = 0; i < lengths.length && remaining > 0; i++) {
      const f = Math.min(1, remaining / lengths[i]);
      tip = [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)];
      drawn.push(tip);
      remaining -= lengths[i];
    }
    if (o.images && o.radical > 0) {
      const mask = this.mask;
      const m = this.maskCtx;
      if (m) {
        if (mask.width !== ctx.canvas.width || mask.height !== ctx.canvas.height) {
          mask.width = ctx.canvas.width;
          mask.height = ctx.canvas.height;
        }
        m.setTransform(1, 0, 0, 1, 0, 0);
        m.globalCompositeOperation = "source-over";
        m.clearRect(0, 0, mask.width, mask.height);
        m.setTransform(dpr * k, 0, 0, dpr * k, dpr * origin.x, dpr * origin.y);
        m.lineCap = "round";
        m.lineJoin = "round";
        m.lineWidth = 50;
        m.strokeStyle = "#000";
        m.beginPath();
        m.moveTo(drawn[0][0] - 12, drawn[0][1]);
        for (const [x, y] of drawn) m.lineTo(x, y);
        m.stroke();
        m.globalCompositeOperation = "source-in";
        m.drawImage(o.images.radical, 0, 0, LOGO.width, LOGO.height);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask, 0, 0);
        ctx.restore();
      }
    }

    // The wordmark wipes in as the plate widens.
    if (o.images && o.word > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(LOGO.wordmarkLeft - 4, -10, (LOGO.width - LOGO.wordmarkLeft + 8) * o.word, LOGO.height + 20);
      ctx.clip();
      ctx.drawImage(o.images.wordmark, 0, 0, LOGO.width, LOGO.height);
      ctx.restore();
    }

    ctx.restore();
    return { x: origin.x + tip[0] * k, y: origin.y + tip[1] * k };
  }
}
