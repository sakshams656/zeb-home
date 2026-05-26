#!/usr/bin/env node
// Responsive linter for the landing page.
//
// Run with `npm run lint:responsive` (or as part of `npm run lint`).
// Scans `src/components/landing/**` and `src/components/ui/**` for the
// forbidden patterns documented in AGENTS.md "Mobile responsiveness".
//
// Exit code 1 if any violation is found, 0 otherwise.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCAN_DIRS = [
  resolve(ROOT, "src/components/landing"),
  resolve(ROOT, "src/components/ui"),
];

// Files that are allowed to opt out of specific rules.
const ALLOWLIST_VIEWPORT_HEIGHT = new Set([
  // Hero is allowed to be viewport-tall; everything else must flow.
  resolve(ROOT, "src/components/landing/hero.tsx"),
]);

// Phone-demo flows render inside <PhoneFrame> and are always portrait;
// breakpoint scaling does not apply. Skip them entirely.
function isPhoneDemoFile(absPath) {
  return (
    absPath.includes("/phone-demos/") ||
    absPath.includes("/phone-demo/") ||
    absPath.endsWith("/phone-frame.tsx")
  );
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

// A "class string" is anything inside className="..." (single line) or
// className={`...`} (single line). Multi-line template literals are not
// scanned (rare in this codebase; the lint stays line-oriented for clarity).
const CLASS_RE = /className\s*=\s*(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g;

function extractClassLines(source) {
  // Returns [{ classes, line }] entries per className occurrence.
  const lines = source.split("\n");
  const out = [];
  lines.forEach((rawLine, idx) => {
    CLASS_RE.lastIndex = 0;
    let m;
    while ((m = CLASS_RE.exec(rawLine)) !== null) {
      const classes = m[1] ?? m[2] ?? m[3] ?? "";
      out.push({ classes, line: idx + 1, raw: rawLine });
    }
  });
  return out;
}

const RULES = [
  {
    id: "double-min-height",
    description:
      "min-h-screen paired with min-h-[Npx] — double minimum locks the viewport on phones and clips content.",
    test({ classes }) {
      return /\bmin-h-screen\b/.test(classes) && /\bmin-h-\[\d+px\]/.test(classes);
    },
  },
  {
    id: "desktop-py-no-lg",
    description:
      "py-[Npx] with N >= 96 must be gated behind `lg:` (or use <Section>). Mobile cannot absorb desktop padding.",
    test({ classes }) {
      // Each token is independent; find any py-[Npx] >=96 that isn't preceded by `lg:`.
      const tokens = classes.split(/\s+/);
      return tokens.some((t) => {
        const m = /^py-\[(\d+)px\]$/.exec(t);
        return m && Number(m[1]) >= 96;
      });
    },
  },
  {
    id: "wide-min-width-no-scroll",
    description:
      "min-w-[Npx] (N >= 600) without `overflow-x-auto` on the same line — forces horizontal scroll on phones.",
    test({ classes, raw }) {
      const tokens = classes.split(/\s+/);
      const hasWideMin = tokens.some((t) => {
        const m = /^min-w-\[(\d+)px\]$/.exec(t);
        return m && Number(m[1]) >= 600;
      });
      if (!hasWideMin) return false;
      // Heuristic: the wrapping <div className="overflow-x-auto"> usually
      // appears on the preceding line. We allow the violation if the same
      // line OR the className contains `overflow-x-auto`/`overflow-auto`.
      return !/overflow-(x-)?auto/.test(raw);
    },
  },
  {
    id: "viewport-height-outside-hero",
    description:
      "h-[100vh] / h-[100svh] / h-[100dvh] outside the hero — full-viewport sections break on phones with dynamic browser chrome.",
    test({ classes }, ctx) {
      if (ALLOWLIST_VIEWPORT_HEIGHT.has(ctx.path)) return false;
      return /\bh-\[100[sd]?vh\]/.test(classes);
    },
  },
  {
    id: "section-double-padding",
    description:
      "px-* on a <section> whose inner wrapper is `.container-zeb` — container-zeb already provides the page gutter; doubling it leaves the inner content with too much horizontal padding.",
    test(_, ctx, _idx, occurrence) {
      // Only fire when the className was attached to a <section> element on
      // the same line AND px-* is present.
      if (!/<section\b/.test(occurrence.raw)) return false;
      if (!/\bpx-\S+/.test(occurrence.classes)) return false;
      // Check the next ~8 lines for an inner `container-zeb` div. If we find
      // it, the px-* on the section is redundant.
      const src = ctx.fullSource;
      const lines = src.split("\n");
      const start = occurrence.line - 1;
      const window = lines.slice(start, Math.min(start + 8, lines.length)).join("\n");
      return /container-zeb/.test(window);
    },
  },
  {
    id: "phone-frame-scaled",
    description:
      "scale-[0.*] near a <PhoneFrame> — the frame is already fluid; CSS transforms do not shrink the layout box.",
    test({ classes, raw }) {
      if (!/scale-\[0\./.test(classes)) return false;
      // The PhoneFrame is usually rendered on the very next non-empty line.
      // We treat any scale-[0.*] in the same JSX expression as a violation
      // when "PhoneFrame" appears anywhere in the same raw line.
      return /PhoneFrame/.test(raw);
    },
  },
  {
    id: "floating-chrome-without-overflow",
    description:
      "Floating-chrome hook classes (nav-inner / pill-shell) without an overflow- clip — children can escape the rounded edges on viewports where they outgrow the chrome, as the nav-pill bug showed. Add a new hook here when you introduce another shrinking floating container.",
    test({ classes }) {
      if (!/\b(nav-inner|pill-shell)\b/.test(classes)) return false;
      return !/\boverflow-(hidden|clip|x-hidden|y-hidden|x-clip|y-clip)\b/.test(classes);
    },
  },
];

// Additional multi-line rule: unguarded GSAP pixel-layout writes.
//
// Flags any `gsap.set(...)` / `gsap.to(...)` call whose object literal sets
// one of the layout-affecting CSS properties below as a *number* (i.e. px),
// when the enclosing scope is not inside a `gsap.matchMedia` / `mm.add` block.
//
// We detect "inside matchMedia" by walking backwards line-by-line tracking
// indentation: if any line at strictly less indentation than the GSAP call
// contains `mm.add(` or `gsap.matchMedia(`, we treat the call as guarded.
const PIXEL_LAYOUT_KEYS = /\b(left|right|top|bottom|borderRadius)\s*:/;
const GSAP_CALL_RE = /\bgsap\.(set|to)\s*\(/g;

function leadingIndent(line) {
  const m = /^(\s*)/.exec(line);
  return m ? m[1].length : 0;
}

function isGuardedByMatchMedia(source, callIndex) {
  // callIndex is the file-offset where `gsap.set(` / `gsap.to(` begins.
  const before = source.slice(0, callIndex);
  const lines = before.split("\n");
  const callLineIdx = lines.length - 1;
  const callLine = lines[callLineIdx];
  const callIndent = leadingIndent(callLine);
  // Walk backward up to 80 lines (typical function body) looking for a
  // matchMedia opener at lower indentation than the call itself.
  const stop = Math.max(0, callLineIdx - 80);
  for (let i = callLineIdx - 1; i >= stop; i -= 1) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const indent = leadingIndent(line);
    if (indent >= callIndent) continue;
    if (/\b(mm\.add|gsap\.matchMedia)\s*\(/.test(line)) return true;
  }
  return false;
}

function extractGsapObjectArg(source, openParenIndex) {
  // openParenIndex points to the `(` of gsap.set( / gsap.to(. We need the
  // second arg (the props object). Skip over the first arg by tracking
  // brace/paren/bracket depth until we hit a comma at depth 0, then capture
  // until the matching close-paren of the call.
  let depth = 0;
  let i = openParenIndex + 1;
  let firstArgEnd = -1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === "(" || ch === "{" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "}" || ch === "]") {
      depth -= 1;
      if (depth < 0) return null;
    } else if (ch === "," && depth === 0) {
      firstArgEnd = i;
      break;
    }
    i += 1;
  }
  if (firstArgEnd < 0) return null;
  // Now capture the rest of the call's args (the second arg).
  let j = firstArgEnd + 1;
  let argStart = j;
  while (j < source.length) {
    const ch = source[j];
    if (ch === "(" || ch === "{" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "}" || ch === "]") {
      if (depth === 0 && ch === ")") return source.slice(argStart, j);
      depth -= 1;
    }
    j += 1;
  }
  return null;
}

function lintUnguardedGsapPixelLayout(source, relPath) {
  let count = 0;
  let m;
  GSAP_CALL_RE.lastIndex = 0;
  while ((m = GSAP_CALL_RE.exec(source)) !== null) {
    const openParen = m.index + m[0].length - 1;
    const obj = extractGsapObjectArg(source, openParen);
    if (!obj) continue;
    if (!PIXEL_LAYOUT_KEYS.test(obj)) continue;
    if (/clearProps\s*:/.test(obj)) continue;
    if (isGuardedByMatchMedia(source, m.index)) continue;
    // Allow inline opt-out comment within ~5 lines before the GSAP call so
    // multi-line explanatory comments still count.
    const upto = source.slice(0, m.index);
    const lineNo = upto.split("\n").length;
    const lines = source.split("\n");
    const allowFrom = Math.max(0, lineNo - 6);
    const allowWindow = lines.slice(allowFrom, lineNo).join("\n");
    if (/lint-allow:\s*unguarded-gsap-pixel-layout/.test(allowWindow)) continue;
    const cur = lines[lineNo - 1] ?? "";
    console.error(`${relPath}:${lineNo}  [unguarded-gsap-pixel-layout]`);
    console.error(`  ${cur.trim()}`);
    count += 1;
  }
  return count;
}

let totalViolations = 0;
const filesScanned = [];

for (const dir of SCAN_DIRS) {
  const files = walk(dir);
  for (const file of files) {
    if (isPhoneDemoFile(file)) continue;
    filesScanned.push(file);
    const source = readFileSync(file, "utf8");
    const occurrences = extractClassLines(source);
    const rel = relative(ROOT, file);

    // Rule: scale-[0.*] PhoneFrame — we also want to catch the case where
    // the scale wrapper is on a previous line from the PhoneFrame JSX. Run a
    // simpler multi-line pass for that specific rule too.
    const phoneFrameRegions = source.split("\n");
    for (let i = 0; i < phoneFrameRegions.length; i += 1) {
      const line = phoneFrameRegions[i];
      if (/scale-\[0\./.test(line)) {
        const window = phoneFrameRegions.slice(i, Math.min(i + 5, phoneFrameRegions.length)).join("\n");
        if (/PhoneFrame/.test(window)) {
          // Avoid double-counting with the per-className rule below.
          if (!/className\s*=/.test(line) || !/PhoneFrame/.test(line)) {
            console.error(`${rel}:${i + 1}  [phone-frame-scaled]`);
            console.error(`  ${line.trim()}`);
            totalViolations += 1;
          }
        }
      }
    }

    for (let i = 0; i < occurrences.length; i += 1) {
      const occ = occurrences[i];
      for (const rule of RULES) {
        if (rule.test(occ, { path: file, fullSource: source }, i, occ)) {
          console.error(`${rel}:${occ.line}  [${rule.id}]`);
          console.error(`  ${occ.classes.trim()}`);
          totalViolations += 1;
        }
      }
    }

    totalViolations += lintUnguardedGsapPixelLayout(source, rel);
  }
}

if (totalViolations > 0) {
  console.error(``);
  console.error(`responsive-lint: ${totalViolations} violation(s) across ${filesScanned.length} files.`);
  console.error(`See "Mobile responsiveness" in AGENTS.md for the rules.`);
  process.exit(1);
}

console.log(`responsive-lint: ok (${filesScanned.length} files clean).`);
