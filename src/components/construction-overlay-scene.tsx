"use client";

import { motion, useMotionValue, type MotionValue } from "framer-motion";
import {
  HeroConstructionTape,
  HeroDevelopmentLabel,
} from "./hero-construction-tape";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

type ConstructionOverlaySceneProps = {
  scrollYProgress?: MotionValue<number>;
};

export function ConstructionOverlayScene({
  scrollYProgress: scrollYProgressProp,
}: ConstructionOverlaySceneProps) {
  const fallbackProgress = useMotionValue(0);
  const scrollYProgress = scrollYProgressProp ?? fallbackProgress;

  return (
    <div className="relative flex h-full min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-32 text-center">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="animate-gradient-shift absolute top-[-20%] left-1/2 h-[70vh] w-[90vw] max-w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.18)_0%,transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="animate-gradient-shift-alt absolute right-[-10%] bottom-[-10%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.12)_0%,transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="animate-gradient-shift absolute top-[30%] left-[-15%] h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-fade" />
      </div>

      <motion.div className="relative z-10 mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8 text-[13px] font-medium tracking-[0.25em] text-muted uppercase"
        >
          Personal Website
        </motion.p>

        <HeroDevelopmentLabel />
      </motion.div>

      <HeroConstructionTape scrollYProgress={scrollYProgress} />
    </div>
  );
}
