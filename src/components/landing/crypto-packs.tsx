import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { PACKS, type PackId } from "@/lib/market-data";

const PACK_LIST: PackId[] = ["defi", "l1", "ai", "meme"];

export function CryptoPacks() {
  return (
    <section id="packs" className="scroll-mt-20 bg-[var(--surface)] px-6 py-20">
      <div className="container-zeb">
        <SectionHeader
          chip="CryptoPacks"
          title="Diversified themes in one tap"
          subtitle="Expert-curated baskets — DeFi, L1s, AI, and more."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACK_LIST.map((id, i) => {
            const p = PACKS[id];
            return (
              <Reveal key={id} delay={i * 80}>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow)] transition hover:border-[var(--cyan)]">
                  <h3 className="text-lg font-black text-[var(--text)]">{p.name}</h3>
                  <p className="mt-2 text-2xl font-black text-[var(--success)]">+{p.ret}% YTD</p>
                  <p className="mt-3 text-sm text-[var(--text-muted)]">{p.coins.length} assets · {p.coins.slice(0, 4).join(", ")}…</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
