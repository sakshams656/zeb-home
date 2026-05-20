"use client";
import * as S from "./app-styles";
export function AiInsightsScreen() {
  return (
    <div style={S.shell}>
      <header style={S.header}><span style={{ flex: 1, fontWeight: 800, fontSize: 11 }}>BTC-INR AI Insights</span></header>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, fontSize: 11 }} className="phone-scroll-hide">
        <article style={S.card}>
          <p style={{ lineHeight: 1.5 }}>Bitcoin is experiencing neutral short-term momentum with bearish weekly pressure.</p>
          <ul style={{ marginTop: 8, paddingLeft: 16, color: "#555" }}>
            <li>Price $76,961 · 24h +0.33%</li>
            <li>7d change -4.74%</li>
          </ul>
        </article>
        <article style={S.card}><strong style={{ color: S.blue }}>Opportunities</strong><p style={{ marginTop: 6, color: "#555" }}>Range $76,055–$77,667. EMA crossovers forming.</p></article>
        <article style={S.card}><strong style={{ color: S.danger }}>Risks</strong><p style={{ marginTop: 6, color: "#555" }}>Bearish sentiment. ETF outflows noted.</p></article>
      </div>
    </div>
  );
}
