import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import { BRAND, BRAND_IDS, PF_FACTS, REPRESENTED_BRAND_LIST, REPRESENTED_BRAND_NAMES, type BrandId } from "@/lib/site";
import { getProduct, productShots } from "@/lib/products";
import { ProductCard } from "@/components/cards/ProductCard";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";
import { BrandBento } from "@/components/BrandLockup";

const BRANDS_DESCRIPTION = `Gastech Combustions is the authorised distributor of ${REPRESENTED_BRAND_LIST} in India, and builds its own gas trains in Pune. See each range.`;

export const metadata = buildMetadata({
  title: `Authorised Brands: ${REPRESENTED_BRAND_NAMES.join(", ")}`,
  description: BRANDS_DESCRIPTION,
  path: "/brands/",
  keywords: ["Riello distributor Pune", "Pietro Fiorentini India", "Gasvigil dealer", "industrial burner brands", "gas safety brands"],
});

const IMG = "/images";  // self-hosted copy of the catalogue images

/* Product pointers resolve through lib/products.ts so the client URL scheme is
   written down exactly once. */
const toRoute = (slug: string): string => getProduct(slug)?.route ?? "/";

type BrandCard = {
  img: string | null; // null: no photograph yet, a plain panel is shown
  alt: string;
  desc: string;
  tagIcon: string;
  tag: string;
  links: { href: string; label: string }[]; // empty: no detail page, the card offers "Enquire"
};

/* One card per brand, rendered in registry order (Pietro Fiorentini, Electrogas,
   Gastech, Riello, Gasvigil). Names come from lib/site.ts. */
const CARDS: Record<BrandId, BrandCard> = {
  pf: {
    img: `${IMG}/brochure/PF_APERFLUX101.png`,
    alt: "Pietro Fiorentini gas regulator",
    desc: `Founded in ${PF_FACTS.foundedCity} in ${PF_FACTS.foundedYear} and recognised as a Historic Brand of National Interest, with ${PF_FACTS.yearsProse} across the entire natural gas supply chain. Gas pressure regulation and metering: regulators and governors, slam shut-off and relief valves, and flow meters with electronic volume correction, for steady, measurable and protected supply. The brochure also shows a hydrogen-ready meter range.`,
    tagIcon: "gauge",
    tag: "Regulation & metering",
    links: [
      { href: toRoute("pressure-regulators"), label: "Regulators" },
      { href: toRoute("flow-meters"), label: "Flow meters" },
      { href: toRoute("safety-valves"), label: "Safety valves" },
    ],
  },
  electrogas: {
    img: null,
    alt: "",
    desc: "Valves for gas lines: solenoid, motorised, butterfly and port valves, specified together with the regulation and burners on your gas train.",
    tagIcon: "manifold",
    tag: "Valves & actuation",
    links: [
      { href: toRoute("electrogas"), label: "Electrogas range" },
      { href: toRoute("valves"), label: "Valve types" },
    ],
  },
  gastech: {
    img: `${IMG}/gas-train/compact-monoblock.jpg`,
    alt: "Gastech compact gas train with filter, regulator and gauges",
    desc: "Gas trains engineered and manufactured in Pune as complete skid-mounted assemblies: customized, reliable, safe and application-specific, assembled and tested by us before handover.",
    tagIcon: "manifold",
    tag: "Turnkey systems",
    links: [{ href: toRoute("gas-trains"), label: "Gas trains" }],
  },
  riello: {
    img: `${IMG}/brochure/burners/light-oil-01.jpeg`,
    alt: "Riello industrial burner",
    desc: "Italian industrial burners for natural gas, LPG, light oil and dual-fuel duty, from one-stage to fully modulating, sized to your boiler or process.",
    tagIcon: "flame",
    tag: "Combustion",
    links: [
      { href: toRoute("gas-burners"), label: "Gas burners" },
      { href: toRoute("light-oil-burners"), label: "Light oil" },
      { href: toRoute("dual-fuel-burners"), label: "Dual fuel" },
    ],
  },
  gasvigil: {
    img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`,
    alt: "Gasvigil gas leak detector",
    desc: "Continuous gas-leak detection and automatic shutoff: fixed, panelled, stand-alone and portable systems that protect people and plant, with alarm and interlock outputs into your control scheme.",
    tagIcon: "shield",
    tag: "Gas safety",
    links: [{ href: toRoute("gasvigil"), label: "Leak detection" }],
  },
};

const RANGE = ["gas-trains", "pressure-regulators", "flow-meters", "safety-valves", "gas-burners", "gasvigil"];

export default function BrandsPage() {
  return (
    <>
      {/* Sheet row P10: CollectionPage + ItemList. Only Gasvigil has its own
          brand route today, so only that ListItem carries a url; the others
          stay on this page's own sections. */}
      <JsonLd
        data={[
          collectionPageSchema("/brands/", "Brands We Represent", BRANDS_DESCRIPTION),
          itemListSchema(
            "Brands We Represent",
            "/brands/",
            BRAND_IDS.map((id) => ({
              name: BRAND[id].name,
              desc: CARDS[id].desc,
              ...(id === "gasvigil" || id === "electrogas" ? { url: toRoute(id) } : {}),
            })),
          ),
        ]}
      />
      <main id="main">
        <PageHero
          backgroundSrc="/images/editorial/fabrication-india.jpg"
          crumbs={[{ label: "Brands" }]}
          title={<>
            <span className="line">Brands{" "}</span>
            <span className="line"><em>We Represent</em></span>
          </>}
          lede={<>Gastech Combustions is the Pune-based representative for world-class combustion and gas-safety manufacturers. We supply, size, install and service their equipment, and put the right brand and model against your duty.</>}
          primary={<a className="btn btn--primary" href="#pf">Explore the brands <Icon name="arrow" /></a>}
          secondary={<EnquiryButton className="btn--tech" type="technical" product="Brand enquiry" icon="chat">Talk to a brand specialist</EnquiryButton>}
          asideBare
          aside={<BrandBento ids={BRAND_IDS} label="Brands in the Gastech range" />}
        />

        <section className="sec sec--sunken" id="brands" aria-labelledby="bp-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The manufacturers"
              title={<>The names behind <u>every system.</u></>}
              sub="Each brand is chosen for what it does best. We put the right one against your duty, then engineer, install and maintain it."
            />
            <div className="fac-list" data-stagger>
              {BRAND_IDS.map((id, i) => {
                const b = CARDS[id];
                const name = BRAND[id].name;
                const mod = id === "pf" ? " usp-pf" : id === "gastech" ? " usp-gt" : "";
                return (
                  <article className={`${i % 2 ? "fac-item fac-item--flip" : "fac-item"}${mod}`} key={id} id={id}>
                    <div className={b.img ? "fac-media" : "fac-media fac-media--plain"}>
                      {b.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.img} alt={b.alt} loading="lazy" decoding="async" />
                      ) : (
                        <Icon name={b.tagIcon} />
                      )}
                      <span className="fac-idx">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="fac-body">
                      <h3>{name}</h3>
                      <p>{b.desc}</p>
                      <span className="fac-tag"><Icon name={b.tagIcon} /> {b.tag}</span>
                      <div className="hero-cta hero-cta--spaced">
                        {b.links.length > 0 ? (
                          b.links.map((l) => (
                            <Link key={l.href} className="btn btn--ghost btn--sm" href={l.href}>
                              {l.label} <Icon name="arrow" />
                            </Link>
                          ))
                        ) : (
                          <EnquiryButton className="btn btn--ghost btn--sm" type="technical" product={`${name} enquiry`} icon="chat">Enquire</EnquiryButton>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sec" id="range" aria-labelledby="range-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Explore the range"
              title={<>Open a product for <u>models and specs.</u></>}
              sub="Every brand maps to a dedicated product page with capacities, sizes and configurations."
            />
            <div className="pc-grid" data-stagger>
              {RANGE.map((slug) => {
                const p = getProduct(slug);
                if (!p) return null;
                return (
                  <ProductCard key={slug} title={p.navLabel} line={p.card.line} tag={p.card.tag} brand={p.brandIds[0]} shots={productShots(p)} red={slug === "gas-trains"} fact={p.card.fact} href={p.route} />
                );
              })}
            </div>
          </div>
        </section>

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title="Tell us the fuel, duty and site." sub="We will put the right brand and model against your application and come back with a quotation." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Brand enquiry">Request a quote</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
