import type { CSSProperties } from "react";

/** Shared inline styles matching ZebPay app chrome */
export const navy = "#0a0f2e";
export const blue = "#1b55e0";
export const blueLight = "#3d6df0";
export const success = "#00b07a";
export const danger = "#e33e5c";
export const warn = "#f5a623";

export const shell: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  background: "#f4f6ff"
};

export const header: CSSProperties = {
  background: navy,
  color: "#fff",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0
};

export const backBtn: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#fff",
  fontSize: 22,
  cursor: "pointer",
  padding: 0,
  lineHeight: 1
};

export const card: CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 12,
  marginBottom: 8,
  boxShadow: "0 1px 4px rgba(10,15,46,0.06)"
};

export const cta: CSSProperties = {
  background: blue,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 16px",
  fontWeight: 700,
  fontSize: 13,
  width: "100%",
  cursor: "pointer"
};

export const ctaDisabled: CSSProperties = {
  ...cta,
  background: "#b8c0d4",
  cursor: "not-allowed"
};

export const pill = (active: boolean): CSSProperties => ({
  padding: "6px 12px",
  borderRadius: 20,
  border: "none",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  background: active ? blue : "#e8ecf4",
  color: active ? "#fff" : "#555"
});

export const homeIndicator: CSSProperties = {
  width: 100,
  height: 4,
  background: "#1a1f3a",
  borderRadius: 2,
  margin: "8px auto 6px",
  flexShrink: 0
};
