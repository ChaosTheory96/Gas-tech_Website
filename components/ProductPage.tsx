/* ---------------------------------------------------------------------------
   Product page renderer. One implementation shared by every product route,
   whatever depth its URL sits at under the client scheme (/products/burners/...,
   /products/gas-regulation/..., /brands/..., /gas-trains/). Content lives here
   only, never duplicated per route folder.
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getProduct, type Product } from "@/lib/products";
import { productGraph } from "@/lib/schema";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { Carousel } from "@/components/carousel";
import { EnquiryButton } from "@/components/enquiry";
import FaqAccordion from "@/components/FaqAccordion";
import DatasheetRange from "@/components/DatasheetRange";
import SpecTable from "@/components/SpecTable";
import KeyValueTable from "@/components/KeyValueTable";
import SpecStats from "@/components/SpecStats";
import ArchChart from "@/components/ArchChart";

/**
 * Breadcrumb parents. Only hubs that actually exist are linked, so a product
 * nested three levels deep never advertises an unbuilt category page.
 */
export function productCrumbs(p: Product) {
  const hub = p.route.startsWith("/brands/")
    ? { name: "Brands", href: "/brands/" }
    : { name: "Products", href: "/products/" };
  return [
    { name: "Home", href: "/" },
    hub,
    { name: p.navLabel, href: p.route },
  ];
}

export function productMetadata(p: Product) {
  return buildMetadata({
    title: p.metaTitle,
    description: p.metaDescription,
    path: p.route,
    image: p.slides[0]?.src ?? "/assets/gc-logo-flat.png",
    keywords: [p.brand, p.navLabel, p.h1, "Gastech Combustions", "Pune"],
  });
}

/** Route segments for a product path, minus its owning prefix, for [...slug] params. */
export function segmentsUnder(p: Product, prefix: string): string[] {
  return p.route.slice(prefix.length).replace(/\/$/, "").split("/");
}

export default function ProductPage({ p }: { p: Product }) {
  const crumbs = productCrumbs(p);
  const related = p.related.map(getProduct).filter(Boolean) as Product[];

  // C / arch chart: regulator families compared by max design pressure.
  // Values are parsed from the REAL variant sub-copy ("Up to 102 bar …"),
  // never invented. Only pressure-regulators carries three comparable pressure families.
  const archData =
    p.slug === "pressure-regulators"
      ? (p.variants
          .map((v) => {
            const m = /([\d.]+)\s*bar/.exec(v.sub ?? "");
            return m
              ? { value: parseFloat(m[1]), unit: "bar", name: v.title, sub: v.kicker }
              : null;
          })
          .filter(Boolean) as { value: number; unit: string; name: string; sub?: string }[])
      : null;

  return (
    <>
      {/* Sheet-exact graph: each product route emits only the types listed in
          its SEO Meta row (see lib/schema.ts productGraph). */}
      <JsonLd data={productGraph(p, crumbs)} />
      <main id="main">
        {/* PRODUCT HERO */}
        <section className="p-hero">
          <div className="wrap p-hero-grid">
            <div className="p-hero-copy" data-reveal>
              <nav className="p-crumb" aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                  <span key={c.href}>
                    {i > 0 && <span aria-hidden="true"> / </span>}
                    {i < crumbs.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span>{c.name}</span>}
                  </span>
                ))}
              </nav>
              <div className="p-brandline">
                <span className="tag">{p.brandline[0]}</span>
                <span className="rule" />
                <span className="tag">{p.brandline[1]}</span>
              </div>
              <h1>{p.h1}</h1>
              <p className="p-lead">{p.lead}</p>
              <SpecStats specs={p.specs} />
              <div className="cta-dual">
                <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss technical specs</EnquiryButton>
              </div>
              {/* margin-top promoted to the .p-callnote polish rule (Phase 3) */}
              <p className="p-callnote">
                or call <a href={SITE.contact.phonePrimaryHref}>{SITE.contact.phonePrimary}</a>
              </p>
            </div>

            <Carousel
              className="pcar"
              viewportClassName="pcar-viewport"
              trackClassName="pcar-track"
              maxPerView={1}
              autoplayMs={6000}
              captions={p.slides.map((s) => s.cap)}
              slides={p.slides.map((s) => (
                <div className="pcar-slide" key={s.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                </div>
              ))}
            />
          </div>
        </section>

        <Marquee />

        {/* MODEL RANGE */}
        <section className="sec sec--tint">
          <div className="wrap">
            <SectionHead eyebrow={p.modelEyebrow} title={p.modelTitle} sub={p.modelSub} />
            <DatasheetRange variants={p.variants} />
          </div>
        </section>

        {/* ARCH CHART (real per-family design pressure — pressure-regulators only) */}
        {archData && archData.length >= 2 && (
          <section className="sec">
            <div className="wrap">
              <SectionHead
                eyebrow="Design pressure"
                title={<>Three families, <u>drawn to scale.</u></>}
                sub="Arch height is linear to the maximum design pressure of each Pietro Fiorentini regulator family."
              />
              <ArchChart data={archData} note="Linear scale · bar, max design pressure per family" />
            </div>
          </section>
        )}

        {/* ASSEMBLY (gas trains) */}
        {p.assembly && (
          <section className="sec sec--sunken">
            <div className="wrap">
              <SectionHead eyebrow="Assembly" title={<>What goes into the train.</>} sub="A complete skid-mounted assembly, incorporating the control and safety devices your application requires." />
              <DatasheetRange variants={p.assembly} />
            </div>
          </section>
        )}

        {/* COMPARISON TABLE */}
        {p.columns && (
          <section className="sec sec--sunken">
            <div className="wrap">
              <SectionHead eyebrow={p.specEyebrow} title={p.specTitle} />
              <SpecTable columns={p.columns} />
            </div>
          </section>
        )}

        {/* SPECIFICATIONS (key/value table) */}
        <section className={p.columns ? "sec" : "sec sec--sunken"}>
          <div className="wrap">
            <SectionHead eyebrow={p.columns ? "At a glance" : p.specEyebrow} title={p.columns ? "Selection notes." : p.specTitle} />
            <KeyValueTable rows={p.specRows} />
          </div>
        </section>

        {/* FAQ (AEO / GEO) */}
        <section className="sec sec--tint" id="faq" aria-labelledby="faq-h">
          <div className="wrap">
            <SectionHead eyebrow="Questions" title={<>Common questions <u>answered.</u></>} />
            <FaqAccordion faqs={p.faq} />
          </div>
        </section>

        {/* ENQUIRE BAND */}
        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title={<>Get the right {p.navLabel.toLowerCase()}, or talk it through.</>} sub="Ask for a quotation, or reach a technical engineer for custom products, specifications and sizing." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product={p.h1}>Request a quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss technical specs</EnquiryButton>
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="sec sec--sunken">
            <div className="wrap">
              <SectionHead eyebrow="Explore more" title={<>Related products.</>} />
              <div className="rel-grid" data-stagger>
                {related.map((r) => (
                  <Link className="rel-card" key={r.slug} href={r.route} scroll={false}>
                    <div className="rc-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={r.slides[0]?.src} alt={r.slides[0]?.alt ?? r.h1} loading="lazy" decoding="async" /></div>
                    <div className="rc-body"><span>{r.brand}</span><h3>{r.navLabel}</h3></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
