"use client";

import { motion } from "framer-motion";
import { greeceTheme, greeceTimeline } from "@/lib/greece-2026";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";
import { greeceFadeUp, greeceStagger, greeceViewport } from "./motion-presets";

export function GreeceTimeline() {
  return (
    <section id="timeline" className="scroll-mt-32 px-6 py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
        >
          <GreeceSectionLabel>Timeline</GreeceSectionLabel>
          <GreeceSectionTitle>How the five weeks ran.</GreeceSectionTitle>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="relative mt-6 space-y-0 border-l pl-6"
          style={{ borderColor: `rgba(${greeceTheme.accentRgb}, 0.28)` }}
        >
          {greeceTimeline.map((item, i) => (
            <motion.li
              key={item.id}
              custom={i}
              variants={greeceFadeUp}
              className="relative pb-6 last:pb-0"
            >
              <span
                className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ring-4"
                style={{
                  backgroundColor: greeceTheme.accent,
                  // Punches a hole in the rail so the dot reads as a station.
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ["--tw-ring-color" as any]: "var(--background)",
                }}
                aria-hidden
              />
              <p
                className="text-[11px] font-semibold tracking-[0.12em] uppercase"
                style={{ color: greeceTheme.accent }}
              >
                {item.date}
              </p>
              <h3 className="mt-1 text-[16px] leading-tight font-semibold tracking-[-0.02em] text-foreground">
                {item.label}
              </h3>
              <p className="mt-1.5 max-w-2xl text-[14px] leading-[1.6] text-muted">
                {item.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
