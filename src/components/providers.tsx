"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { destroyLenis, initLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/gsap";
import { ThemeProvider } from "@/context/theme-context";

function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    initLenis();
    return () => destroyLenis();
  }, []);
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </ThemeProvider>
  );
}
