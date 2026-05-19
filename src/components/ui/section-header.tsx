import { Chip } from "./chip";

export function SectionHeader({
  chip,
  title,
  subtitle,
  center = true
}: {
  chip?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <header className={`mb-12 ${center ? "text-center" : ""}`}>
      {chip && <Chip>{chip}</Chip>}
      <h2
        className={`mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight text-[var(--text)] ${center ? "mx-auto max-w-3xl" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base text-[var(--text-muted)] ${center ? "mx-auto max-w-xl" : "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
