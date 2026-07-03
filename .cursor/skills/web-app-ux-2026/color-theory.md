# Color Theory — zeb-home

Color is not decoration. It is the first trust signal: calm, hesitation, or “this fits.”  
Users judge before they read. Up to ~90% of first-impression quality is chromatic harmony and hierarchy.

This document is the **design system for feeling** — not a lint checklist.  
Token values live in [`src/app/globals.css`](../../../src/app/globals.css).  
Migration plan: [color-harmony-plan.md](color-harmony-plan.md).

Cross-reference: [AGENTS.md](../../../AGENTS.md) theming rules.

---

## 1. Screens speak RGB (additive light)

All UI color is **light on glass** — Red + Green + Blue added toward white.  
Design in sRGB hex. Do not treat print/CMYK logic as screen logic.

| Model | Medium | Rule for zeb-home |
|-------|--------|-------------------|
| **RGB** | Monitors, phones | **Only model we use** |
| CMYK / RYB | Print | Out of scope unless exporting brand PDFs |

Implication: dark UI is **not** “black ink on paper.” It is **low light with selective glow**.  
Heavy blue radials on a navy canvas can feel loud (additive brightness) — tune opacity, not hue count.

---

## 2. Color wheel → harmony schemes

The wheel maps **relationships**, not favorites. Pick a scheme, then assign **roles**.

### Schemes and when to use them

| Scheme | Relationship | Emotional read | zeb-home role |
|--------|--------------|----------------|---------------|
| **Monochromatic** | One hue → tints/shades | Calm, premium, cohesive | **Primary system** — navy → brand blue → panel lifts |
| **Analogous** | Neighbors on wheel (blue → blue-violet → teal) | Flow, trust, “fintech calm” | Canvas washes, ambient glow, secondary UI |
| **Complementary** | Opposites (blue ↔ orange) | High contrast, urgent | **CTAs only** — brand button on canvas |
| **Split-complementary** | Base + two neighbors of opposite | Contrast with less aggression | Gold highlights, warm compliance accents |
| **Triadic** | Three equidistant hues | Energetic, rich | **Avoid** as base — too noisy for finance |
| **Tetradic** | Two complementary pairs | Editorial, game UI | **Avoid** on marketing chrome |

### ZebPay harmony strategy (locked)

```
Lead:     Brand blue  #1b55e0  (220°) — CTAs, links, focus, one accent word per headline
Support:  Navy family #0a0f2e → #10182e → #1a2444 — canvas + elevated panels (analogous)
Accent:   Gold #f5a623 (split-comp) — rare badges, “coming soon”, not body text
Semantic: Success #00b07a / Danger #e33e5c — market data & state ONLY
```

**Hierarchy rule (triadic discipline on a mono base):**  
One color leads, one supports, one accents. If everything is brand blue, nothing is.

---

## 3. Why the current palette feels “off”

Diagnosis (user-reported + design review):

| Symptom | Cause | Harmony fix |
|---------|-------|-------------|
| Dark mode feels harsh / dead | Pure **black** panels on **navy** canvas — not analogous; reads as hole, not lift | Panels → **navy-adjacent** `#10182e`, borders `#2a3558` |
| Dark mode feels “try-hard fintech” | Blue glows at **0.35 opacity** — additive light overload | Cap canvas radials at **0.10–0.16**; fewer layers |
| Light mode feels clinical / flat | Monochrome cool gray with **8+** competing radials | **2–3** subtle washes; slightly warmer muted text |
| No sense of premium calm | Brand blue on **every** chip, tab, glow, and headline accent | Brand = **CTA + links + one accent**; chips use tint, not full saturation |
| `cyan` === `brand` | Duplicate token — no analogous secondary | Reserve `cyan` for data viz / icons OR deprecate |
| Status colors leak into chrome | Green/red tints on card backgrounds | Semantic colors on **text/icons only** |

Compliance goal: **“clean and safe”** (monochrome + analogous), not **“flashy exchange”** (complementary everywhere).

---

## 4. Role-based tokens (intent → CSS var)

Assign by **job**, not by hex habit.

### Surfaces (luminance hierarchy)

| Role | Light (v2 target) | Dark (v2 target) | Job |
|------|-------------------|------------------|-----|
| Canvas | `#f5f7fb` | `#0a0f2e` | Page recedes; calm field |
| Panel | `#ffffff` | `#10182e` | Cards, tables, inputs — **lifted**, not void |
| Panel hover | `#eef1f8` | `#1a2444` | Rows, chips, secondary wells |
| Chrome elevated | `#ffffff` | `#10182e` | Nav scrolled, dropdowns, cookie bar |

**v1 (current, being replaced):** dark panels `#000000` — see [color-harmony-plan.md](color-harmony-plan.md).

### Text (neutral, not tinted)

| Role | Light | Dark | Job |
|------|-------|------|-----|
| Primary | `#0a0f2e` | `#f4f6fb` | Headlines, body |
| Muted | `#5c6578` | `#a8b0c4` | Supporting copy |
| Subtle | `#7a8499` | `#7a8499` | Large labels only — never legal/prices |

Dark muted may be **slightly blue-gray** when it stays analogous to navy — not lavender, not pure `#b3b3b3` on navy panels.

### Brand & accents

| Token | Use | Do not use |
|-------|-----|------------|
| `--brand` | Primary buttons, links, focus ring, **one** headline accent | Section backgrounds, table rows |
| `--brand-tint` | Compliance chips, rank badges, inactive tab hover | Full-width fills |
| `--gold` | “Coming soon”, rare editorial highlight | Navigation, body text |
| `--success` / `--danger` | % change, buy/sell, validation | Card backgrounds, decorative borders |

### Effects

- **Shadows:** theme-aware; light = soft navy tint; dark = deep, low spread  
- **Glows:** canvas only (`.landing-page::before`); max **3** radial layers per theme  
- **No glass:** solid surfaces; no `backdrop-blur` on chrome

---

## 5. Composition patterns

### Cards on canvas (the “safe” read)

```
Light:  soft cool canvas → white card → cool border → navy text
Dark:   brand navy canvas → slate-navy card → blue-gray border → soft white text
```

Cards must be **one luminance step** from canvas — same hex as canvas fails hierarchy.

### CTA (complementary tension, once)

Primary button: `--brand` fill + `text-white`.  
Canvas provides the contrast field — do not add a second competing warm CTA color.

### Market data (semantic only)

Positive → `--success`. Negative → `--danger`.  
Background stays `--surface`. Flash animations may tint briefly; return to neutral.

### Ambient page wash

Single fixed layer (`.landing-page::before`).  
**Never** per-section gradient backgrounds — causes seams ([zeb-home-patterns.md](zeb-home-patterns.md)).

---

## 6. Design-phase review (both themes)

Before Figma or code, answer:

```
Harmony review:
- [ ] Scheme named (zeb-home: mono + analogous, split-comp accent)
- [ ] Lead / support / accent roles assigned — brand is NOT everywhere
- [ ] Light: canvas → panel step visible at 320px?
- [ ] Dark: panels feel lifted (navy-family), not black holes?
- [ ] Glow opacity ≤ 0.16 on dark canvas?
- [ ] Status colors only on data/state?
- [ ] WCAG AA: --fg and --fg-muted on --surface (both themes)?
- [ ] Toggle tested: calm first impression in 5 seconds?
```

Technical lint (glass, hardcoded hex on chrome): `npm run ux:audit`.

---

## 7. Contrast targets (WCAG 2.2 AA)

| Pair | Min ratio | Notes |
|------|-----------|-------|
| `--fg` on `--surface` | 4.5:1 | Body |
| `--fg-muted` on `--surface` | 4.5:1 | Supporting |
| `--fg-subtle` on `--surface` | 3:1 | Large type only |
| `--brand` on `--surface` | 4.5:1 | Links — bold if small |
| White on `--brand` | 4.5:1 | Primary buttons |

Re-check after every token change in `globals.css`.

---

## 8. Forbidden patterns (chrome)

| Pattern | Why |
|---------|-----|
| `text-white` / `text-black` on theme surfaces | Breaks one theme |
| `bg-white/5`, `border-white/10`, `backdrop-blur` | Glass; breaks solid harmony |
| Pure `#000000` panels on navy canvas | Harsh, non-analogous (v1 mistake) |
| Brand glow opacity > 0.18 on dark | Additive overload; feels cheap |
| Complementary orange/red CTAs **beside** brand blue CTAs | Split attention |
| `--fg-subtle` for prices, legal, CTAs | Fails trust |
| Hardcoded `#888`, `#040812` in components | Bypasses system |

---

## 9. Exceptions (fixed palette)

Do not theme-swap:

- Phone demo screens + `PhoneFrame` bezel  
- `CalcShell` / `--sim-gradient` (`.on-dark-surface` for nested chrome)  
- Video thumbnail overlays (`text-white` on dark **media**, not chrome)  
- Syntax highlighting inside `<pre>` — editor palette; base from `--surface-strong`

---

## 10. Agent workflow

1. Read this file + [color-harmony-plan.md](color-harmony-plan.md) for migration phase.  
2. Propose changes as **role assignments**, not one-off hex in components.  
3. Edit tokens in `globals.css` first; components reference vars only.  
4. Verify: theme toggle → home → markets → calculators → 320px.  
5. Log results in [color-review-baseline.md](color-review-baseline.md).

---

## Related

- [color-harmony-plan.md](color-harmony-plan.md) — phased v2 palette rollout  
- [SKILL.md](SKILL.md) — UX workflow  
- [zeb-home-patterns.md](zeb-home-patterns.md) — section + background rules
