"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { DemoPointer } from "./phone-demo/demo-pointer";
import type { DemoMode } from "./phone-demo/types";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { getFeatureRouteForShowcaseMode } from "@/lib/product-features";

const AiFlow = dynamic(() => import("./phone-demo/ai-flow").then((m) => ({ default: m.AiFlow })), { ssr: false });

type PanelMode = DemoMode;

const PANEL_VIDEO_SRC: Partial<Record<PanelMode, string>> = {
  qt: "/videos/quick_trade.mp4",
  ft: "/videos/futures.mp4",
  sip: "/videos/sip.mp4",
  cp: "/videos/crypto_packs.mp4",
  exchange: "/videos/earn.mp4"
};

const VIDEO_PLAYBACK_RATE = 1.5;

const AUTO_ADVANCE_MS = 30000;

const PANELS: {
  id: string;
  title: string;
  body: string;
  mode: PanelMode;
}[] = [
  {
    id: "spot",
    title: "Quick Trade",
    body: "Effortlessly invest in 300+ pairs instantly using Quick Trade. Place orders using the Market or Limit functionality with minimum slippage and best fees.",
    mode: "qt"
  },
  {
    id: "futures",
    title: "Futures",
    body: "Trade Crypto-INR and Crypto-USDT Perpetual futures seamlessly on ZebPay. Endless opportunities are a click away.",
    mode: "ft"
  },
  {
    id: "sip",
    title: "SIP",
    body: "Automate your bitcoin & crypto investing the disciplined way",
    mode: "sip"
  },
  {
    id: "packs",
    title: "CryptoPacks",
    body: "Expert-curated baskets — DeFi, L1s, AI, and more.",
    mode: "cp"
  },
  {
    id: "earn",
    title: "Earn",
    body: "Use ZebPay Earn to get fixed earnings of up to 8.5% Earn from your crypto holdings for a fixed term.",
    mode: "exchange"
  },
  {
    id: "ai",
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

const PANEL_LINKS: Record<PanelMode, string> = {
  qt: getFeatureRouteForShowcaseMode("qt"),
  ft: getFeatureRouteForShowcaseMode("ft"),
  sip: getFeatureRouteForShowcaseMode("sip"),
  cp: getFeatureRouteForShowcaseMode("cp"),
  exchange: getFeatureRouteForShowcaseMode("exchange"),
  ai: getFeatureRouteForShowcaseMode("ai")
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
  return <div className="flex h-full items-center justify-center text-xs text-[var(--fg-muted)]">Loading…</div>;
}

function PanelVideo({
  src,
  playing,
  onEnded
}: {
  src: string;
  playing: boolean;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyRate = () => {
      video.playbackRate = VIDEO_PLAYBACK_RATE;
    };
    applyRate();
    video.addEventListener("loadedmetadata", applyRate);

    if (playing) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }

    return () => video.removeEventListener("loadedmetadata", applyRate);
  }, [src, playing]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      className="h-full w-full object-cover object-top"
      muted
      playsInline
      autoPlay
      preload="metadata"
      onEnded={onEnded}
      aria-hidden
    />
  );
}

function PanelPhone({
  step,
  setStep
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  return <AiFlow step={step} setStep={setStep} />;
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
        copy.querySelectorAll(".panel-title, .panel-body, .learn-cta"),
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
      className="product-showcase relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:py-24"
      onMouseMove={onUserActivity}
      onPointerDown={onUserActivity}
      onTouchStart={onUserActivity}
    >
      <div id="product-showcase" className="relative mx-auto w-full max-w-[1200px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--fg-subtle)] sm:text-sm">Products</p>
          <h2 className="mt-1.5 max-w-3xl text-[clamp(1.5rem,5vw,2.25rem)] font-black leading-tight text-[var(--fg)]">
            Built for every kind of crypto journey.
          </h2>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-10">
          <div
            ref={copyRef}
            id={`showcase-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`showcase-tab-${active.id}`}
            className="panel-copy"
          >
            <h3 className="panel-title text-[clamp(1.8rem,6vw,2.7rem)] font-black text-[var(--fg)]">
              {active.title}
            </h3>
            <p className="panel-body mt-3 max-w-md text-sm text-[var(--fg-muted)] sm:text-base">{active.body}</p>
            {/* {LIVE_PRICE_MODES.has(activeMode) ? <FeatureLivePairsStrip /> : null} */}
            <Link href={PANEL_LINKS[activeMode]} className="btn-primary learn-cta mt-5">
              Learn more
              <span aria-hidden className="learn-cta-arrow">
                →
              </span>
            </Link>
          </div>

          <div ref={phoneRef} className="flex items-center justify-center lg:justify-end">
            <PhoneFrame tilt={6} className="feature-phone">
              {PANEL_VIDEO_SRC[activeMode] ? (
                <PanelVideo
                  src={PANEL_VIDEO_SRC[activeMode]!}
                  playing={!paused}
                  onEnded={advance}
                />
              ) : (
                <Suspense fallback={<ScreenFallback />}>
                  <PanelPhone step={steps.ai} setStep={(n) => setPanelStep("ai", n)} />
                </Suspense>
              )}
            </PhoneFrame>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Product showcase"
          className="-mx-4 mt-8 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-4 pb-2 sm:gap-3 lg:mx-0 lg:mt-6 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {PANELS.map((p) => {
            const isActive = p.mode === activeMode;
            return (
              <button
                key={p.id}
                id={`showcase-tab-${p.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`showcase-panel-${p.id}`}
                onClick={() => selectPanel(p.mode)}
                className={`showcase-tab inline-flex shrink-0 snap-start items-center rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2.5 ${
                  isActive
                    ? "border-transparent bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_8px_24px_rgba(var(--accent-rgb),0.35)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:border-[var(--brand)] hover:text-[var(--fg)]"
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {!paused && activeMode === "ai" && (
          <div className="hidden lg:block">
            <DemoPointer mode={activeMode} steps={steps} maxSteps={MAX_STEPS} scope="product-showcase" />
          </div>
        )}
      </div>
    </section>
  );
}
