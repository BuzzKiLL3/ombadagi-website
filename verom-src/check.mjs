#!/usr/bin/env node
/* Pre-push checks for the Verom site:  node verom-src/check.mjs
   Fails (exit 1) on: route list drift between build and middleware, missing
   pages, duplicate titles/descriptions, missing canonical/OG tags, localhost
   links, or strings that look like secrets anywhere in the published files. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES } from "./build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "verom");
const problems = [];
const fail = (m) => problems.push(m);

// 1. middleware route list matches the build
const mw = readFileSync(join(ROOT, "functions/_middleware.js"), "utf8");
const m = mw.match(/VEROM_ROUTES = new Set\((\[[^\]]+\])\)/);
const mwRoutes = m ? JSON.parse(m[1]) : [];
if (JSON.stringify(mwRoutes) !== JSON.stringify(ROUTES)) fail(`VEROM_ROUTES in _middleware.js ${JSON.stringify(mwRoutes)} differs from build ROUTES ${JSON.stringify(ROUTES)}`);

// 2. pages exist, have unique metadata
const titles = new Map(), descs = new Map();
for (const r of [...ROUTES, "/404"]) {
  const f = r === "/404" ? join(OUT, "404.html") : join(OUT, r === "/" ? "" : r, "index.html");
  if (!existsSync(f)) { fail(`missing page ${r}`); continue; }
  const html = readFileSync(f, "utf8");
  const t = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const d = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const c = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!t) fail(`${r}: no title`); else if (titles.has(t)) fail(`${r}: duplicate title with ${titles.get(t)}`); else titles.set(t, r);
  if (!d || d.length < 70) fail(`${r}: description missing or short`); else if (descs.has(d)) fail(`${r}: duplicate description`); else descs.set(d, r);
  if (!c || !c.startsWith("https://verom.ombadagi.com")) fail(`${r}: bad canonical ${c}`);
  if (!html.includes('property="og:image"')) fail(`${r}: no og:image`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${r}: expected exactly one h1`);
}

// 3. scan published + function files for localhost links and secret-looking strings
const SECRET = [/re_[A-Za-z0-9]{16,}/, /sk_(live|test)_[A-Za-z0-9]{10,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /xox[bpa]-[A-Za-z0-9-]{10,}/, /0x4AAAA[A-Za-z0-9_-]{10,}/];
function walk(d) { return readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
for (const f of [...walk(OUT), ...walk(join(ROOT, "functions")), ...walk(join(ROOT, "verom-src"))]) {
  if (/\.(png|woff|woff2)$/.test(f)) continue;
  const s = readFileSync(f, "utf8");
  for (const re of SECRET) if (re.test(s)) fail(`possible secret in ${f.replace(ROOT, "")} (${re})`);
  if (f.startsWith(OUT) && /(href|src)="https?:\/\/(localhost|127\.0\.0\.1)/.test(s)) fail(`localhost link in ${f.replace(ROOT, "")}`);
}

// 4. sitemap lists every route
const sm = readFileSync(join(OUT, "sitemap.xml"), "utf8");
for (const r of ROUTES) if (!sm.includes(`<loc>https://verom.ombadagi.com${r === "/" ? "/" : r}</loc>`)) fail(`sitemap missing ${r}`);

if (problems.length) { console.error("✗ " + problems.join("\n✗ ")); process.exit(1); }
console.log(`✓ ${ROUTES.length} routes + 404 checked: metadata unique, middleware in sync, sitemap complete, no localhost links, no secret-like strings.`);
