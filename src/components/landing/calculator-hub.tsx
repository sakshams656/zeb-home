"use client";

import { useRef, useState, type ReactNode } from "react";
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

type CalcMeta = {
  id: CalcId;
  label: string;
  rail: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
};

function I({ d }: { d: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const ICONS: Record<CalcId, ReactNode> = {
  spot: <I d="M8 3 4 7l4 4 M4 7h16 M16 21l4-4-4-4 M20 17H4" />,
  futures: <I d="M3 17l6-6 4 4 8-8 M14 7h7v7" />,
  sip: <I d="M3 8h18 M3 14h18 M7 4v3 M17 4v3 M9 11v6 M15 11v6" />,
  packs: <I d="M3 7l9-4 9 4-9 4-9-4z M3 12l9 4 9-4 M3 17l9 4 9-4" />,
  earn: <I d="M12 3v18 M16 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7" />,
  expert: <I d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  rms: <I d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />,
  subs: <I d="M3 6l9-4 9 4-9 4-9-4z M3 12l9 4 9-4 M3 18l9 4 9-4" />,
  options: <I d="M3 12h4l3-8 4 16 3-8h4" />
};

const META: CalcMeta[] = [
  {
    id: "spot",
    label: "Spot fees",
    rail: "Buy/sell cost breakdown",
    title: "Spot Trading Calculator",
    subtitle: "See the exact cost, fee and net amount on every spot trade.",
    icon: ICONS.spot
  },
  {
    id: "futures",
    label: "Futures margin",
    rail: "PnL & liquidation",
    title: "Futures Margin Calculator",
    subtitle: "Estimate PnL and liquidation price for leveraged positions.",
    icon: ICONS.futures
  },
  {
    id: "sip",
    label: "Crypto SIP",
    rail: "Wealth over time",
    title: "Crypto SIP Calculator",
    subtitle:
      "Calculate your crypto investment returns. Estimate potential gains and the future value of your holdings.",
    icon: ICONS.sip
  },
  {
    id: "packs",
    label: "CryptoPacks",
    rail: "Basket growth",
    title: "CryptoPacks Returns Calculator",
    subtitle: "Project basket growth at your target CAGR over time.",
    icon: ICONS.packs
  },
  {
    id: "earn",
    label: "Earn APY",
    rail: "Staking yield",
    title: "Earn APY Calculator",
    subtitle: "See compounded earnings on idle crypto across any time horizon.",
    icon: ICONS.earn
  },
  {
    id: "expert",
    label: "Expert trades",
    rail: "Signal ROI",
    title: "Expert Trades ROI Calculator",
    subtitle: "Model returns from copy-traded signal strategies vs a passive benchmark.",
    icon: ICONS.expert
  },
  {
    id: "rms",
    label: "RMS",
    rail: "TP / SL levels",
    title: "Risk Management Calculator",
    subtitle: "Plan take-profit, stop-loss and risk-reward for every trade.",
    icon: ICONS.rms
  },
  {
    id: "subs",
    label: "Sub accounts",
    rail: "Capital split",
    title: "Sub-Accounts Split Calculator",
    subtitle: "Distribute capital across multiple wallets by weight.",
    icon: ICONS.subs
  },
  {
    id: "options",
    label: "Options",
    rail: "Payoff at expiry",
    title: "Options Payoff Calculator",
    subtitle: "Visualise call/put payoff and break-even at expiry.",
    icon: ICONS.options
  }
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `${(n / 1e7).toFixed(abs >= 1e8 ? 0 : 1)}Cr`;
  if (abs >= 1e5) return `${(n / 1e5).toFixed(abs >= 1e6 ? 0 : 1)}L`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}k`;
  return n.toFixed(0);
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
};

function Field({ label, value, onChange, prefix, suffix, step, min, max }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <span className="flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 transition focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[rgba(27,85,224,0.35)] sm:w-[60%]">
        {prefix && <span className="text-sm text-white/45">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(+e.target.value)}
          className="ml-auto w-full appearance-none bg-transparent text-right font-semibold tabular-nums text-white outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && <span className="text-sm text-white/45">{suffix}</span>}
      </span>
    </label>
  );
}

function Segment<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 sm:w-[60%]">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(27,85,224,0.35)]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </label>
  );
}

function SelectChips<T extends number | string>({
  label,
  value,
  options,
  onChange,
  formatOption
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  formatOption?: (v: T) => string;
}) {
  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <div className="flex w-full gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 sm:w-[60%]">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={String(o)}
              type="button"
              onClick={() => onChange(o)}
              className={`flex-1 rounded-lg px-2 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(27,85,224,0.35)]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {formatOption ? formatOption(o) : String(o)}
            </button>
          );
        })}
      </div>
    </label>
  );
}

type Series = { values: number[]; dashed?: boolean; color?: string };

function LineChart({
  series,
  fill = false,
  zeroBaseline = false,
  marker,
  xStart,
  xEnd,
  valueFormat = compact,
  height = 180
}: {
  series: Series[];
  fill?: boolean;
  zeroBaseline?: boolean;
  marker?: { xPct: number; y: number; color?: string };
  xStart?: string;
  xEnd?: string;
  valueFormat?: (n: number) => string;
  height?: number;
}) {
  const W = 360;
  const H = 200;
  const PAD_L = 40;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 16;
  const all = series.flatMap((s) => s.values);
  let max = Math.max(...all);
  let min = Math.min(...all);
  if (zeroBaseline) {
    max = Math.max(max, 0);
    min = Math.min(min, 0);
  }
  if (max === min) {
    max = max + 1;
    min = min - 1;
  }
  const yToPx = (v: number) => PAD_T + ((max - v) / (max - min)) * (H - PAD_T - PAD_B);
  const xToPx = (i: number, len: number) =>
    PAD_L + (i / Math.max(1, len - 1)) * (W - PAD_L - PAD_R);

  const paths = series.map((s) =>
    s.values.length
      ? s.values
          .map(
            (v, i) =>
              `${i === 0 ? "M" : "L"}${xToPx(i, s.values.length).toFixed(1)} ${yToPx(v).toFixed(1)}`
          )
          .join(" ")
      : ""
  );

  const main = series[0];
  const baselineY = zeroBaseline ? yToPx(0) : yToPx(min);
  const areaPath =
    main && main.values.length
      ? `${paths[0]} L${xToPx(main.values.length - 1, main.values.length).toFixed(1)} ${baselineY.toFixed(
          1
        )} L${PAD_L} ${baselineY.toFixed(1)} Z`
      : "";

  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0))] p-3 sm:p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="calc-area-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(27,85,224,0.55)" />
            <stop offset="100%" stopColor="rgba(27,85,224,0)" />
          </linearGradient>
        </defs>
        {gridTicks.map((p, i) => {
          const y = PAD_T + p * (H - PAD_T - PAD_B);
          const v = max - p * (max - min);
          return (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                strokeDasharray={i === 0 || i === gridTicks.length - 1 ? "" : "2 4"}
              />
              <text
                x={PAD_L - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={9}
                fill="rgba(255,255,255,0.4)"
                fontFamily="inherit"
              >
                {valueFormat(v)}
              </text>
            </g>
          );
        })}
        {zeroBaseline && (
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yToPx(0)}
            y2={yToPx(0)}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
        {fill && areaPath && (
          <path d={areaPath} fill="url(#calc-area-grad)" className="calc-chart-area" />
        )}
        {paths.map((p, i) => (
          <path
            key={i}
            d={p}
            fill="none"
            stroke={series[i].color || "var(--brand)"}
            strokeWidth={i === 0 ? 2.5 : 1.75}
            strokeDasharray={series[i].dashed ? "5 4" : ""}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="calc-chart-line"
          />
        ))}
        {marker && (
          <circle
            cx={PAD_L + marker.xPct * (W - PAD_L - PAD_R)}
            cy={yToPx(marker.y)}
            r={5}
            fill={marker.color || "var(--brand)"}
            stroke="white"
            strokeWidth={2}
          />
        )}
      </svg>
      {(xStart || xEnd) && (
        <div className="mt-2 flex justify-between px-1 text-[10px] text-white/45">
          <span>{xStart}</span>
          <span>{xEnd}</span>
        </div>
      )}
    </div>
  );
}

function CompositionBar({
  segments
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {segments.map((s, i) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          return (
            <div
              key={i}
              style={{ width: `${pct}%`, background: s.color }}
              className="transition-all duration-500"
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-white/65">
        {segments.map((s, i) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          return (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span>{s.label}</span>
              <span className="tabular-nums text-white/45">{pct.toFixed(1)}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RmsTrack({
  entry,
  tp,
  sl,
  current,
  rr
}: {
  entry: number;
  tp: number;
  sl: number;
  current: number;
  rr: number;
}) {
  const min = Math.min(sl, current) * 0.995;
  const max = Math.max(tp, current) * 1.005;
  const range = max - min || 1;
  const pct = (v: number) => Math.min(Math.max(((v - min) / range) * 100, 0), 100);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0))] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <span className="text-xs font-medium uppercase tracking-wider text-white/55">
          Price track
        </span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-white tabular-nums">
          R:R {rr.toFixed(2)}
        </span>
      </div>

      <div className="relative h-6">
        <span
          className="absolute -translate-x-1/2 text-[10px] font-bold"
          style={{ left: `${pct(sl)}%`, color: "var(--danger)" }}
        >
          SL
        </span>
        <span
          className="absolute -translate-x-1/2 text-[10px] font-bold text-white"
          style={{ left: `${pct(entry)}%` }}
        >
          Entry
        </span>
        <span
          className="absolute -translate-x-1/2 text-[10px] font-bold"
          style={{ left: `${pct(tp)}%`, color: "var(--success)" }}
        >
          TP
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,rgba(227,62,92,0.45),rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.08)_55%,rgba(0,176,122,0.5))]">
        <span
          className="absolute top-0 h-3 w-px bg-[var(--danger)]"
          style={{ left: `${pct(sl)}%` }}
        />
        <span
          className="absolute top-0 h-3 w-px bg-white/80"
          style={{ left: `${pct(entry)}%` }}
        />
        <span
          className="absolute top-0 h-3 w-px bg-[var(--success)]"
          style={{ left: `${pct(tp)}%` }}
        />
        <span
          className="absolute top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full border-2 border-white bg-[var(--brand)] shadow-[0_0_0_4px_rgba(27,85,224,0.25)] transition-all"
          style={{ left: `${pct(current)}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
        <div>
          <div className="text-white/55">Stop Loss</div>
          <div className="mt-1 font-bold tabular-nums text-[var(--danger)]">{inr(sl)}</div>
        </div>
        <div>
          <div className="text-white/55">Entry</div>
          <div className="mt-1 font-bold tabular-nums text-white">{inr(entry)}</div>
        </div>
        <div>
          <div className="text-white/55">Take Profit</div>
          <div className="mt-1 font-bold tabular-nums text-[var(--success)]">{inr(tp)}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ k, v, accent }: { k: string; v: string; accent?: "success" | "danger" | "brand" }) {
  const color =
    accent === "success"
      ? "text-[var(--success)]"
      : accent === "danger"
        ? "text-[var(--danger)]"
        : accent === "brand"
          ? "text-[var(--brand)]"
          : "text-white";
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:p-4">
      <p className="text-xs text-white/55">{k}</p>
      <p className={`mt-1 text-base font-black tabular-nums sm:text-lg ${color}`}>{v}</p>
    </div>
  );
}

export function CalculatorHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<CalcId>("sip");

  const [spot, setSpot] = useState({ amount: 50000, fee: 0.2, side: "buy" as "buy" | "sell" });
  const [futures, setFutures] = useState({
    margin: 10000,
    leverage: 10,
    move: 5,
    dir: "LONG" as "LONG" | "SHORT"
  });
  const [sip, setSip] = useState({ monthly: 20000, years: 10, ret: 18 });
  const [packs, setPacks] = useState({ monthly: 3000, years: 5, cagr: 22 });
  const [earn, setEarn] = useState({ principal: 100000, apy: 8.5, months: 12 });
  const [expert, setExpert] = useState({ allocation: 50000, monthlyRet: 3, months: 6 });
  const [rms, setRms] = useState({
    entry: BTC_INR,
    tp: 8,
    sl: 4,
    current: BTC_INR * 1.02
  });
  const [subs, setSubs] = useState({ total: 200000, w1: 50, w2: 30, w3: 20 });
  const [options, setOptions] = useState({
    spot: BTC_INR,
    strike: BTC_INR * 0.95,
    premium: 50000,
    type: "call" as "call" | "put",
    contracts: 1
  });

  const meta = META.find((m) => m.id === tab) ?? META[0];

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      const paths = sectionRef.current.querySelectorAll<SVGPathElement>(".calc-chart-line, .calc-chart-area");
      gsap.fromTo(
        paths,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: ZEB_EASE }
      );
    },
    { dependencies: [tab, spot, futures, sip, packs, earn, expert, rms, subs, options], scope: sectionRef }
  );

  const switchTab = (id: CalcId) => {
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        ".calc-body",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: ZEB_EASE }
      );
    }
    setTab(id);
  };

  return (
    <section
      id="calculators"
      ref={sectionRef}
      className="calculator-hub scroll-mt-24 px-6 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-black text-[var(--text-on-dark)]">
          Run the numbers.
        </h2>
        <p className="mt-2 text-base text-[var(--text-muted-dark)] sm:text-lg">
          Every product, real formulas, instant projections.
        </p>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ul className="-mx-6 flex flex-row gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
              {META.map((m) => {
                const active = tab === m.id;
                return (
                  <li key={m.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => switchTab(m.id)}
                      aria-pressed={active}
                      className={`calc-tab group flex w-[220px] items-start gap-3 rounded-2xl border p-3.5 text-left transition lg:w-full ${
                        active
                          ? "border-transparent bg-[linear-gradient(135deg,rgba(27,85,224,0.95),rgba(27,85,224,0.55))] text-white shadow-[0_10px_30px_rgba(27,85,224,0.35)]"
                          : "border-white/[0.06] bg-white/[0.03] text-white/85 hover:border-white/[0.12] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition ${
                          active
                            ? "border-white/30 bg-white/15 text-white"
                            : "border-white/[0.08] bg-[rgba(27,85,224,0.14)] text-[var(--brand)] group-hover:bg-[rgba(27,85,224,0.22)]"
                        }`}
                      >
                        {m.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold leading-snug">{m.label}</span>
                        <span
                          className={`mt-0.5 block text-xs leading-snug ${
                            active ? "text-white/80" : "text-white/55"
                          }`}
                        >
                          {m.rail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="calc-body rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 backdrop-blur-sm sm:p-6 lg:p-7">
            <header className="flex items-start gap-3 border-b border-white/[0.06] pb-4 sm:gap-4 sm:pb-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[rgba(27,85,224,0.35)] bg-[rgba(27,85,224,0.18)] text-[var(--brand)] sm:h-12 sm:w-12">
                {meta.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-white sm:text-xl lg:text-2xl">{meta.title}</h3>
                <p className="mt-0.5 text-xs text-white/60 sm:mt-1 sm:text-sm">{meta.subtitle}</p>
              </div>
            </header>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:gap-7">
              <div className="space-y-3.5">
                {tab === "spot" && (
                  <>
                    <Field
                      label="Amount"
                      value={spot.amount}
                      onChange={(v) => setSpot({ ...spot, amount: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Fee"
                      value={spot.fee}
                      onChange={(v) => setSpot({ ...spot, fee: v })}
                      step={0.01}
                      suffix="%"
                    />
                    <Segment
                      label="Side"
                      value={spot.side}
                      onChange={(v) => setSpot({ ...spot, side: v })}
                      options={[
                        { value: "buy", label: "Buy" },
                        { value: "sell", label: "Sell" }
                      ]}
                    />
                  </>
                )}
                {tab === "futures" && (
                  <>
                    <Field
                      label="Margin"
                      value={futures.margin}
                      onChange={(v) => setFutures({ ...futures, margin: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Leverage"
                      value={futures.leverage}
                      onChange={(v) => setFutures({ ...futures, leverage: v })}
                      suffix="x"
                    />
                    <Field
                      label="Price move"
                      value={futures.move}
                      onChange={(v) => setFutures({ ...futures, move: v })}
                      suffix="%"
                    />
                    <Segment
                      label="Direction"
                      value={futures.dir}
                      onChange={(v) => setFutures({ ...futures, dir: v })}
                      options={[
                        { value: "LONG", label: "Long" },
                        { value: "SHORT", label: "Short" }
                      ]}
                    />
                  </>
                )}
                {tab === "sip" && (
                  <>
                    <Field
                      label="Monthly Investment"
                      value={sip.monthly}
                      onChange={(v) => setSip({ ...sip, monthly: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Time Period"
                      value={sip.years}
                      onChange={(v) => setSip({ ...sip, years: v })}
                      suffix="Years"
                    />
                    <Field
                      label="Expected Return"
                      value={sip.ret}
                      onChange={(v) => setSip({ ...sip, ret: v })}
                      suffix="%"
                    />
                  </>
                )}
                {tab === "packs" && (
                  <>
                    <Field
                      label="Monthly Contribution"
                      value={packs.monthly}
                      onChange={(v) => setPacks({ ...packs, monthly: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Time Period"
                      value={packs.years}
                      onChange={(v) => setPacks({ ...packs, years: v })}
                      suffix="Years"
                    />
                    <Field
                      label="Expected CAGR"
                      value={packs.cagr}
                      onChange={(v) => setPacks({ ...packs, cagr: v })}
                      suffix="%"
                    />
                  </>
                )}
                {tab === "earn" && (
                  <>
                    <Field
                      label="Principal"
                      value={earn.principal}
                      onChange={(v) => setEarn({ ...earn, principal: v })}
                      prefix="₹"
                    />
                    <Field
                      label="APY"
                      value={earn.apy}
                      onChange={(v) => setEarn({ ...earn, apy: v })}
                      step={0.1}
                      suffix="%"
                    />
                    <SelectChips
                      label="Duration"
                      value={earn.months}
                      onChange={(v) => setEarn({ ...earn, months: v })}
                      options={[3, 6, 12, 24]}
                      formatOption={(v) => `${v}m`}
                    />
                  </>
                )}
                {tab === "expert" && (
                  <>
                    <Field
                      label="Allocation"
                      value={expert.allocation}
                      onChange={(v) => setExpert({ ...expert, allocation: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Monthly return"
                      value={expert.monthlyRet}
                      onChange={(v) => setExpert({ ...expert, monthlyRet: v })}
                      step={0.1}
                      suffix="%"
                    />
                    <Field
                      label="Duration"
                      value={expert.months}
                      onChange={(v) => setExpert({ ...expert, months: v })}
                      suffix="months"
                    />
                  </>
                )}
                {tab === "rms" && (
                  <>
                    <Field
                      label="Entry price"
                      value={rms.entry}
                      onChange={(v) => setRms({ ...rms, entry: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Take profit"
                      value={rms.tp}
                      onChange={(v) => setRms({ ...rms, tp: v })}
                      suffix="%"
                    />
                    <Field
                      label="Stop loss"
                      value={rms.sl}
                      onChange={(v) => setRms({ ...rms, sl: v })}
                      suffix="%"
                    />
                    <Field
                      label="Current price"
                      value={rms.current}
                      onChange={(v) => setRms({ ...rms, current: v })}
                      prefix="₹"
                    />
                  </>
                )}
                {tab === "subs" && (
                  <>
                    <Field
                      label="Total"
                      value={subs.total}
                      onChange={(v) => setSubs({ ...subs, total: v })}
                      prefix="₹"
                    />
                    {(["w1", "w2", "w3"] as const).map((k, i) => (
                      <Field
                        key={k}
                        label={`Wallet ${i + 1} weight`}
                        value={subs[k]}
                        onChange={(v) => setSubs({ ...subs, [k]: v })}
                        suffix="pts"
                      />
                    ))}
                  </>
                )}
                {tab === "options" && (
                  <>
                    <Field
                      label="Spot price"
                      value={options.spot}
                      onChange={(v) => setOptions({ ...options, spot: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Strike price"
                      value={options.strike}
                      onChange={(v) => setOptions({ ...options, strike: v })}
                      prefix="₹"
                    />
                    <Field
                      label="Premium"
                      value={options.premium}
                      onChange={(v) => setOptions({ ...options, premium: v })}
                      prefix="₹"
                    />
                    <Segment
                      label="Type"
                      value={options.type}
                      onChange={(v) => setOptions({ ...options, type: v })}
                      options={[
                        { value: "call", label: "Call" },
                        { value: "put", label: "Put" }
                      ]}
                    />
                    <Field
                      label="Contracts"
                      value={options.contracts}
                      onChange={(v) => setOptions({ ...options, contracts: v })}
                    />
                  </>
                )}
              </div>

              <div className="space-y-4">
                {tab === "spot" && <SpotResults state={spot} />}
                {tab === "futures" && <FuturesResults state={futures} />}
                {tab === "sip" && <SipResults state={sip} />}
                {tab === "packs" && <PacksResults state={packs} />}
                {tab === "earn" && <EarnResults state={earn} />}
                {tab === "expert" && <ExpertResults state={expert} />}
                {tab === "rms" && <RmsResults state={rms} />}
                {tab === "subs" && <SubsResults state={subs} />}
                {tab === "options" && <OptionsResults state={options} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotResults({ state }: { state: { amount: number; fee: number; side: "buy" | "sell" } }) {
  const r = spotFeeCalc({ amountInr: state.amount, feePercent: state.fee, side: state.side });
  return (
    <>
      <CompositionBar
        segments={[
          {
            label: state.side === "buy" ? "Order amount" : "Net received",
            value: state.side === "buy" ? state.amount : r.netReceived,
            color: "var(--brand)"
          },
          { label: "Fee", value: r.fee, color: "var(--danger)" }
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Fee" v={inr(r.fee)} accent="danger" />
        <StatCard
          k={state.side === "buy" ? "Total cost" : "Net received"}
          v={inr(state.side === "buy" ? r.totalCost : r.netReceived)}
          accent="brand"
        />
      </div>
    </>
  );
}

function FuturesResults({
  state
}: {
  state: { margin: number; leverage: number; move: number; dir: "LONG" | "SHORT" };
}) {
  const r = futuresMarginCalc({
    marginInr: state.margin,
    leverage: state.leverage,
    priceMovePercent: state.move,
    direction: state.dir
  });
  const moves = [-15, -10, -5, 0, 5, 10, 15];
  const pnls = moves.map(
    (m) =>
      futuresMarginCalc({
        marginInr: state.margin,
        leverage: state.leverage,
        priceMovePercent: m,
        direction: state.dir
      }).estimatedPnl
  );
  const currentIdx = moves.findIndex((m) => m === state.move);
  const xPct = currentIdx >= 0 ? currentIdx / (moves.length - 1) : 0.5;

  return (
    <>
      <LineChart
        series={[{ values: pnls }]}
        zeroBaseline
        marker={{ xPct, y: r.estimatedPnl }}
        xStart="-15%"
        xEnd="+15%"
        valueFormat={(v) => `₹${compact(v)}`}
      />
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          k="Estimated PnL"
          v={inr(r.estimatedPnl)}
          accent={r.estimatedPnl >= 0 ? "success" : "danger"}
        />
        <StatCard k="Liquidation" v={inr(r.liquidationPrice)} accent="danger" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Position size" v={inr(r.positionSize)} />
        <StatCard k="Leverage" v={`${state.leverage}x`} accent="brand" />
      </div>
    </>
  );
}

function SipResults({ state }: { state: { monthly: number; years: number; ret: number } }) {
  const r = sipWealthCalc({
    monthly: state.monthly,
    years: state.years,
    annualReturnPercent: state.ret
  });
  const totalReturn = r.finalValue - r.totalInvested;
  const totalReturnPct = r.totalInvested > 0 ? (totalReturn / r.totalInvested) * 100 : 0;

  return (
    <>
      <LineChart series={[{ values: r.yearlyBalances }]} fill xStart="Year 0" xEnd={`Year ${state.years}`} />
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Total Investment" v={inr(r.totalInvested)} />
        <StatCard k="Expected Return" v={inr(totalReturn)} accent="success" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Final Value" v={inr(r.finalValue)} accent="brand" />
        <StatCard k="Total Return" v={`${totalReturnPct.toFixed(2)}%`} accent="success" />
      </div>
      <CompositionBar
        segments={[
          { label: "Total Invested", value: r.totalInvested, color: "var(--brand)" },
          { label: "Profit", value: totalReturn, color: "var(--success)" }
        ]}
      />
    </>
  );
}

function PacksResults({ state }: { state: { monthly: number; years: number; cagr: number } }) {
  const r = packReturnCalc({
    monthlyContribution: state.monthly,
    years: state.years,
    cagrPercent: state.cagr
  });
  const balances: number[] = [0];
  const mr = state.cagr / 100 / 12;
  let v = 0;
  for (let m = 1; m <= state.years * 12; m++) {
    v = (v + state.monthly) * (1 + mr);
    if (m % 6 === 0) balances.push(v);
  }
  return (
    <>
      <LineChart series={[{ values: balances }]} fill xStart="Start" xEnd={`Year ${state.years}`} />
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Total Invested" v={inr(r.totalInvested)} />
        <StatCard k="Projected Value" v={inr(r.projectedValue)} accent="brand" />
      </div>
      <CompositionBar
        segments={[
          { label: "Total Invested", value: r.totalInvested, color: "var(--brand)" },
          { label: "Gains", value: r.gains, color: "var(--success)" }
        ]}
      />
    </>
  );
}

function EarnResults({
  state
}: {
  state: { principal: number; apy: number; months: number };
}) {
  const r = earnApyCalc({ principal: state.principal, apyPercent: state.apy, months: state.months });
  return (
    <>
      <LineChart
        series={[{ values: r.monthlyBalances }]}
        fill
        xStart="Month 0"
        xEnd={`Month ${state.months}`}
      />
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Principal" v={inr(state.principal)} />
        <StatCard k="Earnings" v={inr(r.earnings)} accent="success" />
      </div>
      <CompositionBar
        segments={[
          { label: "Principal", value: state.principal, color: "var(--brand)" },
          { label: "Yield", value: r.earnings, color: "var(--success)" }
        ]}
      />
    </>
  );
}

function ExpertResults({
  state
}: {
  state: { allocation: number; monthlyRet: number; months: number };
}) {
  const r = expertRoiCalc({
    allocationInr: state.allocation,
    monthlyReturnPercent: state.monthlyRet,
    months: state.months
  });
  const points = Math.max(state.months + 1, 2);
  const strat = Array.from({ length: points }, (_, i) =>
    state.allocation * Math.pow(1 + state.monthlyRet / 100, i)
  );
  const bench = Array.from({ length: points }, (_, i) => state.allocation * Math.pow(1.01, i));
  return (
    <>
      <LineChart
        series={[
          { values: strat },
          { values: bench, dashed: true, color: "rgba(255,255,255,0.55)" }
        ]}
        xStart="Now"
        xEnd={`Month ${state.months}`}
      />
      <div className="flex items-center gap-4 text-xs text-white/65">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded-full bg-[var(--brand)]" /> Strategy
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded-full bg-white/55" /> Benchmark (1% / mo)
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="ROI" v={`${r.roiPercent.toFixed(1)}%`} accent="brand" />
        <StatCard
          k="Net PnL"
          v={inr(r.pnl)}
          accent={r.pnl >= 0 ? "success" : "danger"}
        />
      </div>
      <CompositionBar
        segments={[
          { label: "Allocation", value: state.allocation, color: "var(--brand)" },
          { label: "Gains", value: Math.max(r.pnl, 0), color: "var(--success)" }
        ]}
      />
    </>
  );
}

function RmsResults({
  state
}: {
  state: { entry: number; tp: number; sl: number; current: number };
}) {
  const r = rmsRiskCalc({
    entryPrice: state.entry,
    takeProfitPercent: state.tp,
    stopLossPercent: state.sl,
    currentPrice: state.current
  });
  return (
    <>
      <RmsTrack
        entry={state.entry}
        tp={r.tpPrice}
        sl={r.slPrice}
        current={state.current}
        rr={r.riskRewardRatio}
      />
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Progress" v={`${r.progressPercent.toFixed(1)}%`} accent="brand" />
        <StatCard k="Risk : Reward" v={`1 : ${r.riskRewardRatio.toFixed(2)}`} accent="success" />
      </div>
    </>
  );
}

function SubsResults({
  state
}: {
  state: { total: number; w1: number; w2: number; w3: number };
}) {
  const r = subAccountSplitCalc({
    totalInr: state.total,
    weights: [state.w1, state.w2, state.w3]
  });
  const colors = ["var(--brand)", "#3a73e8", "var(--success)"];
  return (
    <>
      <CompositionBar
        segments={r.allocations.map((a, i) => ({
          label: `Wallet ${a.index}`,
          value: a.amount,
          color: colors[i % colors.length]
        }))}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {r.allocations.map((a, i) => (
          <div
            key={a.index}
            className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"
          >
            <div className="flex items-center gap-2 text-xs text-white/55">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
              Wallet {a.index}
            </div>
            <div className="mt-1 text-lg font-black tabular-nums text-white">{inr(a.amount)}</div>
            <div className="text-xs tabular-nums text-white/55">{a.percent.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </>
  );
}

function OptionsResults({
  state
}: {
  state: {
    spot: number;
    strike: number;
    premium: number;
    type: "call" | "put";
    contracts: number;
  };
}) {
  const r = optionsPayoffCalc({
    spotPrice: state.spot,
    strikePrice: state.strike,
    premium: state.premium,
    type: state.type,
    contracts: state.contracts
  });
  const spots = Array.from({ length: 21 }, (_, i) => state.strike * (0.85 + i * 0.015));
  const payoffs = spots.map(
    (s) =>
      optionsPayoffCalc({
        spotPrice: s,
        strikePrice: state.strike,
        premium: state.premium,
        type: state.type,
        contracts: state.contracts
      }).netPnl
  );
  const spotIdx = spots.reduce(
    (best, s, i) => (Math.abs(s - state.spot) < Math.abs(spots[best] - state.spot) ? i : best),
    0
  );
  const xPct = spotIdx / (spots.length - 1);

  return (
    <>
      <LineChart
        series={[{ values: payoffs }]}
        zeroBaseline
        marker={{ xPct, y: r.netPnl, color: r.netPnl >= 0 ? "var(--success)" : "var(--danger)" }}
        xStart={`₹${compact(spots[0])}`}
        xEnd={`₹${compact(spots[spots.length - 1])}`}
        valueFormat={(v) => `₹${compact(v)}`}
      />
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          k="Net PnL"
          v={inr(r.netPnl)}
          accent={r.netPnl >= 0 ? "success" : "danger"}
        />
        <StatCard k="Break-even" v={inr(r.breakEven)} accent="brand" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard k="Intrinsic" v={inr(r.intrinsicAtSpot)} />
        <StatCard
          k="Total premium"
          v={inr(state.premium * state.contracts)}
          accent="danger"
        />
      </div>
    </>
  );
}
