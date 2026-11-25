import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, BRAND, REPRESENTED_BRAND_LIST } from "@/lib/site";
import { PRODUCTS, getProduct } from "@/lib/products";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";
import BentoGrid, { type BentoItem } from "@/components/BentoGrid";

export const metadata = buildMetadata({
  title: "Industrial Burners, Gas Regulation & Gas Safety | Gastech",
  description: `Browse Gastech Combustions products: gas trains, regulation, metering, valves, burners and leak detection. Authorised ${REPRESENTED_BRAND_LIST}.`,
  path: "/products/",
  keywords: ["industrial burners", "gas regulators", "flow meters", "gas trains", "gas valves", "gas leak detection", "Pune"],
});

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

type Card = { slug?: string; img?: string; alt: string; desc: string; href?: string; title?: string; brand?: string; icon?: string; cta?: string };
type Group = { id: string; eyebrow: string; title: string; sub: string; span: string; cards: Card[] };

/* Brand order: Gas Trains (the product USP) first, then Pietro Fiorentini, then
   Electrogas and Gasvigil, then Riello. Each group is its own section so every
   hero anchor lands on a section that holds exactly what its label says. */
const GROUPS: Group[] = [
  {
    id: "gas-trains",
    eyebrow: "Gastech",
    title: "Complete gas trains.",
    sub: "Turnkey, skid-mounted gas supply assemblies, engineered and built in Pune.",
    span: "c12 r2",
    cards: [
      { slug: "gas-trains", img: `${IMG}/gas-train/steel-plant.jpg`, alt: "Gastech gas train skid with yellow pipework, regulators and control cabinet", desc: "Engineered and manufactured by Gastech: complete skid-mounted trains configured to your gas type, flow, pressures and safety requirements." },
    ],
  },
  {
    id: "fiorentini",
    eyebrow: BRAND.pf.name,
    title: "Regulation, metering & safety.",
    sub: "Regulators, flow meters and safety devices for steady, measurable and protected supply.",
    span: "c4 r2",
    cards: [
      { slug: "pressure-regulators", img: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pietro Fiorentini gas regulator", desc: 'High, medium and low pressure regulators and governors, DN 3/4" to 12".' },
      { slug: "flow-meters", img: `${IMG}/IM-TM%20turbine.jpg`, alt: "Gas flow meter", desc: "RPD and turbine meters with electronic volume correction and Ex barriers." },
      { slug: "safety-valves", img: `${IMG}/PF/gas/shut-off-valves/dilock.jpg`, alt: "Slam shut off valve", desc: "Slam shut-off valves, relief valves and governors for protection trains." },
    ],
  },
  {
    id: "valves-detection",
    eyebrow: `${BRAND.electrogas.name} & ${BRAND.gasvigil.name}`,
    title: "Valves & detection.",
    sub: "Valves for gas lines, and continuous gas-leak protection for people and plant.",
    span: "c6 r2",
    cards: [
      { slug: "valves", icon: "manifold", alt: "", desc: "Solenoid, motorised, butterfly and port valves." },
      { slug: "gasvigil", img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, alt: "Gasvigil gas detector", desc: "Fixed, panelled, stand-alone and portable leak detection with auto shutoff." },
    ],
  },
  {
    id: "burners",
    eyebrow: `${BRAND.riello.name} burners`,
    title: "Burners for every fuel.",
    sub: "One-stage to modulating burners for gas, light oil and dual-fuel duty, sized to your boiler or process.",
    span: "c4 r2",
    cards: [
      { slug: "gas-burners", img: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg`, alt: "Riello gas burner", desc: "Natural gas and LPG burners, 11 to 4885 kW, in four firing modes." },
      { slug: "light-oil-burners", img: `${IMG}/burner/riello-burner/light-oil-burner-02-stage.jpg`, alt: "Riello light oil burner", desc: "Gasoil and kerosene burners, 14 to 5340 kW, one-stage to modulating." },
      { slug: "dual-fuel-burners", img: `${IMG}/burner/riello-burner/light-oil-product/dual-fuel-modulating.jpg`, alt: "Riello dual fuel burner", desc: "Gas and light-oil burners, 163 to 5000 kW, for fuel-security." },
    ],
  },
];

const itemList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Gastech products",
  url: absoluteUrl("/products/"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(p.route),
      name: p.h1,
    })),
  },
};

export default function ProductsPage() {
  const gasTrains = getProduct("gas-trains");
  return (
    <>
      {/* Sheet row P40: CollectionPage + ItemList (the itemList const below is
          a CollectionPage whose mainEntity is the ItemList). */}
      <JsonLd data={[itemList]} />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Products" }]}
          title={<>
            <span className="line">Products</span>
          </>}
          lede={<>Everything we supply, size, install and service, from the brands we represent. Open a product for models, capacities and specifications, or talk to an engineer about your application.</>}
          primary={<a className="btn btn--primary" href="#gas-trains">Browse the range <Icon name="arrow" /></a>}
          secondary={<EnquiryButton className="btn--tech" type="technical" product="Product enquiry" icon="chat">Talk to an engineer</EnquiryButton>}
          asideMedia
          aside={
            <Link className="pa-feature" href={gasTrains?.route ?? "/gas-trains/"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/gas-train/steel-plant.jpg`} alt="Gastech gas train skid with yellow pipework, regulators and control cabinet" loading="eager" decoding="async" />
              <span className="pa-feature-body">
                <b>Gas Trains</b>
                <span>Customized, reliable, safe and application-specific, built in Pune.</span>
                <span className="pa-feature-cta">Explore gas trains <Icon name="arrow" /></span>
              </span>
            </Link>
          }
        />

        {GROUPS.map((g, gi) => (
          <section className={gi % 2 === 0 ? "sec sec--tint" : "sec"} id={g.id} key={g.id}>
            <div className="wrap">
              <SectionHead eyebrow={g.eyebrow} title={g.title} sub={g.sub} />
              <BentoGrid
                items={g.cards.map((c): BentoItem => {
                  const prod = c.slug ? getProduct(c.slug) : undefined;
                  return {
                    href: c.href ?? prod?.route ?? "/",
                    img: c.img,
                    icon: c.icon,
                    cta: c.cta,
                    alt: c.alt,
                    title: c.title ?? prod?.navLabel ?? "",
                    brand: c.brand ?? prod?.brand ?? "",
                    desc: c.desc,
                    span: g.span,
                    ...(c.slug === "gas-trains" ? { usp: "gt" as const } : prod?.brand === BRAND.pf.name ? { usp: "pf" as const } : {}),
                  };
                })}
              />
            </div>
          </section>
        ))}

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Not sure what you need?" title="Tell us the duty, we will size it." sub="Send an enquiry for selection, sizing and a quotation across the whole range." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Product enquiry">Request a quote</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
