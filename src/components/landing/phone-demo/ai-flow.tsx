"use client";

import * as S from "./app-styles";

export function AiFlow({ step }: { step: number; setStep: (n: number) => void }) {
  void step;
  return (
    <div style={S.shell} className="phone-screen" data-screen="ai-1">
      <div style={S.header}>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>BTC-INR AI Insights</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
        <p style={{ fontSize: 10, color: "#888", marginBottom: 10 }}>Updated 8 min ago</p>
        <div style={S.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Summary</div>
          <p style={{ fontSize: 11, lineHeight: 1.5, color: "#333" }}>
            Bitcoin (BTC) is currently experiencing neutral short-term momentum while facing a strong bearish trend over the past week.
          </p>
          <ul style={{ fontSize: 11, marginTop: 10, paddingLeft: 16, color: "#444" }}>
            <li>Current price $76,961.00 USD</li>
            <li>24h change +0.33%</li>
            <li>7d change -4.74%</li>
          </ul>
          <p style={{ fontSize: 9, color: "#999", marginTop: 8 }}>Not financial advice. AI-generated analysis.</p>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: S.blue }}>Opportunities</div>
          <p style={{ fontSize: 11, lineHeight: 1.45, color: "#444" }}>
            Trading range $76,055–$77,667; medium-term catalysts; watch EMA crossovers for directional bias.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: S.danger }}>Risks</div>
          <p style={{ fontSize: 11, lineHeight: 1.45, color: "#444" }}>
            Bearish sentiment -4.74% weekly; ETF outflows; limited positive news flow in recent sessions.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Community Sentiment</div>
          <p style={{ fontSize: 11, lineHeight: 1.45, color: "#444" }}>
            Muted and cautious; traders focus on medium-term catalysts. Bearish momentum may persist without fresh headlines.
          </p>
        </div>
        <p style={{ fontSize: 9, color: "#aaa", marginTop: 8, lineHeight: 1.4 }}>
          Full disclaimer: AI insights are experimental. Always do your own research before trading.
        </p>
      </div>
      <div style={S.homeIndicator} />
    </div>
  );
}
