import Link from "next/link";
import { Section } from "@/components/ui/section";
import type { BlogMediaItem } from "@/types/blog";

export function BlogMediaSection({ items }: { items: BlogMediaItem[] }) {
  return (
    <Section id="media" variant="standard" className="scroll-mt-28">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">Press</p>
      <h2 className="mt-1 text-[clamp(1.35rem,3.5vw,1.75rem)] font-black text-[var(--fg)]">Media</h2>

      <div className="mt-6 flex items-stretch gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const inner = (
            <>
              <h3 className="line-clamp-3 text-base font-bold leading-snug text-[var(--fg)] sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--fg-muted)]">
                {item.excerpt}
              </p>
              <span className="mt-auto inline-flex min-h-11 items-center pt-4 text-sm font-semibold text-[var(--brand)]">
                Read more
              </span>
            </>
          );

          const cardClass =
            "flex min-h-[220px] w-[min(100%,300px)] shrink-0 flex-col rounded-2xl bg-[var(--surface)] p-5 sm:min-h-[240px] sm:w-[320px] sm:p-6";

          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${cardClass} transition-colors hover:bg-[var(--surface-strong)]`}
            >
              {inner}
            </Link>
          ) : (
            <article key={item.id} className={cardClass}>
              {inner}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
