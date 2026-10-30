import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema, collectionPageSchema, itemListSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import ServiceStation, { type ServiceData } from "@/components/ServiceStation";

export const metadata = buildMetadata({
  title: "Burner Installation, Commissioning & AMC | Gastech",
  description:
    "Installation, commissioning and annual maintenance contracts for industrial burners and gas systems in Pune and Maharashtra. Do it right first time.",
  path: "/services/",
  keywords: ["gas burner services", "installation and commissioning", "annual maintenance contract", "technical consultancy", "Pune"],
});

// One dedicated section per service line. Every word is carried over from the
// real SERVICE_LINES + DELIVERS copy (nothing invented); the only structural
// change is promoting each service out of a shared card grid into its own band
// with imagery, its detail points and a service-specific call to action.
type ServiceEntry = ServiceData & {
  tone: "plain" | "sunken";
  flip: boolean;
  cta: { type: "sales" | "technical"; label: string };
};

const SERVICES: ServiceEntry[] = [
  {
    num: "01",
    code: "ENG",
    kicker: "Up front",
    title: "Technical Consultancy",
    lead: "Detailed understanding of your application, then appropriate selection and sizing during your procurement stage, not just trading of products.",
    points: [
      { label: "Application study", text: "we understand your process, gas, duty and site before recommending anything." },
      { label: "Selection & sizing", text: "the right equipment and configuration during your procurement stage." },
    ],
    img: "https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1200&q=80",
    alt: "Gas pressure regulation station engineered to a site duty",
    tone: "plain",
    flip: false,
    cta: { type: "technical", label: "Discuss your application" },
  },
  {
    num: "02",
    code: "I&C",
    kicker: "Getting live",
    title: "Installation & Commissioning",
    lead: "Expert installation and thorough testing and calibration, from initial setup to final activation, so your system fires up and runs efficiently.",
    points: [
      { label: "Expert Installation", text: "skilled technicians set up your burner safely to manufacturer specifications and industry standards." },
      { label: "Comprehensive Commissioning", text: "detailed testing and calibration of all parameters, configurations and connections." },
    ],
    img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80",
    alt: "Complete gas handling system installed on site",
    tone: "sunken",
    flip: true,
    cta: { type: "sales", label: "Request an installation visit" },
  },
  {
    num: "03",
    code: "AMC",
    kicker: "Ongoing care",
    title: "Annual Maintenance Contract",
    lead: "Comprehensive support for your burners and gas systems, designed to ensure optimal performance and minimize downtime through proactive care.",
    points: [
      { label: "Scheduled Maintenance", text: "regularly planned inspections and servicing to keep your burner running efficiently and catch issues early." },
      { label: "Priority Support", text: "dedicated team with priority response for any issue or emergency, minimising disruption." },
    ],
    img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80",
    alt: "Scheduled maintenance and testing of gas equipment",
    tone: "plain",
    flip: false,
    cta: { type: "sales", label: "Ask about an AMC" },
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services/" },
];
void crumbs; // breadcrumb markup retired per sheet row P90 (CollectionPage + ItemList + Service); visible crumbs stay

export default function ServicesPage() {
  return (
    <>
      {/* Sheet row P90: CollectionPage + ItemList + Service. The ItemList names
          the three service lines shown on this page. */}
      <JsonLd
        data={[
          collectionPageSchema(
            "/services/",
            "Services: Installation, Commissioning and AMC",
            "Installation, commissioning and annual maintenance contracts for industrial burners and gas systems in Pune and Maharashtra. Do it right first time.",
          ),
          itemListSchema(
            "Services: Installation, Commissioning and AMC",
            "/services/",
            SERVICES.map((s) => ({ name: s.title, desc: s.lead })),
          ),
          serviceSchema(
            "Gas burner and gas system services",
            "Technical consultancy, installation and commissioning, and annual maintenance contracts for industrial burners and gas systems in Pune.",
            "/services/"
          ),
        ]}
      />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <div className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Services</span>
            </div>
            <p className="eyebrow" data-reveal>Professional services</p>
            <h1 className="split">
              <span className="line">Services:{" "}</span>
              <span className="line">Installation, Commissioning <em>and</em> AMC</span>
            </h1>
            <p className="lede" data-reveal>From the first enquiry we work to understand your application and offer a comprehensive solution, not just a product. Our post-sales services carry the same trust seal as the equipment we supply.</p>
            <div className="intro-cta" data-reveal>
              <a className="btn btn--primary" href="#services">Explore services <Icon name="arrow" /></a>
              <EnquiryButton className="btn--tech" type="technical" product="Service enquiry" icon="chat">Talk to our team</EnquiryButton>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="sec" id="services">
          <div className="wrap">
            <SectionHead
              eyebrow="Three service lines"
              title={<>Support across the <u>whole life</u> of your system.</>}
              sub="Selection and sizing during procurement, then expert installation, commissioning and long-term care."
            />
          </div>
        </section>

        {SERVICES.map((s) => (
          <section key={s.num} className={s.tone === "sunken" ? "sec sec--sunken" : "sec"}>
            <div className="wrap">
              <ServiceStation data={s} flip={s.flip}>
                <EnquiryButton className="btn btn--primary" type={s.cta.type} product={`${s.title} enquiry`}>{s.cta.label}</EnquiryButton>
              </ServiceStation>
            </div>
          </section>
        ))}

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title="Put your system in good hands." sub="Ask for an AMC, an installation and commissioning visit, or technical advice on a new application." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Service enquiry">Request a quote</EnquiryButton>
              <EnquiryButton className="btn--tech" type="technical" product="Service enquiry" icon="chat">Talk to our team</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
