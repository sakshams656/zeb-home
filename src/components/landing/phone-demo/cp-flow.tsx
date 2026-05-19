"use client";

import { useState } from "react";
const PACKS = [
  { name: "Crypto Essential", desc: "Most essentials coins only pack", chg: "2.56", dir: "up" as const },
  { name: "Fast Movers CryptoPack", desc: "High risk - high reward pack", chg: "0.31", dir: "up" as const },
  { name: "Meme-Verse", desc: "Biggest meme coins", chg: "1.66", dir: "down" as const }
];

export function CpFlow({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [pack, setPack] = useState(PACKS[0]);
  const [amt, setAmt] = useState(0);

  if (step === 5) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }}>
        <div style={{ background: "rgba(80,95,140,0.12)", height: 80, flexShrink: 0 }} />
        <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", flex: 1, padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 36, height: 4, background: "#e0e4f0", borderRadius: 2, margin: "0 auto 14px" }} />
          <div style={{ background: "linear-gradient(135deg,#3d6df0,#5b8df8)", borderRadius: 18, padding: 24, textAlign: "center", color: "#fff", marginBottom: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✓</div>
            <div>CryptoPack Purchased!</div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>50.00 USDT</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>📦 {pack.name}</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
            <button type="button" onClick={() => setStep(1)} style={outlineBtn}>
              MY PACKS
            </button>
            <button type="button" onClick={() => setStep(1)} style={solidBtn}>
              BUY MORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }}>
        <div style={{ background: "rgba(80,95,140,0.15)", height: 80 }} />
        <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", flex: 1, padding: 16 }}>
          <h3 style={{ textAlign: "center", fontWeight: 800, marginBottom: 16 }}>Buy Summary</h3>
          <div style={{ background: "linear-gradient(135deg,#3d6df0,#5b8df8)", borderRadius: 16, padding: 18, color: "#fff", marginBottom: 14 }}>
            <div style={{ fontSize: 11, opacity: 0.75 }}>You are buying worth</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>50.00 USDT</div>
          </div>
          <button id="cp-buy-now" type="button" onClick={() => setStep(5)} style={{ ...solidBtn, width: "100%" }}>
            BUY NOW
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }} className="phone-scroll-hide">
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 9 }}>
          <button type="button" onClick={() => setStep(2)} style={backBtn}>
            ‹
          </button>
          <span style={{ fontWeight: 700 }}>Buy {pack.name}</span>
        </div>
        <div style={{ flex: 1, padding: "0 14px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 300, color: "#555" }}>{amt.toFixed(2)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 14 }}>
              {[25, 50, 75, 100].map((p) => (
                <button key={p} type="button" className="cp-pct-btn" onClick={() => setAmt(Math.round(25_000 * (p / 100)))}>
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "0 14px 14px" }}>
          <button id="cp-preview" type="button" onClick={() => setStep(4)} style={{ ...solidBtn, width: "100%" }}>
            PREVIEW BUY SUMMARY
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
            ✕
          </button>
          <span style={{ fontWeight: 700 }}>{pack.name} Details</span>
        </div>
        <div style={{ flex: 1, padding: 14, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>{pack.name}</div>
            <span style={{ background: pack.dir === "up" ? "#e8f8f0" : "#fff0f0", color: pack.dir === "up" ? "#1a7a3a" : "#c0392b", fontSize: 10, padding: "4px 10px", borderRadius: 8 }}>
              {pack.dir === "up" ? "↑" : "↓"} {pack.chg}%
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px" }}>
          <button type="button" onClick={() => setStep(1)} style={outlineBtn}>
            SELL
          </button>
          <button id="cp-buy-more" type="button" onClick={() => setStep(3)} style={solidBtn}>
            BUY MORE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff" }} className="phone-scroll-hide">
      <div style={{ padding: "12px 16px", fontFamily: "var(--font-display)", fontWeight: 700, color: "#111" }}>CryptoPacks</div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {PACKS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="cp-pack-card"
            onClick={() => {
              setPack(p);
              setStep(2);
            }}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 14,
              cursor: "pointer",
              border: "none",
              textAlign: "left",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 13, color: "#111", marginBottom: 3 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{p.desc}</div>
            <div style={{ fontSize: 9, marginTop: 8, color: p.dir === "up" ? "#1a7a3a" : "#c0392b", fontWeight: 700 }}>
              {p.dir === "up" ? "↑" : "↓"} {p.chg}% | 1M
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const backBtn: React.CSSProperties = { width: 30, height: 30, border: "1.5px solid #dde3f5", borderRadius: "50%", background: "#fff", cursor: "pointer" };
const outlineBtn: React.CSSProperties = { flex: 1, padding: 13, border: "1.5px solid #2855c8", borderRadius: 12, background: "#fff", color: "#2855c8", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };
const solidBtn: React.CSSProperties = { flex: 1, padding: 13, border: "none", borderRadius: 12, background: "#2855c8", color: "#fff", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };
