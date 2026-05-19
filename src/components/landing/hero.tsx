"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { usePersona } from "@/context/persona-context";
import { formatInr } from "@/lib/format";
import { BTC_INR } from "@/lib/market-data";
import { gsap, SplitText, prefersReducedMotion, setWillChange } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const STATS = [
  { target: 6, suffix: "M+", label: "Users", prefix: "" },
  { target: 22, suffix: "B+", label: "Volume", prefix: "$" },
  { target: 400, suffix: "+", label: "Assets", prefix: "" },
  { target: 160, suffix: "+", label: "Countries", prefix: "" }
];

export function Hero() {
  const { persona } = usePersona();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    const dots: { x: number; y: number; bx: number; by: number }[] = [];
    const gap = 28;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      dots.length = 0;
      for (let x = gap; x < canvas.width; x += gap) {
        for (let y = gap; y < canvas.height; y += gap) {
          dots.push({ x, y, bx: x, by: y });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        const dx = d.bx - mx;
        const dy = d.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = dist < 120 ? (120 - dist) / 120 : 0;
        d.x += (d.bx + (dx / (dist || 1)) * force * 12 - d.x) * 0.08;
        d.y += (d.by + (dy / (dist || 1)) * force * 12 - d.y) * 0.08;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 184, 230, 0.15)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits: SplitText[] = [];
        sectionRef.current?.querySelectorAll(".hero-headline").forEach((el) => {
          const split = new SplitText(el as HTMLElement, { type: "words,chars" });
          splits.push(split);
          gsap.from(split.words, {
            opacity: 0,
            y: 60,
            rotateX: -40,
            stagger: 0.04,
            duration: 0.8,
            ease: "power4.out",
            delay: 0.2
          });
        });

        gsap.from(".hero-sub", { opacity: 0, y: 20, duration: 0.6, delay: 0.7, ease: "power2.out" });
        gsap.from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.85, ease: "back.out(1.7)" });

        document.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power1.out",
            scrollTrigger: { trigger: ".hero-stats", start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = `${el.dataset.prefix ?? ""}${Math.round(obj.val)}${el.dataset.suffix ?? ""}`;
            }
          });
        });

        const path = sectionRef.current?.querySelector(".sparkline-path") as SVGPathElement | null;
        if (path) {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 2, ease: "power2.out", delay: 0.5 }
          );
        }

        cardsRef.current?.querySelectorAll(".hero-float-card").forEach((card, i) => {
          setWillChange(card, true);
          gsap.from(card, { opacity: 0, y: 40, scale: 0.9, delay: 1 + i * 0.15, duration: 0.7, ease: "power3.out" });
          gsap.to(card, { y: -12, duration: 3 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.5 });
        });

        return () => splits.forEach((s) => s.revert());
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const copy = copyRef.current;
      if (prefersReducedMotion() || !copy) return;
      const outgoing = copy.querySelectorAll(".persona-copy");
      const incoming = copy.querySelectorAll(`.persona-copy-${persona}`);
      if (!incoming.length) return;
      gsap.to(outgoing, {
        opacity: 0,
        y: 8,
        duration: 0.25,
        stagger: 0.02,
        onComplete: () => {
          gsap.fromTo(incoming, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        }
      });
    },
    { scope: copyRef, dependencies: [persona] }
  );

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 20;
      const ny = (e.clientY / window.innerHeight - 0.5) * 12;
      cards.querySelectorAll(".hero-float-card").forEach((c) => {
        (c as HTMLElement).style.transform = `translate(${nx}px, ${ny}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative overflow-hidden px-6 pb-16 pt-12 md:pb-24 md:pt-20"
      style={{ background: "var(--hero-gradient)" }}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      <div className="container-zeb relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div ref={copyRef}>
            <span className="persona-copy persona-copy-trader show-trader hero-sub inline-block rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-bold text-[var(--cyan)]">
              Pro-grade futures · RMS · APIs
            </span>
            <span className="persona-copy persona-copy-retail show-retail hero-sub inline-block rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-bold text-[var(--cyan)]">
              SIP · CryptoPacks · Earn up to 8.5%
            </span>
            <h1 className="hero-headline mt-4 text-[clamp(2rem,5vw,3.25rem)] font-black leading-tight tracking-tight text-[var(--text)]">
              <span className="persona-copy persona-copy-trader show-trader">
                Trade smarter with <span className="text-[var(--cyan)]">AI insights</span> &amp; RMS
              </span>
              <span className="persona-copy persona-copy-retail show-retail">
                Grow wealth with <span className="text-[var(--cyan)]">CryptoPacks</span> &amp; SIP
              </span>
            </h1>
            <p className="hero-sub mt-4 max-w-lg text-lg text-[var(--text-muted)]">
              <span className="persona-copy persona-copy-trader show-trader">
                India&apos;s trusted exchange since 2014 — spot, futures up to 25x, expert signals, and institutional-grade risk controls.
              </span>
              <span className="persona-copy persona-copy-retail show-retail">
                Buy 400+ assets in INR, automate investing, and earn yield — FIU-IND registered and insured.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`${APP_URL}/signup`} className="hero-cta btn-primary">Get Started Free</a>
              <Link href="#features" className="hero-cta btn-outline">Explore Features</Link>
            </div>
            <div className="hero-stats mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="stat-value text-2xl font-black text-[var(--text)]"
                    data-target={s.target}
                    data-suffix={s.suffix}
                    data-prefix={s.prefix}
                  >
                    {s.prefix}0{s.suffix}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div ref={cardsRef} className="relative hidden lg:block">
            <HeroCards btcPrice={BTC_INR} persona={persona} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCards({ btcPrice, persona }: { btcPrice: number; persona: string }) {
  const spark =
    "M 0 28 L 7.27 20 L 14.55 4 L 21.82 8.67 L 29.09 12 L 36.36 16 L 43.64 20 L 50.91 24 L 58.18 28 L 65.45 24 L 72.73 20 L 80 16";
  return (
    <div className="relative h-[420px]">
      <div
        className="hero-float-card absolute left-0 top-8 w-56 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <div className="text-xs font-bold text-[var(--text-muted)]">BTC / INR</div>
        <div className="mt-1 text-xl font-black tabular-nums">{formatInr(btcPrice)}</div>
        <svg viewBox="0 0 80 32" className="mt-2 h-8 w-full">
          <path className="sparkline-path" d={spark} fill="none" stroke="var(--success)" strokeWidth={2} />
        </svg>
        <span className="text-sm font-bold text-[var(--success)]">+1.72%</span>
      </div>
      <div
        className="hero-float-card absolute right-0 top-0 w-52 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <div className="text-xs font-bold text-[var(--text-muted)]">{persona === "trader" ? "Futures PnL" : "Earn APY"}</div>
        <div className="mt-1 text-2xl font-black text-[var(--success)]">{persona === "trader" ? "+₹12,400" : "8.5%"}</div>
        <div className="text-xs text-[var(--text-muted)]">Today</div>
      </div>
      <div
        className="hero-float-card absolute bottom-0 left-1/4 w-60 rounded-2xl border border-[var(--border)] p-4 shadow-lg"
        style={{ background: "var(--card-gradient)" }}
      >
        <span className="rounded bg-[var(--cyan)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--navy)]">NEW</span>
        <span className="ml-2 text-sm font-bold">AI Insights</span>
        <p className="mt-2 text-xs text-[var(--text-muted)]">BTC sentiment: Bullish · 78% confidence</p>
      </div>
    </div>
  );
}
