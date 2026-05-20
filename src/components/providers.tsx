"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "lenis/dist/lenis.css";
import { destroyLenis, initLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/gsap";

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <SmoothScroll>{children}</SmoothScroll>
    </ThemeProvider>
  );
}
