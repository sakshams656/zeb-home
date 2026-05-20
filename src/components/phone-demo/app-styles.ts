import type { CSSProperties } from "react";

export const navy = "#0a0f2e";
export const blue = "#1b55e0";
export const success = "#00b07a";
export const danger = "#e33e5c";

export const shell: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  background: "#f4f6ff",
  fontFamily: "var(--font-lato), system-ui, sans-serif",
  fontSize: 12
};

export const header: CSSProperties = {
  background: navy,
  color: "#fff",
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
  minHeight: 44
};

export const card: CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 12,
  marginBottom: 8,
  boxShadow: "0 1px 4px rgba(10,15,46,0.06)"
};

export const pill = (active: boolean): CSSProperties => ({
  padding: "6px 10px",
  borderRadius: 20,
  border: "none",
  fontSize: 10,
  fontWeight: 700,
  background: active ? blue : "#e8ecf4",
  color: active ? "#fff" : "#555"
});
