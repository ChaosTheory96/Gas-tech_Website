import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteGraph, breadcrumbSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";

export const metadata = buildMetadata({
  title: "How We Deliver | Design, Supply, Commission & Service | Gastech",
  description:
    "Gastech Combustions engineers, supplies, tests, installs and services complete gas systems. From enquiry and design to commissioning and long-term AMC, one accountable partner does it right first time in Pune.",
  path: "/delivery",
  keywords: ["gas system engineering", "gas train installation", "commissioning", "turnkey gas systems", "Pune"],
});

const IMG = "https://gastechcombustions.in/images";
const UNSPLASH = "https://images.unsplash.com";

const FACILITIES = [
  {
    idx: "01",
    img: `${UNSPLASH}/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80`,
    alt: "Application engineering",
    title: "Design & Engineering",
    desc: "Systems are engineered to your duty, gas type and site conditions, with the right brand and sizing for the job.",
    tagIcon: "settings",
    tag: "Application engineering",
    flip: false,
  },
  {
    idx: "02",
    img: `${UNSPLASH}/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80`,
    alt: "Gas system integration",
    title: "Supply & Integration",
    desc: "We source from our partner brands and integrate regulation, metering, safety and control into a working system.",
    tagIcon: "factory",
    tag: "Systems integration",
    flip: true,
  },
  {
    idx: "03",
    img: `${UNSPLASH}/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80`,
    alt: "Quality control and testing",
    title: "Quality & Testing",
    desc: "Pressure and performance testing prove every system before handover, so commissioning on site is clean.",
    tagIcon: "award",
    tag: "Tested & commissioned",
    flip: false,
  },
];

const STEPS = [
  { n: "1", title: "Enquiry & study", desc: "We assess your gas demand, application and site." },
  { n: "2", title: "Design", desc: "Sizing and layout engineered to spec." },
  { n: "3", title: "Supply & assembly", desc: "Sourced from our brands, assembled and tested." },
  { n: "4", title: "Install & commission", desc: "On-site setup and performance proof." },
  { n: "5", title: "Service & AMC", desc: "Long-term uptime and support." },
];

const CHECKS = [
  "Riello burners",
  "Pietro Fiorentini",
  "IM flow meters & EVC",
  "Gasvigil safety",
  "In-house engineering & service",
];

const MATERIALS = [
  { icon: "flame", title: "Industrial Burners", desc: "Gas, oil and dual fuel." },
  { icon: "gear", title: "Regulation & Metering", desc: "Stations, flow meters, EVC." },
  { icon: "molecule", title: "Leak Detection", desc: "Sensing and auto shutoff." },
  { icon: "chip", title: "Hydrogen Solutions", desc: "Hydrogen-ready regulation & metering." },
];

const SUPPORT = [
  { num: "S / 01", icon: "chat", title: "Technical Consultancy", desc: "Sizing, layout and gas-strategy guidance from application through to commissioning." },
  { num: "S / 02", icon: "wrench", title: "Installation & Commissioning", desc: "Expert installation, thorough testing and calibration from setup to final activation." },
  { num: "S / 03", icon: "calendar", title: "Annual Maintenance Contracts", desc: "Planned AMC cover so uptime is protected and surprises are engineered out." },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Delivery", href: "/delivery" },
];

export default function DeliveryPage() {
  return (
    <>
      <JsonLd data={[...siteGraph(), breadcrumbSchema(crumbs)]} />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Delivery</span>
            </div>
            <p className="eyebrow" data-reveal>How we deliver</p>
            <h1 className="split">
              <span className="line">From spec to</span>
              <span className="line"><em>sustained</em> uptime.</span>
            </h1>
            <p className="lede" data-reveal>We practise one thing above all: do it right first time. From the first enquiry our engineers understand your application and offer a complete solution, not just a product, then design, supply, test, install, commission and service it with one accountable partner.</p>
            <div className="intro-cta" data-reveal>
              <a className="btn btn--primary" href="#process">See how we work <Icon name="arrow" /></a>
              <EnquiryButton className="btn--tech" type="technical" product="Delivery enquiry" icon="chat">Talk to our team</EnquiryButton>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="sec sec--sunken" id="facilities" aria-labelledby="fac-h">
          <div className="wrap">
            <SectionHead
              eyebrow="What we take care of"
              title={<>Engineering, supply <u>and proof.</u></>}
              sub="Gastech engineers, supplies, commissions and services complete gas systems. One accountable partner means consistent quality and dependable delivery."
            />
            <div className="fac-list" data-stagger>
              {FACILITIES.map((f) => (
                <article className={f.flip ? "fac-item fac-item--flip" : "fac-item"} key={f.idx}>
                  <div className="fac-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img} alt={f.alt} loading="lazy" decoding="async" />
                    <span className="fac-idx">{f.idx}</span>
                  </div>
                  <div className="fac-body">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                    <span className="fac-tag"><Icon name={f.tagIcon} /> {f.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="process" aria-labelledby="proc-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The path"
              title={<>From enquiry to <u>ongoing support.</u></>}
              sub="A single accountable partner for your gas system, from first study to lifetime servicing."
            />
            <ol className="steps" data-steps>
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec sec--dark band-standards" aria-labelledby="std-h">
          <div className="wrap">
            <div className="std-head">
              <p className="eyebrow eyebrow--light">Standards & materials</p>
              <h2 id="std-h" data-reveal>Engineered around <u>trusted brands.</u></h2>
            </div>
            <ul className="std-strip" data-stagger>
              {CHECKS.map((c) => (
                <li key={c}><Icon name="check" /> {c}</li>
              ))}
            </ul>
            <div className="mat-grid" data-stagger>
              {MATERIALS.map((m) => (
                <div className="mat-item" key={m.title}>
                  <Icon name={m.icon} />
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec--sunken" id="support" aria-labelledby="svc-h">
          <div className="wrap">
            <SectionHead
              eyebrow="After delivery"
              title={<>Beyond the <u>equipment.</u></>}
              sub="Three service lines keep your gas plant running at design performance for its whole life."
            />
            <div className="svc-grid" data-stagger>
              {SUPPORT.map((s) => (
                <article className="svc" key={s.num}>
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-ic" aria-hidden="true"><Icon name={s.icon} /></span>
                  <div className="svc-main">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/services">Explore all services <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title="Put your system in good hands." sub="Ask for a site study, a design proposal, or an installation and commissioning visit. We do it right first time." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Delivery enquiry">Request a quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product="Delivery enquiry" icon="chat">Talk to our team</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
