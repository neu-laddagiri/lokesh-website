"use client";

import { greeceHero, greeceTheme } from "@/lib/greece-2026";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GREECE_EASE, greeceFadeUp } from "./motion-presets";

export function GreeceHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.65], [1, 0.96]);
  const y = useTransform(scrollYProgress, [0, 0.65], [0, 48]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-28 pb-24 lg:px-8"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${greeceTheme.aegeanRgb}, 0.35) 0%, transparent 55%),
              radial-gradient(ellipse 50% 40% at 85% 70%, rgba(${greeceTheme.accentRgb}, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse 40% 35% at 10% 80%, rgba(${greeceTheme.aegeanRgb}, 0.15) 0%, transparent 45%),
              linear-gradient(180deg, #05080c 0%, #0a1018 45%, #000000 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to top, var(--background) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-[18%] right-[8%] h-[min(42vw,380px)] w-[min(42vw,380px)] rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(${greeceTheme.accentRgb}, 0.5) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-[22%] left-[6%] h-[min(36vw,320px)] w-[min(36vw,320px)] rounded-full opacity-25 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(${greeceTheme.aegeanRgb}, 0.55) 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={greeceFadeUp}
          className="text-[13px] font-medium tracking-[0.28em] text-muted uppercase"
        >
          {greeceHero.subtitle}
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={greeceFadeUp}
          className="mt-6 text-[clamp(3.5rem,11vw,7rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-foreground"
        >
          {greeceHero.title}
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={greeceFadeUp}
          className="mx-auto mt-8 h-px w-16"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${greeceTheme.accentRgb}, 0.8), transparent)`,
          }}
          aria-hidden
        />

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={greeceFadeUp}
          className="mx-auto mt-10 max-w-2xl text-[clamp(1rem,2.2vw,1.2rem)] leading-[1.85] text-muted"
        >
          {greeceHero.description}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: GREECE_EASE }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.22em] text-muted uppercase">
            Explore
          </span>
          <div
            className="h-10 w-px"
            style={{
              background: `linear-gradient(to bottom, rgba(${greeceTheme.accentRgb}, 0.5), transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
