# zeb-home UX Patterns

Project-specific conventions. Read alongside [AGENTS.md](../../../AGENTS.md).

## Section wrapper

Always prefer `<Section>` from `src/components/ui/section.tsx`:

```tsx
import { Section } from "@/components/ui/section";

<Section id="markets" className="markets-section" aria-labelledby="markets-heading">
  <h2 id="markets-heading">…</h2>
  …
</Section>
```

Variants: `compact` | `standard` (default) | `spacious`

Hero is an exception: `min-h-screen` allowed in `hero.tsx` only.

## Theming

- Gate: `dark` class on `<html>`, persisted as `zeb-theme` in localStorage
- Use `text-[var(--fg)]`, `bg-[var(--surface)]`, `border-[var(--border)]`
- Brand chips: `--brand-tint`, `--brand-tint-border`; glows: `rgba(var(--brand-rgb), 0.x)` on canvas only
- `text-white` only on opaque brand/success/danger button backgrounds
- **Color harmony (design phase):** [color-theory.md](color-theory.md) — schemes, emotional hierarchy
- **Theme migration:** [color-harmony-plan.md](color-harmony-plan.md) — v2 token rollout

### Dark palette (v3)

- **Canvas:** `--bg` → `#0a0f2e`
- **Panels:** `--surface` → `#10182e`
- **CTAs:** `--accent` → `#F0B84C`
- **Links:** `--brand` → `#6ba8ff`

### Light palette (v3)

- **Canvas:** `--bg` → `#f7f4ef` (warm cream)
- **Panels:** `--surface` → `#faf8f4`
- **CTAs:** `--accent` gold; **links:** `--brand` `#1b55e0`

### Do not theme-swap

- Phone demo screens (`phone-demo/`, `phone-demos/`)
- Phone bezel (`phone-frame.tsx`)
- Calculator simulator (`calculator-ui.tsx` / `--sim-gradient`)

## Page background

One continuous gradient on `.landing-page::before` (`position: fixed`). **Do not** add per-section `background` gradients — they cause visible seams between sections.

## Buttons

```html
<a class="btn-primary" href="…">Get started</a>
<button class="btn-outline" type="button">Learn more</button>
```

All include 44px min-height and `:focus-visible` ring in `globals.css`.

## Focus styles

Global pattern in `globals.css`:

```css
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
```

Do not use `outline-none` without a visible `:focus-visible` alternative.

## Animations

- Guard GSAP with `prefersReducedMotion()` from `src/lib/gsap.ts`
- Global reduced-motion kill switch in `globals.css`
- Lenis smooth scroll disabled when reduced motion preferred (`providers.tsx`)
- **Never** skip rendering final values when animation is disabled (SocialProof pattern)

## Responsive lint

Forbidden patterns enforced by `scripts/responsive-lint.mjs`:

- `min-h-screen` + `min-h-[Npx]` on same element
- `py-[≥96px]` without `lg:` prefix
- `min-w-[≥600px]` outside `overflow-x-auto`
- Full viewport height outside hero
- `scale-[0.` on PhoneFrame
- `nav-inner` / `pill-shell` without `overflow-hidden`
- Unguarded GSAP pixel layout writes

## Performance patterns

Heavy sections should lazy-load:

```tsx
const CalculatorHub = dynamic(() => import("./calculator-hub").then(m => ({ default: m.CalculatorHub })), {
  loading: () => <Section><div className="h-96 animate-pulse bg-[var(--surface)] rounded-2xl" /></Section>,
});
```

CoinGecko data: fetch via `/api/coingecko/*` server routes, never embed API keys in client.

## Trust / legal

- Footer links: Terms, Privacy, Risk disclosure (`src/lib/links.ts`)
- External: always `rel="noopener noreferrer"`
- Cookie consent component gates third-party fetches when implemented

## File map (live site)

| Route | Page |
|-------|------|
| `/` | Home — hero, ticker, product showcase, social proof, **HNI & institutional**, security, FAQ |
| `/markets` | Live markets table |
| `/calculators` | Calculator hub |
| `/announcements` | Platform announcements |
| `/discover` | Discover more (videos/guides) |
| `/testimonials` | User testimonials |
| `/events` | Events & meet ups |
| `/features/quick-trade` | Quick Trade feature page |
| `/features/futures` | Perpetual Futures feature page |
| `/features/sip` | Crypto SIP feature page |
| `/features/cryptopacks` | CryptoPacks feature page |
| `/features/earn` | Earn fixed-yield feature page |
| `/features/ai-insights` | AI Insights feature page |
| `/pro/expert-trades` | Expert trades / copy-trade tools |
| `/business/*` | HNI, OTC, listings, partnerships, affiliate |

Internal routes: `src/lib/routes.ts`. Nav structure: `src/components/landing/nav-config.ts`.
