export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
      {children}
    </span>
  );
}
