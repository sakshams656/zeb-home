"use client";
import * as S from "./app-styles";
export function BtcChartScreen() {
  return (
    <div style={S.shell}>
      <header style={S.header}><span>‹</span><span style={{ flex: 1, fontWeight: 800 }}>BTC-INR</span><span>★ A⁺</span></header>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
        <article style={S.card}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>₹76,14,628 <span style={{ fontSize: 11, color: S.success }}>↑0.70% 1D</span></div>
          <div style={{ fontSize: 10, color: "#888" }}>Vol 60,01,845 INR</div>
        </article>
        <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80, marginBottom: 8 }}>
          <path d="M0 70 Q40 20 80 40 T160 25 T240 35 L240 80 L0 80 Z" fill="rgba(0,176,122,0.2)" />
          <path d="M0 70 Q40 20 80 40 T160 25 T240 35" fill="none" stroke={S.success} strokeWidth={2} />
        </svg>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {["1H", "1D", "1W", "1M"].map((t) => (<span key={t} style={S.pill(t === "1D")}>{t}</span>))}
        </div>
        <div style={{ background: S.blue, color: "#fff", borderRadius: 10, padding: 10, fontWeight: 700, fontSize: 11 }}>Start a SIP in BTC ›</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button type="button" style={{ flex: 1, background: S.success, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontWeight: 700 }}>BUY</button>
          <button type="button" style={{ flex: 1, background: S.danger, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontWeight: 700 }}>SELL</button>
        </div>
      </div>
    </div>
  );
}
