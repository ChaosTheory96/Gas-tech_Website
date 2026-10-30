/* ---------------------------------------------------------------------------
   410 Gone for the two legacy URLs the client retires with no successor
   (Redirects sheet, renovation-and-painting and portfolio-style-1).

   These cannot live in next.config redirects: a redirect may only carry a 3xx,
   and Next.js fails the build on statusCode 410. Issuing a real Gone here is
   what makes the signal work — a 301 onto /404/ would keep the URL in the index
   and pass no removal signal at all.
   --------------------------------------------------------------------------- */
import { NextResponse, type NextRequest } from "next/server";

/* One <style> block replaces the old inline style attribute (Phase 3: no
   invented inline values). This standalone legacy response cannot reference
   the site's compiled stylesheet from middleware by design, so the rules
   mirror token intent (measure ≈ --measure-prose, gutters ≈ --gutter, the
   --font-sans terminal fallback) as documented literals — classified as an
   audit exception in qa/_audit.mjs, not silent raw values. */
const BODY = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>410 Gone — Gastech Combustions</title>
<style>body{font-family:system-ui,sans-serif;max-width:38rem;margin:4rem auto;padding:0 1.5rem;line-height:1.6}</style></head>
<body>
<h1>410 Gone</h1>
<p>This page has been removed permanently and has no replacement address.</p>
<p>Current products, brands and contact details live at
<a href="/products/">/products/</a>, <a href="/brands/">/brands/</a> and
<a href="/contact-us/">/contact-us/</a>.</p>
</body></html>`;

export function middleware(_req: NextRequest) {
  return new NextResponse(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}

export const config = {
  matcher: ["/renovation-and-painting.html", "/portfolio-style-1.html"],
};
