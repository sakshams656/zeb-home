import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const STATS = [
  { value: "98%", label: "Cold storage", desc: "Multi-sig across geographies" },
  { value: "0", label: "Exchange hacks", desc: "Since 2014" },
  { value: "5-of-3", label: "Multi-sig", desc: "Custody architecture" },
  { value: "$100M", label: "Insurance", desc: "Custodial coverage" }
];

export function Security() {
  return (
    <section id="security" className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Security" title="Institutional-grade protection" subtitle="FIU-IND registered · ISO 27001 · SOC 2 Type II" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
                <p className="text-3xl font-black text-[var(--cyan)]">{s.value}</p>
                <p className="mt-2 font-bold text-[var(--text)]">{s.label}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
