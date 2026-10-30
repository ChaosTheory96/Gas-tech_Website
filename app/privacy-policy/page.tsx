import type { Metadata } from "next";
import PrivacyDoc from "@/components/PrivacyDoc";
import { JsonLd } from "@/components/blocks";
import { webPageSchema } from "@/lib/schema";

/* Sheet row P06 keeps this page index, follow, so it is in the sitemap and the
   crawlable surface; reachable from the footer legal bar and by URL. */
export const metadata: Metadata = {
  title: "Privacy Policy | Gastech Combustions",
  description:
    "How Gastech Combustions collects, uses and protects the information you submit through website enquiry forms, cookies and analytics.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Sheet row P06: WebPage. */}
      <JsonLd
        data={[
          webPageSchema(
            "/privacy-policy/",
            "Privacy Policy",
            "How Gastech Combustions collects, uses and protects the information you submit through website enquiry forms, cookies and analytics.",
          ),
        ]}
      />
      <main id="main">
        <section className="intro-hero">
          <div className="wrap">
            <p className="eyebrow" data-reveal>Legal</p>
            <h1 className="split">
              <span className="line">Privacy{" "}</span>
              <span className="line"><em>Policy</em></span>
            </h1>
            <p className="lede" data-reveal>
              What this website collects, why it collects it and how to have it
              removed. Written in plain language, in the order you would ask
              about it.
            </p>
            <p className="mono-tag" data-reveal>Last updated 27 October 2026</p>
          </div>
        </section>

        <section className="sec">
          <PrivacyDoc />
        </section>
      </main>
    </>
  );
}
