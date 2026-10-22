/* ---------------------------------------------------------------------------
   JSON-LD structured data builders — the machine-readable layer behind SEO,
   AEO (answer engines read FAQPage + crisp entity facts) and GEO (generative
   engines parse Organization / Product / Service + site-wide breadcrumbs).
   Rendered with next/script-free <script type="application/ld+json"> in pages.
   --------------------------------------------------------------------------- */
import { SITE, absoluteUrl } from "./site";
import type { Product } from "./products";

const LOGO = absoluteUrl("/assets/gc-logo.svg");

export function organizationSchema() {
  const sameAs = [SITE.social.linkedin, SITE.social.facebook, SITE.social.instagram, SITE.social.youtube].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.legalName,
    legalName: SITE.legalName,
    alternateName: SITE.name,
    url: absoluteUrl("/"),
    logo: LOGO,
    description: SITE.description,
    email: SITE.contact.salesEmail,
    telephone: SITE.contact.phonePrimary,
    areaServed: "IN",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.worksAddress,
      addressLocality: SITE.contact.city,
      addressRegion: SITE.contact.region,
      postalCode: "411021",
      addressCountry: SITE.contact.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.contact.phonePrimary,
        contactType: "sales",
        email: SITE.contact.salesEmail,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        telephone: SITE.contact.phoneSecondary,
        contactType: "technical support",
        email: SITE.contact.technicalEmail,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    knowsAbout: [
      "Industrial burners",
      "Gas regulation stations",
      "Gas metering",
      "Gas leak detection",
      "Gas trains",
      "Hydrogen-ready gas systems",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: SITE.legalName,
    image: LOGO,
    url: absoluteUrl("/"),
    telephone: SITE.contact.phonePrimary,
    email: SITE.contact.salesEmail,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.worksAddress,
      addressLocality: SITE.contact.city,
      addressRegion: SITE.contact.region,
      postalCode: "411021",
      addressCountry: SITE.contact.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: 18.5167, longitude: 73.8153 },
    areaServed: [SITE.contact.city, SITE.contact.region, "India"],
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}

export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/${p.slug}#product`),
    name: p.h1,
    brand: { "@type": "Brand", name: p.brand },
    description: p.metaDescription,
    image: p.slides.map((s) => s.src),
    url: absoluteUrl(`/${p.slug}`),
    category: p.brandline[1],
    manufacturer: { "@type": "Organization", name: p.brand },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/${p.slug}`),
      priceAvailability: "https://schema.org/MayFromOutStore",
      availability: "https://schema.org/InStock",
      businessFunction: { "@type": "BusinessFunction", name: "Sell" },
      areaServed: "IN",
      seller: { "@id": absoluteUrl("/#organization") },
    },
  };
}

export function faqSchema(entries: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    mainEntity: entries.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.href),
    })),
  };
}

export function serviceSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`${url}#service`),
    name,
    description,
    url: absoluteUrl(url),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: "IN",
    serviceType: name,
  };
}

/* Bundle the always-on graph (org + website + business) once per page. */
export function siteGraph() {
  return [organizationSchema(), websiteSchema(), localBusinessSchema()];
}

/* A compact <script> payload helper. */
export function jsonLd(data: unknown | unknown[]) {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d) => ({
    __html: JSON.stringify(d).replace(/</g, "\\u003c"),
  }));
}
