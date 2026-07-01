"use client";

import { greeceReflections, greeceTheme } from "@/lib/greece-2026";
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

function ReflectionBlock({
  reflection,
  index,
}: {
  reflection: (typeof greeceReflections)[number];
  index: number;
}) {
  return (
    <motion.blockquote
      custom={index}
      variants={greeceFadeUp}
      className="relative rounded-[1.5rem] border px-8 py-10 sm:px-10 sm:py-12"
      style={{
        borderColor: `rgba(${greeceTheme.accentRgb}, 0.12)`,
        background: `linear-gradient(135deg, rgba(${greeceTheme.aegeanRgb}, 0.06) 0%, transparent 60%)`,
      }}
    >
      <span
        className="absolute top-6 left-8 text-5xl leading-none font-serif text-muted/20"
        aria-hidden
      >
        &ldquo;
      </span>
      <p className="relative text-[17px] leading-[1.85] text-foreground-secondary italic">
        {reflection.placeholder}
      </p>
    </motion.blockquote>
  );
}

export function GreeceReflections() {
  return (
    <section
      id="reflections"
      className="scroll-mt-32 px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
          className="text-center"
        >
          <GreeceSectionLabel>Writing</GreeceSectionLabel>
          <GreeceSectionTitle>Reflections</GreeceSectionTitle>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.75] text-muted">
            Personal essays and observations — to be written as the experience
            takes shape.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-14 space-y-5"
        >
          {greeceReflections.map((reflection, i) => (
            <ReflectionBlock
              key={reflection.id}
              reflection={reflection}
              index={i + 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
