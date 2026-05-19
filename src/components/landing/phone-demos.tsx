"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { DemoPointer } from "./phone-demo/demo-pointer";
import type { DemoMode } from "./phone-demo/types";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const QtFlow = dynamic(() => import("./phone-demo/qt-flow").then((m) => ({ default: m.QtFlow })), { ssr: false });
const CpFlow = dynamic(() => import("./phone-demo/cp-flow").then((m) => ({ default: m.CpFlow })), { ssr: false });
const FtFlow = dynamic(() => import("./phone-demo/ft-flow").then((m) => ({ default: m.FtFlow })), { ssr: false });
const SipFlow = dynamic(() => import("./phone-demo/sip-flow").then((m) => ({ default: m.SipFlow })), { ssr: false });
const ExchangeFlow = dynamic(() => import("./phone-demo/exchange-flow").then((m) => ({ default: m.ExchangeFlow })), { ssr: false });
const AiFlow = dynamic(() => import("./phone-demo/ai-flow").then((m) => ({ default: m.AiFlow })), { ssr: false });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

type FeatId = DemoMode;

const TABS: { id: FeatId; emoji: string; title: string; desc: string }[] = [
  { id: "qt", emoji: "⚡", title: "Quick Trade", desc: "Buy & sell 400+ coins instantly" },
  { id: "cp", emoji: "📦", title: "CryptoPacks", desc: "Curated themed portfolios" },
  { id: "ft", emoji: "📈", title: "Futures", desc: "Perpetual contracts with leverage" },
  { id: "sip", emoji: "🔁", title: "Crypto SIP", desc: "Auto-invest on a schedule" },
  { id: "exchange", emoji: "💱", title: "Exchange", desc: "Full spot market & charts" },
  { id: "ai", emoji: "🤖", title: "AI Insights", desc: "BTC analysis & sentiment" }
];

const STEPS: Record<FeatId, number> = { qt: 3, cp: 5, ft: 3, sip: 3, exchange: 3, ai: 1 };

export function PhoneDemos() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [feat, setFeat] = useState<FeatId>("qt");
  const [steps, setSteps] = useState<Record<FeatId, number>>({ qt: 1, cp: 1, ft: 1, sip: 1, exchange: 1, ai: 1 });

  const setStep = useCallback((id: FeatId, n: number) => {
    setSteps((s) => ({ ...s, [id]: n }));
  }, []);

  const selectFeat = useCallback((id: FeatId) => {
    if (!prefersReducedMotion() && screenRef.current) {
      gsap.fromTo(screenRef.current, { opacity: 0.6, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
    }
    setFeat(id);
    setSteps((s) => ({ ...s, [id]: 1 }));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      ScrollTrigger.create({
        trigger: "#phone-demos",
        start: "top 70%",
        once: true,
        onEnter: () =>
          gsap.from(".phone-chrome", { y: 80, opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out" })
      });
      gsap.to(".demo-pointer", { y: -6, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: sectionRef }
  );

  const step = steps[feat];

  return (
    <section
      id="phone-demos"
      ref={sectionRef}
      className="scroll-mt-20 px-6 py-20"
      style={{ background: "var(--hero-gradient)" }}
    >
      <div className="container-zeb">
        <SectionHeader
          chip="Interactive demos"
          title="Built for every kind of crypto journey"
          subtitle="Six app flows — Quick Trade, Packs, Futures, SIP, Exchange, and AI Insights. Demo only."
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start">
          <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectFeat(tab.id)}
                className={`shrink-0 rounded-2xl border p-3 text-left transition ${
                  feat === tab.id
                    ? "border-[var(--cyan)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)]/50"
                }`}
              >
                <span className="text-xl">{tab.emoji}</span>
                <div className="mt-1 text-sm font-bold">{tab.title}</div>
                <div className="text-xs text-[var(--text-muted)]">{tab.desc}</div>
              </button>
            ))}
            <p className="text-xs text-[var(--text-muted)]">
              Demo only · <Link href={`${APP_URL}/signup`} className="font-semibold text-[var(--cyan)]">Sign up to trade live</Link>
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[320px]">
            <div
              ref={phoneRef}
              className="phone-chrome feature-phone relative overflow-hidden rounded-[2.5rem] border-[10px] border-[#1a1f3a] bg-[#0a0f2e] shadow-[var(--shadow-lg)]"
              style={{ aspectRatio: "9/19", minHeight: 520 }}
            >
              <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div ref={screenRef} className="phone-screen-active relative flex h-full flex-col overflow-hidden pt-8">
                {feat === "qt" && <QtFlow step={step} setStep={(n) => setStep("qt", n)} />}
                {feat === "cp" && <CpFlow step={step} setStep={(n) => setStep("cp", n)} />}
                {feat === "ft" && <FtFlow step={step} setStep={(n) => setStep("ft", n)} />}
                {feat === "sip" && <SipFlow step={step} setStep={(n) => setStep("sip", n)} />}
                {feat === "exchange" && <ExchangeFlow step={step} setStep={(n) => setStep("exchange", n)} />}
                {feat === "ai" && <AiFlow step={step} setStep={(n) => setStep("ai", n)} />}
              </div>
            </div>
            <DemoPointer mode={feat} steps={steps} maxSteps={STEPS} />
          </div>
        </div>
      </div>
    </section>
  );
}
