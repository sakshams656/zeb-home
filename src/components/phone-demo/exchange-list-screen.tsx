"use client";

import * as S from "./app-styles";

const ROWS = [
  { sym: "BTC", earn: "0.2%", price: "₹75,62,901", ch: "+0.21%", up: true },
  { sym: "ETH", earn: "1.5%", price: "₹2,10,130", ch: "+0.11%", up: true },
  { sym: "STETH", earn: "", price: "₹2,08,195", ch: "-0.09%", up: false },
  { sym: "BNB", earn: "0.5%", price: "₹62,908", ch: "+0.14%", up: true },
  { sym: "BCH", earn: "", price: "₹36,544", ch: "+5.04%", up: true }
];

export function ExchangeListScreen() {
  return (
    <div style={S.shell}>
      <header style={S.header}>
        <span style={{ fontWeight: 800, flex: 1 }}>Exchange</span>
        <span>🔍</span>
        <span style={{ fontWeight: 700 }}>INR ▾</span>
      </header>
      <div style={{ padding: "8px 12px", display: "flex", gap: 6 }}>
        {["★ All", "New", "Gainers", "Losers"].map((t, i) => (
          <span key={t} style={S.pill(i === 0)}>{t}</span>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }} className="phone-scroll-hide">
        {ROWS.map((r) => (
          <article key={r.sym} style={{ ...S.card, display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{r.sym}</strong>
              {r.earn ? <div style={{ fontSize: 9, color: S.blue }}>Earn {r.earn}</div> : null}
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>{r.price}</strong>
              <div style={{ color: r.up ? S.success : S.danger }}>{r.ch}</div>
            </div>
          </article>
        ))}
      </div>
      <nav style={{ display: "flex", justifyContent: "space-around", padding: 10, borderTop: "1px solid #e0e5f7", fontSize: 9 }}>
        {["Home", "QuickTrade", "Portfolio", "Exchange", "Futures"].map((n) => (
          <span key={n} style={{ color: n === "Exchange" ? S.blue : "#888" }}>{n}</span>
        ))}
      </nav>
    </div>
  );
}
