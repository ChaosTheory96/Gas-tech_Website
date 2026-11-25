import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { contactPageSchema, localBusinessSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";

export const metadata = buildMetadata({
  title: "Contact Gastech Combustions | Pune Gas Train Supplier",
  description:
    "Contact Gastech Combustions, Bavdhan Khurd, Pune. Send an enquiry or email us for gas trains, regulators, burners and leak detectors.",
  path: "/contact-us/",
  keywords: ["contact gastech", "gas burner company pune", "burner enquiry", "gas systems contact", "Pune"],
});

const C = SITE.contact;

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
            "Contact Gastech Combustions, Bavdhan Khurd, Pune. Send an enquiry or email us for gas trains, regulators, burners and leak detectors.",
          ),
          localBusinessSchema(),
        ]}
      />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Contact" }]}
          title={<>
            <span className="line">Contact{" "}</span>
            <span className="line"><em>Gastech Combustions</em></span>
          </>}
          lede={<>Tell us your gas type, duty and site. We will come back with a quotation, a site study or technical advice on burners, gas regulation, metering, valves, leak detection or hydrogen solutions.</>}
          primary={<EnquiryButton className="btn btn--primary" type="sales" product="Contact">Send an enquiry</EnquiryButton>}
          center
        />

        <section className="sec sec--dark contact-cta" id="reach" aria-labelledby="contact-h">
          <div className="wrap">
            <div className="cta-head">
              <div className="cta-head-copy">
                <p className="eyebrow eyebrow--light">Write to us</p>
                <h2 id="contact-h" data-reveal>Two inboxes, <u>one team.</u></h2>
                <p className="sub" data-reveal>Sales for quotations, the technical desk for application advice.</p>
              </div>
            </div>
            <div className="contact-grid" data-stagger>
              <a className="contact-card" href={`mailto:${C.salesEmail}`}>
                <span className="cc-num">01</span>
                <span className="contact-ic"><Icon name="mail" /></span>
                <span className="k">Sales</span>
                <span className="v">{C.salesEmail}</span>
                <span className="contact-go">Send email <Icon name="arrow" /></span>
              </a>
              <a className="contact-card" href={`mailto:${C.technicalEmail}`}>
                <span className="cc-num">02</span>
                <span className="contact-ic"><Icon name="chat" /></span>
                <span className="k">Technical</span>
                <span className="v">{C.technicalEmail}</span>
                <span className="contact-go">Send email <Icon name="arrow" /></span>
              </a>
            </div>
          </div>
        </section>

        <section className="sec sec--sunken" id="map" aria-labelledby="map-h">
          <div className="wrap map-split">
            <div className="map-frame" data-reveal>
              <iframe
                title="Gastech Combustions corporate office location map"
                src={C.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="map-copy">
              <SectionHead
                eyebrow="Visit us"
                title={<>Find our <u>corporate office.</u></>}
              />
              <address className="map-address">
                Brahma Corp Vantage Towers, C-1005, 10th Floor,<br />
                Bavdhan Khurd, Pune 411021
              </address>
              <p className="map-note">Monday to Friday 9:30 to 5:30, Saturday 9:30 to 1:00. Write to <a href={`mailto:${C.salesEmail}`}>{C.salesEmail}</a> before you visit so the right engineer is available.</p>
              <a className="btn btn--primary" href={C.mapUrl} target="_blank" rel="noopener">Open in Google Maps <Icon name="arrow" /></a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
