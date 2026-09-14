"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, staggerContainer, viewport } from "@/components/home/motion";
import { ArrowIcon } from "@/components/home/section";

/** Greek flag blue. Nine stripes, white cross on a blue canton. */
const GREEK_BLUE = "#0d5eaf";
const GREEK_BLUE_RGB = "13, 94, 175";

/** Nine equal bands across the full height of the card, blue first and last. */
const STRIPE_BACKGROUND =
  "repeating-linear-gradient(180deg, var(--greek-stripe) 0%, var(--greek-stripe) 11.111%, transparent 11.111%, transparent 22.222%)";

function GreekFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 27 18"
      className={className}
      role="img"
      aria-label="Flag of Greece"
    >
      <rect width="27" height="18" fill="#ffffff" />
      {[0, 2, 4, 6, 8].map((y) => (
        <rect key={y} y={y * 2} width="27" height="2" fill={GREEK_BLUE} />
      ))}
      <rect width="10" height="10" fill={GREEK_BLUE} />
      <rect x="4" width="2" height="10" fill="#ffffff" />
      <rect y="4" width="10" height="2" fill="#ffffff" />
    </svg>
  );
}

/**
 * The canton: a square covering the top five stripes, drawn as four quadrants
 * so the cross between them reads as the white arms of the flag.
 */
function GreekCanton() {
  return (
    <svg
      viewBox="0 0 10 10"
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-0 left-0 aspect-square h-[55.5%]"
      aria-hidden
    >
      {[
        [0, 0],
        [6, 0],
        [0, 6],
        [6, 6],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="4"
          height="4"
          style={{ fill: "var(--greek-canton)" }}
        />
      ))}
    </svg>
  );
}

const facts = [
  { label: "Campus", value: "Deree, American College of Greece" },
  { label: "Dates", value: "May 16 to June 19, 2026" },
  { label: "Courses", value: "3 (2 on campus, 1 remote)" },
  { label: "GPA abroad", value: "4.0" },
] as const;

export function GreecePreview() {
  return (
    <section id="greece-2026" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="relative overflow-hidden rounded-[2rem] p-9 sm:p-12 lg:p-14"
          style={{
            border: `1px solid rgba(${GREEK_BLUE_RGB}, 0.28)`,
            boxShadow: `0 24px 80px rgba(${GREEK_BLUE_RGB}, 0.12)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: STRIPE_BACKGROUND }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 85% 10%, rgba(${GREEK_BLUE_RGB}, 0.22) 0%, transparent 60%)`,
            }}
            aria-hidden
          />
          <GreekCanton />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <motion.div
                custom={0}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <GreekFlag className="h-[22px] w-[33px] shrink-0 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10" />
                <p
                  className="text-[12px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: GREEK_BLUE }}
                >
                  Greece 2026
                </p>
              </motion.div>

              <motion.h2
                custom={1}
                variants={fadeUp}
                className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.04em] text-foreground"
              >
                A month in Athens,
                <br />
                <span className="text-muted">documented.</span>
              </motion.h2>

              <motion.p
                custom={2}
                variants={fadeUp}
                className="mt-5 max-w-lg text-[16px] leading-[1.7] text-muted"
              >
                Two courses on campus at Deree in Agia Paraskevi, plus Business
                Statistics run remotely from Athens at the same time. Finished
                the term at a 4.0. The archive covers the coursework, the city,
                and the flights that got me there.
              </motion.p>

              <motion.div custom={3} variants={fadeUp}>
                <Link
                  href="/greece-2026"
                  className="group/link mt-9 inline-flex h-[50px] items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-[-0.02em] text-white transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    backgroundColor: GREEK_BLUE,
                    boxShadow: `0 0 40px rgba(${GREEK_BLUE_RGB}, 0.35)`,
                  }}
                >
                  Explore Greece 2026
                  <ArrowIcon />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {facts.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  custom={i + 1}
                  variants={fadeUp}
                  className="rounded-2xl px-5 py-5 backdrop-blur-xl"
                  style={{
                    border: `1px solid rgba(${GREEK_BLUE_RGB}, 0.25)`,
                    backgroundColor: `rgba(${GREEK_BLUE_RGB}, 0.07)`,
                  }}
                >
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-[14px] leading-snug font-semibold tracking-[-0.02em] text-foreground">
                    {fact.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
