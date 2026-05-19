import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

export function AppDownload() {
  return (
    <section className="px-6 py-20">
      <div className="container-zeb">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <SectionHeader chip="Mobile app" title="Trade anywhere" subtitle="iOS & Android — full feature parity with web." center={false} />
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`${APP_URL}/app`} className="btn-primary">App Store</a>
                <a href={`${APP_URL}/app`} className="btn-outline">Google Play</a>
              </div>
            </div>
            <div className="mx-auto flex h-64 w-48 items-center justify-center rounded-[2rem] border-[8px] border-[var(--navy)] bg-[var(--surface)] text-center text-sm text-[var(--text-muted)]">
              ZebPay App
              <br />
              QR at signup
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
