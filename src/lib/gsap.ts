import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, CustomEase);
  CustomEase.create("zeb", "0.16, 1, 0.3, 1");
}

export { gsap, ScrollTrigger, SplitText, Draggable };
export const ZEB_EASE = "zeb";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setWillChange(el: Element | null, on: boolean) {
  if (!el || !(el instanceof HTMLElement)) return;
  el.style.willChange = on ? "transform, opacity" : "";
}
