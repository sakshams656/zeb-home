import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  { icon: "🤖", title: "AI Insights", desc: "Sentiment scores and trade bias for every major pair.", tag: "NEW", href: "#features" },
  { icon: "👤", title: "Expert Trades", desc: "Follow verified futures traders with transparent win rates.", tag: "HOT", href: "#features" },
  { icon: "🛡", title: "RMS Account", desc: "Auto TP/SL and position limits — 87% of traders enable it.", href: "#features" },
  { icon: "🔀", title: "Sub Accounts", desc: "Isolated wallets and API keys per strategy or team member.", href: "#features" },
  { icon: "📊", title: "Options Trading", desc: "INR-settled calls and puts on majors.", tag: "Soon", href: "#features" }
];

export function ProFeatures() {
  return (
    <section id="pro" className="scroll-mt-20 bg-[var(--surface)] px-6 py-20">
      <div className="container-zeb">
        <SectionHeader
          chip="Pro tools"
          title="Features that set ZebPay apart"
          subtitle="Built for serious traders — and coming soon for options."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <Link
                href={f.href}
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition hover:border-[var(--cyan)] hover:shadow-[var(--shadow)]"
              >
                {f.tag && (
                  <span
                    className={`mb-3 inline-block rounded px-2 py-0.5 text-[10px] font-extrabold ${
                      f.tag === "Soon" ? "bg-[var(--gold)] text-[var(--navy)]" : "bg-[var(--cyan)] text-[var(--navy)]"
                    }`}
                  >
                    {f.tag}
                  </span>
                )}
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-lg font-black text-[var(--text)] group-hover:text-[var(--cyan)]">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{f.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
