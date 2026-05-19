"use client";

import { usePersona } from "@/context/persona-context";

export function PersonaBar() {
  const { persona, setPersona } = usePersona();
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="container-zeb flex flex-wrap items-center justify-center gap-2 py-2 text-sm">
        <span className="text-[var(--text-muted)]">I am a</span>
        {(
          [
            { id: "trader" as const, label: "Active Trader", icon: "⚡" },
            { id: "retail" as const, label: "Retail Investor", icon: "📈" }
          ] as const
        ).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPersona(p.id)}
            className={`rounded-full px-4 py-1.5 font-bold transition ${
              persona === p.id
                ? "bg-[var(--cyan)] text-[var(--navy)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
