"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { QtFlow } from "./phone-demo/qt-flow";
import { CpFlow } from "./phone-demo/cp-flow";
import { FtFlow } from "./phone-demo/ft-flow";
import { DemoPointer } from "./phone-demo/demo-pointer";
import type { DemoMode } from "./phone-demo/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

type FeatId = "qt" | "cp" | "ft";

const TABS: { id: FeatId; emoji: string; title: string; desc: string }[] = [
  { id: "qt", emoji: "⚡", title: "Quick Trade", desc: "Buy & sell 400+ coins instantly" },
  { id: "cp", emoji: "📦", title: "CryptoPacks", desc: "Curated themed portfolios" },
  { id: "ft", emoji: "📈", title: "Futures", desc: "Perpetual contracts with leverage" }
];

export function PhoneDemos() {
  const [feat, setFeat] = useState<FeatId>("qt");
  const [mode, setMode] = useState<DemoMode>("qt");
  const [qtStep, setQtStep] = useState(1);
  const [cpStep, setCpStep] = useState(1);
  const [ftStep, setFtStep] = useState(1);

  const selectFeat = useCallback((id: FeatId) => {
    setFeat(id);
    setMode(id);
    if (id === "qt") setQtStep(1);
    if (id === "cp") setCpStep(1);
    if (id === "ft") setFtStep(1);
  }, []);

  return (
    <section id="phone-demos" className="scroll-mt-20 px-6 py-20" style={{ background: "var(--hero-gradient)" }}>
      <div className="container-zeb">
        <SectionHeader
          chip="Interactive demos"
          title="Built for every kind of crypto journey"
          subtitle="Try Quick Trade, CryptoPacks, and Futures — no real order placed."
        />
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
            <div className="flex flex-col gap-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectFeat(tab.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    feat === tab.id
                      ? "border-[var(--cyan)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
                      : "border-[var(--border)] bg-[var(--bg-elevated)]/50 hover:border-[var(--cyan)]/50"
                  }`}
                >
                  <span className="text-2xl">{tab.emoji}</span>
                  <div className="mt-2 font-bold text-[var(--text)]">{tab.title}</div>
                  <div className="text-sm text-[var(--text-muted)]">{tab.desc}</div>
                </button>
              ))}
              <p className="text-center text-xs text-[var(--text-muted)] lg:text-left">
                Demo only · <Link href={`${APP_URL}/signup`} className="text-[var(--cyan)] font-semibold">Sign up to trade live</Link>
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[320px]">
              <div
                className="feature-phone relative overflow-hidden rounded-[2.5rem] border-[10px] border-[#1a1f3a] bg-[#0a0f2e] shadow-[var(--shadow-lg)]"
                style={{ aspectRatio: "9/19", minHeight: 520 }}
              >
                <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                <div className="flex h-full flex-col pt-8">
                  {mode === "qt" && <QtFlow step={qtStep} setStep={setQtStep} />}
                  {mode === "cp" && <CpFlow step={cpStep} setStep={setCpStep} />}
                  {mode === "ft" && <FtFlow step={ftStep} setStep={setFtStep} />}
                </div>
              </div>
              <DemoPointer mode={mode} qtStep={qtStep} cpStep={cpStep} ftStep={ftStep} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
