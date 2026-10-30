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
      postalCode: SITE.contact.worksPostal,
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

/* "hours" are the office hours already published on the live contact page.
   No geo coordinates and no priceRange: the build sheet's own checklist bans
   invented geo/offers, and unverified pinpoints are not published. */
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
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.worksAddress,
      addressLocality: SITE.contact.city,
      addressRegion: SITE.contact.region,
      postalCode: SITE.contact.worksPostal,
      addressCountry: SITE.contact.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:30",
        closes: "17:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:30",
        closes: "13:00",
      },
    ],
    areaServed: [SITE.contact.city, SITE.contact.region, "India"],
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}

/* Build-sheet Schema column: "Product (brand, no offers)". No offers, no
   aggregateRating, nothing that would claim stock or prices we cannot verify. */
export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`${p.route}#product`),
    name: p.h1,
    brand: { "@type": "Brand", name: p.brand },
    description: p.metaDescription,
    image: p.slides.map((s) => s.src),
    url: absoluteUrl(p.route),
    category: p.brandline[1],
    manufacturer: { "@type": "Organization", name: p.brand },
  };
}

/* CollectionPage for hub-shaped pages (sheet rows P10, P24, P30, P40, P51,
   P61, P90). Emitted as its own graph root next to its companion ItemList,
   Brand, Service or BreadcrumbList roots. */
export function collectionPageSchema(path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`${path}#collection`),
    name,
    description,
    url: absoluteUrl(path),
    publisher: { "@id": absoluteUrl("/#organization") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

export type ListEntry = { name: string; url?: string; desc?: string };

export function itemListSchema(name: string, base: string, entries: ListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl(`${base}#itemlist`),
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.desc ? { description: it.desc } : {}),
      ...(it.url ? { url: absoluteUrl(it.url) } : {}),
    })),
  };
}

export function brandSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": absoluteUrl(`${path}#brand`),
    name,
  };
}

export function aboutPageSchema(path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl(`${path}#about`),
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: { "@id": absoluteUrl("/#organization") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

export function contactPageSchema(path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": absoluteUrl(`${path}#contact`),
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: { "@id": absoluteUrl("/#business") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

export function webPageSchema(path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "en-IN",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

/* FAQPage. `url` defaults to the home anchor for the historic site-wide FAQ;
   any page with its own question set passes its own path so the entity @id is
   never shared by two different FAQ lists. */
export function faqSchema(entries: { q: string; a: string }[], url = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl(`${url}#faq`),
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

/* Product-route graph, exactly per each page's Schema.org column in the build
   sheet SEO Meta tab. No site identity bundle here; the sheet rows list only
   the page-level types. FAQPage only where the row asks for one, even when the
   page shows FAQs (Gasvigil per P24). */
export function productGraph(p: Product, crumbs: { name: string; href: string }[]) {
  const bc = breadcrumbSchema(crumbs);
  const faq = faqSchema(p.faq, p.route);
  const collection = collectionPageSchema(p.route, p.h1, p.metaDescription);
  switch (p.slug) {
    case "pressure-regulators": // P51: CollectionPage + ItemList + FAQPage + BreadcrumbList
      return [
        collection,
        itemListSchema(
          p.h1,
          p.route,
          p.variants.map((v) => ({ name: v.title, desc: [v.spec, v.sub].filter(Boolean).join(" / ") })),
        ),
        faq,
        bc,
      ];
    case "flow-meters": // P61: CollectionPage + FAQPage + BreadcrumbList
      return [collection, faq, bc];
    case "gas-trains": // P30: CollectionPage + Service + FAQPage + BreadcrumbList
      return [collection, serviceSchema(p.h1, p.metaDescription, p.route), faq, bc];
    case "gasvigil": // P24: CollectionPage + Brand + BreadcrumbList
      return [collection, brandSchema(p.brand, p.route), bc];
    default: // P42/P43/P44/P52: Product (brand, no offers) + FAQPage + BreadcrumbList
      return [productSchema(p), faq, bc];
  }
}

/* A compact <script> payload helper. */
export function jsonLd(data: unknown | unknown[]) {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d) => ({
    __html: JSON.stringify(d).replace(/</g, "\\u003c"),
  }));
}
