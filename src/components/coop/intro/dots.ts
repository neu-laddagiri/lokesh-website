import { DOTS } from "@/lib/coop";
import { clamp01, easeInOutCubic, easeOutCubic, lerp, progress, type Timing } from "./timing";

export type DotRole = "pending" | "dimmed" | "invite" | "yes";

/** Position on a unit disc, plus the order it appears in. */
export type Dot = { x: number; y: number; role: DotRole; order: number };

export type FieldLayout = {
  /** Field center and radius in CSS pixels. */
  cx: number;
  cy: number;
  radius: number;
  dotRadius: number;
};

/** Small seeded generator, so the same dots dim and glow on every visit. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let x = Math.imul(state ^ (state >>> 15), state | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One dot per application, packed on a sunflower spiral (the most even way to
 * fill a disc). Exactly DOTS.dimmed of them dim and DOTS.glowing glow; the one
 * yes is a glowing dot partway out, so its walk to the center reads.
 */
export function layoutDots(): Dot[] {
  const { total, dimmed, glowing } = DOTS;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const dots: Dot[] = Array.from({ length: total }, (_, i) => {
    const r = Math.sqrt((i + 0.5) / total);
    return { x: r * Math.cos(i * golden), y: r * Math.sin(i * golden), role: "pending", order: i };
  });

  const random = seeded(20261104);
  const pool = dots.map((_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const invites = pool.slice(0, glowing);
  for (const i of pool.slice(glowing, glowing + dimmed)) dots[i].role = "dimmed";
  for (const i of invites) dots[i].role = "invite";

  let yes = invites[0];
  let best = Infinity;
  for (const i of invites) {
    const distance = Math.abs(Math.hypot(dots[i].x, dots[i].y) - 0.55);
    if (distance < best) {
      best = distance;
      yes = i;
    }
  }
  dots[yes].role = "yes";
  return dots;
}

/** A soft accent-blue halo, drawn once and stamped behind glowing dots. */
export function makeGlowSprite(): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(41,151,255,0.9)");
    gradient.addColorStop(0.35, "rgba(41,151,255,0.35)");
    gradient.addColorStop(1, "rgba(41,151,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return sprite;
}

export type YesDotState = {
  /** Where the surviving dot sits once the field has collapsed. */
  x: number;
  y: number;
  /** 0 to 1: the dot hands over to the map pin. */
  fade: number;
};

/**
 * Draws the whole field for time t. Everything else is a function of the same
 * clock, so a skipped or seeked intro draws exactly the right frame.
 */
export function drawField(
  ctx: CanvasRenderingContext2D,
  dots: readonly Dot[],
  layout: FieldLayout,
  t: number,
  T: Timing,
  glowSprite: HTMLCanvasElement,
  yes: YesDotState,
) {
  const spawned = easeOutCubic(progress(t, T.dots)) * dots.length;
  const dim = easeInOutCubic(progress(t, T.dim));
  const glow = easeInOutCubic(progress(t, T.glow));
  const collapse = easeInOutCubic(progress(t, T.collapse));

  for (const dot of dots) {
    const appear = clamp01((spawned - dot.order) / 4);
    if (appear <= 0) continue;

    let x = layout.cx + dot.x * layout.radius;
    let y = layout.cy + dot.y * layout.radius;
    let alpha = 0.78 * appear;
    let scale = 0.35 + 0.65 * easeOutCubic(appear);
    const glowing = dot.role === "invite" || dot.role === "yes";

    if (dot.role === "dimmed") {
      alpha *= 1 - 0.82 * dim;
      scale *= 1 - 0.18 * dim;
    }
    if (glowing) alpha = lerp(alpha, 1, glow);

    if (dot.role === "yes") {
      x = lerp(x, yes.x, collapse);
      y = lerp(y, yes.y, collapse);
      scale *= 1 + 0.75 * collapse;
      alpha *= 1 - yes.fade;
    } else {
      alpha *= 1 - collapse;
      x = lerp(x, layout.cx, collapse * 0.3);
      y = lerp(y, layout.cy, collapse * 0.3);
    }
    if (alpha <= 0.004) continue;

    const r = layout.dotRadius * scale;
    if (glowing && glow > 0) {
      const halo = r * 7;
      ctx.globalAlpha = glow * alpha * (dot.role === "yes" ? 1 : 0.85);
      ctx.drawImage(glowSprite, x - halo / 2, y - halo / 2, halo, halo);
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = glowing && glow > 0.5 ? "rgb(214,234,255)" : "rgb(245,245,247)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
