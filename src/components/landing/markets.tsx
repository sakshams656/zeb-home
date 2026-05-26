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
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums"
      style={{
        background: up ? "rgba(0,176,122,0.14)" : "rgba(227,62,92,0.14)",
        color: up ? "var(--success)" : "var(--danger)"
      }}
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

  const HOVER_CHART_DELAY_MS = 200;

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
      className="markets-section scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">Markets</p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-black text-[var(--fg)]">
              What&apos;s moving today
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Live prices across the assets traders are watching right now.
            </p>
          </div>
          <div className="flex gap-1 self-start rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 sm:self-auto">
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
                      ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(var(--brand-rgb),0.35)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="markets-table mt-8 overflow-hidden rounded-3xl border border-[var(--border)] backdrop-blur-sm"
          style={{ background: "var(--surface)" }}
        >
          <div>
            <table className="w-full text-sm">
              <thead
                className="sticky top-0 z-10 backdrop-blur"
                style={{ background: "rgba(var(--nav-bg-rgb), 0.85)" }}
              >
                <tr className="border-b border-[var(--border)] text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
                  <th className="hidden py-4 pl-4 pr-2 sm:table-cell sm:pl-6">#</th>
                  <th className="py-4 pl-3 pr-2 sm:pl-0">Coin</th>
                  <th className="py-4 pr-2 text-right sm:text-left">Price</th>
                  <th className="py-4 pr-3 text-right sm:pr-2 sm:text-left">24H</th>
                  <th className="hidden py-4 pr-2 lg:table-cell">Volume</th>
                  <th className="hidden py-4 pr-2 lg:table-cell">7D Trend</th>
                  <th className="hidden py-4 pr-4 sm:table-cell sm:pr-6"></th>
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
                  const isLast = i === coins.length - 1;
                  const rowBorder = isActive || isLast ? "" : "border-b border-[var(--border)]";
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
                        className={`market-row group relative cursor-pointer transition-colors focus:outline-none ${rowBorder}`}
                        style={
                          isActive
                            ? {
                                background:
                                  "linear-gradient(90deg, rgba(var(--brand-rgb), 0.14), rgba(var(--brand-rgb), 0.02) 70%)"
                              }
                            : undefined
                        }
                      >
                        <td className="relative hidden py-4 pl-4 pr-2 sm:table-cell sm:py-5 sm:pl-6">
                          <span
                            className={`pointer-events-none absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r bg-[var(--brand)] transition-opacity ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                            }`}
                            aria-hidden
                          />
                          {i < 3 ? (
                            <span
                              className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-bold text-[var(--brand)] tabular-nums"
                              style={{ background: "rgba(var(--brand-rgb), 0.16)" }}
                            >
                              {i + 1}
                            </span>
                          ) : (
                            <span className="text-sm tabular-nums text-[var(--fg-muted)]">{i + 1}</span>
                          )}
                        </td>
                        <td className="relative py-3.5 pl-3 pr-2 sm:py-5 sm:pl-0">
                          <span
                            className={`pointer-events-none absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r bg-[var(--brand)] transition-opacity sm:hidden ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                            }`}
                            aria-hidden
                          />
                          <span className="flex items-center gap-2 sm:gap-3">
                            {c.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={c.image}
                                alt=""
                                width={36}
                                height={36}
                                className="h-7 w-7 rounded-full bg-[var(--surface)] sm:h-9 sm:w-9"
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="grid h-7 w-7 place-items-center rounded-full text-xs font-black text-white sm:h-9 sm:w-9 sm:text-sm"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(var(--brand-rgb), 0.95), rgba(var(--brand-rgb), 0.45))",
                                  boxShadow: "0 4px 14px rgba(var(--brand-rgb), 0.35)"
                                }}
                              >
                                {c.sym[0]}
                              </span>
                            )}
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-bold leading-tight text-[var(--fg)] sm:text-base">
                                {c.name}
                              </span>
                              <span className="mt-0.5 inline-block w-fit rounded bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                                {c.sym}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-right sm:py-5 sm:text-left">
                          <span
                            key={flashKey}
                            className={`inline-block rounded px-1.5 py-1 text-xs font-semibold tabular-nums text-[var(--fg)] sm:text-sm ${flashCls}`}
                          >
                            {formatInr(displayPrice)}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 text-right sm:py-5 sm:pr-2 sm:text-left">
                          <ChangeChip value={c.ch} />
                        </td>
                        <td className="hidden py-4 pr-2 sm:py-5 lg:table-cell">
                          <div className="flex items-center gap-3">
                            <span className="w-14 shrink-0 text-sm tabular-nums text-[var(--fg-muted)]">
                              {c.vol} Cr
                            </span>
                            <span className="block h-1 w-20 overflow-hidden rounded-full bg-[var(--surface)]">
                              <span
                                className="block h-full rounded-full"
                                style={{
                                  width: `${(c.vol / maxVol) * 100}%`,
                                  background:
                                    "linear-gradient(90deg, rgba(var(--brand-rgb), 0.95), rgba(var(--brand-rgb), 0.45))"
                                }}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="hidden py-4 pr-2 sm:py-5 lg:table-cell">
                          <Sparkline data={c.spark7d} seed={i + 1} positive={c.ch >= 0} />
                        </td>
                        <td className="hidden py-4 pr-4 text-right text-[var(--fg-subtle)] sm:table-cell sm:py-5 sm:pr-6">
                          <span
                            aria-hidden
                            className="inline-block transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"
                          >
                            →
                          </span>
                        </td>
                      </tr>
                      {isActive && activeCoin ? (
                        <tr
                          data-coin-group={c.sym}
                          className="market-chart-row border-b border-[var(--border)]"
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

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-[var(--fg-muted)] sm:flex-row">
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
