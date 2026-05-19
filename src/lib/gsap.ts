import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);
}

export { gsap, ScrollTrigger, SplitText, Draggable };

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setWillChange(el: Element | null, on: boolean) {
  if (!el || !(el instanceof HTMLElement)) return;
  if (on) el.style.willChange = "transform, opacity";
  else el.style.willChange = "";
}
