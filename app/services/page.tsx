import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteGraph, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import ServicePipeline from "@/components/ServicePipeline";

export const metadata = buildMetadata({
  title: "Services | Consultancy, Installation, Commissioning & AMC | Gastech",
  description:
    "Gastech Combustions provides technical consultancy, installation and commissioning, and annual maintenance contracts for industrial burners and gas systems in Pune. Selection, sizing and long-term care from one accountable partner.",
  path: "/services",
  keywords: ["gas burner services", "installation and commissioning", "annual maintenance contract", "technical consultancy", "Pune"],
});

const SERVICE_LINES = [
  {
    num: "S / 01",
    icon: "settings",
    title: "Technical Consultancy",
    desc: "Detailed understanding of your application, then appropriate selection and sizing during your procurement stage, not just trading of products.",
  },
  {
    num: "S / 02",
    icon: "wrench",
    title: "Installation & Commissioning",
    desc: "Expert installation and thorough testing and calibration, from initial setup to final activation, so your system fires up and runs efficiently.",
  },
  {
    num: "S / 03",
    icon: "calendar",
    title: "Annual Maintenance Contracts",
    desc: "Comprehensive support for your burners and gas systems, designed to ensure optimal performance and minimize downtime through proactive care.",
  },
];

const DELIVERS = [
  {
    idx: "AMC",
    kicker: "Ongoing care",
    title: "Annual Maintenance Contract",
    points: [
      "Scheduled Maintenance: regularly planned inspections and servicing to keep your burner running efficiently and catch issues early.",
      "Priority Support: dedicated team with priority response for any issue or emergency, minimising disruption.",
    ],
  },
  {
    idx: "I&C",
    kicker: "Getting live",
    title: "Installation & Commissioning",
    points: [
      "Expert Installation: skilled technicians set up your burner safely to manufacturer specifications and industry standards.",
      "Comprehensive Commissioning: detailed testing and calibration of all parameters, configurations and connections.",
    ],
  },
  {
    idx: "ENG",
    kicker: "Up front",
    title: "Technical Consultancy",
    points: [
      "Application study: we understand your process, gas, duty and site before recommending anything.",
      "Selection & sizing: the right equipment and configuration during your procurement stage.",
    ],
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          ...siteGraph(),
          serviceSchema(
            "Gas burner and gas system services",
            "Technical consultancy, installation and commissioning, and annual maintenance contracts for industrial burners and gas systems in Pune.",
            "/services"
          ),
          breadcrumbSchema(crumbs),
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
              <span className="line">We do it right,</span>
              <span className="line"><em>first time.</em></span>
            </h1>
            <p className="lede" data-reveal>From the first enquiry we work to understand your application and offer a comprehensive solution, not just a product. Our post-sales services carry the same trust seal as the equipment we supply.</p>
            <div className="intro-cta" data-reveal>
              <a className="btn btn--primary" href="#services">Explore services <Icon name="arrow" /></a>
              <EnquiryButton className="btn--tech" type="technical" product="Service enquiry" icon="chat">Talk to our team</EnquiryButton>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="sec sec--sunken" id="services">
          <div className="wrap">
            <SectionHead
              eyebrow="Three service lines"
              title={<>Support across the <u>whole life</u> of your system.</>}
              sub="Selection and sizing during procurement, then expert installation, commissioning and long-term care."
            />
            <ServicePipeline stations={SERVICE_LINES} />
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <SectionHead eyebrow="Key features" title="What each service delivers." />
            <div className="var-grid" data-stagger>
              {DELIVERS.map((d) => (
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
