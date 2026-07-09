import sanitizeHtml from "sanitize-html";

/** Sanitize WordPress article HTML for in-app rendering. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "b",
      "i",
      "a",
      "blockquote",
      "figure",
      "figcaption",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
      "hr"
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      span: ["style"],
      div: ["class"],
      figure: ["class"],
      table: ["class"],
      p: ["class"],
      h2: ["class"],
      h3: ["class"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const nextAttribs: Record<string, string> = {
          ...attribs,
          rel: "noopener noreferrer"
        };
        if (href.startsWith("http")) nextAttribs.target = "_blank";
        else delete nextAttribs.target;
        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        let src = attribs.src ?? "";
        if (src.startsWith("/")) src = `https://zebpay.com/in${src}`;
        if (src.startsWith("https://zebpay.com/wp-content/")) {
          src = src.replace("https://zebpay.com/", "https://zebpay.com/in/");
        }
        return {
          tagName,
          attribs: {
            ...attribs,
            src,
            loading: "lazy",
            alt: attribs.alt ?? ""
          }
        };
      }
    }
  });
}
