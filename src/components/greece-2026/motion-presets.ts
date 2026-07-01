export const GREECE_EASE = [0.25, 0.4, 0.25, 1] as const;

export const greeceFadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.07, ease: GREECE_EASE },
  }),
};

export const greeceStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

export const greeceViewport = { once: true, margin: "-90px" as const };
