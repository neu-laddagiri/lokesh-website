"use client";

export type CourseAccent = {
  accent: string;
  accentLight: string;
  accentRgb: string;
  accentGlow: string;
};

export const ARTIFACT_CARD_MIN_HEIGHT = "min-h-[200px]";

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

export function getArtifactActionLabel(label: string): string {
  if (/report/i.test(label)) return "Open Report →";
  if (/presentation/i.test(label)) return "Open Presentation →";
  return "View PDF →";
}

export function artifactGridClassName(count: number): string {
  if (count === 3) {
    return "mt-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3 sm:max-w-3xl sm:mx-auto";
  }

  return "mt-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
}

type SyllabusHeaderButtonProps = {
  href: string;
  accent: CourseAccent;
};

export function SyllabusHeaderButton({ href, accent }: SyllabusHeaderButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase backdrop-blur-md transition-all duration-300 hover:scale-[1.04]"
      style={{
        borderColor: `rgba(${accent.accentRgb}, 0.35)`,
        backgroundColor: `rgba(${accent.accentRgb}, 0.12)`,
        color: accent.accentLight,
        boxShadow: `0 0 20px rgba(${accent.accentRgb}, 0.12)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 24px ${accent.accentGlow}, 0 0 32px rgba(${accent.accentRgb}, 0.2)`;
        e.currentTarget.style.borderColor = `rgba(${accent.accentRgb}, 0.5)`;
        e.currentTarget.style.backgroundColor = `rgba(${accent.accentRgb}, 0.18)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px rgba(${accent.accentRgb}, 0.12)`;
        e.currentTarget.style.borderColor = `rgba(${accent.accentRgb}, 0.35)`;
        e.currentTarget.style.backgroundColor = `rgba(${accent.accentRgb}, 0.12)`;
      }}
    >
      View Syllabus
      <ExternalLinkIcon />
    </a>
  );
}

type StaticArtifactCardProps = {
  label: string;
  icon: React.ReactNode;
  iconStyle?: React.CSSProperties;
};

export function StaticArtifactCard({
  label,
  icon,
  iconStyle,
}: StaticArtifactCardProps) {
  return (
    <div
      className={`glass-strong flex ${ARTIFACT_CARD_MIN_HEIGHT} h-full w-full flex-col items-center justify-center gap-4 rounded-3xl px-6 py-8`}
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={iconStyle}
      >
        {icon}
      </span>
      <span className="text-center text-[15px] font-medium tracking-[-0.01em] text-foreground">
        {label}
      </span>
    </div>
  );
}

type InteractiveArtifactCardProps = {
  label: string;
  icon: React.ReactNode;
  href: string;
  accent: CourseAccent;
  actionLabel?: string;
  iconStyle?: React.CSSProperties;
};

export function InteractiveArtifactCard({
  label,
  icon,
  href,
  accent,
  actionLabel,
  iconStyle,
}: InteractiveArtifactCardProps) {
  const helperText = actionLabel ?? getArtifactActionLabel(label);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex ${ARTIFACT_CARD_MIN_HEIGHT} h-full w-full cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border px-6 py-8 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03]`}
      style={{
        background: `linear-gradient(145deg, rgba(${accent.accentRgb}, 0.14) 0%, rgba(${accent.accentRgb}, 0.06) 100%)`,
        borderColor: `rgba(${accent.accentRgb}, 0.3)`,
        boxShadow: `0 0 28px rgba(${accent.accentRgb}, 0.15)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 48px ${accent.accentGlow}, 0 0 40px rgba(${accent.accentRgb}, 0.22)`;
        e.currentTarget.style.borderColor = `rgba(${accent.accentRgb}, 0.5)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 28px rgba(${accent.accentRgb}, 0.15)`;
        e.currentTarget.style.borderColor = `rgba(${accent.accentRgb}, 0.3)`;
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(${accent.accentRgb}, 0.2) 0%, transparent 70%)`,
        }}
        aria-hidden
      />
      <span
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
        style={
          iconStyle ?? {
            backgroundColor: `rgba(${accent.accentRgb}, 0.18)`,
            color: accent.accent,
            boxShadow: `0 0 20px rgba(${accent.accentRgb}, 0.2)`,
          }
        }
      >
        {icon}
      </span>
      <span className="relative z-10 text-center text-[15px] font-semibold tracking-[-0.01em] text-foreground">
        {label}
      </span>
      <span
        className="relative z-10 inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 group-hover:text-foreground"
        style={{ color: accent.accentLight }}
      >
        {helperText}
        <ExternalLinkIcon />
      </span>
    </a>
  );
}
