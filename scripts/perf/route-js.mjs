/**
 * Sums the JS bytes (raw + gzip) of the chunks loaded for one route,
 * using Next's app-build-manifest so before/after builds are comparable.
 * Usage: node scripts/perf/route-js.mjs <routeFragment>
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const fragment = process.argv[2] || "product/[id]/[slug]";
const manifestPath = ".next/app-build-manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const key = Object.keys(manifest.pages).find((k) => k.includes(fragment));
if (!key) {
  console.error("route not found. keys:", Object.keys(manifest.pages).join("\n"));
  process.exit(1);
}

const files = [...new Set(manifest.pages[key])];
let raw = 0;
let gzip = 0;
const rows = [];
for (const file of files) {
  const full = path.join(".next", file);
  if (!fs.existsSync(full)) continue;
  const buf = fs.readFileSync(full);
  const gz = zlib.gzipSync(buf).length;
  raw += buf.length;
  gzip += gz;
  if (buf.length > 20000) rows.push({ file, raw: buf.length, gzip: gz });
}

console.log(`route: ${key}`);
console.log(`chunks: ${files.length}`);
console.log(`raw total: ${(raw / 1024).toFixed(1)} KB`);
console.log(`gzip total: ${(gzip / 1024).toFixed(1)} KB`);
console.log("largest chunks (gzip):");
rows
  .sort((a, b) => b.gzip - a.gzip)
  .slice(0, 8)
  .forEach((r) => console.log(`  ${(r.gzip / 1024).toFixed(1)} KB  ${r.file}`));
