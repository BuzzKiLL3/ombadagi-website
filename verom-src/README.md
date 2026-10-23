# Verom Solutions website — verom.ombadagi.com

Business site for **Verom Solutions**, kept separate from the personal site ombadagi.com but deployed from this same repository and Cloudflare Pages project.

## How it works

| Piece | What it does |
|---|---|
| `verom-src/content/en.mjs` | **All site text**, product descriptions, feature status, form labels |
| `verom-src/config.mjs` | Business facts: contact email, legal/registration details, Turnstile key, dates |
| `verom-src/assets/verom.css` | Design system (tokens at the top) and all component styles |
| `verom-src/assets/verom.js` | Navigation, form validation and submission, illustrative animations |
| `verom-src/build.mjs` | Generates the static site into `/verom` (no dependencies) |
| `verom-src/make-images.py` | Renders `og.png` and the PNG icons (needs Playwright + Chromium) |
| `verom-src/check.mjs` | Pre-push checks: metadata, sitemap, route sync, localhost links, secret-like strings |
| `functions/_middleware.js` | Serves `/verom` when the hostname starts with `verom.`; adds Verom security headers; leaves ombadagi.com untouched |
| `functions/api/lead.js` | `POST /api/lead` — receives the contact, trial and interest forms |

The generated `/verom` folder is committed, so Cloudflare Pages still needs **no build command**.

On ombadagi.com, any `/verom/...` address redirects to `https://verom.ombadagi.com/...`, and `/verom-src/...` returns 404, so the personal site never shows Verom content.

## Editing

```bash
node verom-src/build.mjs     # regenerate /verom after any change in verom-src
node verom-src/check.mjs     # must print ✓ before you push
# only if the logo or social image changes:
python3 verom-src/make-images.py
```

Adding a page: add its path to `ROUTES` in `build.mjs` **and** to `VEROM_ROUTES` in `functions/_middleware.js` (the check fails if they differ).

Adding French later: copy `content/en.mjs` to `content/fr.mjs`, have it translated properly, add `"fr"` to `config.locales`, and extend `build()` to write `/fr/...` pages with `hreflang` links.

## Going live on verom.ombadagi.com (one-time, in Cloudflare)

The DNS change is yours to approve, so it was not made automatically.

1. Cloudflare dashboard → **Workers & Pages** → project **ombadagi-website** → **Custom domains** → **Set up a custom domain**.
2. Enter `verom.ombadagi.com` → **Continue** → **Activate domain**. Because ombadagi.com is already on Cloudflare, this adds a single `CNAME verom → ombadagi-website.pages.dev` record. No existing record is changed.
3. Wait for the status to show **Active** (SSL is issued automatically, usually within minutes).
4. Open https://verom.ombadagi.com and check the home page loads.

Before the domain is attached, the site can be previewed at `https://verom.ombadagi-website.pages.dev` (the `verom` branch preview). Preview hosts send `X-Robots-Tag: noindex`, so they are not indexed.

## Activating the forms

Until a delivery channel is configured, the forms answer honestly: the visitor sees *"Online form delivery is not active yet"* and a pre-filled email link to `contactEmail`. Nothing is silently dropped.

Configure at least one channel in **Pages project → Settings → Variables and Secrets** (Production), then redeploy:

| Name | Type | Required | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | Secret | For email | API key from resend.com (free tier) |
| `LEAD_TO_EMAIL` | Text | For email | Where submissions go, e.g. `contact@ombadagi.com` (comma-separate several) |
| `LEAD_FROM_EMAIL` | Text | Optional | Sender. Default `onboarding@resend.dev`, which only delivers to your own Resend account email. After verifying `ombadagi.com` in Resend, use e.g. `Verom Website <leads@ombadagi.com>` |
| `LEAD_WEBHOOK_URL` | Secret | Optional | POST each submission as JSON (Google Apps Script, Make, Zapier, Slack workflow…) |
| `LEAD_WEBHOOK_SECRET` | Secret | Optional | Sent as `X-Verom-Secret` header so the webhook can verify the sender |
| `LEADS` | KV binding | Recommended | **Settings → Bindings → KV namespace**, variable name `LEADS`. Stores every submission for 12 months and enables rate limiting (5 per 10 min per IP) and duplicate suppression |
| `TURNSTILE_SECRET_KEY` | Secret | Optional | Cloudflare Turnstile server key; also set `turnstileSiteKey` in `config.mjs` and rebuild |

Simplest free setup: **Resend** (email to you) + **KV** `LEADS` (backup copy and rate limiting).

Spam protection already active without configuration: hidden honeypot field, minimum fill time, same-origin check, server-side validation, body size limit.

## External services

| Service | Status | Needed for |
|---|---|---|
| Cloudflare Pages | Already used | Hosting, functions |
| Cloudflare DNS | Already used | `verom` CNAME (step above) |
| Resend (or a webhook target) | Not configured | Receiving form submissions by email |
| Cloudflare KV | Not configured | Storing submissions, rate limiting |
| Cloudflare Turnstile | Optional | Extra bot protection |
| Cloudflare Web Analytics | Optional | Cookieless page analytics |

## Analytics

None installed, no cookies, so no consent banner is needed. Every main button carries a `data-track` name and form successes call `veromTrack("lead_submitted", …)`, which fires a `verom:track` DOM event. To measure:

- **Page views:** turn on Cloudflare Web Analytics for the Pages project (cookieless). Add `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` in `VEROM_CSP` if Cloudflare injects the beacon.
- **Button and form events:** listen for `verom:track` in `verom.js` and forward to your analytics tool. If that tool sets cookies, add a real consent mechanism first.

## SEO

- Unique title, description, canonical, Open Graph and Twitter tags on every page; `Organization`, `WebSite`, `SoftwareApplication` (no price, no ratings) and `BreadcrumbList` structured data.
- `https://verom.ombadagi.com/sitemap.xml` and `robots.txt` are generated.

**Google Search Console** (after the domain is live):
1. Go to search.google.com/search-console → **Add property** → **URL prefix** → `https://verom.ombadagi.com/`.
2. Verify with the **HTML tag** method: add the meta tag to `head()` in `build.mjs`, rebuild, push, then click **Verify**. (Or use a **Domain** property for `ombadagi.com` with a DNS TXT record, which covers both sites.)
3. **Sitemaps** → submit `https://verom.ombadagi.com/sitemap.xml`.
4. **URL inspection** → request indexing for the home page and the Quotation ERP page.

Indexing and ranking are decided by Google; nothing here guarantees them.

## Quotation ERP feature status

Source: the QuoteForge status note of 16 October 2026 (the application code itself was not available to inspect here). Feature cards on the site use the same classification:

| Feature | Status on site | Basis |
|---|---|---|
| Configurable calculation engine (formula language, traceability) | In current build | Core engine, 31 tests passing |
| Costing and pricing | In current build | Core engine; sample rates only |
| Quotation workflow (statuses) | In current build | Core engine |
| PDF quotations | In current build | Core engine PDF writer |
| Industry configuration packs | In current build | Two packs exist |
| Structured enquiry intake | In current build | Core engine |
| Windows desktop app with local database | In validation | Never compiled yet; first Windows build pending |
| Device licensing and audit log | In validation | TPM path unproven on hardware |
| Product and supplier catalogue UI | Planned | Not built |
| Document extraction (OCR) | Planned | Not built |

Customer management, taxes and discounts, search/filter and exports are **not** claimed, because they are not in the status note. The product is called **V1.1** on the site as requested; the status note calls the build v0.1.0. Update `features` in `content/en.mjs` when either changes.

## Unfinished / next steps

- Attach `verom.ombadagi.com` (above), then configure a form channel and send a test submission.
- Add verified Udyam number, GSTIN, registered address and governing law in `config.mjs`.
- Have the Privacy Policy and Terms reviewed (both pages are marked as starter text).
- Consider a dedicated business address such as `contact@ombadagi.com` (Cloudflare Email Routing, free) instead of the personal address.
- Pricing section: intentionally absent until real prices exist.
- French version: structure ready, translation not done.
