import Image from "next/image";
import type { BuyStep } from "@/lib/how-to-buy-content";

export function BuySteps({ steps }: { steps: BuyStep[] }) {
  return (
    <ol className="flex flex-col gap-10">
      {steps.map((step, i) => (
        <li key={step.title} className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-text)]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[var(--fg)] sm:text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <Image
              src={step.screenshotSrc}
              alt={step.screenshotLabel}
              width={640}
              height={400}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <figcaption className="border-t border-[var(--border)] px-4 py-2 text-center text-xs text-[var(--fg-muted)]">
              {step.screenshotLabel}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
