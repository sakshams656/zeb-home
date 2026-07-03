import sanitizeHtml from "sanitize-html";

/** Strip WordPress HTML to plain text blocks — no raw HTML reaches the DOM. */
export function cmsHtmlToParagraphs(html: string): string[] {
  const plain = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\u00a0/g, " ")
    .trim();

  if (!plain) return [];

  return plain
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}
