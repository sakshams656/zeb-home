# Color theory review — zeb-home baseline (Jun 2026)

Full-site audit against [color-theory.md](./color-theory.md). Toggle both themes after any follow-up work.

## Summary

| Area | Light | Dark | Notes |
|------|-------|------|-------|
| **Home** (`/`) | Pass | Pass | Hero, ticker, product showcase, social proof, security, FAQ, footer |
| **Markets** (`/markets`) | Pass | Pass | Solid surfaces; rank badges use `--brand-tint` |
| **Calculators** (`/calculators`) | Pass | Pass | Tab hovers fixed; active dark tab uses solid brand |
| **How to Buy** (`/how-to-buy/*`) | Pass | Pass | Semantic tokens throughout |
| **Discover** (`/discover`) | Pass | Pass | Video overlay uses literal white on media (exception) |
| **Feature pages** (`/features/*`) | Pass | Pass | Feature hub chips/code blocks aligned |
| **Cookie consent** | Pass | Pass | `--bg-elevated` bar |
| **Legacy sections** (not on home) | Pass | Pass | `pro-bento`, `earn`, `crypto-packs` refactored |

## Design-phase checklist (site-wide)

```
Color review:
- [x] Light theme: hierarchy clear (bg → surface → fg)
- [x] Dark theme: navy canvas + black panels (not glass)
- [x] Contrast AA for body and muted on surfaces
- [x] Brand used for emphasis / CTAs, not large flat fills
- [x] Status colors for data/state only
- [x] No glass (backdrop-blur / translucent chrome)
- [x] Toggle tested on primary routes
```

## Fixes applied in this review

| File | Issue | Fix |
|------|-------|-----|
| `calculator-hub.tsx` | `hover:text-white` on inactive tabs (breaks light) | `hover:text-[var(--fg)]` |
| `calculator-hub.tsx` | Dark active tab translucent gradient | Solid `bg-[var(--brand)]` |
| `product-showcase.tsx` | `text-[#888]` loading fallback | `text-[var(--fg-muted)]` |
| `markets.tsx` | Inline `rgba` rank badge | `bg-[var(--brand-tint)]` |
| `markets.tsx` | Inline gradient coin avatar | `bg-[var(--brand)]` |
| `price-ticker.tsx` | Inline brand rgba on fallback avatar | `bg-[var(--brand)]` |
| `feature-hub/index.tsx` | `bg-[var(--danger)]/20`, `bg-black/30` pre | Solid border + `--surface-strong` |
| `feature-hub/index.tsx` | Legacy `--text` / `--text-muted` | `--fg` / `--fg-muted` |
| `persona-bar.tsx` | Active tab `text-[var(--navy)]` on cyan pill | `text-white` |
| `pro-bento.tsx` | Hardcoded section/card hex, translucent panels | `--bg` / `--surface` / `--surface-strong` |
| `earn.tsx`, `crypto-packs.tsx` | Hardcoded navy section bg | `bg-[var(--bg)]` |

## Pass without changes

- **Hero** — compliance pills use `--brand-tint`; single brand CTA with `text-white`
- **Nav** — solid `--bg` when scrolled; Login outline + Create account primary
- **Security** — theme-aware pillar icons; solid cards
- **FAQ** — solid accordion surfaces
- **Footer** — semantic surfaces; brand hover on social icons (white on brand OK)
- **How to Buy** — step badges on brand; cards on canvas
- **Testimonials / announcements / events** — already on token system from prior glass removal

## Documented exceptions (allowed)

| Pattern | Where | Why |
|---------|-------|-----|
| `text-white` on `--brand` / `--success` / `--danger` | CTAs, step badges, play buttons | Opaque colored buttons per color-theory |
| `text-white/80` on video thumbnail overlay | `discover-more.tsx` | Text on dark photographic media, not chrome |
| Hardcoded hex in syntax highlighting | `pro-bento.tsx` API pre | Code-editor palette; base pre uses `--surface-strong` |
| `PhoneFrame` + phone demos | `phone-frame.tsx`, `phone-demo/*` | Always-light iOS mimic (AGENTS.md) |
| `CalcShell` / `.on-dark-surface` | `calculator-ui.tsx` | Simulator always dark |
| `rgba(255,255,255,0.1)` in SVG gauges | `pro-bento.tsx` | Decorative chart strokes on cards |
| Legacy `--text` alias | `globals.css` → `--fg` | Aliased; prefer `--fg` in new code |

## Remaining low-priority items

1. **Legacy `--text` / `--text-muted` in unused or secondary components** (`steps.tsx`, `adoption-strip.tsx`, `trust-strip.tsx`, `section-header.tsx`, `phone-demos.tsx`) — aliases work; migrate to `--fg` when touching those files.
2. **Prose pages** (`[...slug]/page.tsx`) — uses `--text` aliases; fine until CMS pages are restyled.
3. **Syntax colors in feature-hub** — if API code blocks are added, mirror `pro-bento` pattern (solid pre + tokenized base text).

## Verification

```bash
npm run ux:audit   # no glass / hardcoded chrome violations
npm run lint       # responsive + ux
```

Manual: nav theme toggle → home scroll → markets table → calculators tabs → how-to-buy hub → discover video cards.
