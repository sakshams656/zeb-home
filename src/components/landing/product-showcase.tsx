"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { DemoPointer } from "./phone-demo/demo-pointer";
import type { DemoMode } from "./phone-demo/types";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const QtFlow = dynamic(() => import("./phone-demo/qt-flow").then((m) => ({ default: m.QtFlow })), { ssr: false });
const FtFlow = dynamic(() => import("./phone-demo/ft-flow").then((m) => ({ default: m.FtFlow })), { ssr: false });
const SipFlow = dynamic(() => import("./phone-demo/sip-flow").then((m) => ({ default: m.SipFlow })), { ssr: false });
const CpFlow = dynamic(() => import("./phone-demo/cp-flow").then((m) => ({ default: m.CpFlow })), { ssr: false });
const ExchangeFlow = dynamic(() => import("./phone-demo/exchange-flow").then((m) => ({ default: m.ExchangeFlow })), { ssr: false });
const AiFlow = dynamic(() => import("./phone-demo/ai-flow").then((m) => ({ default: m.AiFlow })), { ssr: false });

type PanelMode = DemoMode;

const PANELS: {
  id: string;
  num: string;
  title: string;
  body: string;
  bg: string;
  mode: PanelMode;
}[] = [
  {
    id: "spot",
    num: "01",
    title: "Spot Trade",
    body: "The fastest way to buy and sell crypto. Up to 200+ pairs.",
    bg: "#0a0f2e",
    mode: "qt"
  },
  {
    id: "futures",
    num: "02",
    title: "Futures",
    body: "Trade perpetuals with up to 25x leverage and RMS protection.",
    bg: "#06112b",
    mode: "ft"
  },
  {
    id: "sip",
    num: "03",
    title: "SIP",
    body: "Invest on autopilot. Daily, weekly, or monthly in any coin.",
    bg: "#071a2e",
    mode: "sip"
  },
  {
    id: "packs",
    num: "04",
    title: "CryptoPacks",
    body: "Expert-curated baskets — DeFi, L1s, AI, and more.",
    bg: "#080d24",
    mode: "cp"
  },
  {
    id: "earn",
    num: "05",
    title: "Earn",
    body: "Put idle crypto to work. Up to 8.5% APY on stablecoins.",
    bg: "#050e1f",
    mode: "exchange"
  },
  {
    id: "ai",
    num: "06",
    title: "AI Insights",
    body: "Sentiment, opportunities, and risks for every major pair.",
    bg: "#040c1a",
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

function panelIndex(progress: number) {
  return Math.min(PANELS.length - 1, Math.max(0, Math.round(progress * (PANELS.length - 1))));
}

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
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const lastIdxRef = useRef(0);
  const [activeMode, setActiveMode] = useState<PanelMode>("qt");
  const [steps, setSteps] = useState<Record<PanelMode, number>>(INITIAL_STEPS);

  const setPanelStep = useCallback((mode: PanelMode, n: number) => {
    setSteps((s) => ({ ...s, [mode]: n }));
    setActiveMode(mode);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (prefersReducedMotion() || !section || !track) return;

      const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const scroll = gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (st) => {
            const idx = panelIndex(st.progress);
            if (idx !== lastIdxRef.current) {
              lastIdxRef.current = idx;
              setActiveMode(PANELS[idx].mode);
            }
            dotsRef.current?.querySelectorAll(".showcase-dot").forEach((dot, i) => {
              const el = dot as HTMLElement;
              const active = i === idx;
              el.style.width = active ? "24px" : "8px";
              el.style.background = active ? "var(--cyan)" : "rgba(255,255,255,0.25)";
            });
          }
        }
      });

      const panels = gsap.utils.toArray<HTMLElement>(".product-panel", track);
      panels.forEach((panel, i) => {
        const mode = PANELS[i].mode;
        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scroll,
            start: "left 60%",
            toggleActions: "play none none none",
            once: true
          }
        })
          .from(panel.querySelector(".panel-number"), { opacity: 0, y: 40, duration: 0.5, ease: ZEB_EASE })
          .from(panel.querySelector(".panel-title"), { opacity: 0, y: 60, duration: 0.7, ease: ZEB_EASE }, "-=0.3")
          .from(panel.querySelector(".panel-body"), { opacity: 0, y: 30, duration: 0.5 }, "-=0.4");

        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: scroll,
          start: "left right",
          end: "right left",
          onLeaveBack: () => setSteps((s) => ({ ...s, [mode]: 1 }))
        });
      });

      gsap.to(".demo-pointer", { y: -6, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: sectionRef }
  );

  return (
    <section id="showcase" ref={sectionRef} className="product-showcase relative bg-[#040812]">
      <div id="phone-demos" className="product-sticky relative h-screen overflow-hidden">
        <div ref={trackRef} className="product-track flex h-full">
          {PANELS.map((p) => (
            <article
              key={p.id}
              className="product-panel flex h-full w-screen shrink-0 items-center"
              style={{ background: p.bg }}
            >
              <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
                <div className="panel-copy">
                  <p className="panel-number text-[120px] font-black leading-none text-[var(--cyan)] opacity-90">{p.num}</p>
                  <h2 className="panel-title text-[clamp(2.5rem,5vw,4rem)] font-black text-[var(--text-on-dark)]">{p.title}</h2>
                  <p className="panel-body mt-6 max-w-md text-xl text-[var(--text-muted-dark)]">{p.body}</p>
                  <a
                    href="#"
                    className="mt-8 inline-flex rounded-full border border-[var(--border-dark)] px-6 py-3 font-bold text-[var(--cyan)] hover:border-[var(--cyan)]"
                  >
                    Learn more →
                  </a>
                </div>
                <div className="panel-phone-spacer hidden min-h-[580px] lg:block" aria-hidden />
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:block" />
            <div className="panel-phone pointer-events-auto flex justify-center">
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

        <div ref={dotsRef} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {PANELS.map((p) => (
            <span
              key={p.id}
              className="showcase-dot h-2 rounded-full transition-all duration-300"
              style={{ width: 8, background: "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>

        <DemoPointer mode={activeMode} steps={steps} maxSteps={MAX_STEPS} />
      </div>
    </section>
  );
}
