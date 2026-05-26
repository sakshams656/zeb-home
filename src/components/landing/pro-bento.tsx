"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const SIGNALS = [
  { trader: "Rahul V.", win: "78%", text: "[BUY] ETH at ₹2,10,000. Target ₹2,40,000." },
  { trader: "Meera S.", win: "82%", text: "[SELL] BTC at ₹76,50,000. Target ₹74,00,000." },
  { trader: "Arjun K.", win: "71%", text: "[BUY] SOL at ₹10,400. Target ₹11,200." }
];

const SPARK = [42, 48, 45, 52, 58, 55, 62, 60, 58, 62];

export function ProBento() {
  const ref = useRef<HTMLElement>(null);
  const [signalIdx, setSignalIdx] = useState(0);
  const [apiTab, setApiTab] = useState<"python" | "curl">("python");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setSignalIdx((i) => (i + 1) % SIGNALS.length), 3000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.querySelectorAll(".bento-cell"), {
        opacity: 0,
        scale: 0.92,
        stagger: { from: "center", amount: 0.4 },
        duration: 0.7,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ".bento-grid", start: "top 70%", once: true }
      });
      gsap.from(".gauge-needle", {
        rotation: -90,
        transformOrigin: "50% 100%",
        duration: 1.2,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ".bento-ai", start: "top 75%", once: true }
      });
    },
    { scope: ref }
  );

  const sig = SIGNALS[signalIdx];

  return (
    <section id="pro" ref={ref} className="scroll-mt-24 bg-[#040812] px-6 py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[var(--fg)]">Tools for serious traders.</h2>

        <div
          className="bento-grid mt-12 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, minmax(180px, auto))"
          }}
        >
          <article className="bento-cell bento-ai col-span-2 row-span-2 rounded-3xl border border-[var(--border)] bg-[#0a1428] p-8">
            <h3 className="text-xl font-black text-[var(--cyan)]">AI Insights</h3>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">Last updated 8 min ago</p>
            <svg viewBox="0 0 200 100" className="mx-auto mt-4 w-full max-w-[200px]">
              <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
              <path d="M20 90 A80 80 0 0 1 140 40" fill="none" stroke="var(--cyan)" strokeWidth={8} />
              <line className="gauge-needle" x1={100} y1={90} x2={130} y2={50} stroke="var(--cyan)" strokeWidth={3} />
            </svg>
            <p className="text-center text-3xl font-black text-[var(--success)]">62% Bullish</p>
            <svg viewBox="0 0 200 40" className="mx-auto mt-4 w-full max-w-[200px]">
              <polyline
                fill="none"
                stroke="var(--cyan)"
                strokeWidth={2}
                points={SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 200},${40 - v * 0.5}`).join(" ")}
              />
            </svg>
            <p className="mt-2 text-center text-[10px] text-[var(--fg-muted)]">Confidence trend · 7d</p>
          </article>

          <article className="bento-cell col-span-2 row-span-1 rounded-3xl border border-[var(--border)] bg-[#0a1a0a] p-6">
            <h3 className="font-black text-[var(--success)]">Expert Trades</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)] text-sm font-bold text-[var(--navy)]">
                {sig.trader[0]}
              </span>
              <div>
                <p className="font-bold text-[var(--fg)]">{sig.trader}</p>
                <span className="rounded bg-[var(--success)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--success)]">
                  {sig.win} win rate
                </span>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-black/30 p-4 text-sm text-white">{sig.text}</p>
          </article>

          <article className="bento-cell col-span-1 row-span-1 rounded-3xl border border-[var(--border)] bg-[#1a0a0a] p-6">
            <h3 className="font-black text-[#ff6b6b]">RMS</h3>
            <p className="mt-1 text-[10px] text-[var(--fg-muted)]">Auto TP / SL</p>
            <svg viewBox="0 0 120 80" className="mt-3 w-full">
              <circle cx={35} cy={45} r={28} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
              <circle cx={35} cy={45} r={28} fill="none" stroke="#ff4d6a" strokeWidth={6} strokeDasharray="90 176" transform="rotate(-90 35 45)" />
              <circle cx={85} cy={45} r={28} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
              <circle cx={85} cy={45} r={28} fill="none" stroke="#00b07a" strokeWidth={6} strokeDasharray="120 176" transform="rotate(-90 85 45)" />
            </svg>
          </article>

          <article className="bento-cell col-span-1 row-span-1 rounded-3xl border border-[var(--border)] bg-[#0a0f1a] p-6">
            <h3 className="font-black text-[#5b9fff]">Sub Accounts</h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "Trading", bal: 62, color: "#1b55e0" },
                { name: "Earn", bal: 28, color: "#2a66e8" },
                { name: "SIP", bal: 10, color: "#00b07a" }
              ].map((w) => (
                <li key={w.name} className="flex items-center gap-2 text-xs">
                  <span className="w-14 text-[var(--fg-muted)]">{w.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                    <div className="h-full rounded-full" style={{ width: `${w.bal}%`, background: w.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="bento-cell col-span-2 row-span-1 rounded-3xl border border-[var(--border)] bg-[#080d1a] p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[var(--cyan)]">APIs</h3>
              <div className="flex gap-1 rounded-lg bg-black/40 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setApiTab("python")}
                  className={`rounded px-2 py-1 ${apiTab === "python" ? "bg-[var(--brand)] text-white" : "text-[var(--fg-muted)]"}`}
                >
                  Python
                </button>
                <button
                  type="button"
                  onClick={() => setApiTab("curl")}
                  className={`rounded px-2 py-1 ${apiTab === "curl" ? "bg-[var(--brand)] text-white" : "text-[var(--fg-muted)]"}`}
                >
                  cURL
                </button>
              </div>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-[10px] leading-relaxed">
              {apiTab === "python" ? (
                <>
                  <span className="text-[#c792ea]">from</span> zebpay <span className="text-[#c792ea]">import</span> Client{"\n"}
                  <span className="text-[#82aaff]">client</span> = Client(api_key=<span className="text-[#c3e88d]">&quot;…&quot;</span>){"\n"}
                  <span className="text-[#82aaff]">order</span> = client.buy(<span className="text-[#c3e88d]">&quot;BTC-INR&quot;</span>, qty=<span className="text-[#f78c6c]">0.01</span>)
                </>
              ) : (
                <>
                  <span className="text-[#c792ea]">curl</span> -X POST https://api.zebpay.com/v1/orders \{"\n"}
                  {"  "}-H <span className="text-[#c3e88d]">&quot;Authorization: Bearer …&quot;</span> \{"\n"}
                  {"  "}-d <span className="text-[#c3e88d]">&apos;{`{"pair":"BTC-INR","side":"buy"}`}&apos;</span>
                </>
              )}
            </pre>
          </article>

          <article className="bento-cell col-span-2 row-span-1 rounded-3xl border border-[var(--border)] bg-[#1a1400] p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-black text-[var(--gold)]">Options</h3>
              <span className="rounded bg-[var(--gold)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--navy)]">Coming soon</span>
            </div>
            <svg viewBox="0 0 280 80" className="mt-2 w-full">
              <path d="M0 60 Q70 10 140 35 T280 25" fill="none" stroke="var(--gold)" strokeWidth={2.5} />
              <circle cx={140} cy={35} r={5} fill="var(--gold)" />
              <circle cx={200} cy={28} r={4} fill="#fff" opacity={0.6} />
              <text x={138} y={52} textAnchor="middle" fill="#888" fontSize={9}>
                Strike
              </text>
            </svg>
          </article>
        </div>
      </div>
    </section>
  );
}
