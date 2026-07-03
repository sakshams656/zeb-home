import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FeatureLivePairsGrid } from "@/components/features/feature-live-pairs";
import {
  FEATURE_ICONS,
  type FeatureIconName
} from "@/components/features/feature-icons";
import { Section } from "@/components/ui/section";

export function FeatureIconBadge({
  name,
  className = ""
}: {
  name: FeatureIconName;
  className?: string;
}) {
  const Icon = FEATURE_ICONS[name];
  return (
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--brand-tint-border)] bg-[var(--brand-tint)] text-[var(--brand)] ${className}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

type FeatureHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  visual: ReactNode;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function FeatureHero({
  eyebrow,
  title,
  description,
  visual,
  primaryCta,
  secondaryCta
}: FeatureHeroProps) {
  return (
    <Section variant="spacious" className="pt-24 sm:pt-28 lg:pt-32">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--fg-subtle)]">{eyebrow}</p>
          <h1 className="mt-2 text-[clamp(2rem,6vw,3.25rem)] font-black leading-[1.08] text-[var(--fg)]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--fg-muted)] sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={primaryCta.href} className="btn-hero-primary text-sm sm:text-base">
              {primaryCta.label}
            </a>
            {secondaryCta ? (
              secondaryCta.href.startsWith("/") ? (
                <Link href={secondaryCta.href} className="btn-outline">
                  {secondaryCta.label}
                </Link>
              ) : (
                <a href={secondaryCta.href} className="btn-outline">
                  {secondaryCta.label}
                </a>
              )
            ) : null}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">{visual}</div>
      </div>
    </Section>
  );
}

type Benefit = { icon: FeatureIconName; title: string; body: string };

export function FeatureBenefits({ items }: { items: Benefit[] }) {
  return (
    <Section variant="compact">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--brand-tint-border)]"
          >
            <FeatureIconBadge name={b.icon} />
            <h2 className="mt-4 text-base font-bold text-[var(--fg)]">{b.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{b.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

type Step = { title: string; body: string; icon?: FeatureIconName };

export function FeatureSteps({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <Section variant="standard">
      <h2 className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">
        {title}
      </h2>
      <ol className="relative mt-10 grid gap-4 sm:grid-cols-3">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-9 hidden h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent sm:block"
        />
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:text-left"
          >
            <div className="mx-auto flex w-fit items-center gap-3 sm:mx-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-text)]">
                {i + 1}
              </span>
              {step.icon ? <FeatureIconBadge name={step.icon} className="h-9 w-9 rounded-lg" /> : null}
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--fg)]">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

type Highlight = { icon: FeatureIconName; title: string; body: string };

export function FeatureHighlights({ title, items }: { title: string; items: Highlight[] }) {
  return (
    <Section variant="standard">
      <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">{title}</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((h) => (
          <div
            key={h.title}
            className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <FeatureIconBadge name={h.icon} className="h-12 w-12 rounded-2xl" />
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-[var(--fg)]">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{h.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

type CompareCard = { icon: FeatureIconName; title: string; body: string; tag?: string };

export function FeatureCompare({
  title,
  left,
  right
}: {
  title: string;
  left: CompareCard;
  right: CompareCard;
}) {
  return (
    <Section variant="standard">
      <h2 className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">
        {title}
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[left, right].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <FeatureIconBadge name={card.icon} className="h-12 w-12 rounded-2xl" />
              {card.tag ? (
                <span className="rounded-full bg-[var(--brand-tint)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
                  {card.tag}
                </span>
              ) : null}
            </div>
            <h3 className="mt-5 text-xl font-bold text-[var(--fg)]">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">{card.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FeaturePairsShowcase({
  title,
  description,
  cta,
  moreLabel = "+294 more"
}: {
  title: string;
  description: string;
  cta: { label: string; href: string };
  moreLabel?: string;
}) {
  return (
    <Section variant="standard">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-10 lg:p-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">{title}</h2>
            <p className="mt-4 text-[var(--fg-muted)]">{description}</p>
            <a href={cta.href} className="btn-primary mt-8">
              {cta.label}
            </a>
          </div>
          <div className="relative min-h-[240px] border-t border-[var(--border)] bg-[var(--surface-strong)] lg:min-h-0 lg:border-l lg:border-t-0">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "28px 28px"
              }}
            />
            <FeatureLivePairsGrid moreLabel={moreLabel} className="relative" />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FeatureScreenshotBand({
  title,
  description,
  imageSrc,
  imageAlt,
  cta,
  reverse = false
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cta?: { label: string; href: string };
  reverse?: boolean;
}) {
  return (
    <Section variant="standard">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className={reverse ? "order-1 lg:order-2" : "order-2 lg:order-1"}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={640}
            height={400}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className={reverse ? "order-2 lg:order-1" : "order-1 lg:order-2"}>
          <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">{title}</h2>
          <p className="mt-4 text-[var(--fg-muted)]">{description}</p>
          {cta ? (
            <a href={cta.href} className="btn-primary mt-8">
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

export function FeatureCtaBand({
  title,
  description,
  cta,
  icon = "quickTrade"
}: {
  title: string;
  description: string;
  cta: { label: string; href: string };
  icon?: FeatureIconName;
}) {
  return (
    <Section variant="compact">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--brand-tint-border)] bg-[var(--surface)] px-6 py-12 text-center sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 0%, rgba(var(--brand-rgb), 0.16) 0%, transparent 70%)"
          }}
        />
        <div className="relative">
          <FeatureIconBadge name={icon} className="mx-auto h-14 w-14 rounded-2xl" />
          <h2 className="mt-6 text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]">{title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--fg-muted)]">{description}</p>
          <a href={cta.href} className="btn-hero-primary mt-8">
            {cta.label}
          </a>
        </div>
      </div>
    </Section>
  );
}
