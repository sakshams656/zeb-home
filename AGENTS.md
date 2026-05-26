<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Theming

The website chrome supports both **dark** and **light** themes, gated by a single
boolean — the `dark` class on `<html>`. The toggle lives in the nav (see
[src/components/landing/theme-toggle.tsx](src/components/landing/theme-toggle.tsx)
and [src/context/theme-context.tsx](src/context/theme-context.tsx)). Theme is
persisted in `localStorage` under `zeb-theme` (defaults to dark when unset).
A blocking script in [src/app/layout.tsx](src/app/layout.tsx) applies the saved
class on `<html>` before first paint to avoid a flash.

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

# Mobile responsiveness

The site is **mobile-first**. Every new component MUST render correctly at
320 px wide and scale up — there is no "desktop-only" escape hatch. The
default `npm run lint` script invokes
[scripts/responsive-lint.mjs](scripts/responsive-lint.mjs) which fails CI on
the forbidden patterns listed below.

## Breakpoint policy

We use Tailwind v4 defaults (no overrides in `@theme`):

| Prefix | Min width | When to use                                          |
| ------ | --------- | ---------------------------------------------------- |
| (none) | 0 px      | Phones. This is the base case — write it first.     |
| `sm:`  | 640 px    | Large phones / phablets.                             |
| `md:`  | 768 px    | Tablet / phone landscape. Use it — currently scarce. |
| `lg:`  | 1024 px   | Desktop where the layout shifts from stacked.        |
| `xl:`  | 1280 px   | Wide-screen polish only.                             |

## Required primitives

- Wrap every page section in [`<Section>`](src/components/ui/section.tsx) (or
  use `.container-zeb` for non-section containers). They enforce the
  `px-4 py-14 sm:px-6 sm:py-16 lg:py-24` rhythm. Do NOT hand-roll
  `px-6 py-[120px]`-style spacing on a bare `<section>`.
- Buttons: use `.btn-primary` / `.btn-outline` / `.btn-hero-primary` from
  globals.css — they bake in a 44 px tap floor and a `sm:` ramp.
- Phone bezel: [`<PhoneFrame>`](src/components/ui/phone-frame.tsx) is fluid
  (`min(290px, 80vw)`). Do NOT wrap it in `scale-[0.x]` — CSS transforms do
  not shrink the layout box and will clip content.

## Required patterns

- **Headlines**: when using `clamp()`, the minimum MUST be `<= 2rem` so the
  text fits a 320 px viewport. Example:
  `text-[clamp(2rem,6vw,4.5rem)]`. Floors of `3rem` / `4rem` are forbidden.
- **Tap targets**: any `<button>`, `<a>`, or interactive icon must have a hit
  area of at least 44 x 44 px. If the visual is smaller, pad the container:
  `<button class="grid h-11 w-11 place-items-center"><Icon class="h-5 w-5"/></button>`.
- **Tables**: hide secondary columns below `lg:` with
  `<th class="hidden lg:table-cell">` + `<td class="hidden lg:table-cell">`.
  Do NOT use `min-w-[800px]` inside `overflow-x-auto` — horizontal scroll on
  data tables is poor UX on phones.
- **Cards / grids**: stack on phones (`grid-cols-1`), upgrade at `sm:` or
  `md:`. Avoid pixel `w-[Npx]` on grid items; use `w-full` plus container
  constraints.
- **Section padding**: use the `<Section>` variants. If you must hand-write,
  follow the formula `px-4 py-14 sm:px-6 sm:py-16 lg:py-24`.

## Forbidden patterns (lint-enforced)

The responsive linter rejects PRs that include any of these:

- `min-h-screen` on the same element as `min-h-[Npx]` (double minimum locks
  the viewport on mobile and clips content).
- `py-[Npx]` where `N >= 96` without a `lg:` prefix (desktop padding leaking
  to phones).
- `min-w-[Npx]` where `N >= 600` outside an `overflow-x-auto` ancestor.
- `h-[100svh]` / `h-[100vh]` / `h-[100dvh]` outside `hero.tsx` (full-viewport
  sections do not work on phones with dynamic browser chrome).
- `px-*` on a `<section>` whose inner wrapper is `.container-zeb`
  (`container-zeb` already provides the page gutter; doubling it leaves
  inner content over-padded). Either drop the `px-*` or replace the inner
  with a plain `mx-auto max-w-[1200px]`.
- `scale-[0.` wrapping a `<PhoneFrame>` (use the fluid frame instead).
- **Floating-chrome hook class without `overflow-hidden`/`overflow-clip`**:
  any element with `nav-inner` / `pill-shell` in its `className` must also
  carry `overflow-hidden` (or `overflow-clip`). Floating chrome that shrinks
  on scroll can otherwise have its children pushed past the rounded edges,
  as the nav-pill hamburger bug showed. When you introduce a new floating /
  shrinking container, give it a hook class and add it to this list.
- **Unguarded `gsap.set` / `gsap.to` pixel-layout writes**: any call that
  sets `left` / `right` / `top` / `bottom` / `borderRadius` as a number must
  be inside a `gsap.matchMedia` (or `mm.add(...)`) callback so the pixel
  math only runs at viewport sizes that can absorb it. The nav-pill bug was
  caused by exactly this — a single `gsap.set` ramp that shrunk the pill on
  every viewport, including 320 px. If you have a one-time pin/origin setup
  (e.g. `gsap.set(el, { left: 0, right: 0 })`) prefix it with the comment
  `// lint-allow: unguarded-gsap-pixel-layout` and explain why the call is
  safe at every viewport.

## Exceptions

- **Phone demo screens** (inside `<PhoneFrame>`) are exempt from breakpoint
  scaling — they always render as a portrait phone-app screenshot.
- **Calculator simulator** (`CalcShell`) is exempt for the same reason.
- The hero section is allowed to use `min-h-screen` (sized for fold).
