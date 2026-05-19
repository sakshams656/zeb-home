const BADGES = [
  "FIU-IND Registered",
  "ISO 27001:2022",
  "SOC 2 Type II",
  "1:1 Reserves",
  "TDS Compliant",
  "4.6★ App Store"
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)] px-6 py-8">
      <div className="container-zeb flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {BADGES.map((b) => (
          <span key={b} className="text-sm font-bold text-[var(--text-muted)]">
            ✓ {b}
          </span>
        ))}
      </div>
    </section>
  );
}
