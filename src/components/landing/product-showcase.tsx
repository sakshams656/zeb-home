"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { DemoPointer } from "./phone-demo/demo-pointer";
import type { DemoMode } from "./phone-demo/types";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const QtFlow = dynamic(() => import("./phone-demo/qt-flow").then((m) => ({ default: m.QtFlow })), { ssr: false });
const FtFlow = dynamic(() => import("./phone-demo/ft-flow").then((m) => ({ default: m.FtFlow })), { ssr: false });
const SipFlow = dynamic(() => import("./phone-demo/sip-flow").then((m) => ({ default: m.SipFlow })), { ssr: false });
const CpFlow = dynamic(() => import("./phone-demo/cp-flow").then((m) => ({ default: m.CpFlow })), { ssr: false });
const ExchangeFlow = dynamic(() => import("./phone-demo/exchange-flow").then((m) => ({ default: m.ExchangeFlow })), { ssr: false });
const AiFlow = dynamic(() => import("./phone-demo/ai-flow").then((m) => ({ default: m.AiFlow })), { ssr: false });

type PanelMode = DemoMode;

const AUTO_ADVANCE_MS = 6000;

const PANELS: {
  id: string;
  num: string;
  title: string;
  body: string;
  mode: PanelMode;
}[] = [
  {
    id: "spot",
    num: "01",
    title: "Spot Trade",
    body: "The fastest way to buy and sell crypto. Up to 200+ pairs.",
    mode: "qt"
  },
  {
    id: "futures",
    num: "02",
    title: "Futures",
    body: "Trade perpetuals with up to 25x leverage and RMS protection.",
    mode: "ft"
  },
  {
    id: "sip",
    num: "03",
    title: "SIP",
    body: "Invest on autopilot. Daily, weekly, or monthly in any coin.",
    mode: "sip"
  },
  {
    id: "packs",
    num: "04",
    title: "CryptoPacks",
    body: "Expert-curated baskets — DeFi, L1s, AI, and more.",
    mode: "cp"
  },
  {
    id: "earn",
    num: "05",
    title: "Earn",
    body: "Put idle crypto to work. Up to 8.5% APY on stablecoins.",
    mode: "exchange"
  },
  {
    id: "ai",
    num: "06",
    title: "AI Insights",
    body: "Sentiment, opportunities, and risks for every major pair.",
    mode: "ai"
  }
];

const MAX_STEPS: Record<PanelMode, number> = {
  qt: 3,
  ft: 4,
  sip: 3,
  cp: 5,
  exchange: 3,
  ai: 1
};

const INITIAL_STEPS: Record<PanelMode, number> = {
  qt: 1,
  cp: 1,
  ft: 1,
  sip: 1,
  exchange: 1,
  ai: 1
};

function ScreenFallback() {
  return <div className="flex h-full items-center justify-center text-xs text-[#888]">Loading…</div>;
}

function PanelPhone({
  mode,
  step,
  setStep
}: {
  mode: PanelMode;
  step: number;
  setStep: (n: number) => void;
}) {
  switch (mode) {
    case "qt":
      return <QtFlow step={step} setStep={setStep} />;
    case "ft":
      return <FtFlow step={step} setStep={setStep} />;
    case "sip":
      return <SipFlow step={step} setStep={setStep} />;
    case "cp":
      return <CpFlow step={step} setStep={setStep} />;
    case "exchange":
      return <ExchangeFlow step={step} setStep={setStep} />;
    case "ai":
      return <AiFlow step={step} setStep={setStep} />;
    default:
      return null;
  }
}

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef(0);
  const [activeMode, setActiveMode] = useState<PanelMode>("qt");
  const [steps, setSteps] = useState<Record<PanelMode, number>>(INITIAL_STEPS);
  const [paused, setPaused] = useState(false);

  const active = PANELS.find((p) => p.mode === activeMode) ?? PANELS[0];

  const advance = useCallback(() => {
    setActiveMode((current) => {
      const idx = PANELS.findIndex((p) => p.mode === current);
      const next = PANELS[(idx + 1) % PANELS.length];
      setSteps((s) => ({ ...s, [next.mode]: 1 }));
      return next.mode;
    });
  }, []);

  const setPanelStep = useCallback((mode: PanelMode, n: number) => {
    interactionRef.current = Date.now();
    setSteps((s) => ({ ...s, [mode]: n }));
  }, []);

  const selectPanel = useCallback((mode: PanelMode) => {
    interactionRef.current = Date.now();
    setActiveMode(mode);
    setSteps((s) => ({ ...s, [mode]: 1 }));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const copy = copyRef.current;
      const phone = phoneRef.current;
      if (!copy || !phone) return;

      gsap.fromTo(
        copy.querySelectorAll(".panel-number, .panel-title, .panel-body, .learn-cta"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: ZEB_EASE, overwrite: true }
      );
      gsap.fromTo(phone, { opacity: 0.65, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3, ease: ZEB_EASE, overwrite: true });
    },
    { dependencies: [activeMode] }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(".demo-pointer", { y: -6, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (prefersReducedMotion() || paused) return;
    interactionRef.current = Date.now();
    const id = window.setInterval(() => {
      if (Date.now() - interactionRef.current >= AUTO_ADVANCE_MS) {
        advance();
        interactionRef.current = Date.now();
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [advance, paused, activeMode]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setPaused(!entry.isIntersecting);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const onUserActivity = () => {
    interactionRef.current = Date.now();
  };

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="product-showcase relative flex h-[100svh] min-h-[640px] overflow-hidden"
      onMouseMove={onUserActivity}
      onPointerDown={onUserActivity}
      onTouchStart={onUserActivity}
    >
      <div
        id="phone-demos"
        className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col px-6 pb-6 pt-[calc(72px+1.5rem)] lg:pb-8 lg:pt-[calc(72px+2rem)]"
      >
        <div className="shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)] sm:text-sm">Products</p>
          <h2 className="mt-1.5 max-w-3xl text-[clamp(1.5rem,3vw,2.25rem)] font-black leading-tight text-[var(--text-on-dark)]">
            Built for every kind of crypto journey.
          </h2>
        </div>

        <div className="mt-4 grid min-h-0 flex-1 items-center gap-6 lg:mt-6 lg:grid-cols-2 lg:gap-10">
          <div ref={copyRef} className="panel-copy">
            <p className="panel-number text-[clamp(48px,6vw,72px)] font-black leading-none text-[var(--brand)] opacity-90">
              {active.num}
            </p>
            <h3 className="panel-title mt-1 text-[clamp(1.5rem,3vw,2.25rem)] font-black text-[var(--text-on-dark)]">
              {active.title}
            </h3>
            <p className="panel-body mt-3 max-w-md text-sm text-[var(--text-muted-dark)] sm:text-base">{active.body}</p>
            <a href="#" className="btn-primary learn-cta mt-5 text-sm">
              Learn more
              <span aria-hidden>→</span>
            </a>
          </div>

          <div ref={phoneRef} className="flex h-full max-h-[460px] items-center justify-center lg:justify-end">
            <div className="origin-center scale-[0.78] sm:scale-[0.85] lg:scale-[0.9]">
              <PhoneFrame tilt={6} className="feature-phone">
                <Suspense fallback={<ScreenFallback />}>
                  <PanelPhone
                    mode={activeMode}
                    step={steps[activeMode]}
                    setStep={(n) => setPanelStep(activeMode, n)}
                  />
                </Suspense>
              </PhoneFrame>
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Product showcase"
          className="mt-4 flex shrink-0 flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {PANELS.map((p) => {
            const isActive = p.mode === activeMode;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectPanel(p.mode)}
                className={`showcase-tab inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:py-2 sm:text-sm ${
                  isActive
                    ? "border-transparent bg-[var(--brand)] text-white shadow-[0_8px_24px_rgba(27,85,224,0.35)]"
                    : "border-[var(--border-dark)] bg-white/[0.04] text-[var(--text-muted-dark)] hover:border-[var(--brand)] hover:text-[var(--text-on-dark)]"
                }`}
              >
                <span className={`tab-num text-[10px] font-black sm:text-xs ${isActive ? "text-white/80" : "text-[var(--brand)]"}`}>
                  {p.num}
                </span>
                {p.title}
              </button>
            );
          })}
        </div>

        {!paused && <DemoPointer mode={activeMode} steps={steps} maxSteps={MAX_STEPS} />}
      </div>
    </section>
  );
}
