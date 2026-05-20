"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { ExchangeListScreen } from "@/components/phone-demo/exchange-list-screen";
import { gsap, SplitText, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

type Dot = { x: number; y: number; vx: number; vy: number };

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dots: Dot[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const initDots = () => {
      dots.length = 0;
      for (let i = 0; i < 300; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        const dx = d.x - mouseRef.current.x;
        const dy = d.y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 0) {
          d.x += (dx / dist) * 2;
          d.y += (dy / dist) * 2;
        }

        ctx.fillStyle = "rgba(0,184,230,0.4)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0,184,230,${0.08 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    initDots();
    window.addEventListener("resize", () => {
      resize();
      initDots();
    });
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
      const root = contentRef.current;
      if (prefersReducedMotion() || !root) return;

      const splits: SplitText[] = [];
      root.querySelectorAll(".hero-h1").forEach((el) => {
        const split = new SplitText(el as HTMLElement, { type: "chars" });
        splits.push(split);
        gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -60 });
      });

      gsap.set([".hero-sub", ".stat-block", ".hero-phone", ".hero-ctas > *"], { opacity: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: ZEB_EASE } });

      const chars = root.querySelectorAll(".hero-h1 .char, .hero-h1 *");
      tl.to(
        splits.length ? splits[0].chars : chars,
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.018, duration: 0.5 },
        0
      );
      tl.to(".hero-sub", { opacity: 1, y: 0, duration: 0.4 }, 0.15);

      tl.fromTo(".stat-users", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, 0.25);
      tl.fromTo(".stat-volume", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.32);
      tl.fromTo(".stat-assets", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, 0.38);

      root.querySelectorAll(".stat-value").forEach((el) => {
        const target = Number((el as HTMLElement).dataset.target ?? 0);
        const prefix = (el as HTMLElement).dataset.prefix ?? "";
        const suffix = (el as HTMLElement).dataset.suffix ?? "";
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
              (el as HTMLElement).textContent = `${prefix}${Math.round(obj.v)}${suffix}`;
            }
          },
          0.35
        );
      });

      tl.fromTo(".hero-phone", { y: 80, opacity: 0, rotateY: -12 }, { y: 0, opacity: 1, rotateY: 0, duration: 0.7 }, 0.5);
      tl.fromTo(".hero-ctas > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.75);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-phone", { y: -14, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
      });

      return () => {
        splits.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero-section relative min-h-screen bg-[#040812]">
      <div ref={contentRef} className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden />

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-6 pt-24 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="hero-copy max-w-xl">
            <h1 className="hero-h1 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] text-[var(--text-on-dark)]">
              The exchange
              <br />
              India trusts.
            </h1>
            <p className="hero-sub mt-6 text-lg text-[var(--text-muted-dark)]">
              Buy, sell, and earn crypto — regulated, insured, and built for you.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 lg:gap-8">
              <div className="stat-block stat-users">
                <p className="stat-value text-[clamp(2rem,5vw,4.5rem)] font-black text-white" data-target={6} data-suffix="M+">
                  0M+
                </p>
                <p className="text-sm text-[var(--text-muted-dark)]">Users</p>
              </div>
              <div className="stat-block stat-volume">
                <p className="stat-value text-[clamp(2rem,5vw,4.5rem)] font-black text-white" data-target={2} data-prefix="₹" data-suffix="T+">
                  ₹0T+
                </p>
                <p className="text-sm text-[var(--text-muted-dark)]">Volume</p>
              </div>
              <div className="stat-block stat-assets">
                <p className="stat-value text-[clamp(2rem,5vw,4.5rem)] font-black text-white" data-target={200} data-suffix="+">
                  0+
                </p>
                <p className="text-sm text-[var(--text-muted-dark)]">Assets</p>
              </div>
            </div>

            <div className="hero-ctas mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a href={`${APP_URL}/signup`} className="btn-primary">
                Start trading →
              </a>
              <a href="#showcase" className="rounded-full border border-[var(--border-dark)] px-6 py-3 font-bold text-[var(--text-on-dark)] hover:border-[var(--cyan)]">
                See all products
              </a>
            </div>
          </div>

          <div className="hero-phone mt-12 shrink-0 lg:mt-0">
            <PhoneFrame tilt={-8}>
              <ExchangeListScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
