import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { BRAND, BRAND_COUNT, PF_FACTS, SERVICE_LINES, REPRESENTED_BRAND_LIST, type BrandId } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { aboutPageSchema, organizationSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";
import BentoGrid, { type BentoItem } from "@/components/BentoGrid";
import SpecStats from "@/components/SpecStats";
import FaqAccordion from "@/components/FaqAccordion";

/* ---------------------------------------------------------------------------
   P02 About Us (build sheet, phase 1, template T8 Utility).
   Fact discipline, section by section:
     - Everything below comes from the Gastech brochure (p.2 gas trains, p.3
       named train duties, p.9 burner capacities, p.10 Gastech modulating
       actuators, p.12 "do it right first time", AMC and installation terms,
       both Pune addresses), the client's own live About page wording, or the
       published product catalogue in lib/products.ts.
     - The build sheet lists founder and CEO names, dealer certificates and
       team and Italy factory-visit photographs as ASSETS STILL AWAITING FROM
       GASTECH. Those blocks are deliberately not built here, and no placeholder
       people, awards, client counts or testimonials are invented in their place.
   --------------------------------------------------------------------------- */

const ABOUT_DESCRIPTION = `Gastech Combustions designs and manufactures gas trains in Pune and distributes ${REPRESENTED_BRAND_LIST}. Meet the team and see how we work.`;

export const metadata = buildMetadata({
  title: "About Gastech Combustions | Gas Train Manufacturer, Pune",
  description: ABOUT_DESCRIPTION,
  path: "/about-us/",
  keywords: [
    "gas train manufacturer pune", "gastech combustions", "industrial burners supplier pune",
    "riello burner dealer", "pietro Fiorentini authorised", "gas leak detection india",
  ],
});

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

/* What we do, as five doors into the site. Every tile is a real, built route
   and every line is catalogue wording already published by Gastech. */
const WORK: BentoItem[] = [
  {
    href: "/gas-trains/",
    usp: "gt",
    img: `${IMG}/gas-train/customized-monoblock.jpg`,
    alt: "Gas train assembly engineered and manufactured by Gastech",
    title: "We engineer and build gas trains",
    brand: "Gastech / Complete gas systems",
    desc: "Skid-mounted assemblies with shut-off valves, filters, regulators, safety valves, solenoids, pressure switches and flow meters, configured to your duty.",
    span: "c7 r2",
  },
  {
    href: "/products/burners/gas-burners/",
    img: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg`,
    alt: "Riello modulating gas burner",
    title: "We size and supply burners",
    brand: "Riello / Gas, oil, dual fuel, industrial",
    desc: "One-stage, two-stage, progressive, three-stage and modulating burners, matched to your boiler, output and fuel.",
    span: "c5 r2",
  },
  {
    href: "/products/gas-regulation/pressure-regulators/",
    usp: "pf",
    img: `${IMG}/PF/Aperflux%20851.jpg`,
    alt: "Pietro Fiorentini APERFLUX pressure regulator",
    title: "We regulate the pressure",
    brand: "Pietro Fiorentini / Regulation",
    desc: "Direct-operated and pilot-operated regulators and governors that hold downstream pressure steady.",
    span: "c4 r2",
  },
  {
    href: "/products/gas-measurement/flow-meters/",
    img: `${IMG}/IM-TM%20turbine.jpg`,
    alt: "Gas turbine meter with electronic volume correction",
    title: "We measure the gas",
    brand: "Pietro Fiorentini / Metering & EVC",
    desc: "Turbine and rotary meters with electronic volume correction for precise gas measurement.",
    span: "c4 r2",
  },
  {
    href: "/brands/gasvigil/",
    img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`,
    alt: "Gasvigil GV 108 gas detector",
    title: "We make it safe",
    brand: "Gasvigil / Leak detection",
    desc: "Continuous sensing with alarm and automatic shutoff, on combustible and toxic gases, plus oxygen and carbon dioxide.",
    span: "c4 r2",
  },
];

/* The four words the Gastech brochure puts under every gas train (p.2), each
   explained with what the same brochure says we actually do about it. */
const PRINCIPLES = [
  {
    idx: "01",
    k: "Customized",
    title: "Built around your duty",
    points: [
      "Each train is designed and configured on application inputs: gas type, flow, inlet and outlet pressure, safety requirements and applicable standards.",
      "Nothing is offered off a shelf first.",
    ],
  },
  {
    idx: "02",
    k: "Reliable",
    title: "Proven before it reaches site",
    points: [
      "Systems are assembled, tested and calibrated in our own facility before handover.",
      "Commissioning proves the design duty on site.",
    ],
  },
  {
    idx: "03",
    k: "Safe",
    title: "Safety is built in, not added on",
    points: [
      "Manual and safety shut-off valves, solenoid valves and pressure switches carry the isolation and monitoring.",
      `${BRAND.gasvigil.name} leak detection with automatic shutoff protects people and plant.`,
    ],
  },
  {
    idx: "04",
    k: "Application-specific",
    title: "The process comes first",
    points: [
      "A textile stenter, a galvanizing plant, a steel-plant furnace and a dual-fuel genset are four different problems, and we treat them that way.",
      "Selection and sizing happen during your procurement stage.",
    ],
  },
];

/* Brands, in registry order (Pietro Fiorentini first, Electrogas second).
   Names and the Pietro Fiorentini facts come from lib/site.ts. Facts are the
   ones printed in the Gastech brochure (p.4 Pietro Fiorentini, p.8 Gasvigil,
   p.2 and p.10 Gastech's own gas trains and actuators) and, for Electrogas, the
   valve categories the client named. */
const BRAND_CARDS: Record<BrandId, { k: string; points: string[]; href: string; cta: string }> = {
  pf: {
    k: "Regulation",
    points: [
      `Founded in ${PF_FACTS.foundedCity} in ${PF_FACTS.foundedYear} and recognised as a Historic Brand of National Interest.`,
      `With ${PF_FACTS.yearsProse} across the entire natural gas supply chain: pressure regulators, safety valves and flow meters with electronic volume correction.`,
    ],
    href: "/products/gas-regulation/pressure-regulators/",
    cta: "Pietro Fiorentini range",
  },
  electrogas: {
    k: "Valves",
    points: [
      "Solenoid, motorised, butterfly and port valves.",
      "Specified with the rest of your gas train, so valves, regulation and burners are selected together.",
    ],
    href: "/products/valves/electrogas-valves/",
    cta: "Valves & actuation",
  },
  gastech: {
    k: "Gas trains",
    points: [
      "Gas trains engineered and manufactured in Pune as complete skid-mounted assemblies, configured to your gas type, flow and pressures.",
      "Modulating actuators for 90-degree butterfly valves and dampers, DN50 to DN450.",
    ],
    href: "/gas-trains/",
    cta: "Gas trains",
  },
  riello: {
    k: "Combustion",
    points: [
      "Industrial burners, from one-stage to fully modulating, sized to your boiler or process.",
      "Supplied, commissioned and serviced by our own team.",
    ],
    href: "/products/burners/gas-burners/",
    cta: "Gas burners",
  },
  gasvigil: {
    k: "Gas safety",
    points: [
      "Gas leak detection with automatic shutoff: fixed, panelled, stand-alone and portable systems.",
      "More than a decade of experience in gas leak detectors and detection systems.",
    ],
    href: "/brands/gasvigil/",
    cta: "Leak detection",
  },
};
const BRAND_ORDER = Object.keys(BRAND_CARDS) as BrandId[];

/* The five steps, as on the former How We Work page. */
const STEPS = [
  { n: "1", title: "Enquiry & study", desc: "We assess your gas demand, application and site.", youGet: "An application study covering gas type, flow, inlet and outlet pressure, safety requirements and applicable standards." },
  { n: "2", title: "Design", desc: "Sizing and layout engineered to spec.", youGet: "A sized proposal and layout, with the right brand and configuration for your duty." },
  { n: "3", title: "Supply & assembly", desc: "Sourced from our brands, assembled and tested.", youGet: "A complete skid-mounted assembly with shut-off valves, filters, regulators, safety devices, flow meters and controls." },
  { n: "4", title: "Install & commission", desc: "On-site setup and performance proof.", youGet: "A commissioned system, tested and calibrated end to end and proven against its design duty." },
  { n: "5", title: "Service & AMC", desc: "Long-term uptime and support.", youGet: "Scheduled maintenance and priority support that keep the system at design performance." },
];

/* Four distinct questions. The gas-train and address answers live on their own
   pages (Gas Trains, Contact) and are not repeated here. */
const FAQS = [
  {
    q: "Who is Gastech Combustions?",
    a: `Gastech Combustions Pvt Ltd is a Pune-based supplier and integrator of industrial combustion, gas regulation, metering and gas-safety systems. We build gas trains, including trains for dual-fuel genset kits, and we represent ${REPRESENTED_BRAND_LIST}.`,
  },
  {
    q: "What do you need from us to size a gas train?",
    a: "Your gas type, flow, inlet and outlet pressure, safety requirements and any standards that apply. With those, we configure the train, choose the brands and send a quotation.",
  },
  {
    q: "Which brands does Gastech represent?",
    a: `Pietro Fiorentini for gas pressure regulation, safety valves and flow metering with electronic volume correction, Electrogas for solenoid, motorised, butterfly and port valves, Riello for industrial gas, oil and dual fuel burners, and Gasvigil for gas leak detection with automatic shutoff. Gastech itself builds the complete gas trains.`,
  },
  {
    q: "Do you install and service what you supply?",
    a: "Yes. Our team handles installation and commissioning, tested and calibrated against the design duty, and offers annual maintenance contracts and technical consultancy.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Sheet row P02: AboutPage + Organization. The visible FAQ stays on the
          page; per the row it is no longer marked up as FAQPage. */}
      <JsonLd
        data={[
          aboutPageSchema("/about-us/", "About Gastech Combustions", ABOUT_DESCRIPTION),
          organizationSchema(),
        ]}
      />
      <main id="main">
        {/* 1 / MASTHEAD. The headline is the client's own About page line. */}
        <PageHero
          crumbs={[{ label: "About Us" }]}
          title={<>
            <span className="line">About{" "}</span>
            <span className="line"><em>Gastech Combustions</em></span>
          </>}
          lede={<>Gastech Combustions Pvt Ltd is a Pune-based supplier and integrator of industrial combustion, gas regulation, metering and gas-safety systems. We engineer and manufacture our own gas trains, represent reputed global brands, and support the equipment from the first enquiry through years of service.</>}
          primary={<EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="About Gastech">Request a Quote</EnquiryButton>}
          secondary={<Link className="btn--tech" href="/services/">Our services <Icon name="arrow" /></Link>}
          asideMedia
          aside={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`${IMG}/gas-train/textile-stenter.jpg`} alt="Gas train built by Gastech for a textile stenter" loading="eager" decoding="async" />
          }
        />

        {/* 2 / STATEMENT */}
        <section className="sec statement" id="who" aria-labelledby="who-h">
          <div className="wrap">
            <p className="eyebrow">Who we are</p>
            <h2 id="who-h" className="statement-h" data-reveal>
              At Gastech Combustions we believe and practise one thing above all: <u>do it right first time</u>, from the enquiry stage to the fifth year of service.
            </h2>
            <div className="statement-grid" data-stagger>
              <div className="sm-item"><span className="sm-k">Base</span><span className="sm-v">Pune, Maharashtra</span></div>
              <div className="sm-item"><span className="sm-k">We build</span><span className="sm-v">Gas trains &amp; modulating actuators</span></div>
              <div className="sm-item"><span className="sm-k">We represent</span><span className="sm-v">{REPRESENTED_BRAND_LIST}</span></div>
              <div className="sm-item"><span className="sm-k">We serve</span><span className="sm-v">Consultancy, installation &amp; AMC</span></div>
            </div>
            <p className="about-note" data-reveal>
              That discipline changes what we sell. Our team is involved from the beginning of the enquiry stage in a detailed understanding of your application, offering a comprehensive solution and not just trading or sales of products. The aim is to add value to your business and to foster a long-term relationship, which is why the same standard covers our consultancy, our installation and commissioning, and our annual maintenance contracts.
            </p>
            <figure className="statement-fig" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/gas-train/steel-plant.jpg" alt="Gas train engineered and assembled by Gastech for a steel plant" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        {/* 3 / AT A GLANCE. Counts come from the data; the Pietro Fiorentini
            heritage is printed in the brochure. */}
        <section className="sec sec--sunken" id="glance" aria-labelledby="glance-h">
          <div className="wrap">
            <SectionHead
              eyebrow="At a glance"
              title={<>Gastech, <u>in plain numbers.</u></>}
              sub="Pietro Fiorentini's heritage, the brands we work with and the equipment we supply and service today."
            />
            <SpecStats
              specs={[
                { value: PF_FACTS.yearsLabel, label: "Pietro Fiorentini across the natural gas supply chain" },
                { value: String(BRAND_COUNT), label: "Brands, including our own gas trains" },
                { value: String(PRODUCTS.length), label: "Product categories supplied and serviced" },
                { value: String(SERVICE_LINES.length), label: "Service lines: consultancy, installation, AMC" },
              ]}
            />
          </div>
        </section>

        {/* 4 / WHAT WE DO. Bento tiles, each a real route. */}
        <section className="sec" id="work" aria-labelledby="work-h">
          <div className="wrap">
            <SectionHead
              eyebrow="What we do"
              title={<>What we do, <u>done properly.</u></>}
              sub="We build the systems ourselves, supply the equipment of the brands we represent, and stay with the plant after handover."
            />
            <BentoGrid items={WORK} />
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/products/">See the full product range <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* 5 / BRANDS. Brand presence, not product specs: those live on the product pages. */}
        <section className="sec sec--sunken" id="brands" aria-labelledby="br-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Brands"
              title={<>The brands behind <u>our systems.</u></>}
              sub={`Authorised distributor of ${REPRESENTED_BRAND_LIST}, and the maker of Gastech gas trains.`}
            />
            <div className="var-grid var-grid--5" data-stagger>
              {BRAND_ORDER.map((id, i) => {
                const b = BRAND_CARDS[id];
                return (
                  <article className="var-card" key={id}>
                    <span className="v-idx">{String(i + 1).padStart(2, "0")}</span>
                    <div className="v-k">{b.k}</div>
                    <h3>{BRAND[id].name}</h3>
                    <ul>
                      {b.points.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                    <Link className="brand-link" href={b.href}>{b.cta} <Icon name="arrow" /></Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6 / PRINCIPLES. The four words printed under every gas train. */}
        <section className="sec sec--tint" id="principles" aria-labelledby="pr-h">
          <div className="wrap">
            <SectionHead
              eyebrow="How we build"
              title={<>Four commitments on <u>every gas train.</u></>}
              sub="What each one means on your project."
            />
            <div className="var-grid var-grid--4" data-stagger>
              {PRINCIPLES.map((p) => (
                <article className="var-card" key={p.idx}>
                  <span className="v-idx">{p.idx}</span>
                  <div className="v-k">{p.k}</div>
                  <h3>{p.title}</h3>
                  <ul>
                    {p.points.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7 / HOW WE WORK. Five steps, moved here from the former How We Work page. */}
        <section className="sec" id="how" aria-labelledby="how-h">
          <div className="wrap">
            <SectionHead
              eyebrow="How we work"
              title={<>From enquiry to <u>ongoing support.</u></>}
              sub="Here is what happens at each stage, and what you receive."
            />
            <ol className="hw-row" data-stagger>
              {STEPS.map((st) => (
                <li className="hw-step" key={st.n}>
                  <span className="hw-n">Step {st.n}</span>
                  <h3>{st.title}</h3>
                  <p>{st.desc}</p>
                  <p className="hw-get"><b>You get:</b> {st.youGet}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 8 / QUESTIONS */}
        <section className="sec sec--sunken" id="questions" aria-labelledby="q-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Asked of us"
              title={<>Questions a <u>new plant</u> usually starts with.</>}
              sub="Short answers, in the words we would use on the phone."
            />
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* 9 / NEXT STEP. Red-plate band: white-only type and accents. One CTA;
            email, phone and address live on the Contact page. */}
        <section className="sec sec--dark" id="next" aria-labelledby="next-h">
          <div className="wrap">
            <SectionHead
              light
              eyebrow="Start a conversation"
              title={<>Tell us the fuel, the duty <u>and the site.</u></>}
              sub="An engineer will come back with the right equipment, a configuration and a quotation."
            />
            <div className="cta-dual">
              <EnquiryButton className="btn--tech" type="technical" product="About Gastech" icon="chat">Talk to an engineer</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
