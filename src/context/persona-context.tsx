"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type Persona = "trader" | "retail";

const PersonaContext = createContext<{
  persona: Persona;
  setPersona: (p: Persona) => void;
} | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>("trader");
  const value = useMemo(() => ({ persona, setPersona }), [persona]);
  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}
