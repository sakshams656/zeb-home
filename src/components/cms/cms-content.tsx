import { cmsHtmlToParagraphs } from "@/lib/cms-plain-text";

type CmsContentProps = {
  html: string;
  className?: string;
};

/** WordPress body copy as plain paragraphs — HTML is stripped server-side. */
export function CmsContent({ html, className }: CmsContentProps) {
  const paragraphs = cmsHtmlToParagraphs(html);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed text-[var(--fg-muted)] last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
