"use client";

export function CalcShell({
  label,
  title,
  children
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="on-dark-surface relative overflow-hidden rounded-2xl p-6 text-white"
      style={{ background: "var(--sim-gradient)" }}
    >
      <span className="pointer-events-none absolute -right-12 -top-12 block h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,184,230,0.2),transparent_70%)]" />
      <p className="relative text-[11px] font-bold uppercase tracking-wide text-[var(--cyan)]">
        {label}
      </p>
      <h4 className="relative mb-4 text-lg font-bold">{title}</h4>
      <div className="relative">{children}</div>
    </div>
  );
}

export function RangeField({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm">
        <span className="text-white/65">{label}</span>
        <span className="font-bold tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--cyan)]"
      />
    </div>
  );
}

export function ResultRow({
  label,
  value,
  highlight
}: {
  label: string;
  value: string;
  highlight?: "success" | "danger";
}) {
  const color =
    highlight === "success"
      ? "var(--success)"
      : highlight === "danger"
        ? "var(--danger)"
        : undefined;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-white/65">{label}</span>
      <span className="font-bold" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 space-y-2 rounded-lg border-l-[3px] border-[var(--cyan)] bg-[rgba(0,184,230,0.08)] p-3">
      {children}
    </div>
  );
}
