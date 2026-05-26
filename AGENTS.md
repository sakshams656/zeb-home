<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Theming

The website chrome supports both **dark** and **light** themes, gated by a single
boolean — the `dark` class on `<html>`. The toggle lives in the nav (see
[src/components/landing/theme-toggle.tsx](src/components/landing/theme-toggle.tsx)
and [src/context/theme-context.tsx](src/context/theme-context.tsx)). Theme is
session-only (defaults to dark on every page load, not persisted).

**Every new component MUST swap correctly with the toggle.** That means:

- Use the semantic CSS variables declared in [src/app/globals.css](src/app/globals.css):
  - Surfaces: `--bg`, `--bg-elevated`, `--surface`, `--surface-strong`
  - Foreground: `--fg`, `--fg-muted`, `--fg-subtle`
  - Borders: `--border`, `--border-strong`
  - Brand / status (theme-invariant): `--brand`, `--brand-hover`, `--brand-rgb`,
    `--success`, `--danger`, `--gold`
  - Effects: `--shadow`, `--shadow-lg`
  - Section backgrounds: `--section-bg-1`, `--section-bg-2`, `--section-bg-glow`, etc.
- For Tailwind utilities use `text-[var(--fg)]`, `bg-[var(--surface)]`,
  `border-[var(--border)]`, etc. — NOT `text-white`, `bg-white/[0.04]`,
  `border-white/[0.08]`.
- For inline brand-tinted gradients/shadows use `rgba(var(--brand-rgb), 0.x)`
  instead of `rgba(27, 85, 224, 0.x)`.
- Text on a solid colored button (`bg-[var(--brand)]`, `bg-[var(--success)]`,
  `bg-[var(--danger)]`, brand gradient) should remain literal `text-white`
  because the button background is opaque-colored, not chrome.
- Always test both themes via the nav toggle before shipping.

## Exceptions (do NOT theme-swap these)

- **Phone-demo screens** in [src/components/landing/phone-demo/](src/components/landing/phone-demo/)
  and [src/components/phone-demo/](src/components/phone-demo/) — they mimic the
  real ZebPay iOS app, always light. Shared palette in `app-styles.ts`.
- **Physical phone bezel** in [src/components/ui/phone-frame.tsx](src/components/ui/phone-frame.tsx).
- **Calculator simulator** (`CalcShell` in
  [src/components/landing/calculator-ui.tsx](src/components/landing/calculator-ui.tsx))
  — uses `--sim-gradient` which is always dark. If you nest content inside a
  container that should always read as on-dark regardless of website theme,
  give it the `.on-dark-surface` class (defined in globals.css) — that scopes
  the semantic tokens to their dark-mode values.
