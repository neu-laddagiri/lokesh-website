"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { greeceTheme, type GalleryGroupId } from "@/lib/greece-2026";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";
import { greeceFadeUp, greeceStagger, greeceViewport } from "./motion-presets";

export type ResolvedPhoto = {
  slug: string;
  group: GalleryGroupId;
  alt: string;
  caption: string;
  wide: boolean;
  src: string;
};

type GroupMeta = { id: GalleryGroupId; label: string; blurb: string };

type Props = {
  photos: readonly ResolvedPhoto[];
  groups: readonly GroupMeta[];
};

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export function GreeceGalleryGrid({ photos, groups }: Props) {
  const [active, setActive] = useState<GalleryGroupId | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible =
    active === "all" ? photos : photos.filter((photo) => photo.group === active);

  const step = useCallback(
    (delta: number) => {
      setLightbox((current) => {
        if (current === null) return current;
        const next = (current + delta + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, step]);

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <section id="gallery" className="scroll-mt-32 px-6 py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceFadeUp}
          custom={0}
        >
          <GreeceSectionLabel>Photography</GreeceSectionLabel>
          <GreeceSectionTitle>Five weeks, in pictures.</GreeceSectionTitle>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-muted">
            {photos.length} sets from the trip. Click any of them to open it
            full size.
          </p>
        </motion.div>

        {groups.length > 1 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={greeceViewport}
            variants={greeceFadeUp}
            custom={1}
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter photos by place"
          >
            {[{ id: "all" as const, label: "All" }, ...groups].map((group) => {
              const isActive = active === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setActive(group.id);
                    setLightbox(null);
                  }}
                  aria-pressed={isActive}
                  className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-300"
                  style={
                    isActive
                      ? {
                          borderColor: `rgba(${greeceTheme.accentRgb}, 0.55)`,
                          backgroundColor: `rgba(${greeceTheme.accentRgb}, 0.14)`,
                          color: greeceTheme.accent,
                        }
                      : {
                          borderColor: "var(--border)",
                          color: "var(--muted)",
                        }
                  }
                >
                  {group.label}
                </button>
              );
            })}
          </motion.div>
        )}

        <motion.div
          key={active}
          initial="hidden"
          whileInView="visible"
          viewport={greeceViewport}
          variants={greeceStagger}
          className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {visible.map((photo, i) => (
            <motion.button
              key={photo.slug}
              type="button"
              custom={i}
              variants={greeceFadeUp}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 ${
                photo.wide ? "col-span-2" : ""
              }`}
              style={{ aspectRatio: photo.wide ? "16 / 11" : "3 / 4" }}
              aria-label={`Open ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={photo.wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3.5 pt-8 pb-3 text-left text-[12px] leading-snug font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {photo.caption}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <CloseIcon />
            </button>

            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronIcon dir="left" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronIcon dir="right" />
                </button>
              </>
            )}

            <motion.div
              key={current.slug}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[82vh] w-full max-w-4xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={1200}
                height={1800}
                sizes="(max-width: 1024px) 92vw, 900px"
                className="h-auto max-h-[82vh] w-auto rounded-xl object-contain"
                priority
              />
            </motion.div>

            <div className="mt-4 max-w-xl text-center">
              <p className="text-[14px] font-medium text-white">
                {current.caption}
              </p>
              <p className="mt-1 text-[12px] text-white/50">
                {lightbox! + 1} of {visible.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
