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

## Dev tooling: layout inspector (dev-only)

A single data engine powers two views — a **human panel** and a **machine API**
for AI models / console / Playwright. What you SEE is exactly what you can READ.

```
components/debug/engine.ts   the ONE model: DOM → normalized node tree
components/debug/report.ts   window.__gt machine API (dev global)
components/DebugOverlay.tsx  the human panel (same engine output)
styles/gt-dbg.css            panel/box styling (--gt-dbg-* custom props)
```

It can never ship: `DebugOverlay` is loaded through a compile-time-false
`next/dynamic` ternary in `app/layout.tsx` in production, so webpack folds the
import away entirely (verified: zero `gt-dbg` strings in prerendered HTML and
zero engine code in production client chunks).

### Human panel

The resting state is deliberately quiet: **one thin colored border per
container, no fills, no labels.** Numbers appear on hover; turn on the **Map**
to outline everything, or **Isolate** to dim all but the hovered subtree.

| Key | Action |
| --- | --- |
| `Ctrl+Shift+D` | Toggle overlay on/off |
| `Ctrl+Shift+E` | Cycle level: sections → containers → everything |
| `Ctrl+Shift+K` | Command palette |
| `Ctrl+Shift+I` | Isolate on/off |
| `Esc` | Turn off + unpin |
| click a box | Pin that section |
| `?debug=1` | Boot any route at a level (also `?debug=2`, `?debug=3`) |

The panel (top-left, translucent, collapsible via `▾`) has three tabs:

- **Inspect** — hovered/pinned element's full record: identity + React
  component name, geometry, box model + gap, stacking, type, colors with
  design-token resolution + contrast, image metadata, and the `:hover` CSS
  rules that apply to it.
- **Layers** — the containing section's layers in stacking order (z-index, then
  DOM depth), including `::before`/`::after` pseudo-layers, each flagged
  `Visible · Hidden · Covered · Off-screen · Clipped · Hover-effect`.
  Hover a row to spotlight it; nav/header/footer are treated as sections.
- **Page** — page health: state counts, non-token colors, low contrast,
  red-plate risks, missing alts, small tap targets, LCP element, headings,
  and a flagged list. **Export** mirrors `__gt.report()`.

State persists in `localStorage("gt:state")`. Decorative noise
(marquees/tickers, sub-pixel boxes) is filtered; mark any subtree
`data-debug-skip` to exclude it.

### Machine API — `window.__gt` (dev only)

Every answer is a function call returning plain JSON or a Markdown string, so
AI models can introspect a page without screenshots:

```js
__gt.help()                       // usage
__gt.report('md'|'json'|'text')  // full page report (health table + layer dump)
__gt.page()                       // { counts, headings, links, lcp, viewport }
__gt.nodes(true)                  // every node, serialized (re-scan with true)
__gt.issues()                     // flagged nodes with reasons
__gt.find('.cap-card')            // matching nodes
__gt.inspect(sel | nodeId)        // one node, fully detailed (incl. hoverRules)
__gt.layers('header')             // a section's layers in stacking order
__gt.covering(sel)                // what paints on top of an element
__gt.toggle() / .level(1|2|3) / .isolate(sel|null)  // drive the visual overlay
__gt.copy(text) / .download(name, text)             // export a report
```

Each node carries: `path` (re-findable selector), `kind`, `rect`/`docRect`,
`box` (margin/padding/border/gap), `stack` (z, position, context), `state[]`,
`type`, `color` (tokens + contrast + red-plate risk), `media`, `a11y`,
`hover`, `component` (React name) and parent/child ids.



## Deploy targets (generic)

- **Node VPS / container**: `npm ci && npm run build && npm start` behind
  nginx / Caddy. Set `NEXT_PUBLIC_SITE_URL` at build time.
- **Any Node PaaS** (Render, Railway, Fly.io, etc.): build command
  `npm run build`, start command `npm start`.
- No Vercel-specific config is used; `next.config.mjs` is portable.
