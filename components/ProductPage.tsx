/* ---------------------------------------------------------------------------
   Product page renderer. One implementation shared by every product route,
   whatever depth its URL sits at under the client scheme (/products/burners/...,
   /products/gas-regulation/..., /brands/..., /gas-trains/). Content lives here
   only, never duplicated per route folder.
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE, BRAND, GASTECH_SCOPE } from "@/lib/site";
import { getProduct, type Product } from "@/lib/products";
import { productGraph } from "@/lib/schema";
import { SectionHead, JsonLd } from "@/components/blocks";
import { BrandLockup } from "@/components/BrandLockup";
import { Carousel } from "@/components/carousel";
import { EnquiryButton } from "@/components/enquiry";
import FaqAccordion from "@/components/FaqAccordion";
import DatasheetRange from "@/components/DatasheetRange";
import SpecTable from "@/components/SpecTable";
import KeyValueTable from "@/components/KeyValueTable";
import SpecStats from "@/components/SpecStats";
import ArchChart from "@/components/ArchChart";
import TypeTiles from "@/components/TypeTiles";

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
  const gt = p.slug === "gas-trains"; // red emphasis panels
  const hasRange = p.variants.length > 0 || !!p.types;
  const red = gt ? " p-panel p-panel--red" : "";
  // enquiry-card facts: the brand plus the hero figures, equal labels merged
  const factMap = new Map<string, string[]>([["Brand", [p.brand]]]);
  p.specs.forEach((s) => factMap.set(s.label, [...(factMap.get(s.label) ?? []), s.value]));
  const facts = Array.from(factMap, ([k, v]): [string, string] => [k, v.join(", ")]);

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
        <section className={`p-hero${p.brand === BRAND.pf.name ? " p-hero--usp p-hero--pf" : p.slug === "gas-trains" ? " p-hero--usp p-hero--gt" : ""}`}>
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
                <BrandLockup inline ids={p.brandIds} label="Brands" />
              </div>
              <h1>{p.h1}</h1>
              <p className="p-lead">{p.lead}</p>
              <SpecStats specs={p.specs} />
              <div className="cta-dual">
                <a className="btn btn--primary" href={hasRange ? "#range" : "#specs"}>See the range</a>
                <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss technical specs</EnquiryButton>
              </div>
            </div>

            <Carousel
              className="pcar"
              viewportClassName="pcar-viewport"
              trackClassName="pcar-track"
              maxPerView={1}
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

        <div className="wrap p-body">
          <div className="p-main">
            {/* MODEL RANGE */}
            {p.variants.length > 0 && (
              <section className="p-sec" id="range">
                <SectionHead eyebrow={p.modelEyebrow} title={p.modelTitle} sub={p.modelSub} />
                <DatasheetRange variants={p.variants} cols={p.grid} />
              </section>
            )}
            {p.types && (
              <section className="p-sec" id="range">
                <SectionHead eyebrow={p.modelEyebrow} title={p.modelTitle} sub={p.modelSub} />
                <TypeTiles types={p.types} brand={p.brand} />
              </section>
            )}

            {/* ARCH CHART (real per-family design pressure, pressure-regulators only) */}
            {archData && archData.length >= 2 && (
              <section className="p-sec" id="design">
                <SectionHead
                  eyebrow="Design pressure"
                  title={<>Three families, <u>drawn to scale.</u></>}
                  sub="Arch height is linear to the maximum design pressure of each Pietro Fiorentini regulator family."
                />
                <ArchChart data={archData} note="Linear scale · bar, max design pressure per family" />
              </section>
            )}

            {/* ASSEMBLY (gas trains) */}
            {p.assembly && (
              <section className={`p-sec${red}`} id="assembly">
                <SectionHead eyebrow="Assembly" title={<>What goes into the train.</>} sub="A complete skid-mounted assembly, incorporating the control and safety devices your application requires." />
                <DatasheetRange variants={p.assembly} flow />
              </section>
            )}

            {/* COMPARISON TABLE */}
            {p.columns && (
              <section className="p-sec" id="compare">
                <SectionHead eyebrow={p.specEyebrow} title={p.specTitle} />
                <SpecTable columns={p.columns} />
              </section>
            )}

            {/* SPECIFICATIONS (key/value table) */}
            <section className="p-sec" id="specs">
              <SectionHead eyebrow={p.columns ? "At a glance" : p.specEyebrow} title={p.columns ? "Selection notes." : p.specTitle} />
              <KeyValueTable rows={p.specRows} />
              <p className="p-scope"><b>Gastech scope.</b> {GASTECH_SCOPE}</p>
            </section>

            {/* HYDROGEN (client item 4: regulation for up to 100% H2) */}
            {p.hydrogen && (
              <section className="p-sec p-panel p-panel--tint" id="hydrogen">
                <SectionHead eyebrow={p.hydrogen.eyebrow} title={p.hydrogen.title} sub={p.hydrogen.sub} />
                <KeyValueTable rows={p.hydrogen.rows} />
              </section>
            )}

            {/* FAQ (AEO / GEO) */}
            <section className={`p-sec${red}`} id="faq" aria-labelledby="faq-h">
              <SectionHead eyebrow="Questions" title={<>Common questions <u>answered.</u></>} />
              <FaqAccordion faqs={p.faq} />
            </section>
          </div>

          {/* ENQUIRE: sticky beside the range, specs and FAQ */}
          <aside className="p-side" id="enquire" aria-label="Enquire">
            <h3>Get the right {p.navLabel.toLowerCase()}</h3>
            <p>Ask for a quotation, or reach a technical engineer for custom products, specifications and sizing.</p>
            <EnquiryButton className="btn btn--primary" type="sales" product={p.h1}>Request a quote</EnquiryButton>
            <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss technical specs</EnquiryButton>
            <dl className="p-side-facts">
              {facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </aside>
        </div>

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
        <div className="p-mbar">
          <EnquiryButton className="btn btn--primary" type="sales" product={p.h1}>Request a quote</EnquiryButton>
          <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss</EnquiryButton>
        </div>
      </main>
    </>
  );
}
