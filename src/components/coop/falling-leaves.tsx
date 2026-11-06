"use client";

import { useEffect, useRef } from "react";

/**
 * Autumn leaves drifting down behind the co-op panels, in the colors of the
 * jack-o'-lantern video. Each leaf tumbles (a squash on one axis reads as a
 * flip), sways, and rides a slow, gusting wind; far leaves are smaller,
 * slower, softer, and dimmer. Drawn on one canvas from pre-rendered sprites.
 */

const COLORS = ["#c2410c", "#ea580c", "#d97706", "#b45309", "#9a3412", "#a16207", "#dc2626", "#7c2d12"];
const SPRITE = 72;

type Shape = (ctx: CanvasRenderingContext2D) => void;

/** A five-lobed maple leaf, stem down, in a 100 by 100 box. */
const maple: Shape = (ctx) => {
  ctx.beginPath();
  const cx = 50;
  const cy = 54;
  for (let k = 0; k <= 160; k++) {
    const a = (k / 160) * Math.PI * 2;
    // Five lobes, the top one longest, small teeth along the edge, a notch at the stem.
    const lobes = Math.abs(Math.cos((5 / 2) * (a + Math.PI / 2)));
    const top = 0.18 * Math.max(0, -Math.sin(a));
    const notch = Math.max(0, Math.sin(a)) ** 6 * 0.35;
    const r = 44 * (0.42 + 0.5 * lobes ** 0.7 + top - notch) + 2.2 * Math.sin(a * 22);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.95;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
};

/** An oak leaf: long, with rounded lobes down both sides. */
const oak: Shape = (ctx) => {
  ctx.beginPath();
  const n = 60;
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const s = k / n;
    const y = 8 + s * 82;
    const w = 26 * Math.sin(Math.PI * Math.min(1, s * 1.08)) ** 0.8 * (0.72 + 0.28 * Math.cos(Math.PI * 2 * 4.5 * s));
    left.push([50 - w, y]);
    right.push([50 + w, y]);
  }
  ctx.moveTo(50, 6);
  for (const [x, y] of right) ctx.lineTo(x, y);
  for (const [x, y] of left.reverse()) ctx.lineTo(x, y);
  ctx.closePath();
};

/** A birch leaf: an oval with a pointed tip and a fine serrated edge. */
const birch: Shape = (ctx) => {
  ctx.beginPath();
  for (let k = 0; k <= 120; k++) {
    const a = (k / 120) * Math.PI * 2;
    const tip = 1 + 0.35 * Math.max(0, -Math.sin(a)) ** 3;
    const r = (1 + 0.035 * Math.sin(a * 26)) * tip;
    const x = 50 + Math.cos(a) * 26 * r;
    const y = 54 + Math.sin(a) * 38 * r;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
};

const SHAPES = [maple, maple, oak, birch];

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amount * 255)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
}

function makeSprite(shape: Shape, color: string, blur: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE;
  canvas.height = SPRITE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(SPRITE / 100, SPRITE / 100);
  if (blur > 0) ctx.filter = `blur(${blur}px)`;
  const fill = ctx.createLinearGradient(20, 10, 80, 95);
  fill.addColorStop(0, shade(color, 0.12));
  fill.addColorStop(1, shade(color, -0.12));
  shape(ctx);
  ctx.fillStyle = fill;
  ctx.fill();
  // Midrib, a few veins, and the stem.
  ctx.strokeStyle = shade(color, -0.22);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(50, 96);
  ctx.lineTo(50, 18);
  for (const y of [36, 52, 68]) {
    ctx.moveTo(50, y + 8);
    ctx.lineTo(34, y - 4);
    ctx.moveTo(50, y + 8);
    ctx.lineTo(66, y - 4);
  }
  ctx.stroke();
  return canvas;
}

type Leaf = {
  x: number;
  y: number;
  z: number;
  size: number;
  sprite: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  swayFreq: number;
  phase: number;
};

export function FallingLeaves({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sprites: { sharp: HTMLCanvasElement; soft: HTMLCanvasElement }[] = [];
    for (const color of COLORS) {
      for (const shape of SHAPES) sprites.push({ sharp: makeSprite(shape, color, 0), soft: makeSprite(shape, color, 2.2) });
    }

    let width = 0;
    let height = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const random = (a: number, b: number) => a + Math.random() * (b - a);
    const spawn = (leaf: Partial<Leaf>, anywhere: boolean): Leaf => {
      const z = Math.random() ** 1.4;
      return {
        x: random(-40, width + 40),
        y: anywhere ? random(-height * 0.9, height * 0.95) : random(-120, -30),
        z,
        size: (14 + 26 * z) * (width < 640 ? 0.85 : 1),
        sprite: Math.floor(Math.random() * sprites.length),
        rot: random(0, Math.PI * 2),
        spin: random(-1.4, 1.4),
        flip: random(0, Math.PI * 2),
        flipSpeed: random(1.2, 3.2),
        sway: random(14, 46),
        swayFreq: random(0.35, 0.9),
        phase: random(0, Math.PI * 2),
        ...leaf,
      };
    };
    const count = Math.round(Math.min(40, Math.max(14, (width * height) / 36000)));
    const leaves = Array.from({ length: count }, () => spawn({}, true)).sort((a, b) => a.z - b.z);

    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let fadeIn = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pausedRef.current || document.hidden) return;
      clock += dt;
      fadeIn = Math.min(1, fadeIn + dt / 0.9);
      // A slow wind with gusts, felt more by near leaves.
      const wind = 16 * Math.sin(clock * 0.21) + 10 * Math.sin(clock * 0.57 + 1.3) + 7 * Math.sin(clock * 1.31 + 0.4);
      ctx.clearRect(0, 0, width, height);
      for (const leaf of leaves) {
        const speed = 24 + 46 * leaf.z;
        leaf.y += speed * dt;
        leaf.x += (wind * (0.35 + 0.65 * leaf.z) + Math.cos(clock * leaf.swayFreq * Math.PI * 2 + leaf.phase) * leaf.sway * leaf.swayFreq) * dt;
        leaf.rot += leaf.spin * dt;
        leaf.flip += leaf.flipSpeed * dt;
        if (leaf.y > height + 50 || leaf.x < -80 || leaf.x > width + 80) Object.assign(leaf, spawn({ z: leaf.z, size: leaf.size }, false));
        const sprite = sprites[leaf.sprite];
        ctx.save();
        ctx.globalAlpha = fadeIn * (0.42 + 0.5 * leaf.z);
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.scale(1, 0.18 + 0.82 * Math.abs(Math.cos(leaf.flip)));
        ctx.drawImage(leaf.z < 0.35 ? sprite.soft : sprite.sharp, -leaf.size / 2, -leaf.size / 2, leaf.size, leaf.size);
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
