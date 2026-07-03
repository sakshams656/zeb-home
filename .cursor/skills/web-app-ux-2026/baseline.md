# UX Baseline — zeb-home

Recorded after implementing the UI/UX skill + Phase A–C improvements.

## Lighthouse (mobile, localhost:3000)

| Date | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| 2026-06-30 | 71 | 93 | 96 | 100 |

Command to reproduce:

```bash
yarn dev
npx lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --chrome-flags="--headless" \
  --output=json --output-path=/tmp/lh-zeb.json
```

**Target:** Accessibility ≥ 90 (met). Performance improvement ongoing (lazy sections, media compression).

## Automated audits

```bash
npm run ux:audit        # UX patterns (a11y, trust, clamp floors)
npm run lint:responsive # AGENTS.md forbidden patterns
npm run lint            # eslint + both audits
```

Status after baseline: **all passing**.

## Manual checklist (post-improvements)

| Check | Status |
|-------|--------|
| Skip link → `#main` | Pass |
| Global `:focus-visible` on buttons | Pass |
| SocialProof shows real stats with reduced motion | Pass (fixed) |
| Mobile nav focus trap + `aria-modal` | Pass |
| Product showcase tab `aria-controls` / `tabpanel` | Pass |
| Testimonials `aria-live="polite"` | Pass |
| Price ticker duplicate row hidden from AT | Pass |
| CoinGecko key server-only (`COINGECKO_API_KEY`) | Pass — set in `.env` |
| Cookie consent before third-party fetches | Pass |
| Continuous page gradient (no section seams) | Pass |

## Known follow-ups

- Performance score 71: compress footer GIFs, further code-split CalculatorHub
- Desktop Lighthouse not yet recorded
- Analytics instrumentation (Pillar 4) — future phase
