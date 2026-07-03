---
name: web-app-ux-2026
description: >-
  Applies 2026 UI/UX fundamentals (accessibility, mobile-first, minimalism,
  data-driven design, performance, personalization, trust, iteration) to
  zeb-home landing work. Includes color harmony theory (wheel schemes,
  emotional hierarchy, dual-theme tokens) for the design phase. Use when
  adding or changing landing components, sections, nav, themes, forms,
  animations, or when the user asks for UX/color review or planning.
---

# Web App UX 2026 — zeb-home

## When to use

Read this skill **before** writing landing UI code. Also use it when reviewing UX, planning a new section, or fixing accessibility/performance issues.

Cross-reference [AGENTS.md](../../../AGENTS.md) for theming and responsive rules.

## Workflow

Copy this checklist and fill it in before coding:

```
UX plan:
- [ ] Pillars touched: (list 1–8)
- [ ] Harmony: scheme + lead/support/accent roles — see color-theory.md
- [ ] Token phase: v1 or v2? — see color-harmony-plan.md
- [ ] Risks:
- [ ] Test plan:
```

1. **Plan** — State pillars; name harmony scheme (zeb-home: mono + analogous, gold accent); run harmony review in [color-theory.md](color-theory.md).
2. **Check** — [checklist.md](checklist.md), [zeb-home-patterns.md](zeb-home-patterns.md), [color-harmony-plan.md](color-harmony-plan.md) if changing theme tokens.
3. **Build** — Use `<Section>`, `.btn-*`, semantic CSS vars from `globals.css`.
4. **Verify** — Run `npm run lint`, test light + dark theme, 320px viewport.

## Eight pillars (summary)

| # | Pillar | zeb-home rule |
|---|--------|---------------|
| 1 | Accessibility | WCAG 2.2 AA: focus-visible, landmarks, complete tabs, reduced-motion must not hide content |
| 2 | Mobile-first | `<Section>`, 44px taps, `clamp()` floor ≤ 2rem, pass responsive lint |
| 3 | Minimalism | One purpose per section; no duplicate trust signals; limit competing motion |
| 4 | Data-driven | Document the metric to track; flag if no analytics hook exists |
| 5 | Performance | RSC shells + client islands; `next/image`; lazy below-fold media |
| 6 | Personalisation | `html.dark` + `--*` tokens; harmony system in [color-theory.md](color-theory.md); v2 rollout [color-harmony-plan.md](color-harmony-plan.md) |
| 7 | Trust | `rel="noopener noreferrer"`; privacy visible; no client API keys |
| 8 | Iteration | Ship with a test plan; re-run `npm run lint` before merge |

Full criteria: [checklist.md](checklist.md)

## Required primitives

- Sections: [`src/components/ui/section.tsx`](../../../src/components/ui/section.tsx)
- Buttons: `.btn-primary`, `.btn-outline`, `.btn-hero-primary` in `globals.css`
- Theme tokens: `--fg`, `--surface`, `--border`, `--brand-rgb`, etc.
- Page background: continuous gradient on `.landing-page::before` — do not add per-section backgrounds

## Post-build verification

```bash
npm run lint          # eslint + responsive + ux audit
```

Manual checks:
- Toggle light/dark in nav
- Resize to 320px width
- Tab through new interactives — focus ring visible
- Enable "Reduce motion" — content still readable, stats show real values

## Additional resources

- [docs/DESIGN.md](../../../docs/DESIGN.md) — **full design system** (fonts, colors, layout, components)
- [color-theory.md](color-theory.md) — harmony schemes, emotional hierarchy, token roles, contrast
- [color-harmony-plan.md](color-harmony-plan.md) — **v2 palette migration** (phased)
- [color-review-baseline.md](color-review-baseline.md) — audit log after theme changes
- [checklist.md](checklist.md) — full 8-pillar pass/fail criteria
- [zeb-home-patterns.md](zeb-home-patterns.md) — project conventions
- [baseline.md](baseline.md) — Lighthouse and audit baseline scores
