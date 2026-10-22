import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { PRODUCTS, getProduct } from "@/lib/products";
import { siteGraph, breadcrumbSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";

export const metadata = buildMetadata({
  title: "Products | Burners, Regulators, Flow Meters & Gas Safety | Gastech",
  description:
    "Browse the full Gastech Combustions range: Riello gas, light oil and dual fuel burners, Pietro Fiorentini gas regulators, flow meters and safety valves, plus custom gas trains and Gasvigil leak detection. Supplied, sized and serviced in Pune.",
  path: "/products",
  keywords: ["industrial burners", "gas regulators", "flow meters", "gas trains", "gas leak detection", "Pune"],
});

const IMG = "https://gastechcombustions.in/images";

const GROUPS: { id: string; eyebrow: string; title: string; sub: string; cols: 3 | 2; cards: { slug: string; img: string; alt: string; desc: string }[] }[] = [
  {
    id: "burners",
    eyebrow: "Riello burners",
    title: "Burners for every fuel.",
    sub: "One-stage to modulating burners for gas, light oil and dual-fuel duty, sized to your boiler or process.",
    cols: 3,
    cards: [
      { slug: "gas-burners", img: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg`, alt: "Riello gas burner", desc: "Natural gas and LPG burners, 11 to 4885 kW, in four firing modes." },
      { slug: "light-oil-burners", img: `${IMG}/burner/riello-burner/light-oil-burner-02-stage.jpg`, alt: "Riello light oil burner", desc: "Gasoil and kerosene burners, 14 to 5340 kW, one-stage to modulating." },
      { slug: "dual-fuel-burners", img: `${IMG}/burner/riello-burner/light-oil-product/dual-fuel-modulating.jpg`, alt: "Riello dual fuel burner", desc: "Gas and light-oil burners, 163 to 5000 kW, for fuel-security." },
    ],
  },
  {
    id: "fiorentini",
    eyebrow: "Pietro Fiorentini",
    title: "Regulation, metering & safety.",
    sub: "Gas pressure regulators, flow meters and safety devices for steady, measurable and protected gas supply.",
    cols: 3,
    cards: [
      { slug: "pf-regulators", img: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pietro Fiorentini gas regulator", desc: 'High, medium and low pressure regulators and governors, DN 3/4" to 12".' },
      { slug: "flow-meters", img: `${IMG}/IM-TM%20turbine.jpg`, alt: "Gas flow meter", desc: "RPD and turbine meters with electronic volume correction and Ex barriers." },
      { slug: "safety-valves", img: `${IMG}/PF/gas/shut-off-valves/dilock.jpg`, alt: "Slam shut off valve", desc: "Slam shut-off valves, relief valves and governors for protection trains." },
    ],
  },
  {
    id: "gas-systems",
    eyebrow: "Gastech & Gasvigil",
    title: "Complete systems & detection.",
    sub: "Turnkey gas supply assemblies and continuous gas-leak protection for people and plant.",
    cols: 2,
    cards: [
      { slug: "gas-trains", img: `${IMG}/burner/gas-burner.png`, alt: "Gas train skid", desc: "Custom skid-mounted gas supply assemblies engineered to your application." },
      { slug: "gasvigil", img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, alt: "Gasvigil gas detector", desc: "Fixed, panelled, stand-alone and portable leak detection with auto shutoff." },
    ],
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
];

const itemList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Gastech products",
  url: absoluteUrl("/products"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/${p.slug}`),
      name: p.h1,
    })),
  },
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={[...siteGraph(), itemList, breadcrumbSchema(crumbs)]} />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Products</span>
            </div>
            <p className="eyebrow" data-reveal>The Gastech range</p>
            <h1 className="split">
              <span className="line">Combustion, regulation,</span>
              <span className="line"><em>metering</em> and safety.</span>
            </h1>
            <p className="lede" data-reveal>Everything we supply, size, install and service, from the brands we represent. Open a product for models, capacities and specifications, or talk to an engineer about your application.</p>
            <div className="intro-cta" data-reveal>
              <a className="btn btn--primary" href="#burners">Browse burners <Icon name="arrow" /></a>
              <EnquiryButton className="btn--tech" type="technical" product="Product enquiry" icon="chat">Talk to an engineer</EnquiryButton>
            </div>
          </div>
        </section>

        <Marquee />

        {GROUPS.map((g, gi) => (
          <section className={gi % 2 === 0 ? "sec sec--tint" : "sec"} id={g.id} key={g.id}>
            <div className="wrap">
              <SectionHead eyebrow={g.eyebrow} title={g.title} sub={g.sub} />
              <div className={g.cols === 3 ? "rel-grid rel-grid--3" : "rel-grid rel-grid--2"} data-stagger>
                {g.cards.map((c) => {
                  const prod = getProduct(c.slug);
                  return (
                    <Link className="rel-card" key={c.slug} href={`/${c.slug}`}>
                      <div className="rc-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={c.img} alt={c.alt} loading="lazy" decoding="async" /></div>
                      <div className="rc-body">
                        <span>{prod?.brand}</span>
                        <h3>{prod?.navLabel}</h3>
                        <p>{c.desc}</p>
                        <span className="rc-go">View range <Icon name="arrow" /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Not sure what you need?" title="Tell us the duty, we will size it." sub="Send an enquiry or reach a technical engineer for selection, sizing and a quotation across the whole range." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Product enquiry">Request a quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product="Product enquiry" icon="chat">Discuss technical specs</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
