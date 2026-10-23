// Markdown for agents: requests that prefer text/markdown get /index.md for the homepage.
// Browsers (Accept: text/html) keep getting HTML.
function wantsMarkdown(accept) {
  if (!accept) return false;
  let md = -1, html = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qp = params.find(p => p.trim().startsWith("q="));
    const q = qp ? parseFloat(qp.split("=")[1]) : 1;
    if (type === "text/markdown") md = Math.max(md, q);
    if (type === "text/html") html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}

/* ===========================================================================
   VEROM SOLUTIONS (verom.ombadagi.com)
   Requests whose hostname starts with "verom." are served from the /verom
   folder of this repo. Every other host keeps the original ombadagi.com
   behaviour below, unchanged. Keep VEROM_ROUTES in sync with ROUTES in
   verom-src/build.mjs (node verom-src/check.mjs verifies it).
   =========================================================================== */
const VEROM_ORIGIN = "https://verom.ombadagi.com";
const VEROM_ROUTES = new Set(["/", "/products", "/products/quotation-erp", "/products/whatsapp-automation", "/products/digital-twins", "/about", "/contact", "/privacy", "/terms"]);
const VEROM_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join("; ");

const isVeromHost = (host) => host.startsWith("verom.");
const isPreviewHost = (host) => host.endsWith(".pages.dev") || host.includes("localhost") || host.startsWith("127.");

async function fetchAsset(env, origin, path) {
  let res = await env.ASSETS.fetch(new URL(path, origin));
  for (let i = 0; i < 3 && res.status >= 300 && res.status < 400; i++) {
    const loc = res.headers.get("Location");
    if (!loc) break;
    res = await env.ASSETS.fetch(new URL(loc, origin));
  }
  return res;
}

function veromResponse(res, { status, cache, host, html }) {
  const out = new Response(res.body, { status: status ?? res.status, headers: res.headers });
  const h = out.headers;
  h.set("Content-Security-Policy", VEROM_CSP);          // replaces the parent site's CSP
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Frame-Options", "DENY");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  h.set("Strict-Transport-Security", "max-age=31536000");
  h.set("Cache-Control", cache);
  h.delete("Link");
  if (html) h.set("Content-Type", "text/html; charset=utf-8");
  if (isPreviewHost(host)) h.set("X-Robots-Tag", "noindex, nofollow");
  return out;
}

async function serveVerom(context, url) {
  const { request, env, next } = context;
  const path = url.pathname;
  const host = url.hostname;

  if (path.startsWith("/api/")) return next();           // Pages Functions (forms)
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  // canonical form: no trailing slash, no index.html, no .html
  let clean = path.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.replace(/\/+$/, "");
  if (clean !== path && VEROM_ROUTES.has(clean || "/")) {
    return Response.redirect(url.origin + (clean || "/") + url.search, 301);
  }

  if (VEROM_ROUTES.has(path)) {
    const res = await fetchAsset(env, url.origin, "/verom" + (path === "/" ? "/" : path + "/"));
    if (res.ok) return veromResponse(res, { cache: "public, max-age=0, must-revalidate", host, html: true });
  } else {
    const last = path.split("/").pop();
    if (last.includes(".") && !last.endsWith(".html") && !path.includes("..")) {
      const res = await fetchAsset(env, url.origin, "/verom" + path);
      const type = res.headers.get("Content-Type") || "";
      if (res.ok && !type.includes("text/html")) {
        const long = path.startsWith("/assets/");
        return veromResponse(res, { cache: long ? "public, max-age=604800" : "public, max-age=86400", host });
      }
    }
  }

  const nf = await fetchAsset(env, url.origin, "/verom/404.html");
  return veromResponse(nf, { status: 404, cache: "no-store", host, html: true });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  if (isVeromHost(url.hostname)) return serveVerom(context, url);
  // The Verom files and their source are not part of the personal site.
  if (url.pathname === "/verom" || url.pathname.startsWith("/verom/")) {
    const rest = url.pathname.replace(/^\/verom/, "") || "/";
    return Response.redirect(VEROM_ORIGIN + rest, 301);
  }
  if (url.pathname.startsWith("/verom-src")) return new Response("Not found", { status: 404 });

  const isPage = url.pathname === "/" || url.pathname === "/index.html";

  if (isPage && (request.method === "GET" || request.method === "HEAD") &&
      wantsMarkdown(request.headers.get("Accept"))) {
    const asset = await env.ASSETS.fetch(new URL("/index.md", url.origin));
    if (asset.ok) {
      const body = await asset.text();
      const tokens = Math.ceil(body.length / 4);
      return new Response(request.method === "HEAD" ? null : body, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "x-markdown-tokens": String(tokens),
          "Vary": "Accept",
          "Cache-Control": "public, max-age=300",
          "Link": '</.well-known/api-catalog>; rel="api-catalog"',
          "X-Content-Type-Options": "nosniff"
        }
      });
    }
  }

  const res = await next();
  if (isPage) {
    const out = new Response(res.body, res);
    out.headers.append("Vary", "Accept");
    return out;
  }
  return res;
}
