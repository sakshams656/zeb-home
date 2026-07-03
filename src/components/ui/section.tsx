import { forwardRef, type ElementType, type ReactNode } from "react";

/**
 * Canonical section wrapper for the landing page.
 *
 * Every section on the marketing site must use this primitive (or the
 * `.container-zeb` CSS class for fragments that need a container without a
 * `<section>`). It enforces the mobile-first padding ramp so authors cannot
 * accidentally ship `py-[120px]`-style desktop-only spacing.
 *
 * Padding variants follow a mobile-first scale:
 *  - `compact`   ~ 48 / 64 / 80  px vertical at base / sm / lg
 *  - `standard`  ~ 56 / 64 / 96  px vertical (the typical section rhythm)
 *  - `spacious`  ~ 64 / 80 / 112 px vertical (only when the section needs air)
 */

type Variant = "compact" | "standard" | "spacious";

const VARIANT_PADDING: Record<Variant, string> = {
  compact: "px-4 py-12 sm:px-6 sm:py-16 lg:py-20",
  standard: "px-4 py-14 sm:px-6 sm:py-16 lg:py-24",
  spacious: "px-4 py-16 sm:px-6 sm:py-20 lg:py-28",
};

export interface SectionProps {
  children: ReactNode;
  /** Padding rhythm. Defaults to `standard`. */
  variant?: Variant;
  /** Optional class on the outer `<section>` (background, scroll-mt, etc.). */
  className?: string;
  /** Optional class on the inner container that caps width to 1200px. */
  innerClassName?: string;
  /** Render the outer element as something other than `<section>` (rare). */
  as?: ElementType;
  /** Set when the section needs to be linked to via in-page anchor. */
  id?: string;
  /** Aria label, when the inner heading doesn't suffice. */
  "aria-label"?: string;
  /** Aria-labelledby reference. */
  "aria-labelledby"?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    children,
    variant = "standard",
    className = "",
    innerClassName = "",
    as,
    id,
    ...aria
  },
  ref
) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`scroll-mt-24 ${VARIANT_PADDING[variant]} ${className}`.trim()}
      {...aria}
    >
      <div className={`mx-auto w-full max-w-[1200px] ${innerClassName}`.trim()}>{children}</div>
    </Tag>
  );
});

export { VARIANT_PADDING as SECTION_PADDING_BY_VARIANT };
