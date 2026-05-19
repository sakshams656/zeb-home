"use client";

import { usePersona } from "@/context/persona-context";

export function PersonaBody({ children }: { children: React.ReactNode }) {
  const { persona } = usePersona();
  return <div data-persona={persona}>{children}</div>;
}
