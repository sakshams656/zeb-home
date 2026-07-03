export const COOKIE_CONSENT_KEY = "zeb-cookie-consent";

export type CookieConsent = "accepted" | "declined" | null;

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (v === "accepted" || v === "declined") return v;
  return null;
}

export function setCookieConsent(value: "accepted" | "declined") {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("zeb-cookie-consent", { detail: value }));
}
