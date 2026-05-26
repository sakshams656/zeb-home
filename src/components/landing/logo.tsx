import Image from "next/image";

type LogoVariant = "default" | "white" | "auto";

type LogoProps = {
  /**
   * - "default": always the dark-on-white logo.
   * - "white":   always the white-on-dark logo.
   * - "auto":    swaps with the website theme — white in dark mode,
   *              default (dark) in light mode. Use this anywhere the logo
   *              sits directly on the page background.
   */
  variant?: LogoVariant;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "auto",
  width = 180,
  height = 80,
  className,
  priority = false
}: LogoProps) {
  if (variant === "auto") {
    return (
      <>
        <Image
          src="/ZebLogoWhite.png"
          alt="ZebPay"
          width={width}
          height={height}
          className={`hidden dark:block ${className ?? ""}`}
          priority={priority}
        />
        <Image
          src="/ZebLogo.png"
          alt="ZebPay"
          width={width}
          height={height}
          className={`block dark:hidden ${className ?? ""}`}
          priority={priority}
        />
      </>
    );
  }

  const src = variant === "white" ? "/ZebLogoWhite.png" : "/ZebLogo.png";
  return (
    <Image
      src={src}
      alt="ZebPay"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
