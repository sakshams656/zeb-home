import type { ReactNode } from "react";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

type SiteShellProps = {
  children: ReactNode;
};

/** Shared chrome for every marketing page (nav + footer + page background). */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="landing-page">
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
