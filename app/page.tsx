import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { siteGraph } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { Carousel } from "@/components/carousel";
import { EnquiryButton } from "@/components/enquiry";
import { Counter, RiseIn, StepsTimeline } from "@/components/motion";

export const metadata = buildMetadata({
  title: "Gastech Combustions | Industrial Burners, Gas Regulation, Metering & Gas Safety",
  description: SITE.description,
  path: "/",
  image: "/assets/gc-logo-flat.png",
  keywords: [
    "industrial burners Pune", "Riello gas burners", "Pietro Fiorentini gas regulators",
    "gas metering station", "gas leak detection India", "gas train skid", "hydrogen ready gas systems",
  ],
});

const IMG = "https://gastechcombustions.in/images";

const CAPABILITIES = [
  { idx: "01", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80", alt: "Riello industrial gas burners", href: "/gas-burners", title: "Riello Gas Burners", desc: "Industrial gas burners for boilers, ovens and process heating, sized to your duty.", specs: ["Modulating & staged", "Boiler & process heat", "Riello engineering"] },
  { idx: "02", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80", alt: "Riello oil burners", href: "/light-oil-burners", title: "Riello Oil Burners", desc: "Light and heavy oil burners delivering reliable, efficient combustion.", specs: ["Light & heavy oil", "Low emissions", "Sized to load"] },
  { idx: "03", img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80", alt: "Complete gas handling systems", href: "/gas-trains", title: "Complete Gas Handling Systems", desc: "Gastech designs, supplies and commissions complete gas handling skids and stations to your duty.", specs: ["Turnkey skids", "Engineered to spec", "Install & commission"], flag: true },
  { idx: "04", img: "https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1200&q=80", alt: "Gas regulation stations", href: "/pf-regulators", title: "Gas Regulation Stations", desc: "Pietro Fiorentini regulation and pressure-control stations for safe, steady supply.", specs: ["Regulation & safety", "Sized to flow", "Certified components"] },
  { idx: "05", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80", alt: "Gas metering stations", href: "/flow-meters", title: "Gas Metering Stations", desc: "Pietro Fiorentini metering stations for accurate, billable gas measurement.", specs: ["Turbine & rotary", "Accurate billing", "Turnkey build"] },
  { idx: "06", img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=80", alt: "Gas flow meters and EVC", href: "/flow-meters", title: "Gas Flow Meters & EVC", desc: "IM-series flow meters with electronic volume correction for precise measurement.", specs: ["Flow meters", "Electronic correction", "Hydrogen options"] },
  { idx: "07", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80", alt: "Gas leak detection and shutoff", href: "/gasvigil", title: "Gas Leak Detection & Shutoff", desc: "Gasvigil leak detection with automatic shutoff to protect people and plant.", specs: ["Continuous sensing", "Auto shutoff", "Alarm & interlock"] },
  { idx: "08", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80", alt: "Hydrogen solutions", href: "/pf-regulators", title: "Hydrogen Solutions", desc: "Pietro Fiorentini hydrogen-ready regulation, metering and flow measurement.", specs: ["Hydrogen-ready", "High accuracy", "Certified"] },
];

const BRANDS = [
  { num: "01", img: `${IMG}/burner/gas-burner.png`, alt: "Riello burners", name: "Riello", desc: "Industrial burners for gas, light oil, heavy oil and dual fuel." },
  { num: "02", img: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pietro Fiorentini gas equipment", name: "Pietro Fiorentini", desc: "Gas regulation and metering stations, flow meters and EVC." },
  { num: "03", img: `${IMG}/IM-TM%20turbine.jpg`, alt: "Gastech gas flow meters and systems", name: "Gastech", desc: "Our own complete gas handling systems and IM flow meters." },
  { num: "04", img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, alt: "Gasvigil leak detection", name: "Gasvigil", desc: "Gas leak detection and automatic shutoff safety systems." },
];

const FACILITIES = [
  { idx: "01", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80", alt: "Application engineering", title: "Design & Engineering", desc: "Systems are engineered to your duty, gas type and site conditions, with the right brand and sizing for the job.", tag: "settings", tagText: "Application engineering" },
  { idx: "02", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80", alt: "Gas system integration", title: "Supply & Integration", desc: "We source from our partner brands and integrate regulation, metering, safety and control into a working system.", tag: "factory", tagText: "Systems integration", flip: true },
  { idx: "03", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80", alt: "Quality control and testing", title: "Quality & Testing", desc: "Pressure and performance testing prove every system before handover, so commissioning on site is clean.", tag: "award", tagText: "Tested & commissioned" },
];

const STEPS = [
  { n: "1", title: "Enquiry & study", desc: "We assess your gas demand and site." },
  { n: "2", title: "Design", desc: "Sizing and layout engineered to spec." },
  { n: "3", title: "Supply & assembly", desc: "Sourced from our brands, assembled and tested." },
  { n: "4", title: "Install & commission", desc: "On-site setup and performance proof." },
  { n: "5", title: "Service & AMC", desc: "Long-term uptime and support." },
];

const SERVICES = [
  { num: "S / 01", icon: "chat", title: "Technical Consultancy", desc: "Sizing, layout and gas-strategy guidance from application through to commissioning." },
  { num: "S / 02", icon: "wrench", title: "Upgrading, Revamping & Servicing", desc: "Modernise and overhaul existing plants to restore and raise performance." },
  { num: "S / 03", icon: "calendar", title: "Annual Maintenance Contracts", desc: "Planned AMC cover so uptime is protected and surprises are engineered out." },
];

const STD_LIST = ["Riello burners", "Pietro Fiorentini", "IM flow meters & EVC", "Gasvigil safety", "In-house engineering & service"];
const MATERIALS = [
  { icon: "layers", title: "Industrial Burners", desc: "Gas, oil and dual fuel." },
  { icon: "gear", title: "Regulation & Metering", desc: "Stations, flow meters, EVC." },
  { icon: "molecule", title: "Leak Detection", desc: "Sensing and auto shutoff." },
  { icon: "chip", title: "Hydrogen Solutions", desc: "Hydrogen-ready regulation & metering." },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Gastech product range",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.h1,
    url: absoluteUrl(`/${p.slug}`),
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[...siteGraph(), itemListSchema]} />
      <main id="main">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-h">
          <div className="hero-media" aria-hidden="true">
            {/* gt-suppressed switches off site.css's 90px runtime-blur heat (no-blur
                rule) now that a real photo carries the hero. */}
            <div className="hero-heat gt-suppressed" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-photo" src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80" alt="" loading="eager" decoding="async" />
            <span className="hero-scrim" />
          </div>
          <div className="wrap hero-inner">
            <RiseIn className="hero-copy">
              <p className="eyebrow eyebrow--light">Pune, India / Combustion &amp; Gas Safety</p>
              <h1 id="hero-h" className="split">
                <span className="line">Combustion and gas safety,</span>
                <span className="line"><em>engineered</em> to perform.</span>
              </h1>
              <p className="lede">Gastech Combustions supplies and services industrial burners, gas regulation and metering stations, gas flow meters, hydrogen solutions and gas-leak detection systems, backed by the global brands we represent.</p>
              <div className="hero-cta">
                <a className="btn btn--primary fx-magnetic" href="#capabilities">Explore Capabilities <Icon name="arrow" /></a>
                <Link className="btn btn--outline fx-magnetic" href="/contact">Talk to an Engineer</Link>
              </div>
            </RiseIn>
            <aside className="hero-card" aria-label="Company at a glance">
              <p className="hero-card-k">At a glance</p>
              <ul>
                <li><b><Counter to={3} /></b><span>Global brands represented</span></li>
                <li><b><Counter to={8} /></b><span>Product categories</span></li>
                <li><b><Counter to={3} /></b><span>Service lines</span></li>
              </ul>
              <a className="hero-card-link" href="#facilities">Inside our facilities <Icon name="arrow-dl" /></a>
            </aside>
          </div>
          <a className="scroll-cue" href="#ticker" aria-label="Scroll down"><span /></a>
        </section>

        <div id="ticker"><Marquee /></div>

        {/* STATEMENT */}
        <section className="sec statement" aria-labelledby="statement-h">
          <div className="wrap">
            <p className="eyebrow">Who we are</p>
            <h2 id="statement-h" className="statement-h" data-reveal>
              We are a Pune-based supplier and integrator of <u>industrial combustion, gas regulation, metering and gas-safety systems</u>, backed by the global brands we represent.
            </h2>
            <div className="statement-grid" data-stagger>
              <div className="sm-item"><span className="sm-k">Base</span><span className="sm-v">Pune, India</span></div>
              <div className="sm-item"><span className="sm-k">Brands</span><span className="sm-v">Riello, Pietro Fiorentini, Gasvigil</span></div>
              <div className="sm-item"><span className="sm-k">Services</span><span className="sm-v">Installation, AMC &amp; consultancy</span></div>
              <div className="sm-item"><span className="sm-k">Focus</span><span className="sm-v">Safe, efficient gas systems</span></div>
            </div>
            <figure className="statement-fig" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80" alt="Gastech application engineers at work on gas equipment" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="sec sec--dark" id="capabilities" aria-labelledby="cap-h">
          <div className="wrap">
            <header className="sec-head sec-head--dark">
              <p className="eyebrow eyebrow--light">01 / Capabilities</p>
              <h2 id="cap-h" data-reveal>Combustion and gas safety. <u>From brands we represent.</u></h2>
              <p className="sub" data-reveal>Industrial burners, gas regulation and metering, flow measurement, leak detection and hydrogen-ready systems, supplied and serviced by Gastech.</p>
            </header>
          </div>
          <Carousel
            className="carousel"
            viewportClassName="car-viewport"
            trackClassName="car-track"
            maxPerView={4}
            slides={CAPABILITIES.map((c) => (
              <article key={c.idx} className={c.flag ? "cap-card cap-card--flag" : "cap-card"}>
                <div className="cap-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.alt} loading="lazy" decoding="async" />
                  {c.flag && <span className="badge">Own line</span>}
                  <span className="cap-idx">{c.idx}</span>
                </div>
                <div className="cap-body">
                  {c.flag && <span className="mono-tag">Flagship</span>}
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <ul className="cap-specs">{c.specs.map((s) => <li key={s}>{s}</li>)}</ul>
                  <Link className="cap-more" href={c.href}>{c.flag ? "Explore" : "Enquire"} <Icon name="arrow" /></Link>
                </div>
              </article>
            ))}
          />
          <div className="wrap cap-foot">
            <p>A complete range of combustion and gas-safety equipment. Request the full catalogue for sizes, capacities and options.</p>
            <Link className="btn btn--ghost-light fx-magnetic" href="/products">Request the full range <Icon name="arrow" /></Link>
          </div>
        </section>

        {/* BRANDS */}
        <section className="sec" id="industries" aria-labelledby="ind-h">
          <div className="wrap">
            <SectionHead eyebrow="02 / Brands we represent" title={<>Global brands, <u>local accountability.</u></>} sub="We supply, install and support equipment from the manufacturers we represent:" />
            <div className="ind-grid" data-stagger>
              {BRANDS.map((b) => (
                <Link className="ind-card" key={b.num} href="/brands">
                  <div className="ind-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.img} alt={b.alt} loading="lazy" decoding="async" /></div>
                  <div className="ind-body"><span className="ind-num">{b.num}</span><h3>{b.name}</h3><p>{b.desc}</p><span className="ind-more">Enquire <Icon name="arrow" /></span></div>
                </Link>
              ))}
            </div>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/brands">Explore all brands we represent <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* FACILITIES */}
        <section className="sec sec--sunken" id="facilities" aria-labelledby="fac-h">
          <div className="wrap">
            <SectionHead eyebrow="03 / How we deliver" title={<>From spec to <u>sustained uptime.</u></>} sub="Gastech engineers, supplies, commissions and services complete gas systems. One accountable partner means consistent quality and dependable delivery." />
            <div className="fac-list" data-stagger>
              {FACILITIES.map((f) => (
                <article className={f.flip ? "fac-item fac-item--flip" : "fac-item"} key={f.idx}>
                  <div className="fac-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={f.img} alt={f.alt} loading="lazy" decoding="async" /><span className="fac-idx">{f.idx}</span></div>
                  <div className="fac-body"><h3>{f.title}</h3><p>{f.desc}</p><span className="fac-tag"><Icon name={f.tag} /> {f.tagText}</span></div>
                </article>
              ))}
            </div>
            <div className="ind-foot" data-reveal>
              <Link className="btn btn--ghost fx-magnetic" href="/delivery">See how we deliver <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        {/* STANDARDS + MATERIALS */}
        <section className="sec sec--dark band-standards" aria-labelledby="std-h">
          <div className="wrap">
            <div className="std-head">
              <p className="eyebrow eyebrow--light">Standards &amp; materials</p>
              <h2 id="std-h" data-reveal>Engineered around <u>trusted brands.</u></h2>
            </div>
            <ul className="std-strip" data-stagger>
              {STD_LIST.map((s) => <li key={s}><Icon name="check" /> {s}</li>)}
            </ul>
            <div className="mat-grid" data-stagger>
              {MATERIALS.map((m) => (
                <div className="mat-item" key={m.title}><Icon name={m.icon} /><h3>{m.title}</h3><p>{m.desc}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="sec" id="process" aria-labelledby="proc-h">
          <div className="wrap">
            <SectionHead eyebrow="04 / How we work" title={<>From enquiry to <u>ongoing support.</u></>} sub="A single accountable partner for your gas system, from first study to lifetime servicing." />
            <StepsTimeline steps={STEPS} />
          </div>
        </section>

        {/* SERVICES */}
        <section className="sec sec--sunken" id="services" aria-labelledby="svc-h">
          <div className="wrap">
            <SectionHead eyebrow="Services" title={<>Beyond the <u>equipment.</u></>} sub="Three service lines keep your gas plant running at design performance for its whole life." />
            <div className="svc-grid" data-stagger>
              {SERVICES.map((s) => (
                <article className="svc" key={s.num}>
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-ic" aria-hidden="true"><Icon name={s.icon} /></span>
                  <div className="svc-main"><h3>{s.title}</h3><p>{s.desc}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* REFERENCES */}
        <section className="sec" id="company" aria-labelledby="ref-h">
          <div className="wrap">
            <SectionHead eyebrow="05 / Company" title={<>Trusted where the <u>gas matters.</u></>} sub="A snapshot of the sectors and standards behind our work. Client references and project case studies available on request." />
            <div className="quote-marquee" aria-hidden="true">
              <div className="qm-track">
                <div className="qm-row">{["Steel","Pharma","Automotive","Food & Beverage","Chemicals","Electronics","Petrochemicals","Water Treatment","Power","Cement"].map((t) => <span key={t}>{t}</span>)}</div>
                <div className="qm-row">{["Steel","Pharma","Automotive","Food & Beverage","Chemicals","Electronics","Petrochemicals","Water Treatment","Power","Cement"].map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </div>
            <div className="ref-grid" data-stagger>
              {[0, 1, 2].map((i) => (
                <figure className="ref-card" key={i}>
                  <Icon name="quote" className="ref-q" />
                  <blockquote>Add a real client reference here, describing the outcome Gastech delivered.</blockquote>
                  <figcaption><b>Client name</b><span>Sector / role</span></figcaption>
                </figure>
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
                <h2 id="contact-h" data-reveal>Find the right burner or gas system. <u>Talk to Gastech.</u></h2>
                <p className="sub" data-reveal>Reach the Gastech team about burners, gas regulation, metering, leak detection or hydrogen solutions, or ask for a quote, a site study or technical advice.</p>
              </div>
              <div className="cta-actions" data-reveal>
                <EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="General enquiry">Get a Quote</EnquiryButton>
                <a className="cta-phone" href={SITE.contact.phonePrimaryHref}><Icon name="phone" /> {SITE.contact.phonePrimary}</a>
              </div>
            </div>
            <div className="contact-grid" data-stagger>
              <a className="contact-card" href={SITE.contact.phonePrimaryHref}><span className="cc-num">01</span><span className="contact-ic"><Icon name="phone" /></span><span className="k">Phone</span><span className="v">{SITE.contact.phonePrimary}</span><span className="contact-go">Call now <Icon name="arrow" /></span></a>
              <a className="contact-card" href={`mailto:${SITE.contact.salesEmail}`}><span className="cc-num">02</span><span className="contact-ic"><Icon name="mail" /></span><span className="k">Email</span><span className="v">{SITE.contact.salesEmail}</span><span className="contact-go">Send email <Icon name="arrow" /></span></a>
              <a className="contact-card" href={SITE.contact.mapUrl} target="_blank" rel="noopener"><span className="cc-num">03</span><span className="contact-ic"><Icon name="pin" /></span><span className="k">Works</span><span className="v">{SITE.contact.worksAddress}</span><span className="contact-go">Get directions <Icon name="arrow" /></span></a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
