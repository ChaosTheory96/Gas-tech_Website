import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { contactPageSchema, localBusinessSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";

export const metadata = buildMetadata({
  title: "Contact Gastech Combustions | Pune Gas Train Supplier",
  description:
    "Contact Gastech Combustions, Bavdhan, Pune. Call, WhatsApp or send an enquiry for gas trains, regulators, burners and leak detectors.",
  path: "/contact-us/",
  keywords: ["contact gastech", "gas burner company pune", "burner enquiry", "gas systems contact", "Pune"],
});

const C = SITE.contact;

const DETAILS = [
  {
    idx: "Hours",
    kicker: "When you can reach us",
    title: "Office hours",
    points: [
      "Monday to Friday: 9:30 to 5:30",
      "Saturday: 9:30 to 1:00",
      "Sunday: closed",
    ],
  },
  {
    idx: "Offices",
    kicker: "Where we are",
    title: "Two Pune locations",
    points: [
      `Works: ${C.worksAddress}`,
      `Registered office: ${C.registeredAddress}`,
    ],
  },
  {
    idx: "Direct",
    kicker: "Call or write",
    title: "Sales and support",
    points: [
      `Phone: ${C.phonePrimary} / ${C.phoneSecondary}`,
      `Sales: ${C.salesEmail}`,
      `Technical: ${C.technicalEmail}`,
    ],
  },
];

const MAP_SRC =
  "https://maps.google.com/maps?q=Dangat%20Industrial%20Estate%2C%20NDA%20Road%2C%20Shivane%2C%20Pune%20411023&output=embed";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact-us/" },
];
void crumbs; // breadcrumb markup retired per sheet row P03 (ContactPage + LocalBusiness only); visible crumbs stay

export default function ContactPage() {
  return (
    <>
      {/* Sheet row P03: ContactPage + LocalBusiness (address, phone, hours).
          No geo block: unverified pinpoints would be an invented fact. */}
      <JsonLd
        data={[
          contactPageSchema(
            "/contact-us/",
            "Contact Gastech Combustions",
            "Contact Gastech Combustions, Bavdhan, Pune. Call, WhatsApp or send an enquiry for gas trains, regulators, burners and leak detectors.",
          ),
          localBusinessSchema(),
        ]}
      />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Contact</span>
            </div>
            <p className="eyebrow" data-reveal>Contact</p>
            <h1 className="split">
              <span className="line">Contact{" "}</span>
              <span className="line"><em>Gastech Combustions</em></span>
            </h1>
            <p className="lede" data-reveal>Reach the Gastech team about burners, gas regulation, metering, leak detection or hydrogen solutions, or ask for a quote, a site study or technical advice. We reply within one business day.</p>
            <div className="intro-cta" data-reveal>
              <EnquiryButton className="btn btn--primary" type="sales" product="Contact">Send an enquiry</EnquiryButton>
              <a className="btn--tech" href={C.phonePrimaryHref}><Icon name="phone" /> Call {C.phonePrimary}</a>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="sec sec--dark contact-cta" id="reach" aria-labelledby="contact-h">
          <div className="wrap">
            <div className="cta-head">
              <div className="cta-head-copy">
                <p className="eyebrow eyebrow--light">Ready when you are</p>
                <h2 id="contact-h" data-reveal>Find the right burner or gas system. <u>Talk to Gastech.</u></h2>
                <p className="sub" data-reveal>Call, email or open an enquiry. Tell us the fuel, duty and site, and an engineer will come back with the right equipment and a quotation.</p>
              </div>
              <div className="cta-actions" data-reveal>
                <EnquiryButton className="btn btn--primary fx-magnetic" type="sales" product="Contact">Get a Quote</EnquiryButton>
                <a className="cta-phone" href={C.phonePrimaryHref}><Icon name="phone" /> {C.phonePrimary}</a>
              </div>
            </div>
            <div className="contact-grid" data-stagger>
              <a className="contact-card" href={C.phonePrimaryHref}>
                <span className="cc-num">01</span>
                <span className="contact-ic"><Icon name="phone" /></span>
                <span className="k">Phone</span>
                <span className="v">{C.phonePrimary}</span>
                <span className="contact-go">Call now <Icon name="arrow" /></span>
              </a>
              <a className="contact-card" href={`mailto:${C.salesEmail}`}>
                <span className="cc-num">02</span>
                <span className="contact-ic"><Icon name="mail" /></span>
                <span className="k">Email</span>
                <span className="v">{C.salesEmail}</span>
                <span className="contact-go">Send email <Icon name="arrow" /></span>
              </a>
              <a className="contact-card" href={C.mapUrl} target="_blank" rel="noopener">
                <span className="cc-num">03</span>
                <span className="contact-ic"><Icon name="pin" /></span>
                <span className="k">Works</span>
                <span className="v">{C.worksAddress}</span>
                <span className="contact-go">Get directions <Icon name="arrow" /></span>
              </a>
            </div>
          </div>
        </section>

        <section className="sec" id="details" aria-labelledby="det-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The details"
              title={<>Hours, offices <u>and direct lines.</u></>}
              sub={<>Gastech Combustions Pvt Ltd, Pune. Reach sales for quotations and the technical desk for application advice.</>}
            />
            <div className="var-grid" data-stagger>
              {DETAILS.map((d) => (
                <article className="var-card" data-tilt key={d.idx}>
                  <span className="v-idx">{d.idx}</span>
                  <div className="v-k">{d.kicker}</div>
                  <h3>{d.title}</h3>
                  <ul>
                    {d.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec--sunken" id="map" aria-labelledby="map-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Visit us"
              title={<>Find the <u>works.</u></>}
              sub={<>Dangat Industrial Estate, NDA Road, Shivane, Pune 411023. The registered office is at Vantage Towers, Bavdhan Khurd. <a href={C.mapUrl} target="_blank" rel="noopener">Open in Google Maps</a>.</>}
            />
            <div data-reveal>
              <iframe
                title="Gastech Combustions works location map"
                src={MAP_SRC}
                width="100%"
                height="420"
                style={{ border: 0, borderRadius: "var(--r-card,16px)", display: "block", width: "100%", height: "clamp(300px,42vh,460px)", filter: "grayscale(.2)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
