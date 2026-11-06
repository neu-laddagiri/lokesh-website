/**
 * The Verisk logo, from the official file (public/coop/verisk/logo.png, 1006
 * by 301, transparent). Its mark is the Greek flag's nine equal stripes, blue
 * on the even ones, clipped to a circle, with a light-blue radical laid over
 * the left side. The intro builds the mark from the flag's stripes and then
 * hands over to these exact pixels; the card shows the same plate.
 */

export const LOGO = {
  width: 1006,
  height: 301,
  src: "/coop/verisk/logo.png",
  /** The same file split by color, so the intro can draw the mark in stages. */
  layers: {
    bands: "/coop/verisk/logo-bands.png",
    radical: "/coop/verisk/logo-radical.png",
    wordmark: "/coop/verisk/logo-wordmark.png",
  },
  /** The mark: nine stripes of 300 / 9 px clipped to this circle (measured from the file). */
  mark: { cx: 156, cy: 150, r: 150, stripes: 9, size: 300 },
  /** Where the flag's stripe field sits before it rounds into the mark: 1.5 times as wide as tall, like the flag. */
  flagField: { x: 6, width: 450 },
  /** Everything right of this is the wordmark. */
  wordmarkLeft: 330,
  /** The radical's centerline in drawing order: stub, down to the vertex, up to the bar, along the bar. */
  radical: [
    [0, 150],
    [31, 150],
    [65, 233],
    [132, 83.3],
    [290, 83.3],
  ] as const,
  colors: { blue: "#00358e", light: "#2a7de1" },
} as const;

/** The white plate behind the logo, in logo pixels, so the intro and the card draw the same shape. */
export const LOGO_PLATE = { padX: 80, padY: 64, radius: 0.24 } as const;

/** Plate size in logo pixels; multiply by a scale for screen pixels. */
export const PLATE = {
  width: LOGO.width + LOGO_PLATE.padX * 2,
  height: LOGO.mark.size + LOGO_PLATE.padY * 2,
} as const;

/**
 * The logo on its white plate, sized by plate height. data-coop-slot="logo"
 * marks the card's copy, which the intro's flying logo lands on exactly.
 */
export function VeriskLogoPlate({
  height,
  hidden = false,
  slot = false,
  className = "",
}: {
  height: number;
  hidden?: boolean;
  slot?: boolean;
  className?: string;
}) {
  const scale = height / PLATE.height;
  return (
    <div
      data-coop-slot={slot ? "logo" : undefined}
      className={`relative shrink-0 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 ${className}`}
      style={{
        width: PLATE.width * scale,
        height,
        borderRadius: height * LOGO_PLATE.radius,
        opacity: hidden ? 0 : 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size brand mark; the intro paints the same file onto its canvas */}
      <img
        src={LOGO.src}
        alt="Verisk"
        width={LOGO.width}
        height={LOGO.height}
        draggable={false}
        className="absolute select-none"
        style={{
          left: LOGO_PLATE.padX * scale,
          top: LOGO_PLATE.padY * scale,
          width: LOGO.width * scale,
          height: LOGO.height * scale,
        }}
      />
    </div>
  );
}
