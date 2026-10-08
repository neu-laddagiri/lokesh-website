"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type ValueAnimationTransition,
} from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import {
  greeceTheme,
  type GalleryGroupId,
  type ResolvedPhoto,
} from "@/lib/greece-2026";
import { useMounted } from "@/lib/use-mounted";
import { ChevronIcon, GreeceLightbox } from "./greece-lightbox";
import { GREECE_EASE, greeceFadeUp, greeceViewport } from "./motion-presets";
import { GreeceSectionLabel, GreeceSectionTitle } from "./section-label";

type GroupMeta = { id: GalleryGroupId; label: string; blurb: string };

type Props = {
  photos: readonly ResolvedPhoto[];
  groups: readonly GroupMeta[];
};

/** Degrees between neighbouring photos on the ring. */
const STEP_DEG = 26;
/**
 * Ring radius in card widths, chosen so neighbours sit a small gap apart:
 * the chord between two slots, 2r sin(step / 2), comes to 1.08 card widths.
 */
const RADIUS = 1.08 / (2 * Math.sin((STEP_DEG / 2) * (Math.PI / 180)));
/** How long each photo holds the front before the ring turns on its own. */
const DWELL_MS = 5000;
const TURN: ValueAnimationTransition = {
  duration: 0.95,
  ease: [0.65, 0, 0.35, 1] as const,
};

/**
 * Every measurement on the ring is a multiple of the card width, so this one
 * value scales the whole carousel. Height follows from the 9:16 cards and is
 * capped by the viewport in both directions.
 */
const STAGE_STYLE = {
  "--card-w": "min(72vw, calc(clamp(380px, 64vh, 620px) * 0.5625))",
  height: "calc(var(--card-w) * 16 / 9 + 72px)",
  maskImage:
    "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
} as CSSProperties;

/** Signed distance from the front of the ring, wrapped to [-count/2, count/2). */
function wrap(value: number, count: number) {
  return ((((value + count / 2) % count) + count) % count) - count / 2;
}

/**
 * Photos fade out before they reach the back of the ring, where they wrap
 * from one side to the other, so a small set never visibly pops.
 */
function fadeLimits(count: number) {
  const end = Math.min(3.2, count / 2 - 0.05);
  return { start: Math.max(0, Math.min(1.5, end - 0.8)), end };
}

function opacityAt(distance: number, start: number, end: number) {
  if (distance <= start) return 1;
  if (distance >= end) return 0;
  return 1 - (distance - start) / (end - start);
}

/** Places a card on the outside of a cylinder, facing out, `offset` slots from the front. */
function ringTransform(offset: number) {
  const degrees = offset * STEP_DEG;
  const radians = degrees * (Math.PI / 180);
  const x = Math.sin(radians) * RADIUS;
  const z = (Math.cos(radians) - 1) * RADIUS;
  return `translate(-50%, -50%) translate3d(calc(${x.toFixed(4)} * var(--card-w)), 0px, calc(${z.toFixed(4)} * var(--card-w))) rotateY(${degrees.toFixed(3)}deg)`;
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const pageIsVisible = () => document.visibilityState === "visible";
const assumeVisible = () => true;

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

const CONTROL_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground-secondary transition-colors duration-300 hover:bg-card-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2";

type RingCardProps = {
  photo: ResolvedPhoto;
  slot: number;
  count: number;
  position: MotionValue<number>;
  isFront: boolean;
  isHidden: boolean;
  onPress: (isFront: boolean, target: number) => void;
};

/**
 * One photo on the ring. Every visual property derives from the shared
 * position value, so all cards move along the same arc in the same frame and
 * none of this re-renders React while the ring turns.
 */
function RingCard({
  photo,
  slot,
  count,
  position,
  isFront,
  isHidden,
  onPress,
}: RingCardProps) {
  const { start, end } = fadeLimits(count);
  const offset = useTransform(position, (p) => wrap(slot - p, count));
  const transform = useTransform(offset, ringTransform);
  const opacity = useTransform(offset, (o) => opacityAt(Math.abs(o), start, end));
  /** Side cards sink toward the page background, which works in both themes. */
  const shade = useTransform(offset, (o) => Math.min(Math.abs(o) * 0.3, 0.72));
  const zIndex = useTransform(offset, (o) => 100 - Math.round(Math.abs(o) * 10));
  const visibility = useTransform(offset, (o) =>
    Math.abs(o) >= end ? "hidden" : "visible",
  );

  return (
    <motion.button
      type="button"
      data-ring-card
      tabIndex={isFront ? 0 : -1}
      aria-hidden={isHidden || undefined}
      aria-label={
        isFront ? `Open full size: ${photo.caption}` : `Show ${photo.caption}`
      }
      onClick={() => onPress(isFront, Math.round(position.get() + offset.get()))}
      className={`absolute top-1/2 left-1/2 aspect-[9/16] overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_30px_70px_-28px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        isFront ? "cursor-zoom-in" : "cursor-pointer"
      }`}
      style={{ width: "var(--card-w)", transform, opacity, zIndex, visibility }}
    >
      {/* Contain, not cover: these are collages, and cropping cuts panels off. */}
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        draggable={false}
        sizes="(max-width: 640px) 72vw, 350px"
        className="object-contain"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background"
        style={{ opacity: shade }}
      />
    </motion.button>
  );
}

export function GreeceGalleryCarousel({ photos, groups }: Props) {
  const [active, setActive] = useState<GalleryGroupId | "all">("all");
  /** Unbounded, so the ring can keep turning the same way forever. */
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const position = useMotionValue(0);
  const indexRef = useRef(0);
  const turnRef = useRef<AnimationPlaybackControls | null>(null);
  const dragRef = useRef({ start: 0, width: 300, moved: false });
  const stageRef = useRef<HTMLDivElement>(null);

  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const inView = useInView(stageRef, { amount: 0.45 });
  const pageVisible = useSyncExternalStore(
    subscribeToVisibility,
    pageIsVisible,
    assumeVisible,
  );

  const visible =
    active === "all" ? photos : photos.filter((photo) => photo.group === active);
  const count = visible.length;
  const front = ((index % count) + count) % count;
  const current = visible[front];
  const place = groups.find((group) => group.id === current.group)?.label;
  const { end } = fadeLimits(count);

  /** Autoplay waits for hydration, so reduced-motion users never see it start. */
  const canAutoplay = mounted && !reduceMotion && count > 1;
  const running =
    canAutoplay &&
    playing &&
    inView &&
    pageVisible &&
    !dragging &&
    !keyboardFocus &&
    !lightboxOpen;

  const goTo = useCallback(
    (target: number, transition: ValueAnimationTransition = TURN) => {
      indexRef.current = target;
      setIndex(target);
      turnRef.current?.stop();
      turnRef.current = animate(
        position,
        target,
        reduceMotion ? { duration: 0 } : transition,
      );
    },
    [position, reduceMotion],
  );

  const step = useCallback(
    (delta: number) => goTo(indexRef.current + delta),
    [goTo],
  );
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const selectGroup = (id: GalleryGroupId | "all") => {
    turnRef.current?.stop();
    position.jump(0);
    indexRef.current = 0;
    setIndex(0);
    setActive(id);
    setLightboxOpen(false);
  };

  const pressCard = (isFront: boolean, target: number) => {
    if (dragRef.current.moved) return;
    if (isFront) {
      setLightboxOpen(true);
      return;
    }
    const distance = Math.min(Math.abs(target - position.get()), 3);
    goTo(target, { ...TURN, duration: 0.7 + 0.18 * distance });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (lightboxOpen || count < 2) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
    /** If focus was on the front card, keep it there as a new card takes the front. */
    if ((event.target as HTMLElement).hasAttribute("data-ring-card")) {
      window.setTimeout(() => {
        stageRef.current
          ?.querySelector<HTMLElement>('[data-ring-card][tabindex="0"]')
          ?.focus({ preventScroll: true });
      }, 0);
    }
  };

  /** Keyboard focus stops the rotation, as the carousel pattern requires. A mouse click does not. */
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setKeyboardFocus(false);
    }
  };

  return (
    <section id="gallery" className="scroll-mt-32 py-12 lg:py-14">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
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
            {photos.length} sets from the trip. Drag or use the arrows to turn
            it, and click the front photo to open it full size.
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
                  onClick={() => selectGroup(group.id)}
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
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={greeceViewport}
        variants={greeceFadeUp}
        custom={2}
        className="mt-6"
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos from the trip"
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <motion.div
          ref={stageRef}
          className="relative touch-pan-y overflow-hidden select-none"
          style={STAGE_STYLE}
          onPanStart={() => {
            turnRef.current?.stop();
            const card =
              stageRef.current?.querySelector<HTMLElement>("[data-ring-card]");
            dragRef.current = {
              start: position.get(),
              width: card?.offsetWidth || 300,
              moved: true,
            };
            setDragging(true);
          }}
          onPan={(_, info) => {
            position.set(
              dragRef.current.start - info.offset.x / dragRef.current.width,
            );
          }}
          onPanEnd={(_, info) => {
            const { start, width } = dragRef.current;
            const velocity = -info.velocity.x / width;
            const base = Math.round(start);
            const target = Math.max(
              base - 3,
              Math.min(base + 3, Math.round(position.get() + velocity * 0.2)),
            );
            goTo(target, { type: "spring", stiffness: 140, damping: 26, velocity });
            setDragging(false);
            window.setTimeout(() => {
              dragRef.current.moved = false;
            }, 0);
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              width: "calc(var(--card-w) * 2.6)",
              height: "calc(var(--card-w) * 1.5)",
              background: `radial-gradient(closest-side, rgba(${greeceTheme.accentRgb}, 0.28), transparent)`,
            }}
          />

          {/* Perspective sits on the cards' direct parent: 3D does not pass through a fading wrapper. */}
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: GREECE_EASE }}
            className="absolute inset-0"
            style={{ perspective: "calc(var(--card-w) * 5.5)" }}
          >
            {visible.map((photo, slot) => (
              <RingCard
                key={photo.slug}
                photo={photo}
                slot={slot}
                count={count}
                position={position}
                isFront={slot === front}
                isHidden={Math.abs(wrap(slot - index, count)) >= end}
                onPress={pressCard}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className="mx-auto mt-2 flex max-w-xl flex-col items-center px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
            {place}
            <span className="mx-2 opacity-40" aria-hidden>
              ·
            </span>
            <span className="tabular-nums">
              {front + 1} / {count}
            </span>
          </p>

          <div
            className="mt-2 min-h-[3.25rem] w-full"
            aria-live={running ? "off" : "polite"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: GREECE_EASE }}
                className="text-[17px] leading-snug font-medium tracking-[-0.015em] text-foreground"
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className={CONTROL_CLASS}
              >
                <ChevronIcon dir="left" />
              </button>

              {canAutoplay && (
                <div className="flex items-center gap-2.5 px-1">
                  {/* The bar is the autoplay timer: the ring turns when it fills. */}
                  <span className="relative block h-[3px] w-24 overflow-hidden rounded-full bg-border">
                    <span
                      key={`${active}-${index}`}
                      className="absolute inset-0 origin-left rounded-full"
                      style={{
                        backgroundColor: greeceTheme.accent,
                        animationName: "greece-carousel-progress",
                        animationDuration: `${DWELL_MS}ms`,
                        animationTimingFunction: "linear",
                        animationFillMode: "forwards",
                        animationPlayState: running ? "running" : "paused",
                      }}
                      onAnimationEnd={() => step(1)}
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => setPlaying((value) => !value)}
                    aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className={CONTROL_CLASS}
              >
                <ChevronIcon dir="right" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <GreeceLightbox
        photos={visible}
        index={lightboxOpen ? front : null}
        onClose={closeLightbox}
        onStep={step}
      />
    </section>
  );
}
