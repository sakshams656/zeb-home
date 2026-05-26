"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

type Dot = { x: number; y: number; vx: number; vy: number };

function TrustBadge() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[var(--brand)]">
      <path
        d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
      // Mobile gets a much lighter particle field: the O(n^2) link math
      // becomes painful on low-end phones and the screen is small enough
      // that 80 dots still feels dense.
      const COUNT = window.innerWidth < 640 ? 80 : 300;
      for (let i = 0; i < COUNT; i++) {
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

    // Particle color reads the theme-invariant brand RGB triple plus
    // a theme-aware alpha so the dots stay readable on either background.
    const getParticleRgb = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-rgb")
        .trim() || "27, 85, 224";
    const isLight = () => !document.documentElement.classList.contains("dark");

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const rgb = getParticleRgb();
      const dotAlpha = isLight() ? 0.55 : 0.45;
      const lineAlphaBase = isLight() ? 0.14 : 0.1;
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

        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
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
            ctx.strokeStyle = `rgba(${rgb}, ${lineAlphaBase * (1 - dist / 120)})`;
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

      gsap.set([".hero-trust", ".hero-h1-line", ".hero-h1-accent", ".hero-cta", ".hero-phone"], {
        opacity: 0,
        y: 28
      });

      const tl = gsap.timeline({ defaults: { ease: ZEB_EASE } });

      tl.to(".hero-trust", { opacity: 1, y: 0, duration: 0.45 }, 0);
      tl.to(".hero-h1-line", { opacity: 1, y: 0, duration: 0.55 }, 0.08);
      tl.to(".hero-h1-accent", { opacity: 1, y: 0, duration: 0.55 }, 0.16);
      tl.to(".hero-cta", { opacity: 1, y: 0, duration: 0.5 }, 0.28);
      tl.fromTo(".hero-phone", { y: 80, opacity: 0, rotateY: -12 }, { y: 0, opacity: 1, rotateY: 0, duration: 0.7 }, 0.4);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-phone", { y: -14, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero-section relative flex min-h-screen items-center justify-center">
      <div ref={contentRef} className="relative flex w-full items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden />

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-10 px-4 pb-16 pt-28 sm:gap-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pt-24 lg:text-left">
          <div className="hero-copy w-full max-w-2xl text-left">
            <p className="hero-trust flex items-center gap-2.5 text-sm font-semibold text-[var(--fg)] sm:text-base">
              <TrustBadge />
              Trusted by 6M+ Users
            </p>

            <h1 className="mt-6 font-black leading-[1.06] tracking-tight">
              <span className="hero-h1-line block text-[clamp(2rem,7vw,4.6rem)] text-[var(--fg)]">
                India&apos;s Oldest and Most Trusted
              </span>
              <span className="hero-h1-accent mt-1 block text-[clamp(1.75rem,6vw,4.5rem)] text-[var(--brand)]">
                Crypto Trading Platform
              </span>
            </h1>

            <a href={`${APP_URL}/signup`} className="hero-cta btn-hero-primary mt-10">
              Get started
              <span className="text-[1.15em] leading-none" aria-hidden>
                →
              </span>
            </a>
          </div>

          <div className="hero-phone shrink-0">
            <PhoneFrame tilt={-8}>
              <div className="relative h-full w-full">
                <Image
                  src="/homePage.png"
                  alt="ZebPay app home screen showing portfolio and quick links"
                  fill
                  className="object-cover object-top"
                  sizes="270px"
                  priority
                />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
