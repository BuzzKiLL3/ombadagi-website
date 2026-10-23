#!/usr/bin/env node
/* =============================================================================
   VEROM SOLUTIONS — STATIC SITE BUILD
   node verom-src/build.mjs      → writes the site into /verom
   No dependencies. Content: content/<locale>.mjs. Settings: config.mjs.
   ============================================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";
import { en } from "./content/en.mjs";

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, "..", "verom");
const T = en; // single locale for now; loop over config.locales when French exists
const PRODUCT_ORDER = ["quotation-erp", "whatsapp-automation", "digital-twins"];
export const ROUTES = ["/", "/products", "/products/quotation-erp", "/products/whatsapp-automation", "/products/digital-twins", "/about", "/contact", "/privacy", "/terms"];

/* ------------------------------------------------------------------ helpers */
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 10);
const abs = (p) => config.url + (p === "/" ? "/" : p);
const year = new Date().getFullYear();

/* -------------------------------------------------------------------- icons */
const I = {
  arrow: '<svg class="arr" viewBox="0 0 16 16" fill="none" aria-hidden="true" width="14" height="14"><path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowLong: '<svg class="arrow" viewBox="0 0 24 12" fill="none" aria-hidden="true"><path d="M1 6h21M17 1.5 22 6l-5 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  info: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v5M10 6.2v.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  okBig: '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/><path d="M12.5 20.5l5 5 10-11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h8l4 4v14H6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 3v4h4M9 12h6M9 15.5h6M9 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v11H10l-4 3.5V16H4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 9.5h8M8 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h4l2.5-6 5 12 2.5-6h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 17a8 8 0 1 1 15 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 14l4-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="14" r="1.4" fill="currentColor"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4v16h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7.5 15l3.5-4 3 2.5 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>',
  flowI: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="6" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="18" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11l10-4M7 13l10 4" stroke="currentColor" stroke-width="1.5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 20.5h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 4.5a4.5 4.5 0 0 0-5.6 5.6L4 15l5 5 4.9-4.9a4.5 4.5 0 0 0 5.6-5.6l-2.8 2.8-2.8-.7-.7-2.8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 6h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7" stroke="currentColor" stroke-width="1.5"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 13l2.5-8h11L20 13v6H4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 13h5l1 2h4l1-2h5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  factory: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20V10l5 3V10l5 3V6h4l1 14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  min: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 5h8" stroke="currentColor"/></svg>',
  max: '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor"/></svg>',
  x: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor"/></svg>'
};
const GLYPH = { "quotation-erp": I.doc, "whatsapp-automation": I.chat, "digital-twins": I.cube };
const HUE = { "quotation-erp": "erp", "whatsapp-automation": "wa", "digital-twins": "dt" };
const glyph = (slug) => `<span class="glyph g-${HUE[slug]}" aria-hidden="true">${GLYPH[slug]}</span>`;
const officeLine = (o) => [o.city, o.region, o.country].filter(Boolean).join(", ") + " – " + o.postalCode;
const officeBlock = (o, cls = "") => `<div class="office ${cls}"><strong>${esc(o.country)}</strong><span>${esc(officeLine(o))}</span><a href="tel:${esc(o.phone)}">${esc(o.phoneDisplay)}</a></div>`;
const pill = (status) => `<span class="pill pill-${status}">${esc(T.ui.status[status])}</span>`;

/* --------------------------------------------------------------------- logo */
export const MARK = (title) => `<svg viewBox="0 0 32 32" fill="none" ${title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'}><path class="mark-a" d="M6.5 7.5 15 25" stroke-width="4" stroke-linecap="round"/><path class="mark-b" d="M25.5 7.5 17.2 24.2" stroke-width="4" stroke-linecap="round"/><circle class="mark-n" cx="25.5" cy="7.5" r="3.4"/></svg>`;
const logo = (href = "/") => `<a class="logo" href="${href}" aria-label="${esc(config.name)} — home">${MARK()}<span class="logo-text" aria-hidden="true"><span class="logo-name">VEROM</span><span class="logo-sub">SOLUTIONS</span></span></a>`;

/* ------------------------------------------------------------------- layout */
let CSS_V = "", JS_V = "";

function head({ title, description, path, jsonld = [], noindex = false }) {
  const url = abs(path);
  const org = {
    "@context": "https://schema.org", "@type": "Organization", "@id": config.url + "/#org",
    name: config.name, url: config.url + "/", logo: config.url + "/assets/logo-512.png",
    email: config.contactEmail, sameAs: [config.parentUrl + "/"],
    address: config.offices.map((o) => ({ "@type": "PostalAddress", addressLocality: o.city, ...(o.region ? { addressRegion: o.region } : {}), postalCode: o.postalCode, addressCountry: o.countryCode })),
    contactPoint: config.offices.map((o) => ({ "@type": "ContactPoint", contactType: "sales", telephone: o.phone, email: config.contactEmail, areaServed: o.countryCode, availableLanguage: ["en", "fr"] })),
    founder: { "@type": "Person", name: config.parentName, url: config.parentUrl + "/" }
  };
  const ld = [org, ...jsonld].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n  ");
  const ts = config.turnstileSiteKey ? '\n  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : "";
  return `<!DOCTYPE html>
<html lang="${T.lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#060A14">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(config.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${config.url}/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Verom Solutions — practical software for quotations, automation and industrial data">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${config.url}/og.png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/inter-regular.woff" as="font" type="font/woff" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-semibold.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="/assets/verom.css?v=${CSS_V}">
  <script defer src="/assets/verom.js?v=${JS_V}"></script>${ts}
  ${ld}
</head>`;
}

function nav(path) {
  const cur = (p) => (path === p || (p !== "/" && path.startsWith(p)) ? ' aria-current="page"' : "");
  const items = PRODUCT_ORDER.map((s) => {
    const p = T.products[s];
    return `<a class="dd-item" href="/products/${s}">${glyph(s)}<span><strong>${esc(p.name)}</strong><span>${esc(T.ui.status[p.status])} · ${esc(p.tagline)}</span></span></a>`;
  }).join("");
  return `<a class="skip" href="#main">${esc(T.ui.skip)}</a>
<header class="nav">
  <div class="wrap nav-in">
    ${logo()}
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links"><span>${esc(T.ui.menu)}</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
    <ul class="nav-links" id="nav-links">
      <li class="has-dd">
        <button class="nav-link" type="button" data-dd aria-expanded="false" aria-controls="dd-products"${path.startsWith("/products") ? ' aria-current="page"' : ""}>${esc(T.ui.products)} ${I.chev}</button>
        <div class="dropdown" id="dd-products" hidden>${items}<a class="dd-all" href="/products">${esc(T.ui.allProducts)} →</a></div>
      </li>
      <li><a class="nav-link" href="/#solutions">${esc(T.ui.solutions)}</a></li>
      <li><a class="nav-link" href="/about"${cur("/about")}>${esc(T.ui.about)}</a></li>
      <li><a class="nav-link" href="/contact"${cur("/contact")}>${esc(T.ui.contact)}</a></li>
      <li class="nav-cta"><a class="btn btn-ghost" href="/contact" data-track="cta_nav_contact">${esc(T.ui.getInTouch)}</a><a class="btn" href="/products" data-track="cta_nav_products">${esc(T.ui.exploreProducts)}</a></li>
    </ul>
  </div>
</header>`;
}

function footer() {
  const L = config.legal;
  const reg = [L.registrationNote, L.udyamNumber && `Udyam: ${L.udyamNumber}`, L.gstin && `GSTIN: ${L.gstin}`].filter(Boolean).map(esc).join(" · ");
  return `<footer class="footer">
  <div class="wrap">
    <div class="f-grid">
      <div>${logo()}<p class="f-about">${esc(T.footer.about)}</p></div>
      <nav aria-label="${esc(T.footer.productsTitle)}"><h2>${esc(T.footer.productsTitle)}</h2><ul>${PRODUCT_ORDER.map((s) => `<li><a href="/products/${s}">${esc(T.products[s].name)}</a></li>`).join("")}<li><a href="/products">${esc(T.ui.allProducts)}</a></li></ul></nav>
      <nav aria-label="${esc(T.footer.companyTitle)}"><h2>${esc(T.footer.companyTitle)}</h2><ul><li><a href="/about">${esc(T.ui.about)}</a></li><li><a href="/contact">${esc(T.ui.contact)}</a></li></ul></nav>
      <div><h2>${esc(T.ui.contact)}</h2><ul><li><a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></li>${config.offices.map((o) => `<li>${esc(o.country)} · <a href="tel:${esc(o.phone)}">${esc(o.phoneDisplay)}</a></li>`).join("")}</ul></div>
      <nav aria-label="${esc(T.footer.legalTitle)}"><h2>${esc(T.footer.legalTitle)}</h2><ul><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li></ul></nav>
    </div>
    <div class="f-bottom">
      <p>© <span data-year>${year}</span> ${esc(config.name)}. ${esc(T.footer.rights)} ${T.footer.parent} <a href="${config.parentUrl}/">${esc(config.parentName)}</a>.</p>
      <p>${reg}</p>
    </div>
  </div>
</footer>`;
}

function i18nScript() {
  const f = T.forms;
  const o = { required: f.errors.required, email: f.errors.email, tooLong: f.errors.tooLong, consent: f.errors.consent, summary: f.errors.summary,
    sending: f.sending, generic: f.failure.generic, notConfigured: f.failure.notConfigured, rate: f.failure.rate, emailLink: f.failure.emailLink,
    email_to: config.contactEmail, subjects: { contact: "Enquiry", trial: "Quotation ERP trial request", interest: "WhatsApp Automation interest" } };
  return `<script>window.VEROM_I18N=${JSON.stringify(o).replace(/</g, "\\u003c")};</script>`;
}

function page(meta, body, { forms = false } = {}) {
  return `${head(meta)}
<body>
${nav(meta.path)}
<main id="main">
${body}
</main>
${footer()}
${forms ? i18nScript() : ""}
</body>
</html>
`;
}

/* -------------------------------------------------------------- components */
const btn = (href, label, { ghost = false, lg = false, track = "", arrow = true } = {}) =>
  `<a class="btn${ghost ? " btn-ghost" : ""}${lg ? " btn-lg" : ""}" href="${href}"${track ? ` data-track="${track}"` : ""}>${esc(label)}${arrow && !ghost ? " " + I.arrow : ""}</a>`;

const secHead = (eyebrow, title, text, { center = false, h = "h2", id = "" } = {}) =>
  `<div class="sec-head${center ? " center" : ""} rv"><span class="eyebrow">${esc(eyebrow)}</span><${h}${id ? ` id="${id}"` : ""}>${esc(title)}</${h}>${text ? `<p>${esc(text)}</p>` : ""}</div>`;

function productCard(slug) {
  const p = T.products[slug];
  const ctas = slug === "quotation-erp"
    ? btn(`/products/${slug}`, p.cta, { track: "cta_card_erp" }) + btn(`/products/${slug}#trial`, p.cta2, { ghost: true, track: "cta_card_erp_trial" })
    : slug === "whatsapp-automation"
      ? btn(`/products/${slug}#interest`, p.cta, { ghost: true, track: "cta_card_wa" })
      : btn(`/contact?product=digital-twins`, p.cta, { ghost: true, track: "cta_card_dt" });
  return `<article class="card ${HUE[slug]} rv">
  <div class="card-top">${glyph(slug)}${pill(p.status)}</div>
  <h3><a href="/products/${slug}">${esc(p.name)}</a></h3>
  <p class="tag">${esc(p.tagline)}</p>
  <p class="desc">${esc(p.card)}</p>
  <ul class="ticks">${p.highlights.map((h) => `<li>${I.check}<span>${esc(h)}</span></li>`).join("")}</ul>
  ${p.planNote ? `<p class="plan-note">${esc(p.planNote)}</p>` : ""}
  <div class="card-cta">${ctas}</div>
</article>`;
}

function ctaBand(title, text, a, b) {
  return `<section class="section tight"><div class="wrap"><div class="cta-band dark rv"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><div class="btns">${a}${b}</div></div></div></section>`;
}

/* ------------------------------------------------------------------- forms */
let fid = 0;
function field({ name, type = "text", label, required = true, full = false, auto = "", max = 200, placeholder = "", options = null, rows = 5 }) {
  const id = `f${fid}-${name}`;
  const req = required ? " required" : "";
  const opt = required ? "" : ` <span class="opt">(${esc(T.forms.fields.optional)})</span>`;
  const desc = ` aria-describedby="${id}-err"`;
  let ctl;
  if (options) ctl = `<select id="${id}" name="${name}"${req}${desc}>${options.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("")}</select>`;
  else if (type === "textarea") ctl = `<textarea id="${id}" name="${name}" rows="${rows}" maxlength="${max}"${req}${desc}${placeholder ? ` placeholder="${esc(placeholder)}"` : ""}></textarea>`;
  else ctl = `<input id="${id}" name="${name}" type="${type}" maxlength="${max}"${auto ? ` autocomplete="${auto}"` : ""}${req}${desc}${type === "email" ? ' inputmode="email" spellcheck="false"' : ""}>`;
  return `<div class="field${full ? " full" : ""}"><label for="${id}">${esc(label)}${opt}</label>${ctl}<p class="err" id="${id}-err" aria-live="polite"></p></div>`;
}

function leadForm(kind, { product = "", title = "" } = {}) {
  fid++;
  const F = T.forms.fields, P = T.forms.placeholders;
  const common = [
    field({ name: "name", label: F.name, auto: "name", max: 120 }),
    field({ name: "email", type: "email", label: F.email, auto: "email", max: 160 }),
    field({ name: "company", label: F.company, auto: "organization", max: 160 }),
    field({ name: "country", label: F.country, auto: "country-name", max: 80 })
  ];
  let extra = [];
  if (kind === "contact") extra = [
    field({ name: "product", label: F.product, full: true, options: T.forms.productOptions }),
    field({ name: "message", type: "textarea", label: F.message, full: true, max: 4000, placeholder: P.message })
  ];
  if (kind === "trial") extra = [
    field({ name: "volume", label: F.volume, required: false, full: true, options: T.forms.volumeOptions }),
    field({ name: "message", type: "textarea", label: F.intended, required: false, full: true, max: 2000, placeholder: P.intended, rows: 4 })
  ];
  if (kind === "interest") extra = [
    field({ name: "message", type: "textarea", label: F.useCase, full: true, max: 2000, placeholder: P.useCase, rows: 4 })
  ];
  const cid = `f${fid}-consent`;
  return `<div class="form-card rv">
  ${title ? `<h3 class="sr-only">${esc(title)}</h3>` : ""}
  <form class="form" data-lead="${kind}" novalidate>
    <input type="hidden" name="kind" value="${kind}">
    ${product ? `<input type="hidden" name="product" value="${esc(product)}">` : ""}
    <input type="hidden" name="startedAt" value="">
    <div class="hp" aria-hidden="true"><label for="f${fid}-website">Website</label><input id="f${fid}-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    ${common.join("")}
    ${extra.join("")}
    <div class="check"><input id="${cid}" name="consent" type="checkbox" required aria-describedby="${cid}-err"><label for="${cid}">${esc(F.consent).replace("Privacy Policy", '<a href="/privacy">Privacy Policy</a>')}</label><p class="err" id="${cid}-err" aria-live="polite"></p></div>
    ${config.turnstileSiteKey ? `<div class="ts-slot"><div class="cf-turnstile" data-sitekey="${esc(config.turnstileSiteKey)}"></div></div>` : ""}
    <div class="form-alert bad" role="alert" tabindex="-1" hidden></div>
    <div class="form-foot"><button class="btn btn-lg" type="submit">${esc(T.forms.submit[kind])} ${I.arrow}</button><p>${esc(T.forms.privacy)}</p></div>
  </form>
  <div class="form-ok" data-ok hidden role="status">${I.okBig}<h3>${esc(T.forms.success.title)}</h3><p>${esc(T.forms.success.text)}</p></div>
</div>`;
}

/* ---------------------------------------------------------------- visuals */
function heroSystem() {
  const rows = [["Q-0142", "Issued", "trial"], ["Q-0141", "In review", "soon"], ["Q-0140", "Draft", "planned"]];
  return `<div class="sys" aria-hidden="true">
  <svg class="sys-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M60 18 C 74 18, 80 28, 80 43"/><path class="flow" d="M60 18 C 74 18, 80 28, 80 43"/>
    <path d="M80 77 C 80 86, 70 88, 56 88"/><path class="flow" d="M80 77 C 80 86, 70 88, 56 88"/>
  </svg>
  <div class="panel p-quote">
    <div class="panel-h">${glyph("quotation-erp")}Quotations</div>
    ${rows.map(([n, s, c]) => `<div class="q-row"><code>${n}</code><span>${n === "Q-0142" ? "Enclosure set" : n === "Q-0141" ? "Pump frame" : "Guarding"}</span><span class="pill pill-${c}">${s}</span></div>`).join("")}
    <div class="q-total"><span>Open value</span><b>25,655.50</b></div>
  </div>
  <div class="panel p-flow">
    <div class="panel-h">${glyph("whatsapp-automation")}Workflow</div>
    <div class="f-steps"><div class="f-step on" data-fstep><i></i>Enquiry received</div><div class="f-step" data-fstep><i></i>Routed to sales</div><div class="f-step" data-fstep><i></i>Follow-up scheduled</div></div>
  </div>
  <div class="panel p-data">
    <div class="panel-h">${glyph("digital-twins")}Machine signal</div>
    <div class="d-row"><div class="d-kpi"><b data-spark-val>3.0</b><span>mm/s</span></div>
    <svg class="d-spark" data-spark viewBox="0 0 160 44" preserveAspectRatio="none"><path class="area" d=""/><path class="line" d=""/></svg></div>
  </div>
  <p class="sys-cap">Illustrative · sample data</p>
</div>`;
}

function appMock() {
  const M = T.erp.mock;
  const stCls = (s) => (s === "In review" ? "st-review" : `st-${s}`);
  return `<figure class="mock" aria-label="Illustrative Quotation ERP interface with sample data">
  <div class="app" aria-hidden="true">
    <div class="app-bar"><span>${esc(M.app)} — V1.1</span><span class="win"><span>${I.min}</span><span>${I.max}</span><span>${I.x}</span></span></div>
    <div class="app-body">
      <aside class="app-side"><div class="logo">${MARK()}<span class="logo-text"><span class="logo-name">VEROM</span></span></div><ul>${M.nav.map((n, i) => `<li${i === M.active ? ' class="on"' : ""}><i></i>${esc(n)}</li>`).join("")}</ul></aside>
      <div class="app-main">
        <div class="app-head"><h4>${esc(M.heading)}</h4><span class="app-search">${esc(M.search)}</span><span class="app-btn">+ ${esc(M.create)}</span></div>
        <div class="app-kpis">${M.kpis.map((k) => `<div class="app-kpi"><span>${esc(k.label)}</span><b>${esc(k.value)}</b></div>`).join("")}</div>
        <table class="app-table"><thead><tr>${M.cols.map((c, i) => `<th${i === 3 ? ' class="num"' : ""}>${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${M.rows.map((r, i) => `<tr${i === 1 ? ' class="sel"' : ""}><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="num">${esc(r[3])}</td><td><span class="st ${stCls(r[4])}">${esc(r[4])}</span></td></tr>`).join("")}</tbody></table>
        <div class="app-aside">
          <div class="app-box"><h5>${esc(M.detail.title)}</h5>${M.detail.lines.map(([a, b]) => `<div class="app-line"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join("")}<div class="app-line total"><span>${esc(M.detail.totalLabel)}</span><span>${esc(M.detail.subtotal)}</span></div></div>
          <div class="app-box"><h5>${esc(M.activityTitle)}</h5><ul class="app-act">${M.activity.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>
        </div>
      </div>
    </div>
  </div>
  <figcaption class="mock-cap">${esc(T.ui.illustrative)}</figcaption>
</figure>`;
}

function twinDash() {
  const D = T.dt.dash;
  const sensors = [[66, 52], [174, 52], [120, 196]];
  return `<figure class="twin" data-twin aria-label="${esc(T.ui.demoData)}">
  <div class="twin-asset" aria-hidden="true">
    <div class="asset-state"><span>${esc(D.asset)}</span><b>● ${esc(D.state)}</b></div>
    <svg viewBox="10 10 220 220">
      <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(170,186,255,.18)"/>
      <circle cx="120" cy="120" r="78" fill="rgba(255,255,255,.02)" stroke="rgba(170,186,255,.28)"/>
      <g class="rotor">
        ${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M120 120 L${(120 + 70 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(120 + 70 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" stroke="rgba(242,188,94,.55)" stroke-width="3" stroke-linecap="round"/>`).join("")}
        <circle cx="120" cy="120" r="70" fill="none" stroke="rgba(242,188,94,.35)" stroke-width="1.5" stroke-dasharray="4 7"/>
      </g>
      <circle cx="120" cy="120" r="18" fill="#131C33" stroke="#F2BC5E" stroke-width="2"/>
      <circle cx="120" cy="120" r="5" fill="#F2BC5E"/>
      ${sensors.map(([x, y], i) => `<g><line x1="${x}" y1="${y}" x2="120" y2="120" stroke="rgba(110,224,174,.25)" stroke-dasharray="2 4"/><circle class="sensor-dot" cx="${x}" cy="${y}" r="5" fill="#6EE0AE"/><text x="${x + (i === 0 ? -10 : 10)}" y="${y + (i === 2 ? 4 : -8)}" fill="#9AA5C2" font-size="12" font-family="ui-monospace,monospace" text-anchor="${i === 0 ? "end" : "start"}">S${i + 1}</text></g>`).join("")}
    </svg>
  </div>
  <div class="twin-side">
    <div class="twin-kpis">${D.sensors.map((s, i) => `<div class="tk"><span><i>S${i + 1}</i>${esc(s.label)}</span><b><span data-k="${s.id}">–</span><em>${esc(s.unit)}</em></b></div>`).join("")}</div>
    <div class="twin-chart"><h4><span>${esc(D.trend)}</span><span>mm/s</span></h4>
      <svg viewBox="0 0 300 96" preserveAspectRatio="none" aria-hidden="true"><g class="grid"><line x1="0" y1="24" x2="300" y2="24"/><line x1="0" y1="48" x2="300" y2="48"/><line x1="0" y1="72" x2="300" y2="72"/></g><line class="limit" x1="0" y1="16" x2="300" y2="16"/><path class="area" d=""/><path class="line" d=""/></svg>
    </div>
    <div class="twin-events"><h4>${esc(D.events)}</h4><ul>${D.eventItems.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>
  </div>
  <figcaption class="mock-cap">${esc(T.ui.demoData)}</figcaption>
</figure>`;
}

function waVisual() {
  return `<div class="chat" aria-hidden="true">
  <div class="bubble in">Hello, can you quote 40 brackets in stainless steel?</div>
  <div class="chat-rule">workflow · new enquiry</div>
  <div class="record"><span>Lead</span><b>Sample customer</b><span>Topic</span><b>Quotation request</b><span>Assigned</span><b>Sales</b></div>
  <div class="bubble out">Thanks. Your request is registered and our team will reply today.</div>
  <p class="mock-cap" style="margin:0">Concept illustration · not a live integration</p>
</div>`;
}

/* -------------------------------------------------------------------- pages */
const pages = {};
const crumbs = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) })) });

/* HOME */
pages["/"] = () => {
  const H = T.home;
  const probIcons = { doc: I.doc, chat: I.chat, pulse: I.pulse };
  const body = `
<section class="hero dark" aria-labelledby="hero-h">
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">${esc(H.hero.eyebrow)}</span>
      <h1 id="hero-h">${(() => { const [a, ...b] = H.hero.title.split(". "); return `${esc(a)}.${b.length ? ` <span class="soft">${esc(b.join(". "))}</span>` : ""}`; })()}</h1>
      <p class="hero-text">${esc(H.hero.text)}</p>
      <div class="hero-cta">${btn("/products", H.hero.cta, { lg: true, track: "cta_hero_products" })}${btn("/contact", H.hero.cta2, { ghost: true, lg: true, track: "cta_hero_contact" })}</div>
    </div>
    ${heroSystem()}
  </div>
</section>

<section class="section mist" aria-labelledby="portfolio-h">
  <div class="wrap">
    ${secHead(H.portfolio.eyebrow, H.portfolio.title, H.portfolio.text, { id: "portfolio-h" })}
    <div class="cards">${PRODUCT_ORDER.map(productCard).join("")}</div>
  </div>
</section>

<section class="section" id="solutions" aria-labelledby="solutions-h">
  <div class="wrap">
    ${secHead(H.problems.eyebrow, H.problems.title, H.problems.text, { id: "solutions-h" })}
    <div class="problems rv">${H.problems.items.map((it) => `<div class="prob"><span class="prob-ic">${probIcons[it.icon]}</span><div><small>${esc(H.problems.problemLabel)}</small><p class="p-text">${esc(it.problem)}</p></div>${I.arrowLong}<div><small>${esc(H.problems.answerLabel)}</small><p class="a-text">${esc(it.answer)}</p></div><a class="link" href="/products/${it.product}">${esc(T.products[it.product].short)} ${I.arrow}</a></div>`).join("")}</div>
  </div>
</section>

<section class="section dark" aria-labelledby="how-h">
  <div class="wrap">
    ${secHead(H.how.eyebrow, H.how.title, H.how.text, { id: "how-h" })}
    <ol class="steps">${H.how.steps.map((s) => `<li class="step rv"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="section" aria-labelledby="why-h">
  <div class="wrap split">
    ${secHead(H.why.eyebrow, H.why.title, "", { id: "why-h" })}
    <ul class="why rv">${H.why.items.map((w) => `<li><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></li>`).join("")}</ul>
  </div>
</section>

${ctaBand(H.final.title, H.final.text, btn("/products/quotation-erp#trial", H.final.cta, { lg: true, track: "cta_final_erp" }), btn("/contact", H.final.cta2, { ghost: true, lg: true, track: "cta_final_contact" }))}
`;
  return page({ title: H.title, description: H.description, path: "/", jsonld: [{ "@context": "https://schema.org", "@type": "WebSite", name: config.name, url: config.url + "/", publisher: { "@id": config.url + "/#org" } }] }, body);
};

/* PRODUCTS */
pages["/products"] = () => {
  const P = T.productsPage;
  const body = `
<section class="hero dark page-hero simple"><div class="hero-grid-bg" aria-hidden="true"></div><div class="wrap hero-in"><div>
  <span class="eyebrow">${esc(P.eyebrow)}</span><h1>${esc(P.heading)}</h1><p class="hero-text">${esc(P.text)}</p>
</div></div></section>
<section class="section mist"><div class="wrap"><div class="cards">${PRODUCT_ORDER.map(productCard).join("")}</div></div></section>
<section class="section" aria-labelledby="road-h"><div class="wrap">
  <div class="sec-head rv"><h2 id="road-h">${esc(P.roadmapTitle)}</h2></div>
  <ul class="roadmap rv">${P.roadmap.map((r) => `<li><a href="/products/${r.product}">${glyph(r.product)}${esc(T.products[r.product].name)}</a>${pill(T.products[r.product].status)}<p>${esc(r.state)}</p></li>`).join("")}</ul>
</div></section>
${ctaBand(P.customTitle, P.customText, btn("/contact?product=custom-software", P.customCta, { lg: true, track: "cta_products_custom" }), "")}
`;
  return page({ title: P.title, description: P.description, path: "/products", jsonld: [crumbs([["Home", "/"], ["Products", "/products"]])] }, body);
};

/* QUOTATION ERP */
pages["/products/quotation-erp"] = () => {
  const E = T.erp;
  const forIcons = [I.factory, I.wrench, I.gauge];
  const legend = ["available", "validation", "planned"].map(pill).join("");
  const body = `
<section class="hero dark page-hero" aria-labelledby="erp-h"><div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">${esc(E.eyebrow)}</span>
      <h1 id="erp-h">${esc(E.heading)}</h1>
      <p class="hero-text">${esc(E.text)}</p>
      <div class="hero-cta">${btn("#trial", E.cta, { lg: true, track: "cta_erp_hero_trial" })}${btn("#how", E.cta2, { ghost: true, lg: true, track: "cta_erp_hero_how" })}</div>
      <p class="hero-note">${I.info}<span>${esc(T.products["quotation-erp"].name)}: ${esc(T.ui.status.trial).toLowerCase()}. ${esc(T.productsPage.roadmap[0].state)}</span></p>
    </div>
    ${appMock()}
  </div>
</section>

<section class="section" id="how" aria-labelledby="how-h">
  <div class="wrap">
    ${secHead("Workflow", E.howTitle, E.howText, { id: "how-h" })}
    <ol class="steps">${E.how.map((s) => `<li class="step rv"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="section mist" aria-labelledby="feat-h">
  <div class="wrap">
    ${secHead("Capabilities", E.featuresTitle, E.featuresText, { id: "feat-h" })}
    <div class="legend rv">${legend}<span>${esc(E.featuresAsOf)} ${esc(config.featureStatusDate)}</span></div>
    <ul class="features">${E.features.map((f) => `<li class="feature rv${f.status === "planned" ? " is-planned" : ""}"><div class="feature-top"><h3>${esc(f.title)}</h3>${pill(f.status)}</div><p>${esc(f.text)}</p></li>`).join("")}</ul>
  </div>
</section>

<section class="section" aria-labelledby="for-h">
  <div class="wrap">
    ${secHead("Fit", E.forTitle, "", { id: "for-h" })}
    <ul class="tiles">${E.forItems.map((f, i) => `<li class="tile rv"><span class="tile-ic">${forIcons[i]}</span><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}</ul>
  </div>
</section>

<section class="section mist" id="trial" aria-labelledby="trial-h">
  <div class="wrap form-wrap">
    <div class="rv">
      <span class="eyebrow">Trial</span>
      <h2 id="trial-h" style="font-size:var(--fs-2xl);margin-top:12px">${esc(E.trialTitle)}</h2>
      <p style="margin-top:16px;color:var(--ink-2);font-size:var(--fs-lg)">${esc(E.trialText)}</p>
      <ul class="list-check" style="margin-top:24px">${E.trialPoints.map((p) => `<li>${I.check}<span>${esc(p)}</span></li>`).join("")}</ul>
    </div>
    ${leadForm("trial", { product: "quotation-erp", title: E.trialTitle })}
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap split">
    ${secHead("FAQ", E.faqTitle, "", { id: "faq-h" })}
    <div class="faq rv">${E.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </div>
</section>
`;
  const app = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: T.products["quotation-erp"].name, applicationCategory: "BusinessApplication", operatingSystem: "Windows", description: E.description, softwareVersion: "1.1", publisher: { "@id": config.url + "/#org" }, url: abs("/products/quotation-erp") };
  return page({ title: E.title, description: E.description, path: "/products/quotation-erp", jsonld: [app, crumbs([["Home", "/"], ["Products", "/products"], [T.products["quotation-erp"].name, "/products/quotation-erp"]])] }, body, { forms: true });
};

/* WHATSAPP */
pages["/products/whatsapp-automation"] = () => {
  const W = T.wa;
  const caseIcons = [I.inbox, I.route, I.bell, I.doc, I.wrench, I.mic];
  const body = `
<section class="hero dark page-hero" aria-labelledby="wa-h"><div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">${esc(W.eyebrow)}</span>
      <h1 id="wa-h">${esc(W.heading)}</h1>
      <p class="hero-text">${esc(W.text)}</p>
      <div class="hero-cta">${btn("#interest", W.cta, { lg: true, track: "cta_wa_hero" })}</div>
      <p class="hero-note">${I.info}<span>${esc(W.devNote)}</span></p>
    </div>
    ${waVisual()}
  </div>
</section>

<section class="section dark" aria-labelledby="flow-h">
  <div class="wrap">
    ${secHead("Concept", W.flowTitle, W.flowCaption, { id: "flow-h" })}
    <ol class="flow rv">${W.flow.map((f, i) => `<li><span class="flow-n">0${i + 1}</span><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="section" aria-labelledby="cases-h">
  <div class="wrap">
    ${secHead("Use cases", W.casesTitle, "", { id: "cases-h" })}
    <ul class="tiles">${W.cases.map((c, i) => `<li class="tile rv"><span class="tile-ic">${caseIcons[i]}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join("")}</ul>
  </div>
</section>

<section class="section mist" aria-labelledby="dep-h">
  <div class="wrap split">
    ${secHead("Requirements", W.dependsTitle, "", { id: "dep-h" })}
    <div class="rv"><ul class="list-check">${W.depends.map((d) => `<li>${I.check}<span>${esc(d)}</span></li>`).join("")}</ul><div class="notice" style="margin-top:24px">${I.info}<span>${esc(W.dependsNote)}</span></div></div>
  </div>
</section>

<section class="section" id="interest" aria-labelledby="int-h">
  <div class="wrap form-wrap">
    <div class="rv"><span class="eyebrow">Early access</span><h2 id="int-h" style="font-size:var(--fs-2xl);margin-top:12px">${esc(W.formTitle)}</h2><p style="margin-top:16px;color:var(--ink-2);font-size:var(--fs-lg)">${esc(W.formText)}</p><p style="margin-top:24px;font-size:var(--fs-xs);color:var(--ink-3)">${esc(W.trademark)}</p></div>
    ${leadForm("interest", { product: "whatsapp-automation", title: W.formTitle })}
  </div>
</section>
`;
  return page({ title: W.title, description: W.description, path: "/products/whatsapp-automation", jsonld: [crumbs([["Home", "/"], ["Products", "/products"], [T.products["whatsapp-automation"].name, "/products/whatsapp-automation"]])] }, body, { forms: true });
};

/* DIGITAL TWINS */
pages["/products/digital-twins"] = () => {
  const D = T.dt;
  const caseIcons = [I.gauge, I.pulse, I.clock, I.grid, I.flowI, I.spark];
  const body = `
<section class="hero dark page-hero" aria-labelledby="dt-h"><div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">${esc(D.eyebrow)}</span>
      <h1 id="dt-h">${esc(D.heading)}</h1>
      <p class="hero-text">${esc(D.text)}</p>
      <div class="hero-cta">${btn("/contact?product=digital-twins", D.cta, { lg: true, track: "cta_dt_hero" })}</div>
      <p class="hero-note">${I.info}<span>${esc(D.devNote)}</span></p>
    </div>
    ${twinDash()}
  </div>
</section>

<section class="section" aria-labelledby="dtc-h">
  <div class="wrap">
    ${secHead("Use cases", D.casesTitle, "", { id: "dtc-h" })}
    <ul class="tiles">${D.cases.map((c, i) => `<li class="tile rv"><span class="tile-ic">${caseIcons[i]}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join("")}</ul>
  </div>
</section>

<section class="section dark" aria-labelledby="dta-h">
  <div class="wrap">
    ${secHead("Approach", D.approachTitle, "", { id: "dta-h" })}
    <ol class="steps">${D.approach.map((s) => `<li class="step rv"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </div>
</section>

${ctaBand("Have an industrial data question?", "Tell us about the asset, the signals you already have and what you want to see. We will tell you honestly what is feasible.", btn("/contact?product=digital-twins", D.cta, { lg: true, track: "cta_dt_band" }), "")}
`;
  return page({ title: D.title, description: D.description, path: "/products/digital-twins", jsonld: [crumbs([["Home", "/"], ["Products", "/products"], [T.products["digital-twins"].name, "/products/digital-twins"]])] }, body);
};

/* ABOUT */
pages["/about"] = () => {
  const A = T.about, L = config.legal;
  const rows = [["Business name", config.name], ["Registration", L.registrationNote], ["Udyam number", L.udyamNumber], ["GSTIN", L.gstin], ["Registered address", L.registeredAddress], ...config.offices.map((o) => [o.country, `${esc(officeLine(o))}<br><a class="link" href="tel:${esc(o.phone)}">${esc(o.phoneDisplay)}</a>`]), ["Email", `<a class="link" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`]].filter((r) => r[1]);
  const body = `
<section class="hero dark page-hero simple"><div class="hero-grid-bg" aria-hidden="true"></div><div class="wrap hero-in"><div>
  <span class="eyebrow">${esc(A.eyebrow)}</span><h1>${esc(A.heading)}</h1><p class="hero-text">${esc(A.text)}</p>
</div></div></section>

<section class="section" aria-labelledby="focus-h"><div class="wrap split">
  <div class="sec-head rv"><span class="eyebrow">Focus</span><h2 id="focus-h">${esc(A.focusTitle)}</h2></div>
  <ul class="chips rv">${A.focus.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
</div></section>

<section class="section mist" aria-labelledby="stance-h"><div class="wrap split">
  <div class="sec-head rv"><span class="eyebrow">Where we are</span><h2 id="stance-h">${esc(A.stanceTitle)}</h2></div>
  <ul class="list-check rv">${A.stance.map((s) => `<li>${I.check}<span>${esc(s)}</span></li>`).join("")}</ul>
</div></section>

<section class="section" aria-labelledby="pr-h"><div class="wrap">
  ${secHead("Principles", A.principlesTitle, "", { id: "pr-h" })}
  <ul class="tiles">${A.principles.map((p, i) => `<li class="tile rv"><span class="tile-ic">${[I.wrench, I.flowI, I.chart][i]}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}</ul>
</div></section>

<section class="section mist" aria-labelledby="fo-h"><div class="wrap split">
  <div class="sec-head rv"><span class="eyebrow">${esc(A.founderTitle)}</span><h2 id="fo-h">${esc(config.parentName)}</h2><p>${esc(A.founderText)}</p><p><a class="link" href="${config.parentUrl}/">${esc(A.founderLink)} ${I.arrow}</a></p></div>
  <div class="rv"><h3 style="font-size:var(--fs-md);margin-bottom:16px">${esc(A.legalTitle)}</h3><dl class="dl">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${/<a |<br>/.test(v) ? v : esc(v)}</dd>`).join("")}</dl></div>
</div></section>

${ctaBand(T.home.final.title, T.home.final.text, btn("/products", T.ui.exploreProducts, { lg: true }), btn("/contact", T.home.final.cta2, { ghost: true, lg: true }))}
`;
  return page({ title: A.title, description: A.description, path: "/about", jsonld: [crumbs([["Home", "/"], ["About", "/about"]])] }, body);
};

/* CONTACT */
pages["/contact"] = () => {
  const C = T.contact;
  const body = `
<section class="hero dark page-hero simple"><div class="hero-grid-bg" aria-hidden="true"></div><div class="wrap hero-in"><div>
  <span class="eyebrow">${esc(C.eyebrow)}</span><h1>${esc(C.heading)}</h1><p class="hero-text">${esc(C.text)}</p>
</div></div></section>
<section class="section mist"><div class="wrap form-wrap">
  <div class="rv">
    <div class="aside-list">
      <div><h2 class="h3" style="font-size:var(--fs-md)">${esc(C.expectTitle)}</h2><ol class="list-check" style="margin-top:12px">${C.expect.map((e) => `<li>${I.check}<span>${esc(e)}</span></li>`).join("")}</ol></div>
      <div><h2 style="font-size:var(--fs-md)">${esc(C.directTitle)}</h2><p style="margin-top:6px">${esc(C.directText)} <a class="link" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p></div>
      <div><h2 style="font-size:var(--fs-md)">${esc(C.officesTitle)}</h2><div class="offices">${config.offices.map((o) => officeBlock(o)).join("")}</div></div>
    </div>
  </div>
  ${leadForm("contact", { title: C.heading })}
</div></section>
`;
  return page({ title: C.title, description: C.description, path: "/contact", jsonld: [{ "@context": "https://schema.org", "@type": "ContactPage", name: C.title, url: abs("/contact") }] }, body, { forms: true });
};

/* LEGAL */
function legal(key, path) {
  const L = T[key];
  const law = config.legal.governingLaw ? `These terms are governed by ${config.legal.governingLaw}.` : T.terms.lawPending;
  const body = `
<section class="hero dark page-hero simple"><div class="wrap hero-in"><div><span class="eyebrow">Legal</span><h1>${esc(L.heading)}</h1></div></div></section>
<section class="section"><div class="wrap prose">
  <div class="notice">${I.info}<span>${esc(L.review)}</span></div>
  ${L.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((p) => `<p>${esc(p).replace(/\{email\}/g, `<a class="link" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`).replace("{law}", esc(law))}</p>`).join("")}`).join("")}
  <p class="meta">Last updated: ${esc(config.legalUpdated)}</p>
</div></section>`;
  return page({ title: L.title, description: L.description, path }, body);
}
pages["/privacy"] = () => legal("privacy", "/privacy");
pages["/terms"] = () => legal("terms", "/terms");

/* 404 */
const notFound = () => {
  const N = T.notFound;
  return page({ title: N.title, description: N.description, path: "/404", noindex: true }, `
<section class="hero dark page-hero simple notfound"><div class="hero-grid-bg" aria-hidden="true"></div><div class="wrap hero-in"><div>
  <span class="code-404">404</span><h1 style="margin-top:12px">${esc(N.heading)}</h1><p class="hero-text">${esc(N.text)}</p>
  <div class="hero-cta">${btn("/", N.cta, { lg: true })}${btn("/products", N.cta2, { ghost: true, lg: true })}</div>
</div></div></section>`);
};

/* -------------------------------------------------------------------- build */
function build() {
  const css = readFileSync(join(SRC, "assets/verom.css"), "utf8");
  const js = readFileSync(join(SRC, "assets/verom.js"), "utf8");
  CSS_V = hash(css); JS_V = hash(js);

  // keep generated binary assets (fonts, png icons) — rebuild everything else
  for (const d of ROUTES.filter((r) => r !== "/")) rmSync(join(OUT, d), { recursive: true, force: true });
  mkdirSync(join(OUT, "assets"), { recursive: true });
  writeFileSync(join(OUT, "assets/verom.css"), css);
  writeFileSync(join(OUT, "assets/verom.js"), js);

  for (const r of ROUTES) {
    const dir = r === "/" ? OUT : join(OUT, r);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), pages[r]());
  }
  writeFileSync(join(OUT, "404.html"), notFound());

  // logos & favicon
  const mark = (a, b, n, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">${extra}<path d="M6.5 7.5 15 25" stroke="${a}" stroke-width="4" stroke-linecap="round"/><path d="M25.5 7.5 17.2 24.2" stroke="${b}" stroke-width="4" stroke-linecap="round"/><circle cx="25.5" cy="7.5" r="3.4" fill="${n}"/></svg>`;
  writeFileSync(join(OUT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#0A1020"/><path d="M8 9 15.2 23.5" stroke="#E9EDF8" stroke-width="3.6" stroke-linecap="round"/><path d="M24 9 16.9 22.8" stroke="#8D97FF" stroke-width="3.6" stroke-linecap="round"/><circle cx="24" cy="9" r="3" fill="#8D97FF"/></svg>`);
  const wordmark = (ink, b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 228 40" fill="none" role="img" aria-label="Verom Solutions"><g transform="translate(0 4)">${mark(ink, b, b).replace(/<\/?svg[^>]*>/g, "")}</g><text x="44" y="21" fill="${ink}" font-family="Inter, Segoe UI, sans-serif" font-size="19" font-weight="600" letter-spacing="3">VEROM</text><text x="44.5" y="34" fill="${ink}" opacity=".66" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="8.5" letter-spacing="3.6">SOLUTIONS</text></svg>`;
  writeFileSync(join(OUT, "assets/logo-dark-bg.svg"), wordmark("#E9EDF8", "#8D97FF"));
  writeFileSync(join(OUT, "assets/logo-light-bg.svg"), wordmark("#0B1222", "#4C5BFF"));
  writeFileSync(join(OUT, "assets/mark.svg"), mark("#0B1222", "#4C5BFF", "#4C5BFF"));

  writeFileSync(join(OUT, "site.webmanifest"), JSON.stringify({ name: config.name, short_name: "Verom", start_url: "/", display: "browser", background_color: "#060A14", theme_color: "#060A14", icons: [{ src: "/assets/logo-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/logo-512.png", sizes: "512x512", type: "image/png" }] }, null, 2));
  writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${config.url}/sitemap.xml\n`);
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.map((r) => `  <url><loc>${abs(r)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
  console.log(`Built ${ROUTES.length} pages + 404 into ${OUT}  (css ${CSS_V}, js ${JS_V})`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
export { build };
