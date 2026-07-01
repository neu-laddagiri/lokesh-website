"use client";

import {
  greeceGalleryMeta,
  greeceGalleryPhotos,
  greeceTheme,
} from "@/lib/greece-2026";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  GreeceSectionLabel,
  GreeceSectionTitle,
} from "./section-label";
import {
  greeceFadeUp,
  greeceStagger,
  greeceViewport,
} from "./motion-presets";

const PLACEHOLDER_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
] as const;

function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${className ?? ""}`}
      style={{
        borderColor: `rgba(${greeceTheme.accentRgb}, 0.1)`,
        background: `linear-gradient(145deg, rgba(${greeceTheme.aegeanRgb}, 0.12) 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -12deg,
            transparent,
            transparent 24px,
            rgba(${greeceTheme.accentRgb}, 0.04) 24px,
            rgba(${greeceTheme.accentRgb}, 0.04) 25px
          )`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border opacity-40"
          style={{ borderColor: `rgba(${greeceTheme.accentRgb}, 0.35)` }}
        />
      </div>
    </div>
  );
}

export function GreeceGallery() {
  const hasPhotos = greeceGalleryPhotos.length > 0;

  return (
    <section
      id="gallery"
      className="scroll-mt-32 px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <GreeceSectionLabel>Photography</GreeceSectionLabel>
            <GreeceSectionTitle>{greeceGalleryMeta.title}</GreeceSectionTitle>
            <p className="mt-5 text-[16px] leading-[1.75] text-muted">
              {greeceGalleryMeta.subtitle}
            </p>
          </div>
          {!hasPhotos && (
            <p
              className="shrink-0 text-[13px] font-medium tracking-[0.06em] uppercase"
              style={{ color: greeceTheme.accent }}
            >
              {greeceGalleryMeta.comingSoonNote}
            </p>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-12 grid auto-rows-[minmax(140px,1fr)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {hasPhotos
            ? greeceGalleryPhotos.map((photo, i) => (
                <motion.figure
                  key={photo.src}
                  custom={i + 1}
                  variants={greeceFadeUp}
                  className={`group relative overflow-hidden rounded-2xl ${
                    photo.aspect === "portrait"
                      ? "row-span-2"
                      : photo.aspect === "landscape"
                        ? "col-span-2"
                        : ""
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {photo.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-[12px] text-foreground-secondary">
                      {photo.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))
            : Array.from({ length: greeceGalleryMeta.placeholderCount }).map(
                (_, i) => (
                  <motion.div
                    key={`placeholder-${i}`}
                    custom={i + 1}
                    variants={greeceFadeUp}
                    className={`min-h-[140px] ${PLACEHOLDER_LAYOUT[i] ?? ""}`}
                  >
                    <PhotoPlaceholder className="h-full min-h-[140px]" />
                  </motion.div>
                ),
              )}
        </motion.div>
      </div>
    </section>
  );
}
