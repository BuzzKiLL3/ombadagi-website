# ombadagi-website

Personal brand and consulting site for **Om Badagi** — Industry 4.0, Lean operational excellence, workflow automation, ERP and supply-chain process work.

Static site: HTML, CSS and vanilla JavaScript. **No build step, no framework, no backend, no dependencies.** Hosted free on Cloudflare Pages.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Page structure, SEO / social metadata, all 9 sections |
| `styles.css` | Design system (tokens at the top) and responsive layout |
| `data.js` | **All editable content and config** — email, LinkedIn, hero machines, capability pathways, machine-lab definitions, workflow scenarios, DMAIC phases |
| `ecosystem.js` | Hero: isometric connected factory (CNC, robot cell, press, pump & motor, conveyor, warehouse rack) with clickable machines and data flowing to business systems |
| `machines.js` | Section 03: multi-machine monitoring demo — each machine has its own signals, connectivity and simulated fault |
| `script.js` | Navigation, capability explorer, operations↔business workflow graph, DMAIC control chart, scroll reveals, email composer |
| `assets/favicon.svg` | Favicon |
| `assets/og-image.png` | Social-share preview image (1200×630) |
| `_headers` | Cloudflare Pages security headers + asset caching |

## Editing content

- **Email address / LinkedIn:** top of `data.js` (`email`, `linkedin`). The LinkedIn URL is also written in `index.html` (3 links + JSON-LD) — search for `om-badagi`.
- **Capability pathways, machines, workflows, DMAIC text:** `data.js`.
- **Headline, profile timeline, "why" section, contact topics:** `index.html`.
- **Colours / fonts / spacing:** CSS variables at the top of `styles.css`.

## Things to verify before publishing

- Profile timeline (dates, titles, Fives FCB wording). LinkedIn could not be read automatically.
- "Lean Green Belt" — confirm the exact credential name and issuer.
- The note that consulting is independent of your employer — keep it; check your employment contract allows outside activity.

## Honesty rules built into the site

- Every machine value, workflow and chart is generated in the browser and labelled **illustrative / simulated**. Machine types are examples of the kinds of equipment covered, not a list of past projects.
- No client logos, testimonials, statistics or results.
- No vendor-partner claims (ERP work is described as vendor-neutral).
- The contact form does **not** send anything to a server. It builds a pre-filled `mailto:` link that opens the visitor's own email app. Limitation: visitors without a configured mail app must copy the address shown. To receive form submissions directly later, add a free service (e.g. Cloudflare Pages Functions + an email API, or Formspree's free tier) and update `script.js`.

## Run locally

```bash
cd ombadagi-website
python3 -m http.server 8000
# open http://localhost:8000
```

Any static server works. Opening `index.html` directly also works.

## Deploy (Cloudflare Pages)

Connected to this GitHub repo. Settings:

- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: *(empty / `/`)*
- Production branch: **main**

Every push to `main` deploys to production. Pushes to other branches create a **preview URL** (`<branch>.ombadagi-website.pages.dev`) — use this to review changes before merging.

## Accessibility & performance

- Keyboard-operable tabs (arrow keys, Home/End), visible focus, skip link.
- `prefers-reduced-motion`: animations off, static settled states.
- Canvas animations pause when offscreen or when the tab is hidden; device-pixel ratio capped at 2.
- No external JS. Only external request: Google Fonts (IBM Plex Sans / Mono).
- No cookies, no analytics.
