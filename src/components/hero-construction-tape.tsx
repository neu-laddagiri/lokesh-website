"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type TapeConfig = {
  id: string;
  rotate: number;
  top: string;
  left: string;
  width: string;
  height: number;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
  glow?: boolean;
  parallax: number;
};

const tapes: TapeConfig[] = [
  {
    id: "tape-1",
    rotate: -28,
    top: "20%",
    left: "-20%",
    width: "160%",
    height: 76,
    opacity: 0.3,
    blur: 0.5,
    duration: 14,
    delay: 0,
    glow: true,
    parallax: 14,
  },
  {
    id: "tape-2",
    rotate: -32,
    top: "50%",
    left: "-15%",
    width: "155%",
    height: 84,
    opacity: 0.32,
    blur: 0,
    duration: 11,
    delay: 0.6,
    glow: true,
    parallax: 22,
  },
  {
    id: "tape-3",
    rotate: -26,
    top: "76%",
    left: "-22%",
    width: "158%",
    height: 72,
    opacity: 0.28,
    blur: 1,
    duration: 13,
    delay: 1.2,
    parallax: 10,
  },
];

type HeroConstructionTapeProps = {
  scrollYProgress: MotionValue<number>;
};

function ConstructionTapeStrip({
  tape,
  scrollYProgress,
}: {
  tape: TapeConfig;
  scrollYProgress: MotionValue<number>;
}) {
  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [0, tape.parallax],
  );

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        top: tape.top,
        left: tape.left,
        width: tape.width,
        height: tape.height,
        rotate: tape.rotate,
        opacity: tape.opacity,
        filter: tape.blur ? `blur(${tape.blur}px)` : undefined,
        y: yOffset,
      }}
      aria-hidden
    >
      <div
        className={`construction-tape relative h-full w-full overflow-hidden rounded-[4px] backdrop-blur-[2px] ${
          tape.glow ? "construction-tape-glow" : ""
        }`}
      >
        <div
          className="construction-tape-texture absolute inset-0"
          style={{
            animationDuration: `${tape.duration}s`,
            animationDelay: `${tape.delay}s`,
          }}
        />
        <div className="construction-tape-edge absolute inset-0" />
        <div className="construction-tape-frost absolute inset-0" />
      </div>
    </motion.div>
  );
}

export function HeroConstructionTape({
  scrollYProgress,
}: HeroConstructionTapeProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
      aria-hidden
    >
      {tapes.map((tape) => (
        <ConstructionTapeStrip
          key={tape.id}
          tape={tape}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export function HeroDevelopmentLabel() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="mb-3 text-[9px] font-medium tracking-[0.32em] text-[#facc15]/55 uppercase sm:mb-4 sm:text-[10px]"
    >
      Under Active Development
    </motion.p>
  );
}
