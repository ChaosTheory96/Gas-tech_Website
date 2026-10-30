import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import { getProduct } from "@/lib/products";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";

export const metadata = buildMetadata({
  title: "Authorised Brands: Pietro Fiorentini, Riello, Gasvigil",
  description:
    "Gastech Combustions is the authorised distributor of Pietro Fiorentini gas regulation, Riello burners and Gasvigil gas detectors in India. See each range.",
  path: "/brands/",
  keywords: ["Riello distributor Pune", "Pietro Fiorentini India", "Gasvigil dealer", "industrial burner brands", "gas safety brands"],
});

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

/* Product pointers resolve through lib/products.ts so the client URL scheme is
   written down exactly once. */
const toRoute = (slug: string): string => getProduct(slug)?.route ?? "/";

const BRANDS = [
  {
    idx: "01",
    name: "Riello",
    img: `${IMG}/burner/riello-burner/light-oil-burner-02-stage.jpg`,
    alt: "Riello industrial burner",
    desc: "Italian industrial burners for natural gas, LPG, light oil, heavy oil and dual-fuel duty, from one-stage to fully modulating, sized to your boiler or process.",
    tagIcon: "flame",
    tag: "Combustion",
    flip: false,
    links: [
      { href: toRoute("gas-burners"), label: "Gas burners" },
      { href: toRoute("light-oil-burners"), label: "Light oil" },
      { href: toRoute("dual-fuel-burners"), label: "Dual fuel" },
    ],
  },
  {
    idx: "02",
    name: "Pietro Fiorentini",
    img: `${IMG}/PF/Aperflux%20851.jpg`,
    alt: "Pietro Fiorentini gas regulator",
    desc: "Gas pressure regulation and metering: governors, slam shut-off and relief valves, flow meters with electronic volume correction, and hydrogen-ready trains for steady, measurable and protected supply.",
    tagIcon: "gauge",
    tag: "Regulation & metering",
    flip: true,
    links: [
      { href: toRoute("pressure-regulators"), label: "Regulators" },
      { href: toRoute("flow-meters"), label: "Flow meters" },
      { href: toRoute("safety-valves"), label: "Safety valves" },
    ],
  },
  {
    idx: "03",
    name: "Gasvigil",
    img: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`,
    alt: "Gasvigil gas leak detector",
    desc: "Continuous gas-leak detection and automatic shutoff: fixed, panelled, stand-alone and portable systems that protect people and plant, with alarm and interlock outputs into your control scheme.",
    tagIcon: "shield",
    tag: "Gas safety",
    flip: false,
    links: [{ href: toRoute("gasvigil"), label: "Leak detection" }],
  },
  {
    idx: "04",
    name: "Gastech Systems",
    img: `${IMG}/IM-TM%20turbine.jpg`,
    alt: "Gastech gas systems and flow meters",
    desc: "Our own turnkey gas-handling assemblies, gas trains and IM-series flow meters, engineered, assembled and tested in Pune, then installed and supported by our in-house service team.",
    tagIcon: "manifold",
    tag: "Turnkey systems",
    flip: true,
    links: [
      { href: toRoute("gas-trains"), label: "Gas trains" },
      { href: "/services/", label: "Services" },
    ],
  },
];

const CHECKS = [
  "Riello burners",
  "Pietro Fiorentini",
  "IM flow meters & EVC",
  "Gasvigil safety",
  "In-house engineering & service",
];

const WHY = [
  { icon: "award", title: "Authorised supply", desc: "Genuine equipment and documentation from the brands we represent." },
  { icon: "settings", title: "Application engineering", desc: "The right brand, model and sizing for your duty, not just a catalogue sale." },
  { icon: "wrench", title: "Install & commission", desc: "On-site setup and performance proof by our own team." },
  { icon: "calendar", title: "AMC & spares", desc: "Long-term uptime, genuine parts and priority support." },
];

const RANGE = ["gas-burners", "dual-fuel-burners", "pressure-regulators", "flow-meters", "safety-valves", "gasvigil"];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Brands", href: "/brands/" },
];
void crumbs; // breadcrumb markup retired per sheet row P10 (CollectionPage + ItemList only); visible crumbs stay

export default function BrandsPage() {
  return (
    <>
      {/* Sheet row P10: CollectionPage + ItemList. Only Gasvigil has its own
          brand route today, so only that ListItem carries a url; the others
          stay on this page's own sections. */}
      <JsonLd
        data={[
          collectionPageSchema(
            "/brands/",
            "Brands We Represent",
            "Gastech Combustions is the authorised distributor of Pietro Fiorentini gas regulation, Riello burners and Gasvigil gas detectors in India. See each range.",
          ),
          itemListSchema(
            "Brands We Represent",
            "/brands/",
            BRANDS.map((b) => ({
              name: b.name,
              desc: b.desc,
              ...(b.name === "Gasvigil" ? { url: toRoute("gasvigil") } : {}),
            })),
          ),
        ]}
      />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Brands</span>
            </div>
            <p className="eyebrow" data-reveal>Brands we represent</p>
            <h1 className="split">
              <span className="line">Brands{" "}</span>
              <span className="line"><em>We Represent</em></span>
            </h1>
            <p className="lede" data-reveal>Gastech Combustions is the Pune-based representative for world-class combustion and gas-safety manufacturers. We supply, size, install and service their equipment, so you get genuine products, correct engineering and one accountable partner from enquiry to uptime.</p>
            <div className="intro-cta" data-reveal>
              <a className="btn btn--primary" href="#riello">Explore the brands <Icon name="arrow" /></a>
              <EnquiryButton className="btn--tech" type="technical" product="Brand enquiry" icon="chat">Talk to a brand specialist</EnquiryButton>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="sec sec--sunken" id="riello" aria-labelledby="bp-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The manufacturers"
              title={<>Four names behind <u>every system.</u></>}
              sub="Each brand is chosen for what it does best. We put the right one against your duty, then engineer, install and maintain it."
            />
            <div className="fac-list" data-stagger>
              {BRANDS.map((b) => (
                <article className={b.flip ? "fac-item fac-item--flip" : "fac-item"} key={b.idx}>
                  <div className="fac-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.img} alt={b.alt} loading="lazy" decoding="async" />
                    <span className="fac-idx">{b.idx}</span>
                  </div>
                  <div className="fac-body">
                    <h3>{b.name}</h3>
                    <p>{b.desc}</p>
                    <span className="fac-tag"><Icon name={b.tagIcon} /> {b.tag}</span>
                    <div className="hero-cta" style={{ marginTop: 16 }}>
                      {b.links.map((l) => (
                        <Link key={l.href} className="btn btn--ghost btn--sm" href={l.href}>
                          {l.label} <Icon name="arrow" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec--dark band-standards" aria-labelledby="why-h">
          <div className="wrap">
            <div className="std-head">
              <p className="eyebrow eyebrow--light">Working with Gastech</p>
              <h2 id="why-h" data-reveal>One partner, <u>start to uptime.</u></h2>
            </div>
            <ul className="std-strip" data-stagger>
              {CHECKS.map((c) => (
                <li key={c}><Icon name="check" /> {c}</li>
              ))}
            </ul>
            <div className="mat-grid" data-stagger>
              {WHY.map((w) => (
                <div className="mat-item" key={w.title}>
                  <Icon name={w.icon} />
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              ))}
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
            <div className="rel-grid rel-grid--3" data-stagger>
              {RANGE.map((slug) => {
                const p = getProduct(slug);
                if (!p) return null;
                const img = p.slides[0]?.src;
                return (
                  <Link className="rel-card" key={slug} href={p.route}>
                    <div className="rc-media">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={img} alt={p.h1} loading="lazy" decoding="async" /></div>
                    <div className="rc-body">
                      <span>{p.brand}</span>
                      <h3>{p.navLabel}</h3>
                      <p>{p.lead}</p>
                      <span className="rc-go">View range <Icon name="arrow" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title="Talk to a brand specialist." sub="Tell us the fuel, duty and site, and we will put the right brand and model against your application." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Brand enquiry">Request a quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product="Brand enquiry" icon="chat">Ask a technical question</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
