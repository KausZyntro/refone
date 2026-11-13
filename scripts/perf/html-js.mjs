/**
 * Measures JavaScript chunks referenced by a prerendered App Router page.
 * Usage: node scripts/perf/html-js.mjs <route>
 * Example: node scripts/perf/html-js.mjs about-us
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const routeArg = process.argv[2];
if (!routeArg) {
  console.error("usage: node scripts/perf/html-js.mjs <route>");
  process.exit(1);
}

const route = routeArg.split("/").filter((part) => part && part !== "page").join(path.sep);
const htmlPath = path.join(".next", "server", "app", route + ".html");
if (!fs.existsSync(htmlPath)) {
  console.error("prerendered HTML not found:", htmlPath);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const refs = new Set();
for (const match of html.matchAll(/(?:src|href)="([^"]+[.]js[^"]*)"/g)) {
  const ref = new URL(match[1], "http://localhost").pathname;
  if (ref.startsWith("/_next/static/")) refs.add(ref);
}

let raw = 0;
let gzip = 0;
const rows = [];
for (const ref of refs) {
  const full = path.join(".next", ref.slice("/_next/".length));
  if (!fs.existsSync(full)) continue;
  const buf = fs.readFileSync(full);
  const gz = zlib.gzipSync(buf).length;
  raw += buf.length;
  gzip += gz;
  rows.push({ file: ref, raw: buf.length, gzip: gz });
}

console.log("route: /" + routeArg);
console.log("html: " + (Buffer.byteLength(html) / 1024).toFixed(1) + " KB");
console.log("script/preload refs: " + refs.size + " (" + rows.length + " chunks found)");
console.log("initial JS raw: " + (raw / 1024).toFixed(1) + " KB");
console.log("initial JS gzip: " + (gzip / 1024).toFixed(1) + " KB");
console.log("largest chunks (gzip):");
rows
  .sort((a, b) => b.gzip - a.gzip)
  .slice(0, 10)
  .forEach((r) => console.log("  " + (r.gzip / 1024).toFixed(1) + " KB  " + r.file));
