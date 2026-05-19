import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  { n: "1", title: "Register", time: "90 sec", desc: "Phone or email + Aadhaar e-KYC in-flow." },
  { n: "2", title: "Deposit", time: "30 sec", desc: "UPI, IMPS, or NEFT — instant on UPI." },
  { n: "3", title: "Trade", time: "Anytime", desc: "Spot, futures, SIP, or follow an expert." }
];

export function Steps() {
  return (
    <section className="px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Get started" title="Three steps to your first trade" />
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cyan)] text-lg font-black text-[var(--navy)]">{s.n}</span>
                <h3 className="mt-4 text-lg font-black">{s.title}</h3>
                <p className="text-sm font-bold text-[var(--cyan)]">{s.time}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
