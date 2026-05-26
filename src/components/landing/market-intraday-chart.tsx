"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChartPoint } from "@/lib/coingecko";

type MarketIntradayChartProps = {
  name: string;
  sym: string;
  points: ChartPoint[] | null;
  loading?: boolean;
};

const H = 200;
const PAD = { top: 12, right: 72, bottom: 28, left: 12 };

function downsample(points: ChartPoint[], max = 120): ChartPoint[] {
  if (points.length <= max) return points;
  const step = Math.ceil(points.length / max);
  return points.filter((_, i) => i % step === 0 || i === points.length - 1);
}

function formatAxisPrice(v: number): string {
  if (v >= 1e7) return `${(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `${(v / 1e5).toFixed(1)}L`;
  return v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function formatAxisDate(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate();
  const mon = d.toLocaleString("en-IN", { month: "short" });
  const yr = String(d.getFullYear()).slice(-2);
  return `${day} ${mon} '${yr}`;
}

function formatTooltipDate(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate();
  const mon = d.toLocaleString("en-IN", { month: "short" });
  const yr = String(d.getFullYear()).slice(-2);
  return `${day} ${mon} '${yr}`;
}

export function MarketIntradayChart({
  name,
  sym,
  points,
  loading
}: MarketIntradayChartProps) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(Math.floor(w));
    });
    ro.observe(node);
    setWidth(Math.floor(node.getBoundingClientRect().width) || 640);
    return () => ro.disconnect();
  }, [loading, points]);

  const series = useMemo(() => (points?.length ? downsample(points) : []), [points]);

  const plotW = width - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const geometry = useMemo(() => {
    if (series.length < 2) return null;
    const prices = series.map((d) => d.p);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const coords = series.map((d, i) => ({
      x: PAD.left + (i / (series.length - 1)) * plotW,
      y: PAD.top + plotH - ((d.p - min) / range) * plotH,
      ...d
    }));
    const gridSteps = 4;
    const gridYs = Array.from({ length: gridSteps + 1 }, (_, i) => {
      const v = min + (range * i) / gridSteps;
      const y = PAD.top + plotH - ((v - min) / range) * plotH;
      return { y, v };
    });
    const xLabels = [0, Math.floor(series.length / 2), series.length - 1].map((idx) => ({
      x: coords[idx].x,
      label: formatAxisDate(series[idx].t)
    }));
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
    const area = `${line} L ${coords[coords.length - 1].x} ${PAD.top + plotH} L ${coords[0].x} ${PAD.top + plotH} Z`;
    return { coords, min, max, gridYs, xLabels, line, area };
  }, [series, plotW, plotH]);

  const activeIdx = hoverIdx ?? (series.length ? series.length - 1 : null);
  const active =
    geometry && activeIdx !== null ? geometry.coords[activeIdx] : null;

  const onPointer = (clientX: number) => {
    if (!geometry || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = clientX - rect.left - PAD.left;
    const ratio = Math.max(0, Math.min(1, x / plotW));
    const idx = Math.round(ratio * (geometry.coords.length - 1));
    setHoverIdx(idx);
  };

  const gradId = `intraday-${sym}-${uid}`;

  return (
    <div
      className="market-intraday-chart border-t border-[var(--border)] px-6 py-5"
      style={{ background: "rgba(var(--nav-bg-rgb), 0.45)" }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
        {name} intraday trend
      </p>

      <div ref={wrapRef} className="relative w-full select-none">
        {loading ? (
          <div className="h-[200px] w-full animate-pulse rounded-lg bg-[var(--surface)]" aria-hidden />
        ) : geometry ? (
          <svg
            width={width}
            height={H}
            className="block w-full touch-none"
            role="img"
            aria-label={`${sym} intraday price chart`}
            onMouseMove={(e) => onPointer(e.clientX)}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (t) onPointer(t.clientX);
            }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(var(--brand-rgb), 0.45)" />
                <stop offset="100%" stopColor="rgba(var(--brand-rgb), 0)" />
              </linearGradient>
            </defs>

            {geometry.gridYs.map(({ y, v }) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotW}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left + plotW + 8}
                  y={y + 4}
                  fill="var(--fg-subtle)"
                  fontSize={10}
                  fontFamily="inherit"
                >
                  {formatAxisPrice(v)}
                </text>
              </g>
            ))}

            {geometry.xLabels.map(({ x, label }, i) => (
              <text
                key={i}
                x={x}
                y={H - 8}
                textAnchor="middle"
                fill="var(--fg-subtle)"
                fontSize={10}
                fontFamily="inherit"
              >
                {label}
              </text>
            ))}

            <path d={geometry.area} fill={`url(#${gradId})`} />
            <path
              d={geometry.line}
              fill="none"
              stroke="var(--brand)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {active && hoverIdx !== null ? (
              <>
                <line
                  x1={active.x}
                  x2={active.x}
                  y1={PAD.top}
                  y2={PAD.top + plotH}
                  stroke="var(--border-strong)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotW}
                  y1={active.y}
                  y2={active.y}
                  stroke="var(--border-strong)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <circle
                  cx={active.x}
                  cy={active.y}
                  r={4}
                  fill="var(--brand)"
                  stroke="var(--bg-elevated)"
                  strokeWidth={1.5}
                />

                <g transform={`translate(${Math.max(PAD.left, active.x - 52)}, ${H - 26})`}>
                  <rect
                    x={0}
                    y={0}
                    width={104}
                    height={20}
                    rx={4}
                    fill="rgba(var(--nav-bg-rgb), 0.92)"
                    stroke="var(--border-strong)"
                  />
                  <text x={52} y={14} textAnchor="middle" fill="var(--fg)" fontSize={10}>
                    {formatTooltipDate(active.t)}
                  </text>
                </g>

                <g transform={`translate(${PAD.left + plotW + 4}, ${active.y - 12})`}>
                  <rect
                    x={0}
                    y={0}
                    width={68}
                    height={22}
                    rx={4}
                    fill="rgba(var(--brand-rgb), 0.25)"
                    stroke="rgba(var(--brand-rgb), 0.5)"
                  />
                  <text x={34} y={15} textAnchor="middle" fill="var(--brand)" fontSize={10} fontWeight={700}>
                    {active.p.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </text>
                </g>
              </>
            ) : null}

            {active && hoverIdx === null ? (
              <g transform={`translate(${PAD.left + plotW + 4}, ${active.y - 12})`}>
                <rect
                  x={0}
                  y={0}
                  width={68}
                  height={22}
                  rx={4}
                  fill="rgba(var(--brand-rgb), 0.2)"
                  stroke="rgba(var(--brand-rgb), 0.45)"
                />
                <text x={34} y={15} textAnchor="middle" fill="var(--brand)" fontSize={10} fontWeight={700}>
                  {active.p.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </text>
              </g>
            ) : null}
          </svg>
        ) : (
          <p className="py-12 text-center text-xs text-[var(--fg-subtle)]">Chart unavailable</p>
        )}
      </div>
    </div>
  );
}
