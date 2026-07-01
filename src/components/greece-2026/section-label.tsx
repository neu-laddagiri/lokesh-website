export function GreeceSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-medium tracking-[0.24em] text-muted uppercase">
      {children}
    </p>
  );
}

export function GreeceSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground">
      {children}
    </h2>
  );
}
