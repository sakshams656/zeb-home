import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

type Cell = string | boolean;

const ROWS: { feature: string; zeb: Cell; w: Cell; d: Cell; hl?: boolean }[] = [
  { feature: "Maker / Taker fees", zeb: "0.10% / 0.15%", w: "0.20% / 0.20%", d: "0.10% / 0.20%", hl: true },
  { feature: "Max futures leverage", zeb: "25x", w: "—", d: "20x" },
  { feature: "INR withdrawal", zeb: "< 30 min", w: "1–2 hrs", d: "~1 hr", hl: true },
  { feature: "AI Insights", zeb: true, w: false, d: false, hl: true },
  { feature: "RMS", zeb: true, w: false, d: false },
  { feature: "Expert Trades", zeb: true, w: false, d: "Partial", hl: true },
  { feature: "CryptoPacks", zeb: true, w: false, d: true },
  { feature: "FIU-IND registered", zeb: true, w: true, d: true }
];

function CellContent({ v }: { v: Cell }) {
  if (v === true) return <span className="text-[var(--success)] font-bold">✓</span>;
  if (v === false) return <span className="text-[var(--text-muted)]">—</span>;
  return <>{v}</>;
}

export function Comparison() {
  return (
    <section className="px-6 py-20 bg-[var(--surface)]">
      <div className="container-zeb">
        <SectionHeader chip="Why ZebPay" title="How we compare" subtitle="Side-by-side on what matters for Indian traders." />
        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--navy)] text-white">
                  <th className="p-4 text-left" />
                  <th className="p-4">ZebPay</th>
                  <th className="p-4">WazirX</th>
                  <th className="p-4">CoinDCX</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.feature} className={r.hl ? "bg-[var(--cyan)]/5" : ""}>
                    <td className="border-t border-[var(--border)] p-4 font-medium">{r.feature}</td>
                    <td className="border-t border-[var(--border)] p-4 text-center font-bold"><CellContent v={r.zeb} /></td>
                    <td className="border-t border-[var(--border)] p-4 text-center"><CellContent v={r.w} /></td>
                    <td className="border-t border-[var(--border)] p-4 text-center"><CellContent v={r.d} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
