#!/usr/bin/env node
// UX audit for the landing page.
//
// Run with `npm run ux:audit` (or as part of `npm run lint`).
// Scans landing/ui/app source for accessibility, trust, and UX patterns
// documented in .cursor/skills/web-app-ux-2026/checklist.md and color-theory.md
//
// Exit code 1 if any violation is found, 0 otherwise.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCAN_DIRS = [
  resolve(ROOT, "src/components/landing"),
  resolve(ROOT, "src/components/features"),
  resolve(ROOT, "src/components/how-to-buy"),
  resolve(ROOT, "src/components/layout"),
  resolve(ROOT, "src/components/ui"),
  resolve(ROOT, "src/app"),
  resolve(ROOT, "src/lib"),
];

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
    } else if (/\.(tsx?|jsx?|css)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

function report(rel, line, ruleId, detail) {
  console.error(`${rel}:${line}  [${ruleId}]`);
  console.error(`  ${detail}`);
  return 1;
}

function lintFile(file, source, rel) {
  let count = 0;
  const lines = source.split("\n");

  // href="#" placeholders (not href="#something")
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/href\s*=\s*["']#["']/.test(line) && !/lint-allow:\s*href-hash/.test(line)) {
      count += report(rel, i + 1, "href-hash-placeholder", line.trim());
    }
  }

  // target="_blank" without rel="noopener noreferrer" on same or next line
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/target\s*=\s*["']_blank["']/.test(line)) {
      const window = lines.slice(i, Math.min(i + 3, lines.length)).join(" ");
      if (!/rel\s*=\s*["'][^"']*noopener/.test(window)) {
        count += report(rel, i + 1, "blank-without-noopener", line.trim());
      }
    }
  }

  // Forbidden clamp floors on headlines
  const CLAMP_FLOOR_RE = /clamp\(\s*(2\.25|3|4)rem/g;
  let m;
  while ((m = CLAMP_FLOOR_RE.exec(source)) !== null) {
    count += report(
      rel,
      lineOf(source, m.index),
      "clamp-floor-too-large",
      `clamp() minimum ${m[1]}rem exceeds 2rem — use clamp(2rem, …)`
    );
  }

  // Hardcoded CoinGecko API key in client source
  if (/CG-[a-zA-Z0-9]+/.test(source) && !file.includes("/api/")) {
    const keyMatch = source.match(/CG-[a-zA-Z0-9]+/);
    if (keyMatch) {
      const idx = source.indexOf(keyMatch[0]);
      count += report(
        rel,
        lineOf(source, idx),
        "hardcoded-api-key",
        "CoinGecko API key must live in server env, not client source"
      );
    }
  }

  // outline-none without focus-visible in same file (landing/ui only)
  if (
    (file.includes("/landing/") || file.includes("/ui/")) &&
    !isPhoneDemoFile(file) &&
    /outline-none/.test(source) &&
    !/focus-visible:/.test(source) &&
    !/lint-allow:\s*outline-none/.test(source) &&
    !/focus-within:/.test(source)
  ) {
    const idx = source.indexOf("outline-none");
    count += report(
      rel,
      lineOf(source, idx),
      "outline-none-without-focus-visible",
      "outline-none used without focus-visible alternative in same file"
    );
  }

  // Glass / translucent chrome (use solid --surface / --bg per color-theory.md)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/lint-allow:\s*glass/.test(line)) continue;
    if (/backdrop-blur/.test(line)) {
      count += report(
        rel,
        i + 1,
        "glass-backdrop-blur",
        "backdrop-blur on chrome — use solid bg-[var(--bg)] or bg-[var(--surface)]"
      );
    }
    if (/bg-\[var\(--(?:bg|surface|bg-elevated)\)\]\/(?:[0-9]{2}|[0-9]{3})\b/.test(line)) {
      count += report(
        rel,
        i + 1,
        "glass-translucent-surface",
        "Translucent surface opacity — use opaque semantic tokens (color-theory.md)"
      );
    }
    if (/\bbg-white\/|border-white\//.test(line) && !isPhoneDemoFile(file) && !file.includes("calculator-ui.tsx")) {
      count += report(
        rel,
        i + 1,
        "glass-white-alpha",
        "white/[opacity] surface on chrome — use --fg / --surface tokens for both themes"
      );
    }
  }

  // <img without alt= (checks same line and next 4 lines)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/<img\b/.test(line)) {
      const window = lines.slice(i, Math.min(i + 5, lines.length)).join("\n");
      if (!/\balt\s*=/.test(window)) {
        count += report(rel, i + 1, "img-missing-alt", line.trim());
      }
    }
  }

  return count;
}

function lintMissingAssets() {
  let count = 0;
  const hasOg =
    existsSync(resolve(ROOT, "public/og-image.png")) ||
    existsSync(resolve(ROOT, "src/app/opengraph-image.tsx"));
  const layoutPath = resolve(ROOT, "src/app/layout.tsx");
  if (existsSync(layoutPath) && !hasOg) {
    const layout = readFileSync(layoutPath, "utf8");
    if (layout.includes("/og-image.png")) {
      count += report(
        "public/",
        0,
        "missing-og-image",
        "Add public/og-image.png or src/app/opengraph-image.tsx"
      );
    }
  }
  const jsonLdPath = resolve(ROOT, "src/components/seo/json-ld.tsx");
  if (existsSync(jsonLdPath)) {
    const jsonLd = readFileSync(jsonLdPath, "utf8");
    const hasLogo =
      existsSync(resolve(ROOT, "public/logo.png")) ||
      existsSync(resolve(ROOT, "public/ZebLogo.png"));
    if (jsonLd.includes("/logo.png") && !hasLogo) {
      count += report("public/", 0, "missing-logo-png", "json-ld references /logo.png but file is missing");
    }
  }
  return count;
}

let totalViolations = 0;
const filesScanned = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (isPhoneDemoFile(file)) continue;
    filesScanned.push(file);
    const source = readFileSync(file, "utf8");
    const rel = relative(ROOT, file);
    totalViolations += lintFile(file, source, rel);
  }
}

totalViolations += lintMissingAssets();

if (totalViolations > 0) {
  console.error("");
  console.error(`ux-audit: ${totalViolations} violation(s) across ${filesScanned.length} files.`);
  console.error(`See .cursor/skills/web-app-ux-2026/checklist.md and color-theory.md for guidance.`);
  process.exit(1);
}

console.log(`ux-audit: ok (${filesScanned.length} files clean).`);
