"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  earnApyCalc,
  expertRoiCalc,
  futuresMarginCalc,
  optionsPayoffCalc,
  packReturnCalc,
  rmsRiskCalc,
  sipWealthCalc,
  spotFeeCalc,
  subAccountSplitCalc
} from "@/lib/calculators";
import { BTC_INR } from "@/lib/market-data";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type CalcId =
  | "spot"
  | "futures"
  | "sip"
  | "packs"
  | "earn"
  | "expert"
  | "rms"
  | "subs"
  | "options";

const TABS: { id: CalcId; label: string; desc: string }[] = [
  { id: "spot", label: "Spot fees", desc: "Buy/sell cost breakdown" },
  { id: "futures", label: "Futures margin", desc: "PnL & liquidation" },
  { id: "sip", label: "Crypto SIP", desc: "Wealth over time" },
  { id: "packs", label: "CryptoPacks", desc: "Basket growth" },
  { id: "earn", label: "Earn APY", desc: "Staking yield" },
  { id: "expert", label: "Expert trades", desc: "Signal ROI" },
  { id: "rms", label: "RMS", desc: "TP / SL levels" },
  { id: "subs", label: "Sub accounts", desc: "Capital split" },
  { id: "options", label: "Options", desc: "Payoff at expiry" }
];

function areaPath(values: number[], w: number, h: number, pad = 8): string {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1 || 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `${pts.join(" ")} L${w - pad} ${h - pad} L${pad} ${h - pad} Z`;
}

function linePath(values: number[], w: number, h: number, pad = 8): string {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1 || 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const inputCls =
  "mt-2 w-full rounded-xl border border-[var(--border-dark)] bg-[var(--surface-dark)] px-4 py-3 text-[var(--text-on-dark)] focus:border-[var(--cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)]";

export function CalculatorHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [tab, setTab] = useState<CalcId>("spot");

  const [spot, setSpot] = useState({ amount: 50000, fee: 0.2, side: "buy" as "buy" | "sell" });
  const [futures, setFutures] = useState({ margin: 10000, leverage: 10, move: 5, dir: "LONG" as "LONG" | "SHORT" });
  const [sip, setSip] = useState({ monthly: 5000, years: 5, ret: 12 });
  const [packs, setPacks] = useState({ monthly: 3000, years: 3, cagr: 18 });
  const [earn, setEarn] = useState({ principal: 100000, apy: 8.5, months: 12 });
  const [expert, setExpert] = useState({ allocation: 50000, monthlyRet: 3, months: 6 });
  const [rms, setRms] = useState({ entry: BTC_INR, tp: 8, sl: 4, current: BTC_INR * 1.02 });
  const [subs, setSubs] = useState({ total: 200000, w1: 50, w2: 30, w3: 20 });
  const [options, setOptions] = useState({
    spot: BTC_INR,
    strike: BTC_INR * 0.95,
    premium: 50000,
    type: "call" as "call" | "put",
    contracts: 1
  });

  const viz = (() => {
    switch (tab) {
      case "spot": {
        const r = spotFeeCalc({ amountInr: spot.amount, feePercent: spot.fee, side: spot.side });
        return {
          kind: "area" as const,
          path: areaPath([spot.amount, r.totalCost, r.netReceived], 320, 200),
          summary: [
            { k: "Fee", v: `₹${Math.round(r.fee).toLocaleString("en-IN")}` },
            { k: spot.side === "buy" ? "Total cost" : "Net received", v: `₹${Math.round(spot.side === "buy" ? r.totalCost : r.netReceived).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "futures": {
        const r = futuresMarginCalc({
          marginInr: futures.margin,
          leverage: futures.leverage,
          priceMovePercent: futures.move,
          direction: futures.dir
        });
        const pts = [-10, -5, 0, futures.move, 10, 15].map((m) => {
          const x = futuresMarginCalc({
            marginInr: futures.margin,
            leverage: futures.leverage,
            priceMovePercent: m,
            direction: futures.dir
          });
          return x.estimatedPnl;
        });
        return {
          kind: "line" as const,
          path: linePath(pts, 320, 200),
          line2: `M${160} 8 L${160} 192`,
          summary: [
            { k: "Est. PnL", v: `₹${Math.round(r.estimatedPnl).toLocaleString("en-IN")}` },
            { k: "Liq. price", v: `₹${Math.round(r.liquidationPrice).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "sip": {
        const r = sipWealthCalc({ monthly: sip.monthly, years: sip.years, annualReturnPercent: sip.ret });
        return {
          kind: "area" as const,
          path: areaPath(r.yearlyBalances, 320, 200),
          summary: [
            { k: "Invested", v: `₹${Math.round(r.totalInvested).toLocaleString("en-IN")}` },
            { k: "Final value", v: `₹${Math.round(r.finalValue).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "packs": {
        const r = packReturnCalc({
          monthlyContribution: packs.monthly,
          years: packs.years,
          cagrPercent: packs.cagr
        });
        return {
          kind: "bars" as const,
          bars: [
            { label: "Invested", pct: (r.totalInvested / r.projectedValue) * 100, color: "#1b55e0" },
            { label: "Gains", pct: (r.gains / r.projectedValue) * 100, color: "#00b07a" }
          ],
          summary: [
            { k: "Projected", v: `₹${Math.round(r.projectedValue).toLocaleString("en-IN")}` },
            { k: "Gains", v: `₹${Math.round(r.gains).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "earn": {
        const r = earnApyCalc({ principal: earn.principal, apyPercent: earn.apy, months: earn.months });
        return {
          kind: "area" as const,
          path: areaPath(r.monthlyBalances, 320, 200),
          summary: [
            { k: "Earnings", v: `₹${Math.round(r.earnings).toLocaleString("en-IN")}` },
            { k: "Final balance", v: `₹${Math.round(r.finalBalance).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "expert": {
        const r = expertRoiCalc({
          allocationInr: expert.allocation,
          monthlyReturnPercent: expert.monthlyRet,
          months: expert.months
        });
        const bench = Array.from({ length: expert.months + 1 }, (_, i) => expert.allocation * Math.pow(1.01, i));
        const strat = Array.from({ length: expert.months + 1 }, (_, i) =>
          expert.allocation * Math.pow(1 + expert.monthlyRet / 100, i)
        );
        return {
          kind: "dual" as const,
          path: linePath(strat, 320, 200),
          line2: linePath(bench, 320, 200),
          summary: [
            { k: "ROI", v: `${r.roiPercent.toFixed(1)}%` },
            { k: "PnL", v: `₹${Math.round(r.pnl).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "rms": {
        const r = rmsRiskCalc({
          entryPrice: rms.entry,
          takeProfitPercent: rms.tp,
          stopLossPercent: rms.sl,
          currentPrice: rms.current
        });
        return {
          kind: "rms" as const,
          tp: r.tpPrice,
          sl: r.slPrice,
          progress: r.progressPercent,
          rr: r.riskRewardRatio,
          summary: [
            { k: "TP", v: `₹${Math.round(r.tpPrice).toLocaleString("en-IN")}` },
            { k: "SL", v: `₹${Math.round(r.slPrice).toLocaleString("en-IN")}` }
          ]
        };
      }
      case "subs": {
        const r = subAccountSplitCalc({ totalInr: subs.total, weights: [subs.w1, subs.w2, subs.w3] });
        return {
          kind: "cols" as const,
          cols: r.allocations,
          summary: r.allocations.map((a) => ({
            k: `Wallet ${a.index}`,
            v: `₹${Math.round(a.amount).toLocaleString("en-IN")}`
          }))
        };
      }
      case "options": {
        const r = optionsPayoffCalc({
          spotPrice: options.spot,
          strikePrice: options.strike,
          premium: options.premium,
          type: options.type,
          contracts: options.contracts
        });
        const spots = Array.from({ length: 21 }, (_, i) => options.strike * (0.85 + i * 0.015));
        const payoffs = spots.map((s) =>
          optionsPayoffCalc({
            spotPrice: s,
            strikePrice: options.strike,
            premium: options.premium,
            type: options.type,
            contracts: options.contracts
          }).netPnl
        );
        return {
          kind: "line" as const,
          path: linePath(payoffs, 320, 200),
          be: options.type === "call" ? r.breakEven : r.breakEven,
          strike: options.strike,
          summary: [
            { k: "Net PnL", v: `₹${Math.round(r.netPnl).toLocaleString("en-IN")}` },
            { k: "Break-even", v: `₹${Math.round(r.breakEven).toLocaleString("en-IN")}` }
          ]
        };
      }
      default:
        return { kind: "area" as const, path: "", summary: [] };
    }
  })();

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      gsap.from(sectionRef.current.querySelectorAll(".calc-tab"), {
        opacity: 0,
        x: -12,
        stagger: 0.04,
        duration: 0.5,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: "#calculators", start: "top 75%", once: true }
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const path = pathRef.current;
      const line = lineRef.current;
      if (prefersReducedMotion()) return;
      if (path && "path" in viz && viz.path) {
        gsap.to(path, { attr: { d: viz.path }, duration: 0.55, ease: ZEB_EASE });
      }
      if (line && "line2" in viz && typeof viz.line2 === "string") {
        gsap.to(line, { attr: { d: viz.line2 }, duration: 0.55, ease: ZEB_EASE });
      }
    },
    { dependencies: [viz, tab] }
  );

  const switchTab = (id: CalcId) => {
    if (!prefersReducedMotion()) {
      gsap.fromTo(".calc-body", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: ZEB_EASE });
    }
    setTab(id);
  };

  return (
    <section id="calculators" ref={sectionRef} className="scroll-mt-24 bg-[#040812] px-6 py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[var(--text-on-dark)]">Run the numbers.</h2>
        <p className="mt-3 text-lg text-[var(--text-muted-dark)]">
          Every product, real formulas, instant projections.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]">
          <ul className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => switchTab(t.id)}
                  className={`calc-tab w-full rounded-xl border px-4 py-3 text-left transition ${
                    tab === t.id
                      ? "border-l-4 border-l-[var(--cyan)] border-[var(--border-dark)] bg-[var(--surface-dark)]"
                      : "border-transparent text-[var(--text-muted-dark)] hover:bg-white/5"
                  }`}
                >
                  <span className="block text-sm font-bold text-[var(--text-on-dark)]">{t.label}</span>
                  <span className="mt-0.5 block text-xs opacity-80">{t.desc}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="calc-body grid min-h-[640px] gap-8 rounded-3xl border border-[var(--border-dark)] bg-[#0a0f2e] p-6 lg:grid-cols-2 lg:p-8">
            <div className="space-y-4">
              {tab === "spot" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Amount (INR)
                    <input type="number" className={inputCls} value={spot.amount} onChange={(e) => setSpot({ ...spot, amount: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Fee %
                    <input type="number" step="0.01" className={inputCls} value={spot.fee} onChange={(e) => setSpot({ ...spot, fee: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Side
                    <select className={inputCls} value={spot.side} onChange={(e) => setSpot({ ...spot, side: e.target.value as "buy" | "sell" })}>
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                  </label>
                </>
              )}
              {tab === "futures" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Margin (INR)
                    <input type="number" className={inputCls} value={futures.margin} onChange={(e) => setFutures({ ...futures, margin: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Leverage
                    <input type="number" className={inputCls} value={futures.leverage} onChange={(e) => setFutures({ ...futures, leverage: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Price move %
                    <input type="number" className={inputCls} value={futures.move} onChange={(e) => setFutures({ ...futures, move: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Direction
                    <select className={inputCls} value={futures.dir} onChange={(e) => setFutures({ ...futures, dir: e.target.value as "LONG" | "SHORT" })}>
                      <option value="LONG">Long</option>
                      <option value="SHORT">Short</option>
                    </select>
                  </label>
                </>
              )}
              {tab === "sip" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Monthly (INR)
                    <input type="number" className={inputCls} value={sip.monthly} onChange={(e) => setSip({ ...sip, monthly: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Years
                    <input type="number" className={inputCls} value={sip.years} onChange={(e) => setSip({ ...sip, years: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Annual return %
                    <input type="number" className={inputCls} value={sip.ret} onChange={(e) => setSip({ ...sip, ret: +e.target.value })} />
                  </label>
                </>
              )}
              {tab === "packs" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Monthly (INR)
                    <input type="number" className={inputCls} value={packs.monthly} onChange={(e) => setPacks({ ...packs, monthly: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Years
                    <input type="number" className={inputCls} value={packs.years} onChange={(e) => setPacks({ ...packs, years: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    CAGR %
                    <input type="number" className={inputCls} value={packs.cagr} onChange={(e) => setPacks({ ...packs, cagr: +e.target.value })} />
                  </label>
                </>
              )}
              {tab === "earn" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Principal (INR)
                    <input type="number" className={inputCls} value={earn.principal} onChange={(e) => setEarn({ ...earn, principal: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    APY %
                    <input type="number" step="0.1" className={inputCls} value={earn.apy} onChange={(e) => setEarn({ ...earn, apy: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Months
                    <select className={inputCls} value={earn.months} onChange={(e) => setEarn({ ...earn, months: +e.target.value })}>
                      {[3, 6, 12, 24].map((m) => (
                        <option key={m} value={m}>
                          {m} months
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
              {tab === "expert" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Allocation (INR)
                    <input type="number" className={inputCls} value={expert.allocation} onChange={(e) => setExpert({ ...expert, allocation: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Monthly return %
                    <input type="number" className={inputCls} value={expert.monthlyRet} onChange={(e) => setExpert({ ...expert, monthlyRet: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Months
                    <input type="number" className={inputCls} value={expert.months} onChange={(e) => setExpert({ ...expert, months: +e.target.value })} />
                  </label>
                </>
              )}
              {tab === "rms" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Entry price
                    <input type="number" className={inputCls} value={rms.entry} onChange={(e) => setRms({ ...rms, entry: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Take profit %
                    <input type="number" className={inputCls} value={rms.tp} onChange={(e) => setRms({ ...rms, tp: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Stop loss %
                    <input type="number" className={inputCls} value={rms.sl} onChange={(e) => setRms({ ...rms, sl: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Current price
                    <input type="number" className={inputCls} value={rms.current} onChange={(e) => setRms({ ...rms, current: +e.target.value })} />
                  </label>
                </>
              )}
              {tab === "subs" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Total (INR)
                    <input type="number" className={inputCls} value={subs.total} onChange={(e) => setSubs({ ...subs, total: +e.target.value })} />
                  </label>
                  {(["w1", "w2", "w3"] as const).map((k, i) => (
                    <label key={k} className="block text-sm text-[var(--text-muted-dark)]">
                      Wallet {i + 1} weight
                      <input type="number" className={inputCls} value={subs[k]} onChange={(e) => setSubs({ ...subs, [k]: +e.target.value })} />
                    </label>
                  ))}
                </>
              )}
              {tab === "options" && (
                <>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Spot price
                    <input type="number" className={inputCls} value={options.spot} onChange={(e) => setOptions({ ...options, spot: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Strike
                    <input type="number" className={inputCls} value={options.strike} onChange={(e) => setOptions({ ...options, strike: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Premium
                    <input type="number" className={inputCls} value={options.premium} onChange={(e) => setOptions({ ...options, premium: +e.target.value })} />
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Type
                    <select className={inputCls} value={options.type} onChange={(e) => setOptions({ ...options, type: e.target.value as "call" | "put" })}>
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                    </select>
                  </label>
                  <label className="block text-sm text-[var(--text-muted-dark)]">
                    Contracts
                    <input type="number" className={inputCls} value={options.contracts} onChange={(e) => setOptions({ ...options, contracts: +e.target.value })} />
                  </label>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <svg viewBox="0 0 320 200" className="h-[200px] w-full shrink-0">
                {viz.kind === "area" && "path" in viz && (
                  <path ref={pathRef} d={viz.path} fill="rgba(0,184,230,0.12)" stroke="var(--cyan)" strokeWidth={2} />
                )}
                {viz.kind === "line" && "path" in viz && (
                  <>
                    <path ref={pathRef} d={viz.path} fill="none" stroke="var(--cyan)" strokeWidth={2.5} />
                    {"line2" in viz && typeof viz.line2 === "string" && viz.line2.length > 20 && (
                      <path ref={lineRef} d={viz.line2} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4 4" />
                    )}
                    {tab === "futures" && (
                      <line x1={160} y1={8} x2={160} y2={192} stroke="#ff4d6a" strokeWidth={1} strokeDasharray="3 3" />
                    )}
                  </>
                )}
                {viz.kind === "dual" && "path" in viz && (
                  <>
                    <path ref={pathRef} d={viz.path} fill="none" stroke="var(--cyan)" strokeWidth={2.5} />
                    {"line2" in viz && <path ref={lineRef} d={viz.line2} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />}
                  </>
                )}
                {viz.kind === "bars" && "bars" in viz && (
                  <g transform="translate(16 80)">
                    {viz.bars.map((b, i) => (
                      <g key={b.label} transform={`translate(0 ${i * 36})`}>
                        <text x={0} y={12} fill="#888" fontSize={11}>
                          {b.label}
                        </text>
                        <rect x={80} y={0} width={220 * (b.pct / 100)} height={20} rx={4} fill={b.color} />
                      </g>
                    ))}
                  </g>
                )}
                {viz.kind === "rms" && "progress" in viz && (
                  <g transform="translate(60 20)">
                    <circle cx={50} cy={80} r={42} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
                    <circle
                      cx={50}
                      cy={80}
                      r={42}
                      fill="none"
                      stroke="#ff4d6a"
                      strokeWidth={8}
                      strokeDasharray={`${(viz.progress / 100) * 264} 264`}
                      transform="rotate(-90 50 80)"
                    />
                    <circle cx={200} cy={80} r={42} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
                    <circle
                      cx={200}
                      cy={80}
                      r={42}
                      fill="none"
                      stroke="#00b07a"
                      strokeWidth={8}
                      strokeDasharray={`${Math.min(viz.rr * 40, 264)} 264`}
                      transform="rotate(-90 200 80)"
                    />
                    <text x={50} y={86} textAnchor="middle" fill="#fff" fontSize={10}>
                      SL
                    </text>
                    <text x={200} y={86} textAnchor="middle" fill="#fff" fontSize={10}>
                      TP
                    </text>
                  </g>
                )}
                {viz.kind === "cols" && "cols" in viz && (
                  <g transform="translate(40 24)">
                    {viz.cols.map((c, i) => {
                      const h = (c.percent / 100) * 140;
                      const colors = ["#1b55e0", "#00b8e6", "#00b07a"];
                      return (
                        <g key={c.index} transform={`translate(${i * 90} 0)`}>
                          <rect x={0} y={160 - h} width={56} height={h} rx={6} fill={colors[i]} />
                          <text x={28} y={178} textAnchor="middle" fill="#888" fontSize={10}>
                            W{c.index}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {viz.summary.map((s) => (
                  <div key={s.k} className="rounded-xl border border-[var(--border-dark)] bg-[var(--surface-dark)] p-4">
                    <p className="text-xs text-[var(--text-muted-dark)]">{s.k}</p>
                    <p className="text-lg font-black text-white">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
