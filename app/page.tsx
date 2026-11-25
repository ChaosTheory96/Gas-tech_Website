import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE, BRAND, PF_FACTS, SERVICE_LINES, REPRESENTED_BRAND_LIST, type BrandId } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { siteGraph, breadcrumbSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import type { ConveyorItem } from "@/components/CapabilityConveyor";
import { CapabilityConveyor } from "@/components/CapabilityConveyor";
import { HomeScrollFx } from "@/components/HomeScrollFx";
import { HomeHero, type HeroCard } from "@/components/HomeHero";
import { EnquiryButton } from "@/components/enquiry";

export const metadata = buildMetadata({
  title: "Gas Trains, PF Regulators & Riello Burners | Gastech",
  description:
    `Pune gas train maker and authorised distributor of ${REPRESENTED_BRAND_LIST}: regulators, valves, burners, meters, leak detection.`,
  path: "/",
  image: "/assets/og-image.png",
  keywords: [
    "industrial burners Pune", "Riello gas burners", "Pietro Fiorentini gas regulators",
    "gas metering station", "gas leak detection India", "gas train skid", "hydrogen ready gas systems",
  ],
});

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

/* Capability cards point at the client URL scheme held in lib/products.ts, so a
   path is never typed twice. Slugs are internal keys only. */
const toRoute = (slug: string): string => getProduct(slug)?.route ?? "/";

const CAPABILITIES = [
  { idx: "01", img: `${IMG}/gas-train/steel-plant.jpg`, alt: "Gastech gas train for a steel plant: yellow pipework, regulators and control cabinet on a skid", href: toRoute("gas-trains"), title: "Complete Gas Handling Systems", desc: "Engineered and manufactured by Gastech: complete skid-mounted gas trains with shut-off valves, filters, regulators, solenoid valves, pressure switches and flow meters, configured to your duty.", specs: ["Customized", "Reliable & safe", "Application-specific"], flag: true },
  { idx: "02", img: `${IMG}/gas-train/compact-monoblock.jpg`, alt: "Gas regulation station: filter, regulator and gauges on a compact skid", href: toRoute("pressure-regulators"), title: "Gas Regulation Stations", desc: `${BRAND.pf.name} regulation and pressure-control stations for safe, steady supply, with hydrogen solutions.`, specs: ["Regulation & safety", "Sized to flow", "Hydrogen solutions"], brands: ["pf", "gastech"] },
  { idx: "03", img: `${IMG}/gas-train/flowmeter-bypass.jpg`, alt: "Gas metering station with flow meter and bypass", href: toRoute("flow-meters"), title: "Gas Metering & Flow Meters", desc: `${BRAND.pf.name} metering stations and flow meters with electronic volume correction for precise measurement.`, specs: ["Turbine & rotary", "Electronic correction", "Turnkey build"], brands: ["pf", "gastech"] },
  { idx: "04", img: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-TWO-STAGE.jpg`, alt: "Riello industrial gas burners", href: toRoute("gas-burners"), title: `${BRAND.riello.name} Gas Burners`, desc: "Industrial gas burners for boilers, ovens and process heating, sized to your duty.", specs: ["Modulating & staged", "Boiler & process heat", "Riello engineering"] },
  { idx: "05", img: `${IMG}/burner/riello-burner/light-oil-burner-03-stage.jpg`, alt: "Riello oil burners", href: toRoute("light-oil-burners"), title: `${BRAND.riello.name} Oil Burners`, desc: "Light oil burners delivering reliable, efficient combustion.", specs: ["Light oil", "Low emissions", "Sized to load"] },
  { idx: "06", img: `${IMG}/Gasvigil/Stand%20Alone.png`, alt: "Gas leak detection and shutoff", href: toRoute("gasvigil"), title: "Gas Leak Detection & Shutoff", desc: `${BRAND.gasvigil.name} leak detection with automatic shutoff to protect people and plant.`, specs: ["Continuous sensing", "Auto shutoff", "Alarm & interlock"] },
] satisfies ConveyorItem[];

/* One entry per brand, in registry order. Names and roles come from lib/site.ts. */
const BRAND_CARDS = [
  { id: "pf", img: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pietro Fiorentini gas equipment", desc: `Founded in ${PF_FACTS.foundedCity} in ${PF_FACTS.foundedYear}, with ${PF_FACTS.yearsProse} across the natural gas supply chain: regulators, safety valves, flow meters and EVC.` },
  { id: "electrogas", img: null, alt: "", desc: "Solenoid, motorised, butterfly and port valves." },
  { id: "gastech", img: `${IMG}/gas-train/textile-stenter.jpg`, alt: "Gastech gas train for a textile stenter", desc: "Our own complete gas handling systems and gas trains, engineered in Pune." },
  { id: "riello", img: `${IMG}/burner/gas-burner.png`, alt: "Riello burners", desc: "Industrial burners for gas, light oil and dual fuel." },
  { id: "gasvigil", img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, alt: "Gasvigil leak detection", desc: "Gas leak detection and automatic shutoff safety systems." },
] satisfies { id: BrandId; img: string | null; alt: string; desc: string }[];

/* Hero side cards: details appear on hover. Destinations come from the product data. */
const HERO_CARDS: HeroCard[] = [
  { side: "left", img: `${IMG}/gas-train/genset-dual-fuel-kit.jpg`, alt: "Gastech gas train on a skid", title: "Gastech Gas Trains", detail: "Complete skid-mounted gas trains with filters, regulators, valves and meters, configured to your duty and built in Pune.", cta: "Explore gas trains", href: toRoute("gas-trains") },
  { side: "right", img: `${IMG}/PF/Staflux%20187.jpg`, alt: "Pietro Fiorentini gas regulator", title: `${BRAND.pf.name} Regulation`, detail: "Regulators, safety valves and flow meters, with a hydrogen range for up to 100% H₂.", cta: "Explore regulation", href: toRoute("pressure-regulators") },
];

/* Retired by sheet-conformance decision (Phase 2, row P01): the home graph is
   Organization + LocalBusiness + WebSite + BreadcrumbList, with no ItemList.
   const itemListSchema = { ...PRODUCTS.map... } — removed from the emit path. */

export default function HomePage() {
  return (
    <>
      {/* Sheet row P01: Organization + LocalBusiness + WebSite + BreadcrumbList. */}
      <JsonLd data={[...siteGraph(), breadcrumbSchema([{ name: "Home", href: "/" }])]} />
      <main id="main">
        {/* GSAP scroll choreography for this page (null-render; SSR/no-JS safe,
            reduced-motion bails out). Wires the existing data-reveal / data-stagger
            hooks plus subtle media parallax and a velocity-reactive ticker. */}
        <HomeScrollFx />
        {/* HERO */}
        <HomeHero cards={HERO_CARDS} />

        <div id="ticker"><Marquee /></div>

        {/* STATEMENT */}
        <section className="sec statement" aria-labelledby="statement-h">
          <div className="wrap">
            <p className="eyebrow">Who we are</p>
            <h2 id="statement-h" className="statement-h" data-reveal>
              We are a Pune-based supplier and integrator of <u>industrial combustion, gas regulation, metering and gas-safety systems</u>, backed by the global brands we represent.
            </h2>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/about-us/">About Gastech Combustions <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="sec sec--dark" id="capabilities" aria-labelledby="cap-h">
          <div className="wrap">
            <header className="sec-head sec-head--dark">
              <p className="eyebrow eyebrow--light">01 / Capabilities</p>
              <h2 id="cap-h" data-reveal>Combustion and gas safety. <u>From brands we represent.</u></h2>
              <p className="sub" data-reveal>Gas trains, gas regulation and metering, burners and leak detection, with hydrogen solutions, supplied and serviced by Gastech.</p>
            </header>
          </div>
          <CapabilityConveyor items={CAPABILITIES} />
          <div className="wrap cap-foot">
            <p>A complete range of combustion and gas-safety equipment. See every product family for models, capacities and options.</p>
            <Link className="btn btn--ghost-light fx-magnetic" href="/products/">View all products <Icon name="arrow" /></Link>
          </div>
        </section>

        {/* BRANDS */}
        <section className="sec" id="industries" aria-labelledby="ind-h">
          <div className="wrap">
            <SectionHead eyebrow="02 / Our brands" title={<>Global brands, <u>supplied and serviced in Pune.</u></>} sub="We supply, install and support equipment from the manufacturers we represent, alongside our own gas trains." />
            <div className="ind-grid" data-stagger>
              {BRAND_CARDS.map((b, i) => {
                const def = BRAND[b.id];
                const mod = b.id === "pf" ? " usp-pf" : b.id === "gastech" ? " usp-gt" : "";
                return (
                  <Link className={`ind-card${mod}`} key={b.id} href={`/brands/#${b.id}`}>
                    {b.img ? (
                      <div className="ind-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.img} alt={b.alt} loading="lazy" decoding="async" /></div>
                    ) : (
                      <div className="ind-media ind-media--plain" aria-hidden="true"><Icon name="manifold" /></div>
                    )}
                    <div className="ind-body"><span className="ind-num">{String(i + 1).padStart(2, "0")}</span><h3>{def.name}</h3><p>{b.desc}</p><span className="ind-more">View brand <Icon name="arrow" /></span></div>
                  </Link>
                );
              })}
            </div>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/brands/">Explore all brands we represent <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="sec sec--sunken" id="services" aria-labelledby="svc-h">
          <div className="wrap">
            <SectionHead eyebrow="Services" title={<>Beyond the <u>equipment.</u></>} sub="Three service lines keep your gas plant running at design performance for its whole life." />
            <div className="svc-grid" data-stagger>
              {SERVICE_LINES.map((s) => (
                <article className="svc" key={s.num}>
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-ic" aria-hidden="true"><Icon name={s.icon} /></span>
                  <div className="svc-main"><h3>{s.title}</h3><p>{s.desc}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="sec sec--dark contact-cta" id="contact" aria-labelledby="contact-h">
          <div className="wrap">
            <div className="cta-head">
              <div className="cta-head-copy">
                <p className="eyebrow eyebrow--light">Ready when you are</p>
                <h2 id="contact-h" data-reveal>Start with the duty. <u>We will size the system.</u></h2>
                <p className="sub" data-reveal>Send us your gas type, flow and pressure. We come back with a recommended gas train, regulator or burner and a quotation.</p>
              </div>
              <div className="cta-actions" data-reveal>
                <EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="General enquiry">Get a Quote</EnquiryButton>
              </div>
            </div>
            <div className="contact-grid" data-stagger>
              <a className="contact-card" href={`mailto:${SITE.contact.salesEmail}`}><span className="cc-num">01</span><span className="contact-ic"><Icon name="mail" /></span><span className="k">Sales</span><span className="v">{SITE.contact.salesEmail}</span><span className="contact-go">Send email <Icon name="arrow" /></span></a>
              <a className="contact-card" href={`mailto:${SITE.contact.technicalEmail}`}><span className="cc-num">02</span><span className="contact-ic"><Icon name="chat" /></span><span className="k">Technical</span><span className="v">{SITE.contact.technicalEmail}</span><span className="contact-go">Send email <Icon name="arrow" /></span></a>
              <a className="contact-card" href={SITE.contact.mapUrl} target="_blank" rel="noopener"><span className="cc-num">03</span><span className="contact-ic"><Icon name="pin" /></span><span className="k">Corporate office</span><span className="v">{SITE.contact.corporateAddress}</span><span className="contact-go">Get directions <Icon name="arrow" /></span></a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
