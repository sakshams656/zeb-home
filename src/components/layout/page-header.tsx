import type { ReactNode } from "react";
import { Section } from "@/components/ui/section";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <Section variant="compact" className="border-b border-[var(--border)]">
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--fg-subtle)]">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-black leading-tight text-[var(--fg)]">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-base text-[var(--fg-muted)]">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </Section>
  );
}
