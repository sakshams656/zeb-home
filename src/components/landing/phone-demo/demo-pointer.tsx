"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoMode } from "./types";

type Hint = { sel: string; label: string };

const QT: Record<number, Hint> = {
  1: { sel: ".qt-row", label: "Tap a coin to trade" },
  2: { sel: "#qt-swipe", label: "Swipe to buy" }
};
const CP: Record<number, Hint> = {
  1: { sel: ".cp-pack-card", label: "Tap a pack" },
  2: { sel: "#cp-buy-more", label: "Tap Buy More" },
  3: { sel: "#cp-preview", label: "Tap to preview" },
  4: { sel: "#cp-buy-now", label: "Tap Buy Now" }
};
const FT: Record<number, Hint> = {
  1: { sel: ".ft-row", label: "Tap a coin to trade" },
  2: { sel: "#ft-buylong-btn", label: "Tap Buy / Long" },
  3: { sel: "#ft-buylong-btn2", label: "Tap Buy / Long" }
};

export function DemoPointer({
  mode,
  qtStep,
  cpStep,
  ftStep
}: {
  mode: DemoMode;
  qtStep: number;
  cpStep: number;
  ftStep: number;
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [label, setLabel] = useState("Tap here");
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const step = mode === "qt" ? qtStep : mode === "cp" ? cpStep : ftStep;
  const hints = mode === "qt" ? QT : mode === "cp" ? CP : FT;

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const h = hints[step];
    if (!h) return;
    timer.current = setTimeout(() => {
      setVisible(false);
      const root = document.querySelector("#phone-demos .feature-phone");
      const el = root?.querySelector(h.sel) ?? document.querySelector(h.sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      setPos({ x: r.left + 20, y: r.top + r.height / 2 - 4 });
      setLabel(h.label);
      setVisible(true);
    }, 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mode, step, hints]);

  useEffect(() => {
    const hide = () => setVisible(false);
    const onScroll = () => {
      if (!visible) return;
      const h = hints[step];
      if (!h) return;
      const root = document.querySelector("#phone-demos .feature-phone");
      const el = root?.querySelector(h.sel) ?? document.querySelector(h.sel);
      if (!el) {
        setVisible(false);
        return;
      }
      const r = el.getBoundingClientRect();
      setPos({ x: r.left + 20, y: r.top + r.height / 2 - 4 });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("click", hide, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", hide, true);
    };
  }, [visible, step, hints]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 99999,
        pointerEvents: "none",
        left: pos.x,
        top: pos.y
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
        <div style={{ fontSize: 28, lineHeight: 1, animation: "handBounce 0.9s ease-in-out infinite", transform: "rotate(180deg)" }}>
          👆
        </div>
        <div
          style={{
            background: "#1a1a3e",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontSize: 10,
            fontWeight: 700,
            padding: "6px 13px",
            borderRadius: 100,
            whiteSpace: "nowrap",
            border: "1.5px solid rgba(40,85,200,0.5)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)"
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
