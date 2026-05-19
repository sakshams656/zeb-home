import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const COINS = [
  { sym: "USDT", apy: "8.5%" },
  { sym: "BTC", apy: "6.0%" },
  { sym: "ETH", apy: "5.0%" },
  { sym: "SOL", apy: "4.5%" }
];

export function Earn() {
  return (
    <section id="earn" className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader
          chip="Earn"
          title="Put idle crypto to work"
          subtitle="Up to 8.5% APY — flexible or locked terms. Daily interest, auto-compound."
        />
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8">
              <p className="text-5xl font-black text-[var(--cyan)]">8.5%</p>
              <p className="mt-2 text-xl font-bold text-[var(--text)]">Max APY on USDT</p>
              <p className="mt-4 text-[var(--text-muted)]">Ring-fenced from trading · Fully insured · No lock-in option</p>
            </div>
            <ul className="space-y-3">
              {COINS.map((c) => (
                <li
                  key={c.sym}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
                >
                  <span className="font-bold">{c.sym}</span>
                  <span className="font-black text-[var(--success)]">{c.apy} APY</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
