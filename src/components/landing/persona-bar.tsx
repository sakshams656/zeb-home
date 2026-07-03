"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { usePersona } from "@/context/persona-context";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function PersonaBar() {
  const { persona, setPersona } = usePersona();
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !indicatorRef.current) return;
      const x = persona === "trader" ? 0 : 1;
      gsap.to(indicatorRef.current, {
        x: x * 100 + "%",
        duration: 0.35,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
    },
    { dependencies: [persona] }
  );

  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div ref={barRef} className="container-zeb flex flex-wrap items-center justify-center gap-2 py-2 text-sm">
        <span className="text-[var(--fg-muted)]">I am a</span>
        <div className="persona-toggle relative flex rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
          <span
            ref={indicatorRef}
            className="persona-indicator pointer-events-none absolute left-1 top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-[var(--cyan)]"
            style={{ transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          />
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
              className={`relative z-10 rounded-full px-4 py-1.5 font-bold transition-colors ${
                persona === p.id ? "text-white" : "text-[var(--fg-muted)]"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
