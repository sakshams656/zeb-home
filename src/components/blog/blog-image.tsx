"use client";

import { useState } from "react";

type BlogImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  fallbackLabel?: string;
};

/** Blog thumbnails use native img — RSS sources vary and may 404 via next/image optimizer. */
export function BlogImage({
  src,
  alt,
  className,
  priority,
  fill,
  width,
  height,
  fallbackLabel
}: BlogImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--brand-tint)] p-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--brand)] ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className ?? ""}`}
      >
        {fallbackLabel ?? "ZebPay Blog"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- blog RSS images use varied external hosts
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
