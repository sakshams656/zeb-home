export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-black tracking-tight text-[var(--text)] ${className}`}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-[var(--navy)]"
        style={{ background: "linear-gradient(135deg, var(--cyan), var(--blue))" }}
      >
        Z
      </span>
      ZebPay
    </span>
  );
}
