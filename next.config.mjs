/** @type {import('next').NextConfig} */

/* ---------------------------------------------------------------------------
   URL scheme, exactly as the client's build sheet defines it: nested paths,
   trailing slash on every URL (Tech SEO Checklist: "Trailing slash everywhere").

   Two rules hold here:
     1. Every path comes from one place — lib/products.ts `route` and lib/site.ts.
     2. No URL is reachable by two paths — the slash-only moves are handled by
        trailingSlash itself, and only pages that actually exist get a 301, so a
        legacy URL can never land on a 404.
   --------------------------------------------------------------------------- */

const nextConfig = {
  reactStrictMode: true,
  // Deploy-ready on any Node host (next start) or a static target if desired.
  // External product imagery is served hotlinked via plain <img>, so the image
  // optimizer is left disabled to keep the build host-agnostic and dependency-free.
  images: { unoptimized: true },

  /* Normalises every URL to its trailing-slash form with a 308. This alone covers
     the four moves where only the slash changed: /products, /brands, /services
     and /gas-trains. It also makes /foo/ and /foo/ the same page, never two. */
  trailingSlash: true,

  async redirects() {
    /* Sheet-conformance note (build sheet P52/P53): the client plan splits gas
       safety into /products/gas-regulation/slam-shut-safety-valves/ and
       /products/gas-regulation/relief-valves/. Neither page is in the current
       build scope, so the consolidated /products/gas-regulation/safety-valves/
       page (slam shut-off + relief + governors, one comparison table) stays as
       the single live route. When the split pages ship, safety-valves 301s to
       slam-shut and the governors rows move to their P20 page. */
    /* Every rule below carries statusCode 301 explicitly. `permanent: true` on
       its own would emit a 308, and the client's Redirects sheet asks for 301s
       that are kept for at least 12 months. */
    return [
      /* ---- Internal scheme migration ------------------------------------
         Paths whose location genuinely changed, so the old live URL must not
         404. The slash-only moves are not listed here: trailingSlash already
         covers them. */
      { source: "/gas-burners", destination: "/products/burners/gas-burners/", permanent: false, statusCode: 301 },
      { source: "/light-oil-burners", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/dual-fuel-burners", destination: "/products/burners/dual-fuel-burners/", permanent: false, statusCode: 301 },
      { source: "/pf-regulators", destination: "/products/gas-regulation/pressure-regulators/", permanent: false, statusCode: 301 },
      { source: "/flow-meters", destination: "/products/gas-measurement/flow-meters/", permanent: false, statusCode: 301 },
      { source: "/safety-valves", destination: "/products/gas-regulation/safety-valves/", permanent: false, statusCode: 301 },
      { source: "/gasvigil", destination: "/brands/gasvigil/", permanent: false, statusCode: 301 },
      { source: "/contact", destination: "/contact-us/", permanent: false, statusCode: 301 },
      { source: "/delivery", destination: "/how-we-work/", permanent: false, statusCode: 301 },
      { source: "/how-we-deliver", destination: "/how-we-work/", permanent: false, statusCode: 301 },

      /* ---- Legacy .html 301s (Redirects sheet) --------------------------
         Activated only where the new target exists on this site today. */

      // Core pages
      { source: "/home.html", destination: "/", permanent: false, statusCode: 301 },
      { source: "/1.html", destination: "/products/", permanent: false, statusCode: 301 },
      { source: "/contact-us.html", destination: "/contact-us/", permanent: false, statusCode: 301 },
      { source: "/product-services.html", destination: "/services/", permanent: false, statusCode: 301 },
      { source: "/gasvigil.html", destination: "/brands/gasvigil/", permanent: false, statusCode: 301 },

      // Gas burners — the three staged/modulating pages merged into one
      { source: "/gas-burners.html", destination: "/products/burners/gas-burners/", permanent: false, statusCode: 301 },
      { source: "/gas-burner-one-stage.html", destination: "/products/burners/gas-burners/", permanent: false, statusCode: 301 },
      { source: "/gas-burner-two-stage.html", destination: "/products/burners/gas-burners/", permanent: false, statusCode: 301 },
      { source: "/gas-burner-modulating.html", destination: "/products/burners/gas-burners/", permanent: false, statusCode: 301 },

      // Oil burners — light and heavy, all merged into one page
      { source: "/light-oil.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/light-oil-one-stage.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/light-oil-two-stage.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/light-oil-three-stage.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/light-oil-modulating.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/heavy-oil-burners-in-india.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/heavy-oil-burners-in-india-two-stage.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },
      { source: "/heavy-oil-burners-in-india-modulating.html", destination: "/products/burners/oil-burners/", permanent: false, statusCode: 301 },

      // Dual fuel burners — merged into one page
      { source: "/dual-fuel.html", destination: "/products/burners/dual-fuel-burners/", permanent: false, statusCode: 301 },
      { source: "/dual-fuel-two-stage.html", destination: "/products/burners/dual-fuel-burners/", permanent: false, statusCode: 301 },
      { source: "/dual-fuel-modulating.html", destination: "/products/burners/dual-fuel-burners/", permanent: false, statusCode: 301 },

      // Gas measurement
      { source: "/gas-flow-meter.html", destination: "/products/gas-measurement/flow-meters/", permanent: false, statusCode: 301 },

      // About Us (P02) is live on /about-us/, so the old page's URL now 301s
      { source: "/about-us.html", destination: "/about-us/", permanent: false, statusCode: 301 },

      /* ---- Removed pages: 410 Gone --------------------------------------
         Template leftovers with no successor. Not declared here because a
         redirect can only carry 3xx: Next.js rejects statusCode 410 at build
         time. The two Gone URLs are answered by middleware.ts instead. */

      /* ---- Pending 301s — NOT activated -----------------------------------
         Each target below is a page the sheet plans but has not been built or
         approved yet. A 301 onto a 404 is worse than no redirect at all, so
         these stay dormant and move into the active block the day their page
         ships. One uncommented line per shipped page.

         { source: "/services.html",                 destination: "/brands/riello/" }                                P11
         { source: "/4.html",                        destination: "/brands/riello/" }                                P11
         { source: "/Energeia.html",                 destination: "/brands/energeia/" }                              unbuilt brand page
         { source: "/pietro-fiorentini.html",        destination: "/brands/pietro-fiorentini/" }                     P12
         { source: "/gasproducts.html",              destination: "/brands/pietro-fiorentini/" }                     P12
         { source: "/hydrogenproducts.html",         destination: "/brands/pietro-fiorentini/hydrogen-ready/" }      unbuilt model page
         { source: "/norval.html",                   destination: "/brands/pietro-fiorentini/norval-regulators/" }   unbuilt model page
         { source: "/dival-600.html",                destination: "/brands/pietro-fiorentini/dival-regulators/" }    unbuilt model page
         { source: "/industrial-burners.html",       destination: "/products/burners/industrial-burners/" }          unbuilt
         { source: "/special-burners.html",          destination: "/products/burners/special-burners/" }             unbuilt
         { source: "/special-burners-intensive-high-medium-speed-concrete-casting-chamber.html",
                                                    destination: "/products/burners/special-burners/" }              merged, page unbuilt
         { source: "/special-burners-intensive-high-medium-speed-silicone-carbide-cone.html",
                                                    destination: "/products/burners/special-burners/" }              merged, page unbuilt
         { source: "/special-burners-medium-temp-radiant-tube.html",
                                                    destination: "/products/burners/special-burners/" }              merged, page unbuilt
         { source: "/special-burners-high-ratio-regulation.html",
                                                    destination: "/products/burners/special-burners/" }              merged, page unbuilt
         { source: "/special-burners-burner-air-duct-module.html",
                                                    destination: "/products/burners/special-burners/" }              merged, page unbuilt
         { source: "/im-tm-turbine-meter.html",      destination: "/products/gas-measurement/turbine-meters/" }      P62
         { source: "/im-rm.html",                    destination: "/products/gas-measurement/rotary-meters/" }       P63
         { source: "/electronic-gas-volume.html",    destination: "/products/gas-measurement/evc/" }                 P64
         { source: "/error.html",                    destination: "/404/" }                                          handled by not-found.tsx
      */
    ];
  },
};

export default nextConfig;
