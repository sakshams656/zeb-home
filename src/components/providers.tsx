"use client";

import { ThemeProvider } from "next-themes";
import { PersonaProvider } from "@/context/persona-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PersonaProvider>{children}</PersonaProvider>
    </ThemeProvider>
  );
}
