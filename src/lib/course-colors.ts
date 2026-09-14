/**
 * One colour per course, and one place that decides it.
 *
 * Previously each course page declared its own ACCENT and the archive card
 * declared another, so five courses were two different colours depending on
 * where you looked. Northeastern red was doing duty for three separate courses
 * and there were five near-identical blues.
 *
 * The 14 hues below are spaced around the wheel at roughly matched chroma and
 * lightness, so they read as one family, and they are ordered warm to cool so
 * neighbouring subjects sit near each other: maths and economics warm, the
 * accounting pair green and ochre, computing and data through teal to cyan,
 * finance and global studies blue, then the honours, Greece, writing and
 * marketing courses through indigo to pink. `light` is the tint used for text
 * and icons, which needs more lift than the base on a dark background.
 *
 * Tailwind arbitrary colour utilities (border-[#...]) cannot read these at
 * runtime, so a handful of hover and border classes on the course pages repeat
 * the hex literally. If you change an accent here, grep the page for the old
 * value.
 */
export type CourseColor = {
  accent: string;
  light: string;
  /** Same colour as `accent`, for rgba() interpolation in glows and tints. */
  rgb: string;
};

export const courseColors = {
  /** Calculus for Business. Northeastern red, and the only course that keeps it. */
  math1231: { accent: "#C8102E", light: "#E8324A", rgb: "200, 16, 46" },
  /** Principles of Macroeconomics. */
  econ1115: { accent: "#E2711D", light: "#F59A4E", rgb: "226, 113, 29" },
  /** Profit Analysis for Managers, taken at Deree as AF 3116. */
  af3116: { accent: "#C08A1E", light: "#E0AC46", rgb: "192, 138, 30" },
  /** Financial Accounting and Reporting. */
  acct1201: { accent: "#2E9E5B", light: "#4FC57F", rgb: "46, 158, 91" },
  /** Discrete Structures. */
  cs1800: { accent: "#17A398", light: "#45C9BE", rgb: "23, 163, 152" },
  /** Intermediate Programming with Data. */
  ds2500: { accent: "#0E9FD8", light: "#46BFF0", rgb: "14, 159, 216" },
  /** Business Statistics. */
  mgsc2301: { accent: "#1B698F", light: "#2D8AB8", rgb: "27, 105, 143" },
  /** Financial Management. */
  fina2201: { accent: "#2563EB", light: "#60A5FA", rgb: "37, 99, 235" },
  /** Global Learning Experience. */
  gbst1012: { accent: "#183A63", light: "#2A5A8F", rgb: "24, 58, 99" },
  /** Honors Discovery. */
  honr1102: { accent: "#4C51BF", light: "#7C81E8", rgb: "76, 81, 191" },
  /** Project Management, taken at Deree as MG 4057. */
  mg4057: { accent: "#8045DA", light: "#A67EEF", rgb: "128, 69, 218" },
  /** First-Year Writing. */
  engw1111: { accent: "#B8489E", light: "#D871BE", rgb: "184, 72, 158" },
  /** Marketing. */
  mktg2201: { accent: "#E0457B", light: "#F0769F", rgb: "224, 69, 123" },
  /** First Year Seminar. Graphite, for the developer-tooling course. */
  cs1200: { accent: "#64748B", light: "#94A3B8", rgb: "100, 116, 139" },
} as const satisfies Record<string, CourseColor>;

export type CourseSlug = keyof typeof courseColors;

export function courseAccent(slug: CourseSlug): string {
  return courseColors[slug].accent;
}
