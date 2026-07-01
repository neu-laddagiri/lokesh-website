"use client";

import { greecePlaces, greeceTheme } from "@/lib/greece-2026";
import { motion } from "framer-motion";
import {
  GreeceSectionLabel,
  GreeceSectionTitle,
} from "./section-label";
import {
  greeceFadeUp,
  greeceStagger,
  greeceViewport,
} from "./motion-presets";

function PlaceCard({
  place,
  index,
}: {
  place: (typeof greecePlaces)[number];
  index: number;
}) {
  return (
    <motion.article
      custom={index}
      variants={greeceFadeUp}
      whileHover={{ y: -5, transition: { duration: 0.35 } }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border transition-all duration-500"
      style={{
        borderColor: `rgba(${greeceTheme.accentRgb}, 0.12)`,
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
        style={{
          background: `linear-gradient(180deg, rgba(${greeceTheme.aegeanRgb}, 0.35) 0%, rgba(5,8,12,0.95) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 100%, rgba(${greeceTheme.accentRgb}, 0.2) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
          {place.region}
        </p>
        <h3 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-foreground">
          {place.name}
        </h3>
        <p className="mt-3 text-[12px] text-muted">Photo coming soon</p>
      </div>
    </motion.article>
  );
}

export function GreecePlaces() {
  return (
    <section
      id="places"
      className="scroll-mt-32 border-t border-white/[0.04] px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
          className="max-w-2xl"
        >
          <GreeceSectionLabel>Exploration</GreeceSectionLabel>
          <GreeceSectionTitle>Places Explored</GreeceSectionTitle>
          <p className="mt-5 text-[16px] leading-[1.75] text-muted">
            Landmarks and neighborhoods across Athens — documented as the
            experience unfolds.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5"
        >
          {greecePlaces.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i + 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
