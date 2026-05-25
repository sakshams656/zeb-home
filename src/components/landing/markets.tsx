"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  COIN_GECKO_IDS,
  fetchCoinMarketChart,
  fetchMarketsCoins,
  MARKETS_DISPLAY_SYMS,
  symFromCgRow,
  volumeInCr,
  type ChartPoint,
  type CgMarketRow
} from "@/lib/coingecko";
import { INITIAL_COINS, type Coin } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { makeLinePath } from "@/lib/charts";
import { MarketIntradayChart } from "./market-intraday-chart";

type Tab = "trending" | "gainers" | "losers";

const TABS: { id: Tab; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "gainers", label: "Top Gainers" },
  { id: "losers", label: "Top Losers" }
];

type MarketCoin = Coin & {
  cgId: string;
  image?: string;
  spark7d?: number[];
};

function cgRowToCoin(row: CgMarketRow): MarketCoin {
  const sym = symFromCgRow(row);
  const ch = row.price_change_percentage_24h ?? 0;
  return {
    sym,
    name: row.name,
    price: row.current_price ?? 0,
    ch,
    vol: volumeInCr(row.total_volume ?? 0),
    categories: ch >= 0 ? ["all", "gain"] : ["all", "loss"],
    cgId: row.id,
    image: row.image,
    spark7d: row.sparkline_in_7d?.price
  };
}

function fallbackCoins(): MarketCoin[] {
  return INITIAL_COINS.filter((c) =>
    (MARKETS_DISPLAY_SYMS as readonly string[]).includes(c.sym)
  ).map((c) => ({
    ...c,
    cgId: COIN_GECKO_IDS[c.sym] ?? c.sym.toLowerCase()
  }));
}

function Sparkline({
  data,
  seed,
  positive
}: {
  data?: number[];
  seed: number;
  positive: boolean;
}) {
  const W = 80;
  const H = 28;

  if (data && data.length >= 2) {
    const { line, area } = makeLinePath(data, W, H, 2);
    const stroke = positive ? "var(--success)" : "var(--danger)";
    const id = positive ? "spark-up" : "spark-down";
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor={positive ? "rgba(0,176,122,0.55)" : "rgba(227,62,92,0.55)"}
            />
            <stop
              offset="100%"
              stopColor={positive ? "rgba(0,176,122,0)" : "rgba(227,62,92,0)"}
            />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id})`} className="market-spark-area" />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="market-spark-line"
        />
      </svg>
    );
  }

  const PAD = 2;
  const pts = Array.from({ length: 14 }, (_, i) => {
    const wob = Math.sin(seed * 1.7 + i * 0.85) * 2 + Math.cos(seed * 0.5 + i * 1.1) * 1.5;
    const y = H / 2 + (positive ? -1 : 1) * Math.sin(seed + i * 0.9) * 8 + wob;
    return [PAD + (i / 13) * (W - PAD * 2), Math.max(PAD, Math.min(H - PAD, y))] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`).join(" ");
  const last = pts[pts.length - 1];
  const first = pts[0];
  const area = `${line} L${last[0].toFixed(1)} ${H} L${first[0].toFixed(1)} ${H} Z`;
  const id = positive ? "spark-up" : "spark-down";
  const stroke = positive ? "var(--success)" : "var(--danger)";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={positive ? "rgba(0,176,122,0.55)" : "rgba(227,62,92,0.55)"} />
          <stop offset="100%" stopColor={positive ? "rgba(0,176,122,0)" : "rgba(227,62,92,0)"} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} className="market-spark-area" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="market-spark-line"
      />
      <circle cx={last[0]} cy={last[1]} r={2.2} fill={stroke} />
    </svg>
  );
}

function ChangeChip({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
        up
          ? "bg-[rgba(0,176,122,0.14)] text-[var(--success)]"
          : "bg-[rgba(227,62,92,0.14)] text-[var(--danger)]"
      }`}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      <span>{formatPercent(value).replace("+", "")}</span>
    </span>
  );
}

export function Markets() {
  const [tab, setTab] = useState<Tab>("trending");
  const [sourceCoins, setSourceCoins] = useState<MarketCoin[]>(fallbackCoins);
  const [loadError, setLoadError] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [ticks, setTicks] = useState<Record<string, { price: number; dir: 1 | -1 | 0; ts: number }>>({});
  const visibleRef = useRef(true);
  const [activeSym, setActiveSym] = useState<string>(MARKETS_DISPLAY_SYMS[0]);
  const [chartPoints, setChartPoints] = useState<ChartPoint[] | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const chartCache = useRef<Map<string, ChartPoint[]>>(new Map());
  const hoverChartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const HOVER_CHART_DELAY_MS = 100;

  const scheduleChartOnHover = useCallback((sym: string) => {
    if (hoverChartTimer.current) clearTimeout(hoverChartTimer.current);
    hoverChartTimer.current = setTimeout(() => {
      setActiveSym(sym);
      hoverChartTimer.current = null;
    }, HOVER_CHART_DELAY_MS);
  }, []);

  const cancelScheduledChart = useCallback(() => {
    if (hoverChartTimer.current) {
      clearTimeout(hoverChartTimer.current);
      hoverChartTimer.current = null;
    }
  }, []);

  useEffect(() => () => cancelScheduledChart(), [cancelScheduledChart]);

  const coins = useMemo<MarketCoin[]>(() => {
    let list = [...sourceCoins];
    if (tab === "gainers") list = list.filter((c) => c.ch > 0).sort((a, b) => b.ch - a.ch);
    else if (tab === "losers") list = list.filter((c) => c.ch < 0).sort((a, b) => a.ch - b.ch);
    return list;
  }, [tab, sourceCoins]);

  const resolvedActiveSym = useMemo(() => {
    if (coins.some((c) => c.sym === activeSym)) return activeSym;
    return coins[0]?.sym ?? activeSym;
  }, [coins, activeSym]);

  const activeCoin = useMemo(
    () => coins.find((c) => c.sym === resolvedActiveSym) ?? coins[0],
    [coins, resolvedActiveSym]
  );

  const maxVol = useMemo(() => Math.max(1, ...coins.map((c) => c.vol)), [coins]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchMarketsCoins();
        if (cancelled) return;
        setSourceCoins(rows.map(cgRowToCoin));
        setLoadError(false);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadChart = useCallback(async (cgId: string) => {
    const cached = chartCache.current.get(cgId);
    if (cached) {
      setChartPoints(cached);
      setChartLoading(false);
      return;
    }
    setChartLoading(true);
    try {
      const points = await fetchCoinMarketChart(cgId, 1);
      chartCache.current.set(cgId, points);
      setChartPoints(points);
    } catch {
      setChartPoints(null);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeCoin?.cgId) return;
    void loadChart(activeCoin.cgId);
  }, [activeCoin?.cgId, loadChart]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visibleRef.current = e.isIntersecting;
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!visibleRef.current) return;
      setTicks((prev) => {
        const next = { ...prev };
        const idx = Math.floor(Math.random() * coins.length);
        const coin = coins[idx];
        if (!coin) return prev;
        const drift = (Math.random() - 0.5) * 0.0012;
        const oldPrice = prev[coin.sym]?.price ?? coin.price;
        const newPrice = oldPrice * (1 + drift);
        if (newPrice === oldPrice) return prev;
        next[coin.sym] = {
          price: newPrice,
          dir: newPrice > oldPrice ? 1 : -1,
          ts: Date.now()
        };
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [coins]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll(".market-row"),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.5,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: ".markets-table",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll(".market-row"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, stagger: 0.025, duration: 0.35, ease: ZEB_EASE }
      );
      const sparks = ref.current.querySelectorAll<SVGPathElement>(".market-spark-line");
      sparks.forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.8, ease: ZEB_EASE }
        );
      });
    },
    { dependencies: [tab], scope: ref }
  );

  const onRowActivate = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "#calculators";
    }
  };

  const isMovingWithinCoinGroup = (e: React.MouseEvent, sym: string) => {
    const next = e.relatedTarget as HTMLElement | null;
    return !!next?.closest?.(`[data-coin-group="${sym}"]`);
  };

  return (
    <section
      id="markets"
      ref={ref}
      className="markets-section scroll-mt-24 px-6 py-[120px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">Markets</p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-black text-[var(--text-on-dark)]">
              What&apos;s moving today
            </h2>
            <p className="mt-2 text-sm text-white/55">
              Live prices across the assets traders are watching right now.
              {loadError ? (
                <span className="block text-[var(--danger)]">Using cached data — live feed unavailable.</span>
              ) : null}
            </p>
          </div>
          <div className="flex gap-1 self-start rounded-full border border-white/[0.08] bg-white/[0.04] p-1 sm:self-auto">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(27,85,224,0.35)]"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="markets-table mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="sticky top-0 z-10 bg-[rgba(7,13,32,0.85)] backdrop-blur">
                  <tr className="border-b border-white/[0.06] text-left text-[11px] font-semibold uppercase tracking-wider text-white/45">
                    <th className="py-4 pl-6 pr-2">#</th>
                    <th className="py-4 pr-2">Coin</th>
                    <th className="py-4 pr-2">Price</th>
                    <th className="py-4 pr-2">24H</th>
                    <th className="py-4 pr-2">Volume</th>
                    <th className="py-4 pr-2">7D Trend</th>
                    <th className="py-4 pr-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((c, i) => {
                    const tick = ticks[c.sym];
                    const displayPrice = tick?.price ?? c.price;
                    const flashKey = tick?.ts ?? 0;
                    const flashCls = tick
                      ? tick.dir === 1
                        ? "market-flash-up"
                        : "market-flash-down"
                      : "";
                    const isActive = resolvedActiveSym === c.sym;
                    const rowBorder = isActive ? "" : "border-b border-white/[0.05]";
                    return (
                      <Fragment key={c.sym}>
                      <tr
                        data-coin-group={c.sym}
                        role="link"
                        tabIndex={0}
                        onMouseEnter={() => scheduleChartOnHover(c.sym)}
                        onMouseLeave={(e) => {
                          if (!isMovingWithinCoinGroup(e, c.sym)) cancelScheduledChart();
                        }}
                        onFocus={() => {
                          cancelScheduledChart();
                          setActiveSym(c.sym);
                        }}
                        onClick={onRowActivate}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowActivate();
                          }
                        }}
                        className={`market-row group relative cursor-pointer transition-colors ${
                          isActive
                            ? "bg-[linear-gradient(90deg,rgba(27,85,224,0.14),rgba(27,85,224,0.02)_70%)]"
                            : "hover:bg-[linear-gradient(90deg,rgba(27,85,224,0.10),rgba(27,85,224,0)_70%)]"
                        } focus:outline-none focus-visible:bg-[linear-gradient(90deg,rgba(27,85,224,0.12),rgba(27,85,224,0)_70%)] ${rowBorder}`}
                      >
                        <td className="relative py-5 pl-6 pr-2">
                          <span
                            className={`pointer-events-none absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r bg-[var(--brand)] transition-opacity ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                            }`}
                            aria-hidden
                          />
                          {i < 3 ? (
                            <span className="inline-flex items-center justify-center rounded-md bg-[rgba(27,85,224,0.16)] px-1.5 py-0.5 text-xs font-bold text-[var(--brand)] tabular-nums">
                              {i + 1}
                            </span>
                          ) : (
                            <span className="text-sm tabular-nums text-white/55">{i + 1}</span>
                          )}
                        </td>
                        <td className="py-5 pr-2">
                          <span className="flex items-center gap-3">
                            {c.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={c.image}
                                alt=""
                                width={36}
                                height={36}
                                className="h-9 w-9 rounded-full bg-white/[0.06]"
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(27,85,224,0.95),rgba(27,85,224,0.45))] text-sm font-black text-white shadow-[0_4px_14px_rgba(27,85,224,0.35)]"
                              >
                                {c.sym[0]}
                              </span>
                            )}
                            <span className="flex flex-col">
                              <span className="font-bold leading-tight text-white">{c.name}</span>
                              <span className="mt-0.5 inline-block w-fit rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                                {c.sym}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="py-5 pr-2">
                          <span
                            key={flashKey}
                            className={`inline-block rounded px-1.5 py-1 font-semibold tabular-nums text-white ${flashCls}`}
                          >
                            {formatInr(displayPrice)}
                          </span>
                        </td>
                        <td className="py-5 pr-2">
                          <ChangeChip value={c.ch} />
                        </td>
                        <td className="py-5 pr-2">
                          <div className="flex items-center gap-3">
                            <span className="w-14 shrink-0 text-sm tabular-nums text-white/70">
                              {c.vol} Cr
                            </span>
                            <span className="block h-1 w-20 overflow-hidden rounded-full bg-white/[0.05]">
                              <span
                                className="block h-full rounded-full bg-[linear-gradient(90deg,rgba(27,85,224,0.95),rgba(27,85,224,0.45))]"
                                style={{ width: `${(c.vol / maxVol) * 100}%` }}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="py-5 pr-2">
                          <Sparkline data={c.spark7d} seed={i + 1} positive={c.ch >= 0} />
                        </td>
                        <td className="py-5 pr-6 text-right text-white/35">
                          <span
                            aria-hidden
                            className="inline-block transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 group-hover:text-white group-focus-visible:text-white"
                          >
                            →
                          </span>
                        </td>
                      </tr>
                      {isActive && activeCoin ? (
                        <tr
                          data-coin-group={c.sym}
                          className="market-chart-row border-b border-white/[0.05]"
                          onMouseEnter={() => scheduleChartOnHover(c.sym)}
                          onMouseLeave={(e) => {
                            if (!isMovingWithinCoinGroup(e, c.sym)) cancelScheduledChart();
                          }}
                        >
                          <td colSpan={7} className="p-0">
                            <MarketIntradayChart
                              name={activeCoin.name}
                              sym={activeCoin.sym}
                              points={chartPoints}
                              loading={chartLoading}
                            />
                          </td>
                        </tr>
                      ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-white/55 sm:flex-row">
          <span className="tabular-nums">
            Showing top {coins.length} of 350+ assets.
          </span>
          <a href="#calculators" className="btn-outline">
            View all markets
          </a>
        </div>
      </div>
    </section>
  );
}
