"use client";

import { motion } from "framer-motion";
import { greecePlaces, greeceTheme } from "@/lib/greece-2026";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";
import { greeceFadeUp, greeceStagger, greeceViewport } from "./motion-presets";

const REGION_ORDER = ["Athens", "Santorini", "Crete", "Italy"] as const;

export function GreecePlaces() {
  return (
    <section id="places" className="scroll-mt-32 px-6 py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
        >
          <GreeceSectionLabel>Places</GreeceSectionLabel>
          <GreeceSectionTitle>Where the time actually went.</GreeceSectionTitle>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {greecePlaces.map((place, i) => (
            <motion.div
              key={place.id}
              custom={i}
              variants={greeceFadeUp}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] leading-tight font-semibold tracking-[-0.02em] text-foreground">
                  {place.name}
                </h3>
                <span
                  className="shrink-0 text-[10.5px] font-semibold tracking-[0.1em] uppercase"
                  style={{
                    color:
                      REGION_ORDER.indexOf(
                        place.region as (typeof REGION_ORDER)[number],
                      ) === 0
                        ? greeceTheme.accent
                        : "var(--muted)",
                  }}
                >
                  {place.region}
                </span>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">
                {place.note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
