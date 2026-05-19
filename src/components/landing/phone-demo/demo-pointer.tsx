"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoMode } from "./types";

type Hint = { sel: string; label: string };

const HINTS: Partial<Record<DemoMode, Record<number, Hint>>> = {
  qt: { 1: { sel: ".qt-row", label: "Tap a coin to trade" }, 2: { sel: "#qt-swipe", label: "Swipe to buy" } },
  cp: {
    1: { sel: ".cp-pack-card", label: "Tap a pack" },
    2: { sel: "#cp-buy-more", label: "Tap Buy More" },
    3: { sel: "#cp-preview", label: "Tap to preview" },
    4: { sel: "#cp-buy-now", label: "Tap Buy Now" }
  },
  ft: {
    1: { sel: ".ft-row", label: "Tap a coin" },
    2: { sel: "#ft-buylong-btn", label: "Tap Buy / Long" },
    3: { sel: "#ft-buylong-btn2", label: "Confirm order" }
  },
  sip: { 1: { sel: "button[style*='border-radius: 50%']", label: "Create a SIP" }, 2: { sel: "button", label: "Pick a coin" } },
  exchange: { 1: { sel: ".ex-row", label: "Select a market" }, 2: { sel: "button", label: "Open chart" } }
};

export function DemoPointer({
  mode,
  steps,
  maxSteps
}: {
  mode: DemoMode;
  steps: Record<DemoMode, number>;
  maxSteps: Record<DemoMode, number>;
}) {
  const [placement, setPlacement] = useState<{ x: number; y: number; label: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const step = steps[mode];
  const hint = HINTS[mode]?.[step];

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!hint) return;
    timer.current = setTimeout(() => {
      const root = document.querySelector("#phone-demos .feature-phone");
      const el = root?.querySelector(hint.sel) ?? document.querySelector(hint.sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      setPlacement({ x: r.left + 20, y: r.top + r.height / 2 - 4, label: hint.label });
    }, 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mode, step, hint]);

  if (!hint || !placement || step > (maxSteps[mode] ?? 1)) return null;

  return (
    <div
      className="demo-pointer"
      style={{ position: "fixed", zIndex: 99999, pointerEvents: "none", left: placement.x, top: placement.y }}
    >
      <div style={{ fontSize: 28, lineHeight: 1, transform: "rotate(180deg)" }}>👆</div>
      <div
        style={{
          background: "#1a1a3e",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          padding: "6px 13px",
          borderRadius: 100,
          whiteSpace: "nowrap",
          border: "1.5px solid rgba(40,85,200,0.5)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)"
        }}
      >
        {placement.label}
      </div>
    </div>
  );
}
