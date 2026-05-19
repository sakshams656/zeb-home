"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { QtCoin } from "./types";
import { spawnConfetti } from "./confetti";

const COINS: QtCoin[] = [
  { sym: "BTC", name: "Bitcoin", icon: "₿", grad: "linear-gradient(135deg,#f7931a,#ffc107)", price: "₹80,08,786.42", chg: "12.78", dir: "up" },
  { sym: "ETH", name: "Ethereum", icon: "Ξ", grad: "linear-gradient(135deg,#627eea,#9b59b6)", price: "₹11,51,594.94", chg: "8.30", dir: "up" },
  { sym: "SOL", name: "Solana", icon: "◎", grad: "linear-gradient(135deg,#9945ff,#14f195)", price: "₹89,763.94", chg: "1.12", dir: "down" }
];

export function QtFlow({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const [coin, setCoin] = useState<QtCoin>(COINS[0]);
  const [limitBase, setLimitBase] = useState(10_408_524);
  const [amt, setAmt] = useState(2500);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const confettiRef = useRef<HTMLDivElement>(null);

  const qty = (amt / (limitBase / 100)).toFixed(6);
  const youPay = Math.round(amt * 1.1);

  const pickCoin = useCallback(
    (c: QtCoin) => {
      setCoin(c);
      setStep(2);
    },
    [setStep]
  );

  const doSwipe = useCallback(() => {
    setTimeout(() => {
      setStep(3);
      spawnConfetti(confettiRef.current);
    }, 850);
  }, [setStep]);

  useEffect(() => {
    if (step === 3) spawnConfetti(confettiRef.current);
  }, [step]);

  if (step === 2) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#fff" }} className="phone-scroll-hide">
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: "1px solid #f0f2fa", flexShrink: 0 }}>
          <button type="button" onClick={() => setStep(1)} style={backBtn}>
            ‹
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Buy {coin.sym}-INR ▾</span>
          <span style={iconBtn}>📋</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }} className="phone-scroll-hide">
          <div style={{ margin: "12px 14px", background: "#eef2ff", borderRadius: 14, padding: "13px 14px", display: "flex", gap: 11, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: coin.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {coin.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{coin.name}</div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>{coin.price}</span>
              <span style={{ marginLeft: 8, background: coin.dir === "up" ? "#1a7a3a" : "#c0392b", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                {coin.dir === "up" ? "↑" : "↓"} {coin.chg}% | 24H
              </span>
            </div>
          </div>
          <div style={{ margin: "0 14px", display: "flex", borderBottom: "1px solid #eef0f8" }}>
            <button type="button" onClick={() => setOrderType("market")} style={tabStyle(orderType === "market")}>
              Market
            </button>
            <button type="button" onClick={() => setOrderType("limit")} style={tabStyle(orderType === "limit", true)}>
              Limit
            </button>
          </div>
          {orderType === "limit" && (
            <div style={{ margin: "12px 14px", border: "1px solid #e0e5f7", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Set Limit Price</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700 }}>
                  ₹{limitBase.toLocaleString("en-IN")}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="qt-sm-btn" onClick={() => setLimitBase((b) => Math.round(b * 0.99))}>
                    -1%
                  </button>
                  <button type="button" className="qt-sm-btn" onClick={() => setLimitBase((b) => Math.round(b * 1.01))}>
                    +1%
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={{ margin: "0 14px 10px", border: "1px solid #e0e5f7", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Enter Amount</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}>₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              <span style={{ fontSize: 11, color: "#888" }}>Qty {qty} {coin.sym}</span>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
              {[25, 50, 75, 100].map((p) => (
                <button key={p} type="button" className="qt-pct-btn" onClick={() => setAmt(Math.round(10_000 * (p / 100)))}>
                  {p}%
                </button>
              ))}
            </div>
          </div>
          <div style={{ margin: "0 14px", paddingTop: 12, borderTop: "1px solid #f0f2fa", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#888" }}>◎ You Pay ⓘ</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>₹{youPay.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div style={{ padding: "0 14px 16px", flexShrink: 0 }}>
          <button
            id="qt-swipe"
            type="button"
            onClick={doSwipe}
            style={{
              width: "100%",
              background: "#1a7a3a",
              border: "none",
              borderRadius: 14,
              padding: "13px 16px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#fff"
            }}
          >
            <span style={{ width: 36, height: 36, background: "rgba(255,255,255,0.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              ›
            </span>
            <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, letterSpacing: "0.07em" }}>
              SWIPE TO BUY {coin.sym}-INR
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#f4f6ff", overflowY: "auto" }} className="phone-scroll-hide">
        <div style={{ background: "linear-gradient(160deg,#43e97b,#38f9d7,#7ee8a2)", padding: "28px 20px 24px", textAlign: "center", position: "relative" }}>
          <div ref={confettiRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div style={{ width: 48, height: 48, margin: "0 auto 14px", background: "linear-gradient(135deg,#27ae60,#2ecc71)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22 }}>
            ✓
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "#0a2a1a" }}>{coin.sym} Buy Order Placed</h3>
          <p style={{ fontSize: 11, color: "rgba(10,42,26,0.65)" }}>Order Type: Limit</p>
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ background: "#fff", border: "1px solid #e8ecf8", borderRadius: 16, padding: 14, marginBottom: 10 }}>
            <Row label="Quantity" value={`${qty} ${coin.sym}`} />
            <Row label="Amount debited" value={`₹${youPay.toLocaleString("en-IN")}.00`} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setStep(1)} style={outlineBtn}>
              VIEW ORDERS
            </button>
            <button type="button" onClick={() => setStep(1)} style={solidBtn}>
              BUY MORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "#fff" }} className="phone-scroll-hide">
      <div style={{ padding: "12px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "#111" }}>QuickTrade</span>
        <span style={{ background: "linear-gradient(135deg,#3d6df0,#6c47ff)", borderRadius: 100, padding: "4px 11px", fontSize: 10, fontWeight: 700, color: "#fff" }}>
          🎁 0 Pts
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px", minHeight: 0 }} className="phone-scroll-hide">
        {COINS.map((c) => (
          <button
            key={c.sym}
            type="button"
            className="qt-row"
            onClick={() => pickCoin(c)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "13px 0",
              border: "none",
              borderBottom: "1px solid #f0f2fa",
              background: "none",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{c.sym}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{c.name}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>{c.price}</div>
              <div style={{ fontSize: 11, color: c.dir === "up" ? "#1a7a3a" : "#e63946", fontWeight: 600 }}>
                {c.dir === "up" ? "↑" : "↓"} {c.chg}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f2fa" }}>
      <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

const backBtn: React.CSSProperties = { width: 32, height: 32, border: "1.5px solid #dde3f5", borderRadius: "50%", background: "#fff", cursor: "pointer", fontSize: 18 };
const iconBtn: React.CSSProperties = { width: 32, height: 32, border: "1.5px solid #dde3f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" };
const outlineBtn: React.CSSProperties = { flex: 1, padding: 13, border: "1.5px solid #2855c8", borderRadius: 14, background: "#fff", color: "#2855c8", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };
const solidBtn: React.CSSProperties = { flex: 1, padding: 13, border: "none", borderRadius: 14, background: "#2855c8", color: "#fff", fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, cursor: "pointer" };

function tabStyle(active: boolean, underline?: boolean): React.CSSProperties {
  return {
    flex: 1,
    textAlign: "center",
    padding: "9px 0",
    fontSize: 13,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: active ? "#2855c8" : "#888",
    fontWeight: active ? 700 : 400,
    borderBottom: active && underline ? "2.5px solid #2855c8" : "none"
  };
}
