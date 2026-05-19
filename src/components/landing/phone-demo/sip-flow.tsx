"use client";

import { useState } from "react";
import * as S from "./app-styles";

export function SipFlow({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [amount, setAmount] = useState(0);
  const [freq, setFreq] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  if (step === 3) {
    return (
      <div style={S.shell} className="phone-screen" data-screen="sip-3">
        <div style={S.header}>
          <button type="button" onClick={() => setStep(2)} style={S.backBtn}>‹</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>SIP Details</span>
          <span style={{ fontSize: 11, opacity: 0.8 }}>Step 2/3</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
          <div style={{ ...S.card, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f7931a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>₿</div>
            <div>
              <div style={{ fontWeight: 700 }}>Bitcoin BTC</div>
              <div style={{ fontSize: 11, color: "#666" }}>₹76,14,638.76 <span style={{ color: S.success }}>0.71% 24H</span></div>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Enter Amount (Min ₹100)</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>₹{amount || "0"}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {[100, 500, 1000, 5000].map((v) => (
                <button key={v} type="button" onClick={() => setAmount(v)} style={S.pill(amount === v)}>₹{v}</button>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Frequency</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["Daily", "Weekly", "Monthly"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFreq(f)} style={S.pill(freq === f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 11, color: "#888" }}>Select Start Date</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>19 May 2026</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Available Balance ₹0.33</div>
          </div>
        </div>
        <div style={{ padding: "0 12px 8px" }}>
          <button type="button" style={amount >= 100 ? S.cta : S.ctaDisabled} disabled={amount < 100}>CONTINUE</button>
        </div>
        <div style={S.homeIndicator} />
      </div>
    );
  }

  if (step === 2) {
    const coins = ["BTC", "ETH", "BAT", "AAVE", "APT", "AVAX", "BNB", "BCH", "ADA", "LINK", "DOGE", "ICP", "LTC"];
    return (
      <div style={S.shell} className="phone-screen" data-screen="sip-2">
        <div style={S.header}>
          <button type="button" onClick={() => setStep(1)} style={S.backBtn}>‹</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>Select Crypto</span>
          <span style={{ fontSize: 11, opacity: 0.8 }}>Step 1/3</span>
        </div>
        <div style={{ padding: "8px 12px" }}>
          <input placeholder="Search" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e0e4f0", fontSize: 13 }} readOnly />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }} className="phone-scroll-hide">
          <div style={{ fontSize: 10, fontWeight: 800, color: "#888", margin: "8px 0" }}>MOST INVESTED</div>
          {["BTC", "ETH", "BAT"].map((c) => (
            <button key={c} type="button" onClick={() => setStep(3)} style={{ ...S.card, width: "100%", textAlign: "left", cursor: "pointer", border: "1px solid #e8ecf4" }}>
              <span style={{ fontWeight: 700 }}>{c}</span>
            </button>
          ))}
          <div style={{ fontSize: 10, fontWeight: 800, color: "#888", margin: "12px 0 8px" }}>ALL COINS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {coins.map((c) => (
              <button key={c} type="button" onClick={() => setStep(3)} style={{ ...S.card, margin: 0, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={S.homeIndicator} />
      </div>
    );
  }

  return (
    <div style={S.shell} className="phone-screen" data-screen="sip-1">
      <div style={S.header}>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>SIP</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }} className="phone-scroll-hide">
        <div style={{ background: S.navy, borderRadius: 14, padding: 14, color: "#fff", marginBottom: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.75 }}>Total SIP Value</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>₹2,439.06</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11 }}>
            <span>Invested ₹2,910.00</span>
            <span style={{ background: "rgba(227,62,92,0.3)", padding: "2px 8px", borderRadius: 6, color: "#ff8fa3" }}>P&L -₹470.93</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {["All(5)", "Active(0)", "Paused(1)", "Cancelled"].map((t, i) => (
            <span key={t} style={S.pill(i === 0)}>{t}</span>
          ))}
        </div>
        {[
          { name: "Bitcoin BTC", sub: "₹250/Weekly", badge: "Paused", badgeColor: S.warn },
          { name: "Ether ETH", sub: "₹100/Weekly", badge: "Cancelled", badgeColor: S.danger }
        ].map((row) => (
          <div key={row.name} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{row.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{row.sub}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: row.badgeColor }}>{row.badge}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setStep(2)} style={{ position: "absolute", right: 16, bottom: 48, width: 52, height: 52, borderRadius: "50%", background: S.blue, color: "#fff", border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(27,85,224,0.4)" }}>+</button>
      <div style={S.homeIndicator} />
    </div>
  );
}
