"use client";
import * as S from "./app-styles";
export function SipPortfolioScreen() {
  return (
    <div style={S.shell}>
      <header style={S.header}><span style={{ flex: 1, fontWeight: 800 }}>SIP</span></header>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
        <article style={{ background: S.navy, borderRadius: 14, padding: 14, color: "#fff", marginBottom: 10 }}>
          <div style={{ fontSize: 11, opacity: 0.75 }}>Total SIP Value</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>₹2,439.06</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11 }}>
            <span>Invested ₹2,910</span><span style={{ color: S.danger }}>P&L -₹470.93</span>
          </div>
        </article>
        {[{ n: "Bitcoin BTC", s: "₹250/Weekly", b: "Paused" }, { n: "Ether ETH", s: "₹100/Weekly", b: "Cancelled" }].map((c) => (
          <article key={c.n} style={S.card}>
            <strong>{c.n}</strong>
            <div style={{ fontSize: 11, color: "#888" }}>{c.s}</div>
            <span style={{ fontSize: 10, color: c.b === "Paused" ? "#f5a623" : S.danger }}>{c.b}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
