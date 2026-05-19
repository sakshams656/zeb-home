"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePersona } from "@/context/persona-context";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { formatInr } from "@/lib/format";
import { BTC_INR } from "@/lib/market-data";
import { HERO_BTC_SPARK } from "@/lib/charts";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

export function Hero() {
  const { persona } = usePersona();
  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-12 md:pb-24 md:pt-20"
      style={{ background: "var(--hero-gradient)" }}
    >
      <div className="container-zeb relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="show-trader inline-block rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-bold text-[var(--cyan)]">
              Pro-grade futures · RMS · APIs
            </span>
            <span className="show-retail inline-block rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-bold text-[var(--cyan)]">
              SIP · CryptoPacks · Earn up to 8.5%
            </span>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-black leading-tight tracking-tight text-[var(--text)]">
              <span className="show-trader">
                Trade smarter with{" "}
                <span className="text-[var(--cyan)]">AI insights</span> &amp; RMS
              </span>
              <span className="show-retail">
                Grow wealth with{" "}
                <span className="text-[var(--cyan)]">CryptoPacks</span> &amp; SIP
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-[var(--text-muted)]">
              <span className="show-trader">
                India&apos;s trusted exchange since 2014 — spot, futures up to 25x,
                expert signals, and institutional-grade risk controls.
              </span>
              <span className="show-retail">
                Buy 400+ assets in INR, automate investing, and earn yield — FIU-IND
                registered and insured.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`${APP_URL}/signup`} className="btn-primary">
                Get Started Free
              </a>
              <Link href="#features" className="btn-outline">
                Explore Features
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { end: 6, suffix: "M+", label: "Users" },
                { end: 22, suffix: "B+", prefix: "$", label: "Volume" },
                { end: 400, suffix: "+", label: "Assets" },
                { end: 160, suffix: "+", label: "Countries" }
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-[var(--text)]">
                    <Counter end={s.end} suffix={s.suffix} prefix={s.prefix ?? ""} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <Reveal className="relative hidden lg:block">
            <HeroCards btcPrice={BTC_INR} persona={persona} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroCards({ btcPrice, persona }: { btcPrice: number; persona: string }) {
  return (
    <div className="relative h-[420px]">
      <div
        className="absolute left-0 top-8 w-56 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <div className="text-xs font-bold text-[var(--text-muted)]">BTC / INR</div>
        <div className="mt-1 text-xl font-black tabular-nums">{formatInr(btcPrice)}</div>
        <svg viewBox="0 0 80 32" className="mt-2 h-8 w-full">
          <path d={HERO_BTC_SPARK} fill="none" stroke="var(--success)" strokeWidth={2} />
        </svg>
        <span className="text-sm font-bold text-[var(--success)]">+1.72%</span>
      </div>
      <div
        className="absolute right-0 top-0 w-52 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <div className="text-xs font-bold text-[var(--text-muted)]">
          {persona === "trader" ? "Futures PnL" : "Earn APY"}
        </div>
        <div className="mt-1 text-2xl font-black text-[var(--success)]">
          {persona === "trader" ? "+₹12,400" : "8.5%"}
        </div>
        <div className="text-xs text-[var(--text-muted)]">Today</div>
      </div>
      <div
        className="absolute bottom-0 left-1/4 w-60 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <div className="flex items-center gap-2">
          <span className="rounded bg-[var(--cyan)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--navy)]">
            NEW
          </span>
          <span className="text-sm font-bold">AI Insights</span>
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          BTC sentiment: Bullish · 78% confidence
        </p>
      </div>
    </div>
  );
}
