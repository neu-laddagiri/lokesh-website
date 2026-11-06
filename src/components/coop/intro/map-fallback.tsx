import type { Variant } from "./timing";

/**
 * The map scene without WebGL or tiles: the Atlantic with Athens and Boston,
 * then an illustration of downtown Boston that turns under the pin the way the
 * real camera would orbit. The stripes fly over it on the intro's canvas,
 * along the invisible arc here. The card's map panel reuses the Boston view.
 */

/**
 * The Atlantic, drawn on a 1000 by 600 grid and fit inside the screen. Phones
 * crop in to the arc and its two labels, so the route is not a sliver.
 */
export const ATLANTIC_VIEWS = {
  desktop: { x: 0, y: 0, width: 1000, height: 600, label: 15, dot: 4 },
  phone: { x: 170, y: 150, width: 660, height: 285, label: 25, dot: 6 },
} as const;
export const ATLANTIC_ATHENS = { x: 772, y: 350 } as const;
export const ATLANTIC_BOSTON = { x: 228, y: 302 } as const;
const ARC_CONTROL = { x: 500, y: 64 } as const;
const ARC = `M ${ATLANTIC_ATHENS.x} ${ATLANTIC_ATHENS.y} Q ${ARC_CONTROL.x} ${ARC_CONTROL.y} ${ATLANTIC_BOSTON.x} ${ATLANTIC_BOSTON.y}`;

/** A point on the drawn arc, Athens (0) to Boston (1), on the Atlantic grid. */
export function arcPoint(s: number): { x: number; y: number } {
  const u = Math.min(1, Math.max(0, s));
  const a = (1 - u) * (1 - u);
  const b = 2 * (1 - u) * u;
  const c = u * u;
  return {
    x: a * ATLANTIC_ATHENS.x + b * ARC_CONTROL.x + c * ATLANTIC_BOSTON.x,
    y: a * ATLANTIC_ATHENS.y + b * ARC_CONTROL.y + c * ATLANTIC_BOSTON.y,
  };
}

/** Screen position of a point on the Atlantic grid (preserveAspectRatio meet). */
export function atlanticToScreen(x: number, y: number, vw: number, vh: number, variant: Variant) {
  const view = ATLANTIC_VIEWS[variant];
  const s = Math.min(vw / view.width, vh / view.height);
  return {
    x: (vw - view.width * s) / 2 + (x - view.x) * s,
    y: (vh - view.height * s) / 2 + (y - view.y) * s,
    scale: s,
  };
}

/** Downtown blocks on a loose grid, drawn once. Center block is the office. */
const BLOCKS = (() => {
  const blocks: { x: number; y: number; w: number; h: number; office: boolean }[] = [];
  for (let gx = -6; gx <= 6; gx++) {
    for (let gy = -6; gy <= 6; gy++) {
      const x = 500 + gx * 92 + ((gy * 37) % 23) - 11;
      const y = 500 + gy * 88 + ((gx * 29) % 19) - 9;
      const inRiver = x + y < 520;
      const inHarbor = x > 840 + (y - 500) * 0.1;
      const inCommon = x > 200 && x < 360 && y > 430 && y < 640;
      if (inRiver || inHarbor || inCommon) continue;
      blocks.push({ x, y, w: 70 + ((gx * gy) % 3) * 6, h: 64 + ((gx + gy) % 4) * 5, office: gx === 0 && gy === 0 });
    }
  }
  return blocks;
})();

function Label({ x, y, size = 15, children }: { x: number; y: number; size?: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fill="rgba(255,255,255,0.42)"
      fontSize={size}
      fontWeight={500}
      textAnchor="middle"
      style={{ fontFamily: "var(--font-geist-sans)", letterSpacing: "-0.01em" }}
    >
      {children}
    </text>
  );
}

/** Downtown Boston, drawn: water, the Common, blocks, and the office block in blue. */
export function BostonCity({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      data-fb="boston"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={style}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g data-fb="city" style={{ transformOrigin: "500px 500px", transformBox: "view-box" }}>
        <rect x="-400" y="-400" width="1800" height="1800" fill="#0b1019" />
        <path d="M -400 300 C 80 330 260 160 470 -40 L 470 -400 L -400 -400 Z" fill="#0b1a2e" />
        <path d="M 830 -400 C 760 160 930 430 880 700 C 850 880 960 1060 1400 1400 L 1400 -400 Z" fill="#0b1a2e" />
        <rect x="196" y="426" width="168" height="218" rx="18" fill="#0d1612" />
        {BLOCKS.map((block) => (
          <rect
            key={`${block.x}-${block.y}`}
            x={block.x - block.w / 2}
            y={block.y - block.h / 2}
            width={block.w}
            height={block.h}
            rx="7"
            fill={block.office ? "#1b2a44" : "#121926"}
            stroke={block.office ? "rgba(41,151,255,0.55)" : "none"}
            strokeWidth="2"
          />
        ))}
        <Label x={150} y={140}>Charles River</Label>
        <Label x={280} y={540}>Boston Common</Label>
        <Label x={930} y={330}>Boston Harbor</Label>
        <Label x={500} y={640}>Downtown Crossing</Label>
      </g>
    </svg>
  );
}

export function MapFallback({ variant }: { variant: Variant }) {
  const view = ATLANTIC_VIEWS[variant];
  return (
    <div className="absolute inset-0 bg-[#04070d]" aria-hidden>
      <svg
        data-fb="atlantic"
        className="absolute inset-0 h-full w-full"
        viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="1">
          {[120, 220, 320, 420, 520].map((y) => (
            <path key={y} d={`M 40 ${y} Q 500 ${y - 60} 960 ${y}`} />
          ))}
          {[180, 340, 500, 660, 820].map((x) => (
            <path key={x} d={`M ${x} 40 Q ${x + (x - 500) * 0.12} 300 ${x} 560`} />
          ))}
        </g>
        <path data-fb="arc" d={ARC} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="4 7" />
        <circle cx={ATLANTIC_ATHENS.x} cy={ATLANTIC_ATHENS.y} r={view.dot} fill="rgba(255,255,255,0.7)" />
        <circle cx={ATLANTIC_BOSTON.x} cy={ATLANTIC_BOSTON.y} r={view.dot} fill="rgba(255,255,255,0.7)" />
        <Label x={ATLANTIC_ATHENS.x} y={ATLANTIC_ATHENS.y + view.label * 2} size={view.label}>
          Athens
        </Label>
        <Label x={ATLANTIC_BOSTON.x} y={ATLANTIC_BOSTON.y + view.label * 2} size={view.label}>
          Boston
        </Label>
      </svg>
      <BostonCity className="opacity-0" />
    </div>
  );
}
