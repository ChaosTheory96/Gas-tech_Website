import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { aboutPageSchema, organizationSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import BentoGrid, { type BentoItem } from "@/components/BentoGrid";
import SpecStats from "@/components/SpecStats";
import SpecTable from "@/components/SpecTable";
import KeyValueTable from "@/components/KeyValueTable";
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

export const metadata = buildMetadata({
  title: "About Gastech Combustions | Gas Train Manufacturer, Pune",
  description:
    "Gastech Combustions designs and manufactures gas trains in Pune and distributes Pietro Fiorentini, Riello and Gasvigil. Meet the team and see how we work.",
  path: "/about-us/",
  keywords: [
    "gas train manufacturer pune", "gastech combustions", "industrial burners supplier pune",
    "riello burner dealer", "pietro Fiorentini authorised", "gas leak detection india",
  ],
});

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

/* What we do, as four doors into the site. Every tile is a real, built route
   and every line is catalogue wording already published by Gastech. */
const WORK: BentoItem[] = [
  {
    href: "/gas-trains/",
    img: `${IMG}/burner/gas-burner.png`,
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
    alt: "IM-TM turbine gas meter",
    title: "We measure the gas",
    brand: "Pietro Fiorentini / Metering & EVC",
    desc: "Turbine and rotary meters with electronic volume correction for accurate, billable measurement.",
    span: "c4 r2",
  },
  {
    href: "/brands/gasvigil/",
    img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`,
    alt: "Gasvigil GV 108 gas detector",
    title: "We make it safe",
    brand: "Gasvigil / Leak detection",
    desc: "Continuous sensing with alarm and automatic shutoff, on combustible, toxic and other gases.",
    span: "c4 r2",
  },
];

/* Burner capacities exactly as printed in the Gastech brochure (p.9) and
   already published across the product pages in lib/products.ts. */
const RANGE = {
  headers: ["Burner type", "Capacity", "Typical duty"],
  rows: [
    ["One-stage gas burners", "11 to 220 kW", "Steady demand, small boilers and light heating duty"],
    ["Two-stage gas burners", "130 to 3,200 kW", "Civil and mid-sized industrial boilers"],
    ["Two-stage progressive gas burners", "45 to 2,290 kW", "Smoother stepped control than high / low firing"],
    ["Modulating gas burners", "130 to 4,885 kW", "Steam, hot-water and diathermic oil boilers under varying load"],
    ["One-stage light oil burners", "23.8 to 240 kW", "Gasoil and kerosene duty, small boilers"],
    ["Two-stage light oil burners", "14 to 296 kW", "Civil and light-industrial boilers"],
    ["Three-stage light oil burners", "830 to 5,340 kW", "Larger steam and hot-water boilers"],
    ["Modulating light oil burners", "415 to 4,340 kW", "Holds set temperature or pressure under varying load"],
    ["Two-stage dual fuel burners", "163 to 1,395 kW", "Gas or oil firing where fuel security matters"],
    ["Modulating dual fuel burners", "407 to 5,000 kW", "Continuous control while switching between fuels"],
    ["Dual-block industrial burners", "150 to 20,000 kW", "Food, chemical, district heating, hospitals, textile"],
    ["ER-series industrial burners", "540 to 32,000 kW", "High-output industrial combustion duty"],
  ],
};

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
      "Gasvigil leak detection with automatic shutoff protects people and plant.",
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

/* Named gas-train duties photographed in the Gastech brochure (p.2 and p.3),
   plus the industrial burners applications printed on p.9. */
const DUTIES = [
  "Monoblock & package burners",
  "Textile stenter machines",
  "Galvanizing plants",
  "Steel-plant furnaces",
  "Dual-fuel gensets",
  "Steam & hot-water boilers",
  "Diathermic oil boilers",
  "Food & chemical plant",
  "District heating",
];

const FACTS = [
  { k: "Legal name", v: SITE.legalName },
  { k: "What we do", v: "We engineer and manufacture gas trains, supply and size industrial burners, gas regulation, metering and gas-safety equipment, then install, commission and maintain what we supply." },
  { k: "Base", v: `${SITE.contact.city}, ${SITE.contact.region}, ${SITE.contact.country}` },
  { k: "Works", v: SITE.contact.worksAddress },
  { k: "Registered office", v: SITE.contact.registeredAddress },
  { k: "Brands represented", v: "Riello (burners), Pietro Fiorentini (regulation & metering), Gasvigil (leak detection)" },
  { k: "Equipment supplied", v: "Industrial burners, complete gas trains and skids, pressure regulators and governors, safety shut-off and relief valves, gas flow meters with electronic volume correction, gas leak detection, modulating actuators" },
  { k: "Fuel conversion", v: "Diesel generators converted to run on dual fuel (diesel and gas)" },
  { k: "Services", v: "Technical consultancy, installation & commissioning, annual maintenance contracts" },
  { k: "Telephone", v: `${SITE.contact.phonePrimary} / ${SITE.contact.phoneSecondary}` },
  { k: "Email", v: SITE.contact.salesEmail },
  { k: "Website", v: absoluteUrl("/").replace("https://", "") },
];

const FAQS = [
  {
    q: "Who is Gastech Combustions?",
    a: "Gastech Combustions Pvt Ltd is a Pune-based supplier and integrator of industrial combustion, gas regulation, metering and gas-safety systems. We represent reputed global brands of burners, gas safety and flow regulation devices, gas flow meters, totalisers, EVC and gas leak detectors, and we offer a conversion solution that lets diesel generators run on dual fuel.",
  },
  {
    q: "Does Gastech manufacture its own gas trains?",
    a: "Yes. Our gas trains are engineered and manufactured to provide safe, reliable and precise control of fuel gas supply to industrial burners and combustion systems, and can be supplied as a complete skid-mounted assembly with manual and safety shut-off valves, filters, pressure regulators, solenoid valves, pressure switches and flow meters.",
  },
  {
    q: "Which brands does Gastech represent?",
    a: "Riello for industrial gas, oil and dual fuel burners, Pietro Fiorentini for gas pressure regulation, safety valves and flow metering with electronic volume correction, and Gasvigil for gas leak detection with automatic shutoff.",
  },
  {
    q: "Where is Gastech located in Pune?",
    a: "We work from two Pune locations: the works at Dangat Industrial Estate, Opp. Dynalec Controls, NDA Road, Shivane, Pune 411023, and the registered office at Brahma Corp Vantage Towers, C-1005, 10th Floor, Bavdhan Khurd, Pune 411021.",
  },
  {
    q: "What does Gastech do after supply?",
    a: "We provide technical consultancy, installation and commissioning with detailed testing and calibration of every parameter, configuration and connection, and annual maintenance contracts with scheduled inspections and priority support.",
  },
  {
    q: "What is the motto behind the way you work?",
    a: "Do it right first time. From the beginning of the enquiry stage our team works to understand your application in detail and offers a comprehensive solution, not just trading or sales of products, so that we add value to your business and foster a long-term relationship.",
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us/" },
];
void crumbs; // breadcrumb markup retired per sheet row P02 (AboutPage + Organization only); visible crumbs stay

export default function AboutUsPage() {
  return (
    <>
      {/* Sheet row P02: AboutPage + Organization. The visible FAQ stays on the
          page; per the row it is no longer marked up as FAQPage. */}
      <JsonLd
        data={[
          aboutPageSchema(
            "/about-us/",
            "About Gastech Combustions",
            "Gastech Combustions designs and manufactures gas trains in Pune and distributes Pietro Fiorentini, Riello and Gasvigil. Meet the team and see how we work.",
          ),
          organizationSchema(),
        ]}
      />
      <main id="main">
        {/* 1 / MASTHEAD. The headline is the client's own About page line. */}
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">About Us</span>
            </div>
            <p className="eyebrow" data-reveal>About Gastech Combustions Pvt Ltd</p>
            <h1 className="split">
              <span className="line">About{" "}</span>
              <span className="line"><em>Gastech Combustions</em></span>
            </h1>
            <p className="lede" data-reveal>We are a Pune-based supplier and integrator of industrial combustion, gas regulation, metering and gas-safety systems. We engineer and manufacture our own gas trains, represent reputed global brands, and stay accountable for the equipment from the first enquiry to years of service.</p>
            <div className="intro-cta" data-reveal>
              <EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="About Gastech">Request a Quote</EnquiryButton>
              <a className="btn--tech" href="#work">What we do <Icon name="arrow" /></a>
            </div>
          </div>
        </section>

        {/* 2 / TICKER. Same band treatment as Home, different words. */}
        <Marquee items={["Gas Trains We Build", "Riello Burners", "Pietro Fiorentini", "Gas Metering & EVC", "Gas Leak Detection", "Dual Fuel Conversion", "Installation & Commissioning", "Annual Maintenance", "Modulating Actuators", "Do It Right First Time"]} />

        {/* 3 / STATEMENT */}
        <section className="sec statement" id="who" aria-labelledby="who-h">
          <div className="wrap">
            <p className="eyebrow">Who we are</p>
            <h2 id="who-h" className="statement-h" data-reveal>
              At Gastech Combustions we believe and practise one thing above all: <u>do it right first time</u>, from the enquiry stage to the fifth year of service.
            </h2>
            <div className="statement-grid" data-stagger>
              <div className="sm-item"><span className="sm-k">Base</span><span className="sm-v">Pune, Maharashtra</span></div>
              <div className="sm-item"><span className="sm-k">We build</span><span className="sm-v">Gas trains &amp; modulating actuators</span></div>
              <div className="sm-item"><span className="sm-k">We represent</span><span className="sm-v">Riello, Pietro Fiorentini, Gasvigil</span></div>
              <div className="sm-item"><span className="sm-k">We serve</span><span className="sm-v">Consultancy, installation &amp; AMC</span></div>
            </div>
            <p data-reveal style={{ maxWidth: "68ch", marginTop: "clamp(20px,2.4vw,32px)" }}>
              That discipline changes what we sell. Our team is involved from the beginning of the enquiry stage in a detailed understanding of your application, offering a comprehensive solution and not just trading or sales of products. The aim is to add value to your business and to foster a long-term relationship, which is why the same trust seal covers our consultancy, our installation and commissioning, and our annual maintenance contracts.
            </p>
            <figure className="statement-fig" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80" alt="Industrial gas equipment engineered and assembled for a site duty" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        {/* 4 / AT A GLANCE. Every number is printed in the brochure or already
            published in the catalogue: capacities (p.9), brands, product
            categories and our two Pune locations. */}
        <section className="sec sec--sunken" id="glance" aria-labelledby="glance-h">
          <div className="wrap">
            <SectionHead
              eyebrow="At a glance"
              title={<>Gastech, <u>in plain numbers.</u></>}
              sub="What we cover, measured by the range we actually supply today rather than a claim about projects or years."
            />
            <SpecStats
              specs={[
                { value: "11 kW to 32,000 kW", label: "Burner outputs we supply, one-stage gas to ER-series industrial" },
                { value: "3", label: "Global brands represented in Pune" },
                { value: "8", label: "Equipment categories supplied and serviced" },
                { value: "2", label: "Pune locations, works and registered office" },
              ]}
            />
          </div>
        </section>

        {/* 5 / WHAT WE DO. Bento tiles, each a real route. */}
        <section className="sec" id="work" aria-labelledby="work-h">
          <div className="wrap">
            <SectionHead
              eyebrow="What we do"
              title={<>Four things, <u>done properly.</u></>}
              sub="We build the systems ourselves, supply the equipment of the brands we represent, and stay with the plant after handover."
            />
            <BentoGrid items={WORK} />
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/products/">See the full product range <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* 6 / THE RANGE WE SIZED. Capacities from brochure p.9. */}
        <section className="sec sec--sunken" id="range" aria-labelledby="range-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Capacity range"
              title={<>From 11 kW to <u>32,000 kW.</u></>}
              sub="Every burner family we supply, with the output range printed in the Gastech brochure. The ultra-low-NOx premix gas range is quoted on request."
            />
            <SpecTable columns={RANGE} />
          </div>
        </section>

        {/* 7 / WHERE THE WORK GOES. Duties named and photographed in the
            brochure, not an invented industry list. */}
        <section className="sec" id="applications" aria-labelledby="app-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Where our work goes"
              title={<>Duties we are asked to <u>feed gas.</u></>}
              sub="Each one is a different combination of gas type, flow, pressure and safety requirement, which is why we configure the train instead of shipping a standard box."
            />
          </div>
          <div className="quote-marquee" aria-hidden="true">
            <div className="qm-track">
              <div className="qm-row">{DUTIES.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="qm-row">{DUTIES.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </div>
          <div className="wrap">
            <p data-reveal style={{ maxWidth: "68ch" }}>
              The brochure shows compact and customised trains for monoblock and package burners, gas trains for textile stenter machines, galvanizing plants and steel-plant furnaces, a train built for a dual-fuel kit on a genset, and a flow-meter bypass assembly with electronic volume correction and limit switch box for RS485 communication. We also build Gastech modulating actuators, smart direct-mounted actuators for 90-degree butterfly valves and dampers from DN50 to DN450, used on combustion air valves, furnace dampers and gas control valves.
            </p>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/gas-trains/">Explore gas trains <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* 8 / PRINCIPLES. The four words printed under every gas train. */}
        <section className="sec sec--tint" id="principles" aria-labelledby="pr-h">
          <div className="wrap">
            <SectionHead
              eyebrow="How we build"
              title={<>Customized. Reliable. <u>Safe. Application-specific.</u></>}
              sub="Four words the Gastech brochure puts under every gas train, and what each one commits us to in practice."
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

        {/* 9 / KEY FACTS. A single machine-readable block of verified entity
            facts, mirroring the Organization and LocalBusiness JSON-LD. */}
        <section className="sec" id="facts" aria-labelledby="facts-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The facts"
              title={<>Everything here is <u>on record.</u></>}
              sub="Legal name, addresses, brands, scope and contact routes, exactly as printed in the Gastech brochure and catalogue."
            />
            <KeyValueTable rows={FACTS} />
          </div>
        </section>

        {/* 10 / QUESTIONS */}
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

        {/* 11 / NEXT STEP. Red-plate band: white-only type and accents. */}
        <section className="sec sec--dark" id="next" aria-labelledby="next-h">
          <div className="wrap">
            <SectionHead
              light
              eyebrow="Start a conversation"
              title={<>Tell us the fuel, the duty <u>and the site.</u></>}
              sub="An engineer will come back with the right equipment, a configuration and a quotation. Two lines, two inboxes, one accountable partner."
            />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="About Gastech">Request a Quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product="About Gastech" icon="chat">Talk to an engineer</EnquiryButton>
            </div>
            <div className="contact-grid" data-stagger>
              <a className="contact-card" href={SITE.contact.phonePrimaryHref}>
                <span className="cc-num">01</span>
                <span className="contact-ic"><Icon name="phone" /></span>
                <span className="k">Sales</span>
                <span className="v">{SITE.contact.phonePrimary}</span>
                <span className="contact-go">Call now <Icon name="arrow" /></span>
              </a>
              <a className="contact-card" href={`mailto:${SITE.contact.salesEmail}`}>
                <span className="cc-num">02</span>
                <span className="contact-ic"><Icon name="mail" /></span>
                <span className="k">Email</span>
                <span className="v">{SITE.contact.salesEmail}</span>
                <span className="contact-go">Send email <Icon name="arrow" /></span>
              </a>
              <a className="contact-card" href={SITE.contact.mapUrl} target="_blank" rel="noopener">
                <span className="cc-num">03</span>
                <span className="contact-ic"><Icon name="pin" /></span>
                <span className="k">Works</span>
                <span className="v">{SITE.contact.worksAddress}</span>
                <span className="contact-go">Get directions <Icon name="arrow" /></span>
              </a>
            </div>
            <div className="ind-foot" data-reveal style={{ marginTop: "clamp(28px,3vw,44px)" }}>
              <Link className="btn btn--ghost-light fx-magnetic" href="/how-we-work/">See how we work <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
