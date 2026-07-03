"use client";

import { useState } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { LINKS } from "@/lib/links";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { CalcShell, RangeField, ResultBox, ResultRow } from "../calculator-ui";
import { formatInr } from "@/lib/format";
import { makeLinePath } from "@/lib/charts";
import { BTC_INR, PACKS, type PackId } from "@/lib/market-data";
import {
  spotFeeCalc,
  futuresMarginCalc,
  earnApyCalc,
  packReturnCalc,
  sipWealthCalc,
  expertRoiCalc,
  rmsRiskCalc,
  subAccountSplitCalc,
  optionsPayoffCalc
} from "@/lib/calculators";

type TabId =
  | "spot"
  | "futures"
  | "earn"
  | "packs"
  | "sip"
  | "expert"
  | "ai"
  | "api"
  | "rms"
  | "subaccounts"
  | "options";

const TABS: { id: TabId; label: string; tag?: string; tagStyle?: "new" | "soon" | "hot" }[] = [
  { id: "spot", label: "Spot" },
  { id: "futures", label: "Futures", tag: "25x" },
  { id: "earn", label: "Earn", tag: "8.5%" },
  { id: "packs", label: "CryptoPacks" },
  { id: "sip", label: "SIP" },
  { id: "expert", label: "Expert Trades", tag: "HOT", tagStyle: "hot" },
  { id: "ai", label: "AI Insights", tag: "NEW", tagStyle: "new" },
  { id: "api", label: "Trading APIs" },
  { id: "rms", label: "RMS" },
  { id: "subaccounts", label: "Sub Accounts" },
  { id: "options", label: "Options", tag: "Soon", tagStyle: "soon" }
];

const CODE = {
  py: `from zebpay import Client\nclient = Client(api_key="...", api_secret="...")\norder = client.place_order(pair="BTC-INR", side="BUY", type="MARKET", quantity=0.05)`,
  js: `import { Zebpay } from '@zebpay/sdk';\nconst order = await client.placeOrder({ pair: 'BTC-INR', side: 'BUY', type: 'MARKET', quantity: 0.05 });`,
  curl: `curl -X POST https://api.zebpay.com/v2/orders -H "X-API-KEY: $KEY" -d '{"pair":"BTC-INR","side":"BUY"}'`
};

const EXPERTS = [
  { name: "Vikram K.", wr: "78%", side: "LONG", pair: "BTC", entry: "₹73.5L → ₹78L" },
  { name: "Priya M.", wr: "82%", side: "SHORT", pair: "SOL", entry: "₹10,250 → ₹9,400" },
  { name: "Rohit A.", wr: "71%", side: "LONG", pair: "ETH", entry: "₹2.48L → ₹2.72L" }
];

function Chart({ data, id }: { data: number[]; id: string }) {
  const { line, area } = makeLinePath(data, 400, 120);
  return (
    <svg viewBox="0 0 400 120" className="mt-2 h-[120px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--brand)" strokeWidth={2} />
    </svg>
  );
}

function SpotPanel() {
  const [amt, setAmt] = useState(50000);
  const [fee, setFee] = useState(0.15);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const r = spotFeeCalc({ amountInr: amt, feePercent: fee, side });
  return (
    <CalcShell label="Fee calculator" title="Spot order cost">
      <div className="mb-3 flex gap-2">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`flex-1 rounded-lg py-2 text-sm font-bold capitalize ${side === s ? "bg-[var(--cyan)] text-[var(--navy)]" : "bg-[var(--surface-strong)]"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <RangeField label="Amount (₹)" value={amt} display={formatInr(amt)} min={1000} max={500000} step={1000} onChange={setAmt} />
      <RangeField label="Fee %" value={fee} display={`${fee}%`} min={0.05} max={0.5} step={0.01} onChange={setFee} />
      <ResultBox>
        <ResultRow label="Trading fee" value={formatInr(Math.round(r.fee))} />
        <ResultRow label={side === "buy" ? "Total cost" : "Net received"} value={formatInr(Math.round(side === "buy" ? r.totalCost : r.netReceived))} highlight="success" />
      </ResultBox>
    </CalcShell>
  );
}

function FuturesPanel() {
  const [margin, setMargin] = useState(10000);
  const [lev, setLev] = useState(10);
  const [move, setMove] = useState(5);
  const [dir, setDir] = useState<"LONG" | "SHORT">("LONG");
  const r = futuresMarginCalc({ marginInr: margin, leverage: lev, priceMovePercent: move, direction: dir });
  return (
    <CalcShell label="PnL simulator" title="Leveraged futures trade">
      <div className="mb-3 flex gap-2">
        {(["LONG", "SHORT"] as const).map((d) => (
          <button key={d} type="button" onClick={() => setDir(d)} className={`flex-1 rounded-lg py-2 text-sm font-bold ${dir === d ? (d === "LONG" ? "bg-[var(--cyan)] text-[var(--navy)]" : "bg-[var(--danger)]") : "bg-[var(--surface-strong)]"}`}>
            {d}
          </button>
        ))}
      </div>
      <RangeField label="Margin (₹)" value={margin} display={formatInr(margin)} min={1000} max={100000} step={1000} onChange={setMargin} />
      <RangeField label="Leverage" value={lev} display={`${lev}x`} min={1} max={25} onChange={setLev} />
      <RangeField label="Price move %" value={move} display={`${move >= 0 ? "+" : ""}${move}%`} min={-20} max={20} onChange={setMove} />
      <ResultBox>
        <ResultRow label="Position size" value={formatInr(Math.round(r.positionSize))} />
        <ResultRow label="Est. PnL" value={`${r.estimatedPnl >= 0 ? "+" : ""}${formatInr(Math.round(r.estimatedPnl))}`} highlight={r.estimatedPnl >= 0 ? "success" : "danger"} />
        <ResultRow label="Liquidation @" value={formatInr(Math.round(r.liquidationPrice))} />
      </ResultBox>
    </CalcShell>
  );
}

function EarnPanel() {
  const [apy, setApy] = useState(8.5);
  const [amt, setAmt] = useState(100000);
  const [dur, setDur] = useState(12);
  const r = earnApyCalc({ principal: amt, apyPercent: apy, months: dur });
  return (
    <CalcShell label="APY calculator" title="Projected earnings">
      <select value={apy} onChange={(e) => setApy(parseFloat(e.target.value))} className="mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm">
        <option value={8.5}>USDT — 8.5% APY</option>
        <option value={6}>BTC — 6% APY</option>
        <option value={5}>ETH — 5% APY</option>
      </select>
      <RangeField label="Principal (₹)" value={amt} display={formatInr(amt)} min={10000} max={1000000} step={10000} onChange={setAmt} />
      <RangeField label="Months" value={dur} display={String(dur)} min={1} max={36} onChange={setDur} />
      <Chart data={r.monthlyBalances} id="earnChart" />
      <ResultBox>
        <ResultRow label="Earnings" value={formatInr(Math.round(r.earnings))} highlight="success" />
        <ResultRow label="Total balance" value={formatInr(Math.round(r.finalBalance))} />
      </ResultBox>
    </CalcShell>
  );
}

function PacksPanel() {
  const [pack, setPack] = useState<PackId>("defi");
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(3);
  const p = PACKS[pack];
  const r = packReturnCalc({ monthlyContribution: monthly, years, cagrPercent: p.cagr });
  return (
    <CalcShell label="Pack estimator" title={p.name}>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {(Object.keys(PACKS) as PackId[]).map((k) => (
          <button key={k} type="button" onClick={() => setPack(k)} className={`rounded-lg border p-2 text-left text-xs font-bold ${pack === k ? "border-[var(--cyan)] bg-[var(--surface-strong)]" : "border-transparent bg-[var(--surface)]"}`}>
            {PACKS[k].name}
            <span className="block text-[var(--success)]">+{PACKS[k].ret}% YTD</span>
          </button>
        ))}
      </div>
      <RangeField label="Monthly (₹)" value={monthly} display={formatInr(monthly)} min={500} max={50000} step={500} onChange={setMonthly} />
      <RangeField label="Years" value={years} display={String(years)} min={1} max={10} onChange={setYears} />
      <ResultBox>
        <ResultRow label="Invested" value={formatInr(Math.round(r.totalInvested))} />
        <ResultRow label="Projected" value={formatInr(Math.round(r.projectedValue))} highlight="success" />
      </ResultBox>
    </CalcShell>
  );
}

function SipPanel() {
  const [m, setM] = useState(5000);
  const [y, setY] = useState(5);
  const [ret, setRet] = useState(25);
  const r = sipWealthCalc({ monthly: m, years: y, annualReturnPercent: ret });
  return (
    <CalcShell label="SIP calculator" title="Project your wealth">
      <RangeField label="Monthly" value={m} display={formatInr(m)} min={500} max={50000} step={500} onChange={setM} />
      <RangeField label="Years" value={y} display={String(y)} min={1} max={20} onChange={setY} />
      <RangeField label="Return %" value={ret} display={`${ret}%`} min={5} max={60} onChange={setRet} />
      <Chart data={r.yearlyBalances} id="sipChart" />
      <ResultBox>
        <ResultRow label="Invested" value={formatInr(r.totalInvested)} />
        <ResultRow label="Final value" value={formatInr(Math.round(r.finalValue))} highlight="success" />
      </ResultBox>
    </CalcShell>
  );
}

function ExpertPanel() {
  const [alloc, setAlloc] = useState(50000);
  const [ret, setRet] = useState(8);
  const [months, setMonths] = useState(6);
  const r = expertRoiCalc({ allocationInr: alloc, monthlyReturnPercent: ret, months });
  return (
    <div className="space-y-4">
      <CalcShell label="Copy-trade ROI" title="Follow expert signals">
        <RangeField label="Allocation (₹)" value={alloc} display={formatInr(alloc)} min={5000} max={500000} step={5000} onChange={setAlloc} />
        <RangeField label="Avg monthly return %" value={ret} display={`${ret}%`} min={2} max={25} onChange={setRet} />
        <RangeField label="Months" value={months} display={String(months)} min={1} max={24} onChange={setMonths} />
        <ResultBox>
          <ResultRow label="Projected PnL" value={`+${formatInr(Math.round(r.pnl))}`} highlight="success" />
          <ResultRow label="ROI" value={`+${r.roiPercent.toFixed(1)}%`} />
        </ResultBox>
      </CalcShell>
      <div className="space-y-2">
        {EXPERTS.map((e) => (
          <div key={e.name} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm">
            <div className="flex justify-between font-bold">
              <span>{e.name}</span>
              <span className="text-[var(--success)]">{e.wr} win rate</span>
            </div>
            <div className="mt-1 text-[var(--fg-muted)]">
              {e.side} {e.pair} · {e.entry}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiPanel() {
  const [sentiment, setSentiment] = useState(72);
  return (
    <CalcShell label="Live preview" title="AI market insights">
      <p className="mb-4 text-sm text-[var(--fg-muted)]">Interactive sentiment demo — full analysis in the ZebPay app.</p>
      <RangeField label="BTC sentiment score" value={sentiment} display={`${sentiment}/100`} min={0} max={100} onChange={setSentiment} />
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div className="h-full rounded-full bg-gradient-to-r from-[var(--danger)] via-[var(--gold)] to-[var(--success)] transition-all" style={{ width: `${sentiment}%` }} />
      </div>
      <p className="mt-4 text-sm font-bold">
        {sentiment >= 60 ? "🟢 Bullish" : sentiment >= 40 ? "🟡 Neutral" : "🔴 Bearish"} — AI suggests{" "}
        {sentiment >= 60 ? "cautious long bias on majors" : "reduce leverage, tighten RMS"}
      </p>
      <a href={LINKS.getStarted} className="mt-4 inline-block text-sm font-bold text-[var(--cyan)]">
        See live in app →
      </a>
    </CalcShell>
  );
}

function ApiPanel() {
  const [lang, setLang] = useState<"py" | "js" | "curl">("js");
  return (
    <CalcShell label="Developer" title="Trading APIs">
      <div className="mb-3 flex gap-2">
        {(["py", "js", "curl"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)} className={`rounded px-3 py-1 text-xs font-bold uppercase ${lang === l ? "bg-[var(--cyan)] text-[var(--navy)]" : "bg-[var(--surface-strong)]"}`}>
            {l}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-[11px] leading-relaxed text-[var(--fg-muted)]">{CODE[lang]}</pre>
      <ResultBox>
        <ResultRow label="Rate limit" value="120 req/min" />
        <ResultRow label="Avg latency" value="&lt; 50ms" />
        <ResultRow label="Spot + Futures" value="✓ Supported" highlight="success" />
      </ResultBox>
    </CalcShell>
  );
}

function RmsPanel() {
  const [tp, setTp] = useState(8);
  const [sl, setSl] = useState(4);
  const entry = 7350000;
  const r = rmsRiskCalc({ entryPrice: entry, takeProfitPercent: tp, stopLossPercent: sl, currentPrice: BTC_INR });
  return (
    <CalcShell label="RMS demo" title="Set your safety net">
      <RangeField label="Take-profit" value={tp} display={`+${tp}%`} min={1} max={30} onChange={setTp} />
      <RangeField label="Stop-loss" value={sl} display={`-${sl}%`} min={1} max={20} onChange={setSl} />
      <div className="relative my-4 h-2 rounded bg-[var(--surface-strong)]">
        <div className="absolute inset-y-0 left-0 rounded bg-gradient-to-r from-[var(--danger)] via-[var(--gold)] to-[var(--success)] transition-all" style={{ width: `${r.progressPercent}%` }} />
      </div>
      <ResultBox>
        <ResultRow label="TP price" value={formatInr(Math.round(r.tpPrice))} highlight="success" />
        <ResultRow label="SL price" value={formatInr(Math.round(r.slPrice))} highlight="danger" />
        <ResultRow label="Risk : Reward" value={`1 : ${r.riskRewardRatio.toFixed(1)}`} />
      </ResultBox>
    </CalcShell>
  );
}

function SubAccountsPanel() {
  const [total, setTotal] = useState(500000);
  const [w1, setW1] = useState(50);
  const [w2, setW2] = useState(30);
  const [w3, setW3] = useState(20);
  const { allocations } = subAccountSplitCalc({ totalInr: total, weights: [w1, w2, w3] });
  return (
    <CalcShell label="Capital split" title="Sub account allocator">
      <p className="mb-3 text-xs text-[var(--fg-muted)]">Separate trading, earn, and bot wallets with isolated API keys.</p>
      <RangeField label="Total capital (₹)" value={total} display={formatInr(total)} min={50000} max={5000000} step={50000} onChange={setTotal} />
      <RangeField label="Trading %" value={w1} display={`${w1}%`} min={10} max={80} onChange={setW1} />
      <RangeField label="Earn %" value={w2} display={`${w2}%`} min={10} max={80} onChange={setW2} />
      <RangeField label="Bot/API %" value={w3} display={`${w3}%`} min={10} max={80} onChange={setW3} />
      <ResultBox>
        {allocations.map((a) => (
          <ResultRow key={a.index} label={`Sub-account ${a.index}`} value={`${a.percent.toFixed(0)}% · ${formatInr(Math.round(a.amount))}`} />
        ))}
      </ResultBox>
    </CalcShell>
  );
}

function OptionsPanel() {
  const [spot, setSpot] = useState(BTC_INR);
  const [strike, setStrike] = useState(7500000);
  const [premium, setPremium] = useState(85000);
  const r = optionsPayoffCalc({ spotPrice: spot, strikePrice: strike, premium, type: "call", contracts: 1 });
  return (
    <CalcShell label="Preview" title="Options trading — coming soon">
      <span className="mb-3 inline-block rounded bg-[var(--gold)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--navy)]">COMING SOON</span>
      <RangeField label="Spot (₹)" value={spot} display={formatInr(spot)} min={5000000} max={9000000} step={50000} onChange={setSpot} />
      <RangeField label="Strike (₹)" value={strike} display={formatInr(strike)} min={5000000} max={9000000} step={50000} onChange={setStrike} />
      <RangeField label="Premium (₹)" value={premium} display={formatInr(premium)} min={10000} max={200000} step={5000} onChange={setPremium} />
      <ResultBox>
        <ResultRow label="Intrinsic (preview)" value={formatInr(Math.round(r.intrinsicAtSpot))} />
        <ResultRow label="Net PnL (preview)" value={formatInr(Math.round(r.netPnl))} highlight={r.netPnl >= 0 ? "success" : "danger"} />
        <ResultRow label="Break-even" value={formatInr(Math.round(r.breakEven))} />
      </ResultBox>
      <a href={LINKS.getStarted} className="mt-3 inline-block text-sm font-bold text-[var(--cyan)]">
        Join waitlist →
      </a>
    </CalcShell>
  );
}

function Panel({ tab }: { tab: TabId }) {
  switch (tab) {
    case "spot": return <SpotPanel />;
    case "futures": return <FuturesPanel />;
    case "earn": return <EarnPanel />;
    case "packs": return <PacksPanel />;
    case "sip": return <SipPanel />;
    case "expert": return <ExpertPanel />;
    case "ai": return <AiPanel />;
    case "api": return <ApiPanel />;
    case "rms": return <RmsPanel />;
    case "subaccounts": return <SubAccountsPanel />;
    case "options": return <OptionsPanel />;
  }
}

const COPY: Record<TabId, { title: string; bullets: string[] }> = {
  spot: { title: "Spot trading", bullets: ["400+ INR pairs", "Market & limit orders", "0.10% / 0.15% fees"] },
  futures: { title: "Futures up to 25x", bullets: ["Perpetual contracts", "Cross & isolated margin", "Integrated RMS"] },
  earn: { title: "Earn yield", bullets: ["Up to 8.5% APY", "Flexible or locked", "Daily interest credit"] },
  packs: { title: "CryptoPacks", bullets: ["Curated themes", "One-tap diversify", "Rebalance alerts"] },
  sip: { title: "Crypto SIP", bullets: ["Auto-invest monthly", "Pause anytime", "Track projected wealth"] },
  expert: { title: "Expert Trades", bullets: ["Follow pro futures signals", "Transparent win rates", "One-tap copy setup"] },
  ai: { title: "AI Insights", bullets: ["Pair sentiment scores", "Trade bias suggestions", "Updated every 4h"] },
  api: { title: "Trading APIs", bullets: ["REST + WebSocket", "Spot & futures", "Sub-account keys"] },
  rms: { title: "Risk Management", bullets: ["Auto TP/SL", "Position-level limits", "87% traders enable RMS"] },
  subaccounts: { title: "Sub Accounts", bullets: ["Isolated balances", "Per-strategy API keys", "Family/office splits"] },
  options: { title: "Options", bullets: ["Calls & puts on majors", "INR-settled", "Launching soon"] }
};

export function FeatureHub() {
  const [tab, setTab] = useState<TabId>("spot");
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const copy = COPY[tab];

  const switchTab = (newTab: TabId) => {
    if (newTab === tab) return;
    const out = panelRef.current;
    if (!prefersReducedMotion() && out) {
      gsap.timeline()
        .to(out, { opacity: 0, scale: 0.97, y: -10, duration: 0.2 })
        .call(() => setTab(newTab))
        .fromTo(out, { opacity: 0, scale: 0.97, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    } else {
      setTab(newTab);
    }
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Pin only on desktop. Pinning a tall section on phones traps the
      // viewport for the duration of the pin range, which is awful UX on
      // small screens.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: "#features",
          start: "top top",
          end: "+=80%",
          pin: true,
          pinSpacing: true,
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="features" ref={sectionRef} className="feature-hub-section scroll-mt-20 py-14 sm:py-16 lg:py-24">
      <div className="container-zeb">
        <SectionHeader
          chip="Tools & Calculators"
          title="Every ZebPay product — try before you sign up"
          subtitle="Eleven interactive simulators with real formulas. Pick a tab and play with the numbers."
        />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
            <div className="flex overflow-x-auto border-b border-[var(--border)]" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => switchTab(t.id)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition ${
                    tab === t.id ? "border-[var(--cyan)] text-[var(--fg)]" : "border-transparent text-[var(--fg-muted)]"
                  }`}
                >
                  {t.label}
                  {t.tag && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${
                        t.tagStyle === "new"
                          ? "bg-[var(--cyan)] text-[var(--navy)]"
                          : t.tagStyle === "soon"
                            ? "bg-[var(--gold)] text-[var(--navy)]"
                            : "border border-[var(--danger)] bg-[var(--surface-strong)] text-[var(--danger)]"
                      }`}
                    >
                      {t.tag}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-2 lg:p-8">
              <div>
                <h3 className="text-[clamp(1.125rem,4vw,1.5rem)] font-black text-[var(--fg)]">{copy.title}</h3>
                <ul className="mt-4 space-y-2">
                  {copy.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[var(--fg-muted)]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--cyan)] text-[10px] font-extrabold text-[var(--navy)]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div ref={panelRef} className="tab-panel active" data-tab={tab}>
                <Panel tab={tab} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
