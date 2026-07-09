/** Renders sanitized WordPress article HTML with theme-aware prose styles. */
export function BlogArticleContent({ html }: { html: string }) {
  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
