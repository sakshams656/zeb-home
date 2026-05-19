"use client";

import { usePersona } from "@/context/persona-context";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

const TRADER = [
  { end: 82, suffix: "%", label: "Use Trading API daily", prefix: "" },
  { end: 87, suffix: "%", label: "Enable RMS protection", prefix: "" },
  { end: 47, suffix: "K", label: "Active futures traders", prefix: "" },
  { end: 62, suffix: "%", label: "Use AI Insights daily", prefix: "" }
];

const RETAIL = [
  { end: 33, suffix: "%", label: "Invest via Crypto SIP", prefix: "" },
  { end: 612, suffix: "K", label: "Active CryptoPacks users", prefix: "" },
  { end: 18, suffix: "L", label: "Following Expert Trades", prefix: "" },
  { end: 85, suffix: "%", label: "Max Earn APY headline", prefix: "" }
];

export function AdoptionStrip() {
  const { persona } = usePersona();
  const metrics = persona === "trader" ? TRADER : RETAIL;
  return (
    <section className="px-6 py-16">
      <div className="container-zeb">
        <Reveal>
          <p className="mb-8 text-center text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Platform metrics · {persona === "trader" ? "Active traders" : "Retail investors"}
          </p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 60}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
                <p className="text-3xl font-black text-[var(--text)]">
                  <Counter end={m.end} suffix={m.suffix} prefix={m.prefix} />
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{m.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
