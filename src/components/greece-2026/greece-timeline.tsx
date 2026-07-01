"use client";

import { greeceTimeline, greeceTheme } from "@/lib/greece-2026";
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

function TimelineNode({
  milestone,
  index,
  isLast,
}: {
  milestone: (typeof greeceTimeline)[number];
  index: number;
  isLast: boolean;
}) {
  const isBookend =
    milestone.status === "start" || milestone.status === "end";

  return (
    <motion.li
      custom={index}
      variants={greeceFadeUp}
      className="relative flex gap-6 sm:gap-8"
    >
      <div className="flex flex-col items-center">
        <div
          className="relative z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2"
          style={{
            borderColor: `rgba(${greeceTheme.accentRgb}, ${isBookend ? 0.9 : 0.55})`,
            backgroundColor: isBookend
              ? `rgba(${greeceTheme.accentRgb}, 0.25)`
              : `rgba(${greeceTheme.aegeanRgb}, 0.2)`,
            boxShadow: isBookend
              ? `0 0 20px rgba(${greeceTheme.accentRgb}, 0.35)`
              : "none",
          }}
        />
        {!isLast && (
          <div
            className="mt-1 w-px flex-1 min-h-[3rem]"
            style={{
              background: `linear-gradient(to bottom, rgba(${greeceTheme.accentRgb}, 0.35), rgba(${greeceTheme.aegeanRgb}, 0.15))`,
            }}
          />
        )}
      </div>

      <motion.article
        whileHover={{ x: 4, transition: { duration: 0.35 } }}
        className="glass-strong group mb-8 flex-1 rounded-2xl border px-6 py-5 transition-all duration-500 sm:px-7 sm:py-6"
        style={{
          borderColor: `rgba(${greeceTheme.accentRgb}, 0.12)`,
        }}
      >
        {milestone.date && (
          <p
            className="text-[11px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: greeceTheme.accent }}
          >
            {milestone.date}
          </p>
        )}
        <h3 className="mt-1.5 text-[1.15rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[1.25rem]">
          {milestone.label}
        </h3>
        <p className="mt-3 text-[14px] leading-[1.7] text-muted">
          {milestone.description}
        </p>
      </motion.article>
    </motion.li>
  );
}

export function GreeceTimeline() {
  return (
    <section id="timeline" className="scroll-mt-32 px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
        >
          <GreeceSectionLabel>Journey</GreeceSectionLabel>
          <GreeceSectionTitle>The month abroad.</GreeceSectionTitle>
          <p className="mt-5 max-w-xl text-[16px] leading-[1.75] text-muted">
            From arrival to final presentations — a chronological record of the
            study abroad experience.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-14 list-none pl-0"
        >
          {greeceTimeline.map((milestone, i) => (
            <TimelineNode
              key={milestone.id}
              milestone={milestone}
              index={i + 1}
              isLast={i === greeceTimeline.length - 1}
            />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
