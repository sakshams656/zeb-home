import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Testimonials } from "@/components/landing/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What ZebPay traders and investors say about the platform."
};

export default function TestimonialsPage() {
  return (
    <SiteShell>
      <Testimonials />
    </SiteShell>
  );
}
