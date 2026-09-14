"use client";

import { motion } from "framer-motion";
import { greeceHero, greeceStats, greeceTheme } from "@/lib/greece-2026";
import { greeceFadeUp, greeceStagger } from "./motion-presets";

const BLUE = greeceTheme.accent;
const BLUE_RGB = greeceTheme.accentRgb;

/** Nine equal bands, blue first and last, matching the flag. */
const STRIPES =
  "repeating-linear-gradient(180deg, var(--greek-stripe) 0%, var(--greek-stripe) 11.111%, transparent 11.111%, transparent 22.222%)";

function GreekFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 18" className={className} role="img" aria-label="Flag of Greece">
      <rect width="27" height="18" fill="#ffffff" />
      {[0, 2, 4, 6, 8].map((y) => (
        <rect key={y} y={y * 2} width="27" height="2" fill={BLUE} />
      ))}
      <rect width="10" height="10" fill={BLUE} />
      <rect x="4" width="2" height="10" fill="#ffffff" />
      <rect y="4" width="10" height="2" fill="#ffffff" />
    </svg>
  );
}

export function GreeceHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-10 lg:px-8 lg:pt-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: STRIPES, opacity: 0.55 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 80% 0%, rgba(${BLUE_RGB}, 0.2) 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={greeceStagger}
        className="relative mx-auto max-w-6xl"
      >
        <motion.div custom={0} variants={greeceFadeUp} className="flex items-center gap-3">
          <GreekFlag className="h-[22px] w-[33px] shrink-0 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10" />
          <p
            className="text-[12px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: BLUE }}
          >
            {greeceHero.eyebrow}
          </p>
        </motion.div>

        <motion.h1
          custom={1}
          variants={greeceFadeUp}
          className="mt-4 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-foreground"
        >
          {greeceHero.title}
        </motion.h1>

        <motion.p
          custom={2}
          variants={greeceFadeUp}
          className="mt-3 text-[clamp(1.0625rem,2.3vw,1.375rem)] leading-[1.3] font-medium tracking-[-0.025em] text-foreground-secondary"
        >
          {greeceHero.subtitle}
        </motion.p>

        <motion.p
          custom={3}
          variants={greeceFadeUp}
          className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-muted"
        >
          {greeceHero.description}
        </motion.p>

        <motion.dl
          custom={4}
          variants={greeceFadeUp}
          className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {greeceStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border px-4 py-3.5 backdrop-blur-xl"
              style={{
                borderColor: `rgba(${BLUE_RGB}, 0.25)`,
                backgroundColor: `rgba(${BLUE_RGB}, 0.07)`,
              }}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-[clamp(1.375rem,2.6vw,1.75rem)] font-semibold tracking-[-0.03em] text-foreground">
                  {stat.value}
                </span>
                <span className="mt-0.5 block text-[10.5px] font-medium tracking-[0.1em] text-muted uppercase">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
