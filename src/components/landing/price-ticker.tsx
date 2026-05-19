import { TICKER_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";

export function PriceTicker() {
  const items = [...TICKER_COINS, ...TICKER_COINS];
  return (
    <div className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3">
      <div className="ticker-track flex w-max gap-8">
        {items.map((c, i) => (
          <span
            key={`${c.sym}-${i}`}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tabular-nums"
          >
            <span className="text-[var(--text)]">{c.sym}</span>
            <span className="text-[var(--text-muted)]">{formatInr(c.price)}</span>
            <span
              className="font-bold"
              style={{ color: c.ch >= 0 ? "var(--success)" : "var(--danger)" }}
            >
              {formatPercent(c.ch)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
