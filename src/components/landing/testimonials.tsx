import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  { quote: "RMS auto stop-loss on every futures position — I sleep better.", name: "Aman K.", role: "Futures trader, Mumbai", tag: "Pro" },
  { quote: "Sub-50ms API placement on perpetuals. Production-grade for our bot.", name: "Priya S.", role: "Algo trader, Bengaluru", tag: "Pro" },
  { quote: "₹15K SIP across two CryptoPacks. Up 38% in 14 months.", name: "Rohit M.", role: "Investor, Pune", tag: "Retail" }
];

export function Testimonials() {
  return (
    <section className="bg-[var(--surface)] px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Community" title="Trusted by millions" />
        <div className="grid gap-6 md:grid-cols-3">
          {ITEMS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <blockquote className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                <p className="text-[var(--text)]">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cyan)] text-xs font-bold text-[var(--navy)]">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <div>
                    <cite className="font-bold not-italic">{t.name}</cite>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                  <span className="ml-auto rounded bg-[var(--surface)] px-2 py-0.5 text-[10px] font-bold">{t.tag}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
