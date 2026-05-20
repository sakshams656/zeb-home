import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function initLenis() {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;

  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);

  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  requestAnimationFrame(() => ScrollTrigger.refresh());
  return lenis;
}

export function destroyLenis() {
  if (tick) {
    gsap.ticker.remove(tick);
    tick = null;
  }
  lenis?.destroy();
  lenis = null;
}
