import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { PRODUCTS, getProduct, type Variant } from "@/lib/products";
import { productSchema, faqSchema, breadcrumbSchema, siteGraph } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { Carousel } from "@/components/carousel";
import { EnquiryButton } from "@/components/enquiry";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Ctx = { params: { slug: string } };

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const p = getProduct(params.slug);
  if (!p) return {};
  return buildMetadata({
    title: p.metaTitle,
    description: p.metaDescription,
    path: `/${p.slug}`,
    image: p.slides[0]?.src ?? "/assets/gc-logo-flat.png",
    keywords: [p.brand, p.navLabel, p.h1, "Gastech Combustions", "Pune"],
  });
}

function VarCard({ v }: { v: Variant }) {
  return (
    <article className="var-card" data-tilt>
      {v.idx && <span className="v-idx">{v.idx}</span>}
      <div className="v-k">{v.kicker}</div>
      <h3>{v.title}</h3>
      {v.spec && <p className="v-spec">{v.spec}</p>}
      {v.sub && <p className="v-sub">{v.sub}</p>}
      <p>{v.desc}</p>
      {v.list && <ul>{v.list.map((x) => <li key={x}>{x}</li>)}</ul>}
    </article>
  );
}

export default function ProductPage({ params }: Ctx) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: p.navLabel, href: `/${p.slug}` },
  ];
  const related = p.related.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <>
      <JsonLd
        data={[
          ...siteGraph(),
          productSchema(p),
          faqSchema(p.faq),
          breadcrumbSchema(crumbs),
        ]}
      />
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
              <div className="p-specstrip" data-spotlight>
                {p.specs.map((s) => (
                  <div className="p-spec" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
                ))}
              </div>
              <div className="cta-dual">
                <EnquiryButton className="btn btn--primary" type="sales" product={p.h1}>Request a quote</EnquiryButton>
                <EnquiryButton className="btn--tech" type="technical" product={p.h1} icon="chat">Discuss technical specs</EnquiryButton>
              </div>
              <p className="p-callnote" style={{ marginTop: 16 }}>
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
            <div className={p.grid === 4 ? "var-grid var-grid--4" : "var-grid"} data-stagger>
              {p.variants.map((v) => <VarCard key={v.title} v={v} />)}
            </div>
          </div>
        </section>

        {/* ASSEMBLY (gas trains) */}
        {p.assembly && (
          <section className="sec sec--sunken">
            <div className="wrap">
              <SectionHead eyebrow="Assembly" title={<>What goes into the train.</>} sub="A complete skid-mounted assembly, incorporating the control and safety devices your application requires." />
              <div className="var-grid var-grid--4" data-stagger>
                {p.assembly.map((v) => <VarCard key={v.title} v={v} />)}
              </div>
            </div>
          </section>
        )}

        {/* COMPARISON TABLE */}
        {p.columns && (
          <section className="sec sec--sunken">
            <div className="wrap">
              <SectionHead eyebrow={p.specEyebrow} title={p.specTitle} />
              <div className="spec-wrap spec-scroll" data-reveal>
                <table className="spec-cols" data-colspot>
                  <thead><tr>{p.columns.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {p.columns.rows.map((row, ri) => (
                      <tr key={ri}>{row.map((cell, ci) => (ci === 0 ? <th key={0}>{cell}</th> : <td key={ci}>{cell}</td>))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SPECIFICATIONS (key/value table) */}
        <section className={p.columns ? "sec" : "sec sec--sunken"}>
          <div className="wrap">
            <SectionHead eyebrow={p.columns ? "At a glance" : p.specEyebrow} title={p.columns ? "Selection notes." : p.specTitle} />
            <div className="spec-wrap" data-reveal>
              <table className="spec">
                <tbody>
                  {p.specRows.map((r) => <tr key={r.k}><th>{r.k}</th><td>{r.v}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ (AEO / GEO) */}
        <section className="sec sec--tint" id="faq" aria-labelledby="faq-h">
          <div className="wrap">
            <SectionHead eyebrow="Questions" title={<>Common questions <u>answered.</u></>} />
            <div className="faq-list" data-stagger>
              {p.faq.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
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
                  <Link className="rel-card" key={r.slug} href={`/${r.slug}`} scroll={false}>
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
