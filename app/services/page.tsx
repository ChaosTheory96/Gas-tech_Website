import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema, collectionPageSchema, itemListSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import { PageHero } from "@/components/PageHero";
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
};

const SERVICES: ServiceEntry[] = [
  {
    num: "01",
    code: "ENG",
    kicker: "Up front",
    title: "Technical Consultancy",
    lead: "Detailed understanding of your application, then appropriate selection and sizing during your procurement stage.",
    points: [
      { label: "Application study", text: "we understand your process, gas, duty and site before recommending anything." },
      { label: "Selection & sizing", text: "the right equipment and configuration during your procurement stage." },
    ],
    img: "/images/editorial/engineer.jpg",
    alt: "An industrial technician inspecting equipment",
    tone: "plain",
    flip: false,
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
    img: "/images/editorial/pipework.jpg",
    alt: "A technician working on an industrial pipe assembly",
    tone: "sunken",
    flip: true,
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
    img: "/images/editorial/inspection.jpg",
    alt: "A worker inspecting industrial machinery",
    tone: "plain",
    flip: false,
  },
];

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
        <PageHero
          backgroundSrc="/images/editorial/pipework.jpg"
          crumbs={[{ label: "Services" }]}
          title={<>
            <span className="line">Installation, Commissioning</span>
            <span className="line"><em>and AMC</em></span>
          </>}
          lede={<>Consultancy before you buy, installation and commissioning when you do, and maintenance contracts for the whole life of your gas system, all by our own team.</>}
          primary={<a className="btn btn--primary" href="#services">Explore services <Icon name="arrow" /></a>}
          secondary={<EnquiryButton className="btn--tech" type="technical" product="Service enquiry" icon="chat">Talk to our team</EnquiryButton>}
          center
        />

        {SERVICES.map((s, i) => (
          <section key={s.num} id={i === 0 ? "services" : undefined} className={s.tone === "sunken" ? "sec sec--sunken" : "sec"}>
            <div className="wrap">
              <ServiceStation data={s} flip={s.flip} />
            </div>
          </section>
        ))}

        <section className="sec sec--dark" id="enquire">
          <div className="wrap">
            <SectionHead light eyebrow="Next step" title="Put your system in good hands." sub="Ask for an AMC, an installation and commissioning visit, or technical advice on a new application." />
            <div className="cta-dual">
              <EnquiryButton className="btn btn--primary" type="sales" product="Service enquiry">Request a quote</EnquiryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
