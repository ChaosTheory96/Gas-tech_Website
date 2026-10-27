import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteGraph, breadcrumbSchema } from "@/lib/schema";
import { Icon } from "@/components/icons";
import { Marquee, SectionHead, JsonLd } from "@/components/blocks";
import { EnquiryButton } from "@/components/enquiry";
import ProcessTimeline from "@/components/ProcessTimeline";

export const metadata = buildMetadata({
  title: "How We Deliver | Design, Supply, Commission & Service | Gastech",
  description:
    "Gastech Combustions engineers, supplies, tests, installs and services complete gas systems. From enquiry and design to commissioning and long-term AMC, one accountable partner does it right first time in Pune.",
  path: "/delivery",
  keywords: ["gas system engineering", "gas train installation", "commissioning", "turnkey gas systems", "Pune"],
});

// The five steps, expanded with what the client actually receives at each
// stage. Every line is grounded in the Gastech brochure and services copy
// (application inputs, skid composition, testing/calibration, AMC) — nothing
// is invented, and no specific standard codes, durations or SLA hours are
// claimed because the source does not provide them.
const STEPS = [
  {
    n: "1",
    title: "Enquiry & study",
    desc: "We assess your gas demand, application and site.",
    youGet: "An application study covering gas type, flow, inlet and outlet pressure, safety requirements and applicable standards.",
  },
  {
    n: "2",
    title: "Design",
    desc: "Sizing and layout engineered to spec.",
    youGet: "A sized proposal and layout, with the right brand and configuration for your duty.",
  },
  {
    n: "3",
    title: "Supply & assembly",
    desc: "Sourced from our brands, assembled and tested.",
    youGet: "A complete skid-mounted assembly with shut-off valves, filters, regulators, safety devices, flow meters and controls.",
  },
  {
    n: "4",
    title: "Install & commission",
    desc: "On-site setup and performance proof.",
    youGet: "A commissioned system, tested and calibrated end to end and proven against its design duty.",
  },
  {
    n: "5",
    title: "Service & AMC",
    desc: "Long-term uptime and support.",
    youGet: "Scheduled maintenance and priority support that keep the system at design performance.",
  },
];

// "What you get at handover" — real proof points drawn from the brochure and
// services copy (testing before handover, safety configuration, Gasvigil
// shutoff, AMC). No fabricated documentation packs, codes or figures.
const HANDOVER = [
  {
    idx: "01",
    k: "Tested",
    title: "Proven before handover",
    points: [
      "Pressure and performance testing on every system before it reaches site.",
      "Commissioning on site with a clean performance proof.",
    ],
  },
  {
    idx: "02",
    k: "Safe by design",
    title: "Configured to your duty",
    points: [
      "Safety shut-off valves, pressure switches and controls configured to your gas type, flow and pressures.",
      "Gasvigil leak detection with automatic shutoff, where specified.",
    ],
  },
  {
    idx: "03",
    k: "Supported",
    title: "One accountable partner",
    points: [
      "Scheduled maintenance and priority response through an Annual Maintenance Contract.",
      "Consultancy and servicing across the whole life of the system.",
    ],
  },
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

        {/* THE PROCESS, IN DEPTH — the authoritative version (Home no longer repeats it) */}
        <section className="sec" id="process" aria-labelledby="proc-h">
          <div className="wrap">
            <SectionHead
              eyebrow="The path"
              title={<>From enquiry to <u>ongoing support.</u></>}
              sub="A single accountable partner for your gas system. Here is what happens at each stage, and exactly what you receive."
            />
            <ProcessTimeline steps={STEPS} />
          </div>
        </section>

        {/* WHAT YOU GET AT HANDOVER */}
        <section className="sec sec--sunken" id="handover" aria-labelledby="ho-h">
          <div className="wrap">
            <SectionHead
              eyebrow="Handover &amp; safety"
              title={<>Proof, not <u>promises.</u></>}
              sub="Delivery is measured by what you can rely on after we leave site: a tested, safely configured system with one partner standing behind it."
            />
            <div className="var-grid" data-stagger>
              {HANDOVER.map((h) => (
                <article className="var-card" key={h.idx}>
                  <span className="v-idx">{h.idx}</span>
                  <div className="v-k">{h.k}</div>
                  <h3>{h.title}</h3>
                  <ul>
                    {h.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* AFTER DELIVERY — points to the dedicated Services page instead of repeating it */}
        <section className="sec" id="support" aria-labelledby="svc-h">
          <div className="wrap">
            <SectionHead
              eyebrow="After delivery"
              title={<>Delivery doesn&rsquo;t <u>end at handover.</u></>}
              sub="Our consultancy, installation and commissioning, and annual maintenance keep your gas plant running at design performance for its whole life. The detail lives on our services page."
            />
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
