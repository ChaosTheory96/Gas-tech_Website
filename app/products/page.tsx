import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, BRAND, PF_FACTS, REPRESENTED_BRAND_LIST } from "@/lib/site";
import { PRODUCTS, getProduct, productShots } from "@/lib/products";
import { ProductCard } from "@/components/cards/ProductCard";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";

export const metadata = buildMetadata({
  title: "Industrial Burners, Gas Regulation & Gas Safety | Gastech",
  description: `Browse Gastech Combustions products: gas trains, regulation, metering, valves, burners and leak detection. Authorised ${REPRESENTED_BRAND_LIST}.`,
  path: "/products/",
  keywords: ["industrial burners", "gas regulators", "flow meters", "gas trains", "gas valves", "gas leak detection", "Pune"],
});

const IMG = "/images";  // self-hosted copy of the catalogue images

type Card = { slug: string; img?: string; desc: string; icon?: string };
type Group = { id: string; eyebrow: string; title: string; sub: string; grid: string; cards: Card[] };

/* key points on the two highlight cards */
const CHIPS = {
  pf: [`Since ${PF_FACTS.foundedYear}`, PF_FACTS.yearsLabel],
  gt: ["Customized", "Reliable & safe", "Application-specific"],
};

/* Brand order: Gas Trains (the product USP) first, then Pietro Fiorentini, then
   Electrogas and Gasvigil, then Riello. Each group is its own section so every
   hero anchor lands on a section that holds exactly what its label says. */
const GROUPS: Group[] = [
  {
    id: "gas-trains",
    eyebrow: "Gastech",
    title: "Complete gas trains.",
    sub: "Turnkey, skid-mounted gas supply assemblies, engineered and built in Pune.",
    grid: "pc-grid pc-grid--wide",
    cards: [
      { slug: "gas-trains", img: `${IMG}/gas-train/compact-monoblock.jpg`, desc: "Engineered and manufactured by Gastech: complete skid-mounted trains configured to your gas type, flow, pressures and safety requirements." },
    ],
  },
  {
    id: "fiorentini",
    eyebrow: BRAND.pf.name,
    title: "Regulation, metering & safety.",
    sub: "Regulators, flow meters and safety devices for steady, measurable and protected supply.",
    grid: "pc-grid",
    cards: [
      { slug: "pressure-regulators", img: `${IMG}/brochure/PF_APERFLUX101.png`, desc: 'High, medium and low pressure regulators and governors, DN 3/4" to 12".' },
      { slug: "flow-meters", img: `${IMG}/IM-TM%20turbine.jpg`, desc: "RPD and turbine meters with electronic volume correction and Ex barriers." },
      { slug: "safety-valves", img: `${IMG}/PF/gas/shut-off-valves/dilock.jpg`, desc: "Slam shut-off valves, relief valves and governors for protection trains." },
    ],
  },
  {
    id: "valves-detection",
    eyebrow: `${BRAND.electrogas.name} & ${BRAND.gasvigil.name}`,
    title: "Valves & detection.",
    sub: "Valves for gas lines, and continuous gas-leak protection for people and plant.",
    grid: "pc-grid pc-grid--2",
    cards: [
      { slug: "valves", icon: "manifold", desc: "Solenoid, motorised, butterfly and port valves." },
      { slug: "gasvigil", img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, desc: "Fixed, panelled, stand-alone and portable leak detection with auto shutoff." },
    ],
  },
  {
    id: "burners",
    eyebrow: `${BRAND.riello.name} burners`,
    title: "Burners for every fuel.",
    sub: "One-stage to modulating burners for gas, light oil and dual-fuel duty, sized to your boiler or process.",
    grid: "pc-grid",
    cards: [
      { slug: "gas-burners", img: `${IMG}/brochure/burners/gas-02.jpeg`, desc: "Natural gas and LPG burners, 11 to 4885 kW, in four firing modes." },
      { slug: "light-oil-burners", img: `${IMG}/brochure/burners/light-oil-01.jpeg`, desc: "Gasoil and kerosene burners, 14 to 5340 kW, one-stage to modulating." },
      { slug: "dual-fuel-burners", img: `${IMG}/brochure/burners/dual-fuel-01.jpeg`, desc: "Gas and light-oil burners, 163 to 5000 kW, for fuel-security." },
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
          backgroundSrc="/images/editorial/gas-facility.jpg"
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
              <div className={g.grid} data-stagger>
                {g.cards.map((c) => {
                  const prod = getProduct(c.slug);
                  if (!prod) return null;
                  const usp = c.slug === "gas-trains" ? "gt" : prod.brand === BRAND.pf.name ? "pf" : null;
                  return (
                    <ProductCard
                      key={c.slug}
                      title={prod.navLabel}
                      line={c.desc}
                      tag={prod.card.tag}
                      brand={prod.brandIds[0]}
                      shots={c.img ? productShots(prod, c.img) : []}
                      icon={c.icon}
                      red={c.slug === "gas-trains"}
                      usp={!!usp}
                      chips={usp ? CHIPS[usp] : undefined}
                      fact={prod.card.fact}
                      href={prod.route}
                    />
                  );
                })}
              </div>
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
