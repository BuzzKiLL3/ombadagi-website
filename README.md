# ombadagi-website

Personal brand site for **Om Badagi**: engineering intelligence, Industry 4.0, operational excellence and automation for manufacturers.

Static site: HTML, CSS and vanilla JavaScript. **No build step, no framework, no dependencies, no backend.** Hosted free on Cloudflare Pages.

## Files

| File | Purpose |
|---|---|
| `index.html` | All sections, SEO and social metadata |
| `styles.css` | Design system (colour and type tokens at the top) and responsive layout |
| `data.js` | **Editable content and config**: email, LinkedIn, media URLs, machine gallery, approach steps, credits |
| `app.js` | Hero intro and video, navigation, custom cursor, magnetic buttons, parallax, image reveals, machine gallery, capability image-follow, approach stepper, email composer |
| `instrument.js` | The interactive demonstration (gauge, OEE, workflow). All values are simulated in the browser |
| `assets/favicon.svg` | Favicon |
| `_headers` | Cloudflare Pages security headers (CSP allows Unsplash/Pexels media) |
| `robots.txt`, `sitemap.xml` | Basic SEO |

## Cloudflare Pages settings

- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: *(leave empty, or `/`)*
- Production branch: **main**

Every push to `main` deploys to production. Pushes to other branches get a preview URL.

## Media and licences

All photos and footage are free-licence media, loaded from the provider's CDN:

- **Hero video:** "A machine is cutting metal with a metal cutting tool", by Daniel Smyth, [Pexels](https://www.pexels.com/video/a-machine-is-cutting-metal-with-a-metal-cutting-tool-9033891/), under the Pexels License.
- **Photos:** 16 images from Unsplash under the Unsplash License. Photographers and links are listed in `data.js` (`credits`) and in the site footer under "Image & video credits".

Both licences allow free commercial use without attribution. Credits are shown anyway.

### Self-hosting the media (optional, recommended later)

1. Download the 720p (1280×720) file from the Pexels page above.
2. Save it as `assets/media/hero.mp4`.
3. In `data.js`, set `heroVideo: "assets/media/hero.mp4"`.

To self-host photos, download them the same way and point the `src` attributes or the `img` ids in `data.js` at local files.

### Video behaviour

- The video autoplays muted and looped, with `playsinline`.
- It only loads on screens 700 px and wider, when the visitor has no data-saver setting and no reduced-motion preference.
- Phones and reduced-motion visitors see the poster image instead.
- If the video fails to load, the poster stays.

## Editing

> **After changing `styles.css` or any `.js` file, bump the `?v=` number on its `<link>`/`<script>` tag in `index.html`.** Cloudflare tells browsers to cache CSS/JS for 4 hours; a new `?v=` forces phones and laptops to fetch the new file immediately.

- **Email, LinkedIn, gallery, approach steps:** edit `data.js`.
- **Headline, philosophy, capabilities, about, contact text:** edit `index.html`.
- **Colours and fonts:** edit the variables at the top of `styles.css`.

## Honesty rules built in

- The demonstration and every machine reading are labelled as **simulated**.
- The machine gallery is labelled as illustrative application examples.
- There are no client logos, testimonials, statistics or promised savings.
- The ERP work is described as vendor-neutral.
- The employer is mentioned only as professional history, with an independence note.
- The contact form sends nothing to a server. It opens a pre-filled email in the visitor's own mail app (`mailto:`).
  - Limitation: visitors without a mail app must copy the address shown.
  - To receive submissions directly later, add a free form service or a Cloudflare Pages Function and update the submit handler in `app.js`.

## Before publishing, verify

- The profile facts in the About section (dates, titles, the "Lean Green Belt" credential wording). LinkedIn could not be read automatically.
- That your employment contract allows outside consulting.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Accessibility and performance

- Semantic sections, a skip link, labelled controls, and keyboard-operable tabs (arrow keys).
- Visible focus.
- `prefers-reduced-motion` gives static states: no video, no parallax, no custom cursor.
- The custom cursor only appears on mouse devices. Touch devices keep native behaviour.
- Images below the fold are lazy-loaded with responsive `srcset`.
- Animations pause when off-screen.
- No external JavaScript, no cookies, no analytics.
