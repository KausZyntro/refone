/**
 * Measures the initial JS payload of a rendered page: parses the script tags /
 * module preloads in the HTML and sums the referenced chunk files (raw + gzip).
 * This makes before/after builds comparable even across Next versions that no
 * longer print per-route sizes.
 * Usage: node scripts/perf/page-js.mjs <url>
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/perf/page-js.mjs <url>");
  process.exit(1);
}

const html = await (await fetch(url)).text();
const refs = new Set();
for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) refs.add(match[1]);
for (const match of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g)) refs.add(match[1]);
for (const match of html.matchAll(/<link[^>]+href="([^"]+)"[^>]+rel="modulepreload"/g)) refs.add(match[1]);

let raw = 0;
let gzip = 0;
const rows = [];
for (const ref of refs) {
  if (!ref.startsWith("/_next/static/")) continue;
  const file = path.join(".next", ref.replace("/_next/", ""));
  if (!fs.existsSync(file)) continue;
  const buf = fs.readFileSync(file);
  raw += buf.length;
  const gz = zlib.gzipSync(buf).length;
  gzip += gz;
  rows.push({ file: ref, raw: buf.length, gzip: gz });
}

rows.sort((a, b) => b.gzip - a.gzip);
console.log(`url: ${url}`);
console.log(`html: ${(html.length / 1024).toFixed(1)} KB`);
console.log(`script/preload refs: ${refs.size} (${rows.length} chunks found)`);
console.log(`initial JS raw: ${(raw / 1024).toFixed(1)} KB`);
console.log(`initial JS gzip: ${(gzip / 1024).toFixed(1)} KB`);
console.log("largest chunks (gzip):");
rows.slice(0, 10).forEach((r) => console.log(`  ${(r.gzip / 1024).toFixed(1)} KB  ${r.file}`));
