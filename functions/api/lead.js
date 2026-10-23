/* =============================================================================
   POST /api/lead — Verom Solutions form submissions (contact, trial, interest)

   Delivery channels, tried in this order. Configure at least one in
   Cloudflare Pages → Settings → Variables and Secrets / Bindings:
     1. Email via Resend   RESEND_API_KEY (secret), LEAD_TO_EMAIL, LEAD_FROM_EMAIL (optional)
     2. Webhook            LEAD_WEBHOOK_URL (secret), LEAD_WEBHOOK_SECRET (optional secret)
     3. KV storage         binding named LEADS (also enables rate limiting and de-duplication)
   Optional spam check:    TURNSTILE_SECRET_KEY (secret) + turnstileSiteKey in verom-src/config.mjs

   If nothing is configured the endpoint answers 503 "not_configured" and the
   page tells the visitor to email instead. It never pretends to have sent.
   ============================================================================= */

const KINDS = {
  contact: { required: ["name", "email", "company", "country", "product", "message"] },
  trial: { required: ["name", "email", "company", "country"] },
  interest: { required: ["name", "email", "company", "country", "message"] }
};
const PRODUCTS = ["quotation-erp", "whatsapp-automation", "digital-twins", "custom-software", "other"];
const VOLUMES = ["", "1-10", "11-50", "51-200", "200+"];
const MAX = { name: 120, email: 160, company: 160, country: 80, product: 40, volume: 10, message: 4000 };
const EMAIL = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;
const ALLOWED_HOSTS = (h) => h === "verom.ombadagi.com" || h.endsWith(".ombadagi-website.pages.dev") || h === "localhost" || h === "127.0.0.1" || h.startsWith("verom.localhost");

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra }
});
const clean = (v) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "");

async function sha(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function onRequestPost({ request, env }) {
  // --- same-origin only
  const origin = request.headers.get("Origin");
  try { if (!origin || !ALLOWED_HOSTS(new URL(origin).hostname)) return json(403, { ok: false, error: "forbidden" }); }
  catch { return json(403, { ok: false, error: "forbidden" }); }
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return json(415, { ok: false, error: "unsupported_media_type" });

  const raw = await request.text();
  if (raw.length > 16000) return json(413, { ok: false, error: "too_large" });
  let input;
  try { input = JSON.parse(raw); } catch { return json(400, { ok: false, error: "invalid_json" }); }
  if (!input || typeof input !== "object") return json(400, { ok: false, error: "invalid_json" });

  // --- spam signals: honeypot and fill time (bots get a quiet "ok", nothing is delivered)
  const started = Number(input.startedAt);
  const elapsed = Date.now() - started;
  if (clean(input.website) || !Number.isFinite(started) || elapsed < 2500 || elapsed > 86400000) {
    return json(200, { ok: true });
  }

  // --- validation
  const kind = clean(input.kind);
  if (!KINDS[kind]) return json(400, { ok: false, error: "invalid", fields: ["kind"] });
  const d = {};
  for (const k of Object.keys(MAX)) d[k] = clean(input[k]);
  if (kind === "trial") d.product = "quotation-erp";
  if (kind === "interest") d.product = "whatsapp-automation";
  const bad = [];
  for (const k of KINDS[kind].required) if (!d[k]) bad.push(k);
  for (const k of Object.keys(MAX)) if (d[k].length > MAX[k]) bad.push(k);
  if (d.email && !EMAIL.test(d.email)) bad.push("email");
  if (d.product && !PRODUCTS.includes(d.product)) bad.push("product");
  if (!VOLUMES.includes(d.volume)) bad.push("volume");
  if (input.consent !== true) bad.push("consent");
  if (bad.length) return json(400, { ok: false, error: "invalid", fields: [...new Set(bad)] });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  // --- optional Turnstile verification
  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", clean(input["cf-turnstile-response"]));
    form.append("remoteip", ip);
    const v = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form }).then((r) => r.json()).catch(() => ({}));
    if (!v.success) return json(400, { ok: false, error: "verification_failed" });
  }

  // --- rate limiting and de-duplication (needs the LEADS KV binding)
  const kv = env.LEADS;
  if (kv) {
    const bucket = Math.floor(Date.now() / 600000);
    const rlKey = `rl:${await sha(ip)}:${bucket}`;
    const count = Number(await kv.get(rlKey)) || 0;
    if (count >= 5) return json(429, { ok: false, error: "rate_limited" }, { "Retry-After": "600" });
    await kv.put(rlKey, String(count + 1), { expirationTtl: 900 });
  }
  const dupKey = `dup:${await sha(kind + d.email.toLowerCase() + d.message)}`;
  if (kv && await kv.get(dupKey)) return json(200, { ok: true, duplicate: true });

  const lead = {
    kind, product: d.product, name: d.name, email: d.email, company: d.company, country: d.country,
    volume: d.volume || undefined, message: d.message || undefined,
    receivedAt: new Date().toISOString(), page: request.headers.get("Referer") || undefined
  };
  const subject = { contact: "New enquiry", trial: "Quotation ERP trial request", interest: "WhatsApp Automation interest" }[kind];
  const text = [
    `${subject} — Verom Solutions website`, "",
    `Name:     ${lead.name}`, `Email:    ${lead.email}`, `Company:  ${lead.company}`, `Country:  ${lead.country}`,
    `Product:  ${lead.product}`, lead.volume ? `Volume:   ${lead.volume} quotations/month` : null, "",
    lead.message ? `Message:\n${lead.message}` : null, "", `Received: ${lead.receivedAt}`
  ].filter((l) => l !== null).join("\n");

  let delivered = 0, attempted = 0;

  if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL) {
    attempted++;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.LEAD_FROM_EMAIL || "Verom Website <onboarding@resend.dev>",
        to: env.LEAD_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: lead.email,
        subject: `[Verom] ${subject}: ${lead.company}`.slice(0, 180),
        text
      })
    }).catch(() => null);
    if (r && r.ok) delivered++;
  }

  if (env.LEAD_WEBHOOK_URL) {
    attempted++;
    const headers = { "Content-Type": "application/json" };
    if (env.LEAD_WEBHOOK_SECRET) headers["X-Verom-Secret"] = env.LEAD_WEBHOOK_SECRET;
    const r = await fetch(env.LEAD_WEBHOOK_URL, { method: "POST", headers, body: JSON.stringify({ ...lead, text }) }).catch(() => null);
    if (r && r.ok) delivered++;
  }

  if (kv) {
    attempted++;
    try {
      await kv.put(`lead:${lead.receivedAt}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(lead), { expirationTtl: 60 * 60 * 24 * 365 });
      delivered++;
    } catch { /* counted as failed */ }
  }

  if (!attempted) return json(503, { ok: false, error: "not_configured" });
  if (!delivered) return json(502, { ok: false, error: "delivery_failed" });
  if (kv) await kv.put(dupKey, "1", { expirationTtl: 900 }).catch(() => {});
  return json(200, { ok: true });
}

// Any other method (POST is handled by onRequestPost above).
export async function onRequest() {
  return json(405, { ok: false, error: "method_not_allowed" }, { Allow: "POST" });
}
