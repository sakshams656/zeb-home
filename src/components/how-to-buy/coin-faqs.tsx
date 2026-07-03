import { FeatureFaq } from "@/components/features/feature-faq";
import type { FaqItem } from "@/lib/how-to-buy-content";

export function CoinFaqs({ items, coinSlug }: { items: FaqItem[]; coinSlug: string }) {
  return (
    <div>
      <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-black text-[var(--fg)]">
        Frequently asked questions
      </h2>
      <div className="mt-6">
        <FeatureFaq items={items} id={`how-to-buy-faq-${coinSlug}`} />
      </div>
    </div>
  );
}
