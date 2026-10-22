# Gastech Combustions — Next.js Site

Production Next.js 14 (App Router) rebuild of the Gastech Combustions website,
carrying over the verified design system pixel-for-pixel and adding a complete
**SEO / AEO / GEO** layer. Deploy-ready on any Node host (not Vercel-locked).

## Quick start

```bash
npm install
cp .env.example .env      # optional locally; set NEXT_PUBLIC_SITE_URL in prod
npm run dev               # http://localhost:3000
```

## Production build & run

```bash
npm run build
npm start                 # serves the optimized build (default port 3000)
# or: npm run start -- -p 8080
```

The site renders fully static HTML (all routes are SSG), so it can also be
hosted behind any CDN / static host that can run a Node process, or exported.

## Environment

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for metadata, sitemap, JSON-LD. **Set this before building for production.** | Yes (prod) |
| `ENQUIRY_TO_EMAIL` / `ENQUIRY_TECHNICAL_EMAIL` | Documented for future transport wiring | No |

All defaults fall back to `https://gastechcombustions.in` in `lib/site.ts`.

## Routes

- `/` — home
- `/products` — range hub
- `/[slug]` — 8 data-driven product pages: `gas-burners`, `light-oil-burners`,
  `dual-fuel-burners`, `pf-regulators`, `flow-meters`, `safety-valves`,
  `gas-trains`, `gasvigil`
- `/brands`, `/delivery`, `/services`, `/contact`
- `/_not-found` — branded 404

## SEO / AEO / GEO

- **SEO**: per-route `buildMetadata()` (title, description, canonical, Open
  Graph, Twitter, robots, keywords), `app/sitemap.ts`, `app/robots.ts`,
  `app/manifest.ts`.
- **AEO**: `FAQPage` JSON-LD + a visible `<details>` FAQ accordion on every
  product page; crisp entity facts in the Organization graph.
- **GEO**: always-on `siteGraph()` (Organization + WebSite + LocalBusiness),
  plus `Product`, `Service`, `CollectionPage`/`ItemList` and `BreadcrumbList`
  per relevant route, and `/llms.txt` (`app/llms.txt/route.ts`).

## Design-fidelity notes

- The original cascade (`tokens.css`, `site.css`, `enhancements.css`,
  `fonts.css`) is imported verbatim via `app/globals.css` (`postcss-import`).
  Tailwind runs with `preflight:false` because `site.css` ships its own reset.
- `site.js` is not used. The client only ever adds `html.js-fx` (scroll-driven
  CSS reveal/parallax) — it never adds `.js`, so `[data-reveal]` content can
  never get stuck hidden. Nav behaviour, enquiry modal, carousels, scroll
  progress and page transitions are re-implemented as React components.
- Product photos are the live `gastechcombustions.in` images (kept as-is);
  `next.config.mjs` sets `images.unoptimized` so the `<img>` markup stays
  byte-faithful.

## Enquiry form (placeholder transport)

`app/api/enquiry/route.ts` validates required fields, honours the honeypot, and
currently **logs the lead server-side** then returns `{ ok: true }` so the whole
"Thank you" flow works with no third party. The client has their own mailboxes
(`sales@` / `technical@`). When a transport is decided, wire ONE branch in the
marked `TODO(transport)` block (SMTP / Resend / Formspree) — the payload shape
is already stable, so no front-end changes are needed.

## Deploy targets (generic)

- **Node VPS / container**: `npm ci && npm run build && npm start` behind
  nginx / Caddy. Set `NEXT_PUBLIC_SITE_URL` at build time.
- **Any Node PaaS** (Render, Railway, Fly.io, etc.): build command
  `npm run build`, start command `npm start`.
- No Vercel-specific config is used; `next.config.mjs` is portable.
