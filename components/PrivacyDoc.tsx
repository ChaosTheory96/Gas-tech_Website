"use client";

/* ---------------------------------------------------------------------------
   PrivacyDoc — the legal document body for /privacy-policy.
   At-a-glance summary strip + a two-column layout: a sticky clause index
   (scroll-spy via IntersectionObserver) beside numbered clauses.
   Content is factual: it mirrors what the site actually does (enquiry form
   only; no cookies, analytics or third-party processors — grep-verified).
   JS-off-safe: every clause is plain visible content; JS only drives the
   index highlight, never reveal/hide.
   --------------------------------------------------------------------------- */
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const CLAUSES = [
  { id: "who", num: "01", title: "Who we are" },
  { id: "collect", num: "02", title: "What we collect" },
  { id: "use", num: "03", title: "How we use it" },
  { id: "basis", num: "04", title: "Lawful basis" },
  { id: "storage", num: "05", title: "Storage and retention" },
  { id: "sharing", num: "06", title: "Who sees the data" },
  { id: "security", num: "07", title: "Security" },
  { id: "rights", num: "08", title: "Your rights" },
  { id: "children", num: "09", title: "Children" },
  { id: "changes", num: "10", title: "Changes to this policy" },
  { id: "contact", num: "11", title: "Contact" },
];

const GLANCE = [
  {
    k: "What we collect",
    t: "Name, company, email, phone and your requirement. From the enquiry form. Nothing else.",
  },
  {
    k: "Why we collect it",
    t: "To answer your enquiry, prepare quotations and schedule service visits.",
  },
  {
    k: "Who sees it",
    t: "Our sales and engineering team only. We do not sell or rent personal data.",
  },
  {
    k: "Tracking",
    t: "No cookies, no analytics, no advertising trackers. This site does not follow you.",
  },
];

export default function PrivacyDoc() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    CLAUSES.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const c = SITE.contact;

  return (
    <div className="wrap">
      <div className="glance-grid">
        {GLANCE.map((g) => (
          <div className="glance-card" key={g.k}>
            <h3>{g.k}</h3>
            <p>{g.t}</p>
          </div>
        ))}
      </div>

      <div className="legal-grid">
        <nav className="legal-nav" aria-label="Policy sections">
          {CLAUSES.map((cl) => (
            <a
              key={cl.id}
              href={`#${cl.id}`}
              className={active === cl.id ? "on" : ""}
            >
              <span className="lnum">{cl.num}</span>
              {cl.title}
            </a>
          ))}
        </nav>

        <div className="legal-body">
          <section className="legal-clause" id="who">
            <h2><span className="cnum">01</span>Who we are</h2>
            <p>
              {SITE.legalName} is an industrial combustion and gas systems
              company based in {c.city}, {c.region}, India. This page explains
              how the website gastechcombustions.in handles personal
              information. It covers this website only, not any other site you
              reach through a link from it.
            </p>
          </section>

          <section className="legal-clause" id="collect">
            <h2><span className="cnum">02</span>What we collect</h2>
            <p>
              This site has one form, the enquiry form. When you use it you
              choose to send us: your full name, company name, email address,
              phone number and your written requirement. Each submission also
              carries the enquiry type (sales or technical), the product it
              relates to and the page it was sent from.
            </p>
            <p>
              We do not set tracking cookies, run analytics or embed
              advertising or social scripts, so the site collects nothing about
              you in the background.
            </p>
          </section>

          <section className="legal-clause" id="use">
            <h2><span className="cnum">03</span>How we use your data</h2>
            <p>
              Your enquiry is used to answer you: to prepare a quotation,
              advise on equipment selection, arrange site visits or
              maintenance, and generally correspond about the systems you asked
              about. We do not sell your data, add you to marketing lists
              without consent, or make automated decisions about you.
            </p>
          </section>

          <section className="legal-clause" id="basis">
            <h2><span className="cnum">04</span>Lawful basis</h2>
            <p>
              We process enquiry data on the basis of the consent you give by
              submitting the form, and of steps taken at your request before
              entering into a contract, namely quoting and supplying equipment
              or services.
            </p>
          </section>

          <section className="legal-clause" id="storage">
            <h2><span className="cnum">05</span>Storage and retention</h2>
            <p>
              Enquiry data is delivered to our own business mailboxes
              (sales@ and technical@) and is kept only as long as needed to
              respond to you and to maintain ordinary business records such as
              quotations and warranty history. Data is stored in India.
            </p>
          </section>

          <section className="legal-clause" id="sharing">
            <h2><span className="cnum">06</span>Who sees the data</h2>
            <p>
              Within Gastech, enquiry data is seen only by the sales and
              engineering staff who handle your enquiry. We do not share data
              with third-party processors. If a manufacturer whose equipment
              you asked about (Riello, Pietro Fiorentini or Gasvigil) needs
              your details to answer a technical or warranty question, we pass
              on only what is necessary and we tell you first.
            </p>
          </section>

          <section className="legal-clause" id="security">
            <h2><span className="cnum">07</span>Security</h2>
            <p>
              This website is served over HTTPS. Access to the mailboxes where
              enquiries arrive is limited to authorised staff. No payment card
              data is collected or stored anywhere on this site.
            </p>
          </section>

          <section className="legal-clause" id="rights">
            <h2><span className="cnum">08</span>Your rights</h2>
            <p>
              Under India&rsquo;s Digital Personal Data Protection Act, 2023
              you may request access to the personal data you have shared with
              us, ask for its correction or erasure, and withdraw the consent
              you gave when submitting the form. Email{" "}
              <a href={`mailto:${c.salesEmail}`}>{c.salesEmail}</a> with the
              subject &ldquo;Data request&rdquo; and we will act within 30
              days. You also have the right to lodge a grievance with the
              Data Protection Board of India.
            </p>
          </section>

          <section className="legal-clause" id="children">
            <h2><span className="cnum">09</span>Children</h2>
            <p>
              This site is written for industrial buyers and engineers. It is
              not directed at children, and we do not knowingly collect data
              from anyone under 18.
            </p>
          </section>

          <section className="legal-clause" id="changes">
            <h2><span className="cnum">10</span>Changes to this policy</h2>
            <p>
              If this policy changes in a way that matters to you, the
              &ldquo;last updated&rdquo; date at the top of this page is
              revised. Please check this page occasionally.
            </p>
          </section>

          <section className="legal-clause" id="contact">
            <h2><span className="cnum">11</span>Contact</h2>
            <p>
              Questions about this policy or your data: write to{" "}
              <a href={`mailto:${c.salesEmail}`}>{c.salesEmail}</a> or call{" "}
              <a href={c.phonePrimaryHref}>{c.phonePrimary}</a>.
            </p>
            <p>
              {SITE.legalName}, Registered office: {c.registeredAddress}.
              Works: {c.worksAddress}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
