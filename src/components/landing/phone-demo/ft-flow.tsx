"use client";

import { useState } from "react";

const COINS = [
  { sym: "BTC", name: "Bitcoin", icon: "₿", grad: "linear-gradient(135deg,#f7931a,#ffc107)", price: "1,696,313.26", chg: "5.35", dir: "down" as const },
  { sym: "ETH", name: "Ether", icon: "Ξ", grad: "linear-gradient(135deg,#627eea,#9b59b6)", price: "3,47,675.45", chg: "0.31", dir: "up" as const }
];

export function FtFlow({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [coin, setCoin] = useState(COINS[0]);
  const [showToast, setShowToast] = useState(true);

  if (step === 4) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff", position: "relative" }} className="phone-scroll-hide">
        <div style={{ padding: 12 }}>
          <button type="button" onClick={() => setStep(1)} style={backBtn}>
            ‹
          </button>
          <span style={{ fontWeight: 700, marginLeft: 8 }}>{coin.sym}-INR</span>
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 8 }}>
            <div style={{ fontWeight: 800 }}>Positions (2)</div>
            <p style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Long 10x · Unrealised P&amp;L</p>
          </div>
        </div>
        {showToast && (
          <div
            style={{
              position: "absolute",
              bottom: 70,
              left: 12,
              right: 12,
              background: "#fff",
              border: "1.5px solid #e0e5f7",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
              animation: "toastIn 0.4s ease"
            }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "#1a7a3a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
              ⓘ
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Order Placed Successfully</div>
              <div style={{ fontSize: 10, color: "#888" }}>&lt;{coin.sym}/INR&gt; pair placed successfully.</div>
            </div>
            <button type="button" onClick={() => setShowToast(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#aaa" }}>
              ✕
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, padding: "8px 14px 14px" }}>
          <button type="button" onClick={() => setStep(1)} style={solidBtn}>
            BUY / LONG
          </button>
          <button type="button" onClick={() => setStep(1)} style={outlineBtn}>
            SELL / SHORT
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }} className="phone-scroll-hide">
        <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 9 }}>
          <button type="button" onClick={() => setStep(2)} style={backBtn}>
            ‹
          </button>
          <span style={{ fontWeight: 700 }}>{coin.sym}-INR</span>
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12, marginBottom: 8 }}>Limit order · 1x leverage</div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>Set Price / Quantity</div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 14px 14px" }}>
          <button id="ft-buylong-btn2" type="button" onClick={() => setStep(4)} style={solidBtn}>
            BUY / LONG
          </button>
          <button type="button" onClick={() => setStep(4)} style={outlineBtn}>
            SELL / SHORT
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }} className="phone-scroll-hide">
        <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 9 }}>
          <button type="button" onClick={() => setStep(1)} style={backBtn}>
            ‹
          </button>
          <span style={{ fontWeight: 700 }}>{coin.sym}-INR</span>
        </div>
        <div style={{ flex: 1, padding: 14, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: coin.grad, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {coin.icon}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>1 {coin.sym} ~ {coin.price} INR</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Positions (2)</div>
            <p style={{ fontSize: 11, color: "#888" }}>BTC-INR Long 10x</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px" }}>
          <button id="ft-buylong-btn" type="button" onClick={() => setStep(3)} style={solidBtn}>
            BUY / LONG
          </button>
          <button type="button" onClick={() => setStep(3)} style={outlineBtn}>
            SELL / SHORT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }} className="phone-scroll-hide">
      <div style={{ padding: "12px 16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>Futures</div>
      <div style={{ flex: 1, padding: "0 14px", overflowY: "auto" }}>
        {COINS.map((c) => (
          <button
            key={c.sym}
            type="button"
            className="ft-row"
            onClick={() => {
              setCoin(c);
              setStep(2);
            }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              marginBottom: 8,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: c.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {c.icon}
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>{c.sym}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{c.name}</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              {c.price} INR
              <div style={{ color: c.dir === "up" ? "#1a7a3a" : "#e63946", fontSize: 11 }}>
                {c.dir === "up" ? "↑" : "↓"} {c.chg}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const backBtn: React.CSSProperties = { width: 30, height: 30, border: "1.5px solid #dde3f5", borderRadius: "50%", background: "#fff", cursor: "pointer" };
const outlineBtn: React.CSSProperties = { flex: 1, padding: 13, border: "1.5px solid #2855c8", borderRadius: 14, background: "#fff", color: "#2855c8", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };
const solidBtn: React.CSSProperties = { flex: 1, padding: 13, border: "none", borderRadius: 14, background: "#2855c8", color: "#fff", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };
