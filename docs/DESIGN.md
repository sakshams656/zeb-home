# ZebPay Web — Design System

Single reference for typography, color, layout, components, motion, and theming on **zeb-home** (the ZebPay marketing site).

**Source of truth in code:** [`src/app/globals.css`](../src/app/globals.css)  
**Implementation rules:** [`AGENTS.md`](../AGENTS.md)  
**Deeper UX / color harmony:** [`.cursor/skills/web-app-ux-2026/`](../.cursor/skills/web-app-ux-2026/)

---

## 1. Design intent

ZebPay is a regulated Indian crypto exchange. The site should feel:

| Quality | How we achieve it |
|---------|-------------------|
| **Trust & calm** | Indigo-violet analogous family, warm cream light canvas, lifted dark panels |
| **Premium** | 60/30/10 — gold accent on CTAs; ZebPay blue for links |
| **Clarity** | One primary CTA per section; semantic green separate from accent gold |
| **Mobile-first** | 320px base; 44px tap targets; readable `clamp()` headlines |

**Color harmony (v3):** ZebPay blue navy family (60%) + warm cream/blue structure (30%) + gold `--accent` `#F0B84C` (10%).

---

## 2. Typography

### Font family

| Property | Value |
|----------|-------|
| **Family** | [Lato](https://fonts.google.com/specimen/Lato) (Google Fonts) |
| **CSS variable** | `--font-lato` |
| **Loaded weights** | 400 (regular), 700 (bold), 900 (black) |
| **Stack** | `var(--font-lato), system-ui, sans-serif` |
| **Loading** | `display: swap` via `next/font` in [`src/app/layout.tsx`](../src/app/layout.tsx) |

All marketing chrome uses Lato. Phone-demo screens inside `<PhoneFrame>` mimic the iOS app and may use app-specific styles.

### Type roles

| Role | Weight | Typical classes / pattern |
|------|--------|---------------------------|
| **Hero headline** | 900 (black) | `font-black` + `text-[clamp(2rem,6vw,4.5rem)]` — floor **≤ 2rem** for 320px |
| **Section title** | 900 | `font-black` + `text-[clamp(1.75rem,4vw,2.5rem)]` or `text-[clamp(2rem,5vw,3rem)]` |
| **Card / feature title** | 700–900 | `font-bold` / `font-black` + `text-lg`–`text-xl` |
| **Body** | 400 | `text-base` + `text-[var(--fg)]` |
| **Supporting copy** | 400 | `text-sm` or `text-base` + `text-[var(--fg-muted)]` |
| **Labels / table headers** | 600–700 | `text-xs` / `text-sm` + `text-[var(--fg-subtle)]` — not for legal or prices |
| **Primary button** | 700–800 | `.btn-primary` (700), `.btn-hero-primary` (800) |
| **Market data** | 700 | `font-bold` + `tabular-nums` for prices and % |

### Rules

- Headline `clamp()` **minimum must be ≤ 2rem** — never `3rem` or `4rem` floors on mobile.
- Use `tracking-tight` on large headlines; `uppercase tracking-wider` sparingly on labels.
- Prefer semantic colors (`--fg`, `--fg-muted`) over hardcoded grays.
- `text-white` only on opaque **accent** / **success** / **danger** **buttons** — not on theme surfaces.

---

## 3. Color system

### 3.1 Harmony strategy (v3 — 60 / 30 / 10)

| Role | % | Token(s) | Job |
|------|---|----------|-----|
| **Primary family** | 60% | `--bg`, canvas washes | ZebPay navy blue analogous depth |
| **Structure** | 30% | `--surface`, `--border`, `--brand-tint` | Warm cream (light) / slate-navy panels (dark) |
| **Accent** | 10% | `--accent` | Gold `#F0B84C` — CTAs & active states only |
| **Brand (structural)** | — | `--brand` | `#1b55e0` links/charts (light); `#6ba8ff` (dark) |
| **Semantic** | — | `--success`, `--danger` | Market data only — never confused with `--accent` |
| **Editorial** | — | `--editorial-*` | Illustrations, coming-soon — never chrome |

**Why v3 replaced v2:** Monochromatic navy + brand-blue everywhere read as generic SaaS. v3 adds analogous hue spread and a scarce gold CTA accent.

Screens use **RGB (additive light)**. Design in sRGB hex; tokens in CSS variables.

### 3.2 Accent & brand (role split)

| Token | Light | Dark | Usage |
|-------|-------|------|--------|
| `--accent` | `#f0b84c` | `#f0b84c` | `.btn-primary`, `.btn-hero-primary`, active tabs, play buttons |
| `--accent-hover` | `#e0a438` | `#f5c25e` | CTA hover |
| `--accent-rgb` | `240, 184, 76` | same | CTA shadows |
| `--accent-text` | `#14102a` | `#14102a` | Text on gold (WCAG AA) |
| `--brand` | `#1b55e0` | `#6ba8ff` | Links, charts |
| `--brand-hover` | `#1648c7` | `#8bbcff` | Link hover |
| `--brand-rgb` | `27, 85, 224` | `107, 168, 255` | Canvas glows |

### 3.3 Semantic & editorial (invariant)

| Token | Hex | Usage |
|-------|-----|--------|
| `--success` | `#00a872` | Positive %, buy — **not** the CTA accent |
| `--danger` | `#e33e5c` | Negative %, sell, errors |
| `--gold` | `#e8a830` | Rare editorial highlights |
| `--editorial-coral` | `#e8788a` | Illustration only |
| `--editorial-mint` | `#7ec9a8` | Illustration only |
| `--editorial-violet` | `#b8a8e8` | Illustration only |

### 3.4 Light theme tokens

| Token | Hex | Rationale |
|-------|-----|-----------|
| `--bg` | `#f7f4ef` | Warm cream canvas (60%) |
| `--surface` | `#faf8f4` | Soft white card lift |
| `--bg-elevated` | `#fffcf7` | Raised chrome |
| `--surface-strong` | `#eef2fa` | Hover — cool blue tint |
| `--fg` | `#0a0f2e` | Deep navy text |
| `--fg-muted` | `#5c5670` | Supporting copy |
| `--fg-subtle` | `#7a7490` | Section eyebrows |
| `--border` | `#ddd8e8` | Warm-violet edge |
| `--border-strong` | `#c4bdd8` | Hover borders |
| `--brand-tint` | `#ebe8f8` | Chip fills (30%) |
| `--brand-tint-border` | `#d0c9ec` | Chip borders |

### 3.5 Dark theme tokens

| Token | Hex | Rationale |
|-------|-----|-----------|
| `--bg` | `#0a0f2e` | Brand navy canvas |
| `--surface` | `#10182e` | Lifted slate-navy panels |
| `--bg-elevated` | `#10182e` | Nav, dropdowns |
| `--surface-strong` | `#1a2444` | Hover |
| `--fg` | `#f4f6fb` | Soft white |
| `--fg-muted` | `#a8b0c4` | Supporting copy |
| `--fg-subtle` | `#7a8499` | Eyebrows |
| `--border` | `#2a3558` | Panel edges |
| `--border-strong` | `#3d4d6e` | Hover borders |
| `--brand-tint` | `#121e38` | Chips |
| `--brand-tint-border` | `#243d6b` | Chip borders |

### 3.6 Using colors in components

**CTAs → accent:**

```tsx
className="btn-primary"
className="bg-[var(--accent)] text-[var(--accent-text)]"
```

**Links → brand:**

```tsx
className="text-[var(--brand)]"
```

**Eyebrows → fg-subtle** (not brand):

```tsx
className="text-sm font-bold uppercase tracking-widest text-[var(--fg-subtle)]"
```

**Market data → semantic only:**

```tsx
style={{ color: positive ? "var(--success)" : "var(--danger)" }}
```

### 3.7 Contrast (WCAG 2.2 AA)

| Pair | Minimum |
|------|---------|
| `--fg` on `--surface` | 4.5:1 |
| `--fg-muted` on `--surface` | 4.5:1 |
| `--accent-text` on `--accent` | 4.5:1 |
| `--brand` on `--surface` (links) | 4.5:1 |

---

## 4. Theming

### How it works

| Piece | Detail |
|-------|--------|
| **Toggle** | `dark` class on `<html>` |
| **Persistence** | `localStorage` key `zeb-theme` (defaults to **dark** when unset) |
| **No flash** | Blocking script in `layout.tsx` applies class before first paint |
| **Tailwind `dark:`** | Retargeted to `.dark` class in `globals.css` (not `prefers-color-scheme` alone) |
| **Context** | [`src/context/theme-context.tsx`](../src/context/theme-context.tsx) |
| **Toggle UI** | [`src/components/landing/theme-toggle.tsx`](../src/components/landing/theme-toggle.tsx) |

### Page background

One continuous ambient gradient on `.landing-page::before` (`position: fixed`).  
**Do not** add per-section background gradients — they cause visible seams.

### Theme exceptions (fixed palette)

These **do not** follow the site toggle:

| Area | Why |
|------|-----|
| Phone demo screens | Mimic real ZebPay iOS app (always light) |
| `<PhoneFrame>` bezel | Physical device chrome |
| Calculator simulator (`CalcShell`) | Always-dark screen; use `.on-dark-surface` for nested UI |
| Video thumbnail overlays | White text on dark **media**, not chrome |

---

## 5. Layout & spacing

### Breakpoints (Tailwind v4 defaults)

| Prefix | Min width | Use for |
|--------|-----------|---------|
| (none) | 0 | Phones — write this first |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablet / landscape |
| `lg:` | 1024px | Desktop layout shifts |
| `xl:` | 1280px | Wide-screen polish |

### Section primitive

Use [`<Section>`](../src/components/ui/section.tsx) for every page block:

```tsx
import { Section } from "@/components/ui/section";

<Section id="markets" aria-labelledby="markets-heading">
  <h2 id="markets-heading">…</h2>
</Section>
```

| Variant | Vertical padding (approx.) |
|---------|----------------------------|
| `compact` | 48 → 64 → 80 px |
| `standard` (default) | 56 → 64 → 96 px |
| `spacious` | 64 → 80 → 112 px |

Horizontal: `px-4 sm:px-6`; max content width **1200px** on inner wrapper.

### Container

`.container-zeb` — same 1200px cap + fluid gutters:

- Base: `1rem` (16px)
- `sm:`: `1.5rem` (24px)
- `lg:`: `2rem` (32px)

Use for fragments that need a container without a `<section>` wrapper.

### Common layout patterns

- **Grids:** `grid-cols-1` on mobile → `sm:` or `lg:` columns
- **Tables:** hide secondary columns below `lg:` — no `min-w-[800px]` scroll tables
- **Phone demos:** `<PhoneFrame>` at `min(290px, 80vw)` — never `scale-[0.x]` wrappers
- **Hero:** only section allowed `min-h-screen`

---

## 6. Components

### Buttons

Defined in `globals.css`. All enforce **44px min-height** on mobile.

| Class | Use |
|-------|-----|
| `.btn-primary` | Main actions — **accent** fill, `--accent-text` |
| `.btn-hero-primary` | Hero CTA — accent fill |
| `.btn-outline` | Secondary — border + `--fg`, hover brand border |

```html
<a class="btn-primary" href="…">Create account</a>
<button class="btn-outline" type="button">Login</button>
```

### Cards

Default card recipe:

```tsx
className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
```

Hover (optional): `hover:bg-[var(--surface-strong)]` or `hover:border-[var(--border-strong)]`.

### Chips & badges

Compliance tags, rank badges, inactive tab hints:

```tsx
className="rounded-full border border-[var(--brand-tint-border)] bg-[var(--brand-tint)] px-3 py-1 text-sm text-[var(--brand)]"
```

### Navigation

- Floating pill nav with scroll-shrink (GSAP)
- Scrolled state uses solid `--bg` (not translucent glass)
- Desktop: **Login** (outline) + **Create account** (primary)

### Focus

Global keyboard focus:

```css
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
```

Primary buttons use `--fg` outline on `:focus-visible` for contrast on brand fill.

### Phone frame

[`PhoneFrame`](../src/components/ui/phone-frame.tsx) — fluid `min(290px, 80vw)`, aspect ratio 29:58. Bezel colors are fixed (not theme-aware).

---

## 7. Motion & animation

### Easing

Custom GSAP ease `ZEB_EASE` = `"zeb"` → cubic-bezier **0.16, 1, 0.3, 1** (snappy deceleration).

```ts
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
```

### Rules

- Always guard with `prefersReducedMotion()` — when disabled, show **final values** (not `opacity: 0`)
- GSAP pixel layout (`left`, `borderRadius`, etc.) inside `gsap.matchMedia` for viewport-specific math
- Scroll: Lenis smooth scroll; disabled when reduced motion preferred
- Market row flash: brief success/danger tint → transparent (`market-flash-up` / `market-flash-down`)

### Reduced motion

`globals.css` sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` when `prefers-reduced-motion: reduce`.

---

## 8. Effects & ambience

### Shadows

| Token | Light | Dark |
|-------|-------|------|
| `--shadow` | Soft brand-tinted | Deep black |
| `--shadow-lg` | Navy ambient | Stronger black |

### Canvas washes

Controlled by `--section-bg-landing` (and variants for hero, FAQ, footer, etc.):

- **Light:** ≤ 3 layers — soft brand radial + base linear gradient
- **Dark:** brand radial opacity **≤ 0.16** — no black undertone in linear stops

### FAQ grid

`.faq-grid` — subtle grid lines via `--faq-grid-color`, radial mask fade.

---

## 9. Iconography & imagery

- **Security pillars:** theme-aware PNGs at `/security/icons/{light|dark}/{id}.png`
- **Coin icons:** remote URLs (CoinGecko, ZebPay CDN) — `next.config` image domains
- **Open Graph:** generated at `/opengraph-image`
- Decorative images: `alt=""` + `aria-hidden` where appropriate

---

## 10. File map

| Concern | Location |
|---------|----------|
| Design tokens | `src/app/globals.css` |
| Font loading | `src/app/layout.tsx` |
| Theme context | `src/context/theme-context.tsx` |
| Section wrapper | `src/components/ui/section.tsx` |
| Phone bezel | `src/components/ui/phone-frame.tsx` |
| Nav + toggle | `src/components/landing/nav.tsx`, `theme-toggle.tsx` |
| Home sections | `src/components/landing/landing-page.tsx` |
| Routes | `src/lib/routes.ts` |
| External links | `src/lib/links.ts` |

### Live routes (marketing chrome)

`/`, `/markets`, `/calculators`, `/how-to-buy`, `/discover`, `/testimonials`, `/announcements`, `/events`, `/features/quick-trade`, `/pro/expert-trades`, `/business/*`

---

## 11. Do / Don't

### Do

- Use `--fg`, `--surface`, `--border` semantic tokens
- Wrap sections in `<Section>`
- Test **light and dark** + **320px** before shipping
- One primary CTA per section
- Keep brand glow on canvas; cards stay solid
- Use `tabular-nums` for prices

### Don't

- `backdrop-blur` or `bg-white/5` on nav/cards/dropdowns
- Pure `#000000` panels on navy canvas (use `#10182e`)
- Brand blue on every icon, tab, and badge in one view
- `text-white` on theme surfaces
- Per-section gradient backgrounds on landing pages
- `scale-[0.x]` on `<PhoneFrame>`
- `--fg-subtle` for prices, legal text, or CTAs

---

## 12. Extending the system

### Adding a new token

1. Add to `:root` and `.dark` in `globals.css`
2. Document in this file
3. Verify contrast in both themes
4. Prefer role names (`--surface-warning`) over hue names (`--light-blue`)

### Adding a new section

1. Read [color-theory.md](../.cursor/skills/web-app-ux-2026/color-theory.md) harmony checklist
2. Use `<Section>` + semantic tokens
3. No new page background — rely on `.landing-page::before`
4. Run `npm run lint` (includes responsive + UX audit)

### Verification commands

```bash
npm run lint          # eslint + responsive + ux audit
npm run ux:audit      # flags glass, hardcoded chrome colors
```

Manual: theme toggle → full home scroll → markets table → calculators → 320px width.

---

## 13. Related docs

| Doc | Contents |
|-----|----------|
| [color-theory.md](../.cursor/skills/web-app-ux-2026/color-theory.md) | Harmony schemes, emotional hierarchy, forbidden patterns |
| [color-harmony-plan.md](../.cursor/skills/web-app-ux-2026/color-harmony-plan.md) | v2 migration phases |
| [zeb-home-patterns.md](../.cursor/skills/web-app-ux-2026/zeb-home-patterns.md) | UX conventions for agents |
| [AGENTS.md](../AGENTS.md) | Responsive lint rules, theming enforcement |

---

*Last aligned with globals.css **v3** (ZebPay blue + gold `#F0B84C` accent).*
