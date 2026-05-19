"use client";

import { useState } from "react";
import * as S from "./app-styles";

const MARKETS = [
  { sym: "BTC", earn: "0.2%", price: "₹75,62,901.38", ch: "+0.21%", up: true },
  { sym: "ETH", earn: "1.5%", price: "₹2,10,130.92", ch: "+0.11%", up: true },
  { sym: "STETH", earn: "", price: "₹2,08,195.70", ch: "-0.09%", up: false },
  { sym: "BNB", earn: "0.5%", price: "₹62,908.30", ch: "+0.14%", up: true },
  { sym: "BCH", earn: "", price: "₹36,544.27", ch: "+5.04%", up: true }
];

export function ExchangeFlow({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Stop Limit">("Limit");

  if (step === 3) {
    return (
      <div style={S.shell} className="phone-screen" data-screen="ex-3">
        <div style={S.header}>
          <button type="button" onClick={() => setStep(2)} style={S.backBtn}>‹</button>
          <span style={{ flex: 1, fontWeight: 700 }}>Buy BTC-INR</span>
          <span>🛒</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
          <div style={S.card}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>₹75,62,901.38 <span style={{ color: S.success, fontSize: 12 }}>↑0.21%</span></div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 6 }}>Best Buy ₹75,78,239.98 (52%) · Best Sell ₹75,47,562.79 (49%) BOOK ›</div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {(["Limit", "Market", "Stop Limit"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setOrderType(t)} style={{ ...S.pill(orderType === t), flex: 1, fontSize: 10 }}>{t}</button>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 11, color: "#888" }}>Set Limit Price</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontWeight: 800 }}>₹75,62,901.38</span>
              <span><button type="button" style={S.pill(false)}>-1%</button> <button type="button" style={S.pill(false)}>+1%</button></span>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 11, color: "#888" }}>Enter Amount</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#aaa" }}>₹0.00</div>
            <div style={{ fontSize: 10, color: "#888" }}>Qty ~ ---- BTC</div>
            <input type="range" style={{ width: "100%", marginTop: 8 }} readOnly />
            <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>Avbl. Balance ₹0.33</div>
          </div>
        </div>
        <div style={{ padding: "8px 12px", background: "#e8ecf4", borderRadius: 12, margin: "0 12px 8px", textAlign: "center", fontWeight: 700, fontSize: 12, color: S.navy }}>
          SWIPE TO BUY BTC-INR ›››
        </div>
        <div style={S.homeIndicator} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={S.shell} className="phone-screen" data-screen="ex-2">
        <div style={S.header}>
          <button type="button" onClick={() => setStep(1)} style={S.backBtn}>‹</button>
          <span style={{ flex: 1, fontWeight: 700 }}>BTC-INR</span>
          <span style={{ fontSize: 12 }}>★ A⁺ ⋮</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
          <div style={S.card}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>₹76,14,628.87 <span style={{ fontSize: 11, color: S.success }}>INR ↑0.70% 1D</span></div>
            <div style={{ fontSize: 10, color: "#888" }}>Vol 60,01,845.60 INR</div>
            <svg viewBox="0 0 200 60" style={{ width: "100%", height: 56, marginTop: 8 }}>
              <path d="M0 50 Q50 10 100 30 T200 20 L200 60 L0 60 Z" fill="rgba(0,176,122,0.25)" />
              <path d="M0 50 Q50 10 100 30 T200 20" fill="none" stroke={S.success} strokeWidth={2} className="exchange-chart-path" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#888" }}>
              <span>18:00</span><span>19 May</span><span>06:00</span><span>12:00</span>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {["1H", "1D", "1W", "1M", "3M", "1Y"].map((t) => (
                <span key={t} style={S.pill(t === "1D")}>{t === "1D" ? "✓1D" : t}</span>
              ))}
            </div>
          </div>
          <div style={{ background: S.blue, color: "#fff", borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Start a SIP in BTC ›</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setStep(3)} style={{ ...S.cta, background: S.success }}>BUY</button>
            <button type="button" style={{ ...S.cta, background: S.danger }}>SELL</button>
          </div>
        </div>
        <nav style={{ display: "flex", justifyContent: "space-around", padding: "8px 0", borderTop: "1px solid #e0e4f0", background: "#fff", fontSize: 9 }}>
          {["Home", "QuickTrade", "Portfolio", "Exchange", "Futures"].map((n) => (
            <span key={n} style={{ color: n === "Exchange" ? S.blue : "#888", fontWeight: n === "Exchange" ? 700 : 400 }}>{n}</span>
          ))}
        </nav>
        <div style={S.homeIndicator} />
      </div>
    );
  }

  return (
    <div style={S.shell} className="phone-screen" data-screen="ex-1">
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Exchange</span>
        <span style={{ fontSize: 11 }}>🔍 INR ▾</span>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "6px 12px", flexWrap: "wrap" }}>
        {["★", "All", "New", "Gainers", "Losers"].map((t, i) => (
          <span key={t} style={S.pill(i === 1)}>{t}</span>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }} className="phone-scroll-hide">
        {MARKETS.map((m) => (
          <button key={m.sym} type="button" onClick={() => setStep(2)} className="ex-row" style={{ display: "flex", width: "100%", padding: "10px 14px", border: "none", borderBottom: "1px solid #eef0f8", background: "#fff", textAlign: "left", cursor: "pointer" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700 }}>{m.sym}</span>
              {m.earn && <span style={{ fontSize: 9, color: S.blue, marginLeft: 6 }}>Earn {m.earn}</span>}
              <div style={{ fontSize: 12, fontWeight: 600 }}>{m.price}</div>
            </div>
            <span style={{ color: m.up ? S.success : S.danger, fontWeight: 700, fontSize: 12 }}>{m.ch}</span>
          </button>
        ))}
      </div>
      <nav style={{ display: "flex", justifyContent: "space-around", padding: "8px 0", borderTop: "1px solid #e0e4f0", background: "#fff", fontSize: 9 }}>
        {["Home", "QuickTrade", "Portfolio", "Exchange", "Futures"].map((n) => (
          <span key={n} style={{ color: n === "Exchange" ? S.blue : "#888", fontWeight: n === "Exchange" ? 700 : 400 }}>{n}</span>
        ))}
      </nav>
      <div style={S.homeIndicator} />
    </div>
  );
}
