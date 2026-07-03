import Image from "next/image";

type FeatureIllustrationProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function FeatureIllustration({
  src,
  alt,
  priority = false,
  className = ""
}: FeatureIllustrationProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[560px] ${className}`.trim()}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--brand-rgb), 0.18) 0%, rgba(var(--brand-rgb), 0.04) 45%, transparent 72%)"
        }}
      />
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={400}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 560px"
          priority={priority}
        />
      </div>
    </div>
  );
}
