import Link from "next/link";
import { BlogImage } from "@/components/blog/blog-image";
import { Section } from "@/components/ui/section";
import { formatBlogDate } from "@/lib/blog";
import type { BlogVideoItem } from "@/types/blog";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M8 5.14v13.72c0 .9.97 1.46 1.75 1.01l11.6-6.86c.77-.46.77-1.57 0-2.03l-11.6-6.86A1.17 1.17 0 0 0 8 5.14z" />
    </svg>
  );
}

export function BlogVideoSection({ items }: { items: BlogVideoItem[] }) {
  return (
    <Section id="block-chai" variant="standard" className="scroll-mt-28">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">Watch</p>
      <h2 className="mt-1 text-[clamp(1.35rem,3.5vw,1.75rem)] font-black text-[var(--fg)]">
        Block Chai
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--fg-muted)]">
        Conversations with thought leaders and ZebPay CEO Rahul Pagidipati.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((video) => (
          <article key={video.id} className="group">
            <Link
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-video overflow-hidden rounded-2xl bg-[var(--surface-strong)]"
            >
              <BlogImage
                src={video.image}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 grid place-items-center bg-[rgba(10,15,46,0.35)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-text)] shadow-[var(--shadow-lg)]">
                  <PlayIcon className="h-6 w-6 translate-x-0.5" />
                </span>
              </span>
            </Link>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--fg-subtle)]">
                {video.episode}
              </p>
              <h3 className="mt-1 text-base font-bold leading-snug text-[var(--fg)] sm:text-lg">
                <Link
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--brand)] focus-visible:outline-none"
                >
                  {video.title}
                </Link>
              </h3>
              <time dateTime={video.date} className="mt-2 block text-xs text-[var(--fg-subtle)]">
                {formatBlogDate(video.date)}
              </time>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
