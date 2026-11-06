import { greeceTheme } from "@/lib/greece-2026";

/**
 * The flag of Greece (public domain) on its official 27 by 18 grid: nine
 * horizontal stripes, blue on the odd ones, and a blue canton five stripes tall
 * with a white cross one stripe wide. The Greece 2026 hero draws it whole; the
 * co-op intro animates the same stripes one by one.
 */
export const GREEK_FLAG = {
  width: 27,
  height: 18,
  stripes: 9,
  stripeHeight: 2,
  canton: 10,
  blue: greeceTheme.accent,
  white: "#ffffff",
} as const;

/** Stripe i, top to bottom: blue on even indexes, white on odd. */
export function stripeColor(i: number): string {
  return i % 2 === 0 ? GREEK_FLAG.blue : GREEK_FLAG.white;
}

export function GreekFlag({ className }: { className?: string }) {
  const { width, height, stripes, stripeHeight, canton, blue, white } = GREEK_FLAG;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Flag of Greece"
    >
      <rect width={width} height={height} fill={white} />
      {Array.from({ length: stripes }, (_, i) => i)
        .filter((i) => i % 2 === 0)
        .map((i) => (
          <rect key={i} y={i * stripeHeight} width={width} height={stripeHeight} fill={blue} />
        ))}
      <rect width={canton} height={canton} fill={blue} />
      <rect x={(canton - stripeHeight) / 2} width={stripeHeight} height={canton} fill={white} />
      <rect y={(canton - stripeHeight) / 2} width={canton} height={stripeHeight} fill={white} />
    </svg>
  );
}
