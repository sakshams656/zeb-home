# 8-Pillar UX Checklist — zeb-home

Use before shipping any landing change. Mark each item pass/fail for the feature you are building.

---

## 1. Prioritise Accessibility from Day One

- [ ] Interactive elements have visible `:focus-visible` styles (not removed without replacement)
- [ ] Images have meaningful `alt` or `alt=""` when decorative
- [ ] Icon-only buttons/links have `aria-label`
- [ ] Tab widgets use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`
- [ ] Accordions use `aria-expanded` + `aria-controls`
- [ ] Auto-rotating content has `aria-live` or pauses on focus
- [ ] `prefers-reduced-motion`: animations disabled **and** final content still visible (no `0` placeholders)
- [ ] Skip-to-content link present (`layout.tsx` → `#main`)
- [ ] External links: `rel="noopener noreferrer"`; consider sr-only "opens in new tab"
- [ ] No `href="#"` placeholder links in production UI
- [ ] Colour contrast: `--fg-subtle` not used for essential small text; verify AA on both themes
- [ ] Mobile menu: focus trap, `aria-modal`, return focus on close

---

## 2. Design for Mobile-First and Responsive Experiences

- [ ] Built at 320px first; layout stacks before `lg:` breakpoints
- [ ] Section wrapped in `<Section>` (or justified exception documented)
- [ ] Tap targets ≥ 44×44px on all buttons, links, icon controls
- [ ] Headline `clamp()` minimum ≤ `2rem`
- [ ] Tables hide secondary columns below `lg:` (no horizontal scroll tables)
- [ ] Passes `npm run lint:responsive` (no forbidden patterns from AGENTS.md)
- [ ] Phone demos inside `<PhoneFrame>` exempt from breakpoint scaling

---

## 3. Embrace Minimalism and Clarity in UI

- [ ] Section has one clear purpose and CTA hierarchy
- [ ] No duplicate trust badges/stats already shown elsewhere on the page
- [ ] Not stacking ticker + carousel + live table motion in the same viewport without reason
- [ ] Copy is scannable: short headings, muted supporting text only where needed
- [ ] No decorative effects that slow comprehension

---

## 4. Use Data-Driven Design Decisions

- [ ] Change has a stated goal (e.g. signup clicks, calculator engagement, FAQ reach)
- [ ] If analytics not wired: document event name + location for future instrumentation
- [ ] High-friction flows (onboarding, calculator, markets) noted for funnel tracking

*Note: no analytics SDK in repo yet — document intent until Phase D.*

---

## 5. Prioritise Speed and Performance

- [ ] New section uses dynamic `import()` if heavy (GSAP, charts, video)
- [ ] Images use `next/image` with `sizes`; below-fold uses lazy loading
- [ ] Videos: `preload="metadata"` unless above-fold LCP; no autoplay below fold without need
- [ ] No unused GSAP plugins registered
- [ ] Third-party fetches via server route, not hardcoded client API keys
- [ ] Client bundle: prefer server component shell + small client island

---

## 6. Personalise the User Experience

- [ ] Chrome uses semantic CSS variables — no `text-white` / `bg-white/[0.04]` on surfaces
- [ ] Theme toggle tested: light and dark both readable
- [ ] User preference (`zeb-theme`) respected; no `prefers-color-scheme` override of in-app choice
- [ ] Financial/crypto content uses plain language appropriate to audience

### Color harmony (v3) — see [color-theory.md](color-theory.md) + [docs/DESIGN.md](../../../docs/DESIGN.md)

- [ ] 60/30/10: canvas (indigo/cream) / structure (surface, chips) / accent (CTAs only)
- [ ] `--accent` on primary buttons & active tabs — not `--brand`
- [ ] `--brand` for links/charts only — eyebrows use `--fg-subtle`
- [ ] **Dark:** `#100e24` canvas → `#1e1c3e` panels — side-by-side lift visible
- [ ] **Light:** warm cream `#f7f4ef` → soft white `#faf8f4` cards
- [ ] `--success` distinct from `--accent` (market data vs CTA)
- [ ] No glass, no `#000` panels, no per-section gradients
- [ ] Contrast AA including `--accent-text` on `--accent`

---

## 7. Build Trust with Security and Transparency

- [ ] Privacy policy and terms linked (footer minimum; nav for high-trust flows)
- [ ] Trading/crypto disclaimers near relevant CTAs
- [ ] No secrets in client bundle (`CG-` API keys, tokens)
- [ ] Third-party data loads (CoinGecko, YouTube, CMS) disclosed; cookie consent when required
- [ ] CMS HTML sanitised before `dangerouslySetInnerHTML`

---

## 8. Continuously Test and Iterate Your Design

- [ ] Test plan written (keyboard, mobile, both themes, reduced motion)
- [ ] `npm run lint` passes including `ux:audit`
- [ ] Known regressions documented in PR/commit if intentional
- [ ] Baseline scores in [baseline.md](baseline.md) updated after major changes

---

## Quick test script (manual)

1. Tab from skip link through nav → main content → one interactive section
2. 320px + **light** theme scroll full page — cards distinct from canvas
3. 320px + **dark** theme scroll full page — black panels on navy canvas
4. Reduce motion on → verify stats, carousels, animations
5. Lighthouse mobile Accessibility ≥ 90 (target)
