/** Slow-drifting colour fields that give the glass panels something to blur. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[10%] -top-[15%] size-[55vmax] animate-drift-a rounded-full blur-[110px]" style={{ background: "var(--aurora-1)" }} />
      <div className="absolute -right-[15%] top-[10%] size-[50vmax] animate-drift-b rounded-full blur-[120px]" style={{ background: "var(--aurora-2)" }} />
      <div className="absolute -bottom-[20%] left-[20%] size-[45vmax] animate-drift-c rounded-full blur-[120px]" style={{ background: "var(--aurora-3)" }} />
    </div>
  );
}
