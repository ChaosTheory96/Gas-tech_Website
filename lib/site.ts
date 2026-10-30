/* ---------------------------------------------------------------------------
   Site-wide configuration and navigation model. Single source of truth for the
   navbar, footer, contact details and SEO defaults so every route stays
   identical (one of the explicit project requirements).
   --------------------------------------------------------------------------- */

export const SITE = {
  name: "Gastech Combustions",
  legalName: "Gastech Combustions Pvt Ltd",
  shortName: "Gastech",
  tagline:
    "Industrial combustion, gas regulation, metering and gas-safety systems.",
  description:
    "Gastech Combustions Pvt Ltd engineers gas trains and supplies industrial burners, gas regulation, metering and leak-detection systems in Pune.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gastechcombustions.in",
  themeColor: "#D42E22",
  locale: "en_IN",
  foundedNote: "Pune-based supplier and integrator of combustion and gas-safety systems.",
  contact: {
    phonePrimary: "+91 86000 33274",
    phonePrimaryHref: "tel:+918600033274",
    phoneSecondary: "+91 86000 16539",
    phoneSecondaryHref: "tel:+918600016539",
    salesEmail: "sales@gastechcombustions.in",
    technicalEmail: "technical@gastechcombustions.in",
    /* Labels follow the brochure p.12 column headings and the client build sheet
       (P02 "works address (Dangat Industrial Estate)"): the Dangat Estate site in
       Shivane is the WORKS, the Vantage Towers address in Bavdhan Khurd is the
       REGISTERED OFFICE. Both come from the same printed block, so they must never
       be swapped again anywhere on the site. */
    worksAddress: "Dangat Industrial Estate, Opp. Dynalec Controls, NDA Road, Shivane, Pune 411023",
    worksPostal: "411023",
    registeredAddress: "Brahma Corp Vantage Towers, C-1005, 10th Floor, Bavdhan Khurd, Pune 411021",
    registeredPostal: "411021",
    mapUrl:
      "https://maps.google.com/?q=Dangat+Industrial+Estate+NDA+Road+Shivane+Pune+411023",
    city: "Pune",
    region: "Maharashtra",
    country: "IN",
  },
  brands: ["Riello", "Pietro Fiorentini", "Gasvigil", "IM"],
  social: {
    // Fill when profiles are confirmed; omitted from schema when blank.
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  const clean = path.replace(/^\//, "");
  return clean ? `${base}/${clean}` : `${base}/`;
}

/* Primary navigation. `href` uses the client URL scheme: nested paths with a
   trailing slash, matching next.config trailingSlash and the sitemap. */
export type NavChild = {
  href: string;
  label: string;
  sub: string;
  icon: string;
};
export type NavGroup = { heading: string; items: NavChild[] };

export type NavItem =
  | { kind: "page"; href: string; label: string; num: string }
  | { kind: "mega"; label: string; num: string; groups: NavGroup[]; feature: NavFeature };

export type NavFeature = {
  href: string;
  kicker: string;
  title: string;
  sub: string;
  cta: string;
};

export const NAV: NavItem[] = [
  {
    kind: "mega",
    num: "01",
    label: "Products",
    feature: {
      href: "/products/",
      kicker: "Gastech range",
      title: "Find the right equipment.",
      sub: "Burners, regulation, metering and gas safety, sized, installed and serviced in Pune.",
      cta: "View all products",
    },
    groups: [
      {
        heading: "Burners",
        items: [
          { href: "/products/burners/gas-burners/", label: "Gas Burners", sub: "Natural gas & LPG", icon: "flame" },
          { href: "/products/burners/oil-burners/", label: "Oil Burners", sub: "Gasoil & kerosene", icon: "drop" },
          { href: "/products/burners/dual-fuel-burners/", label: "Dual Fuel Burners", sub: "Gas & light oil", icon: "dual" },
        ],
      },
      {
        heading: "Gas systems",
        items: [
          { href: "/products/gas-regulation/pressure-regulators/", label: "Gas Pressure Regulators", sub: "Pietro Fiorentini", icon: "gauge" },
          { href: "/products/gas-measurement/flow-meters/", label: "Flow Meters", sub: "RPD & turbine", icon: "flow" },
          { href: "/products/gas-regulation/safety-valves/", label: "Safety Valves", sub: "SSOV & relief", icon: "shield" },
        ],
      },
      {
        heading: "Supply & safety",
        items: [
          { href: "/gas-trains/", label: "Gas Trains", sub: "Custom skids", icon: "skid" },
          { href: "/brands/gasvigil/", label: "Gas Leak Detection", sub: "Gasvigil", icon: "siren" },
        ],
      },
    ],
  },
  { kind: "page", num: "02", href: "/brands/", label: "Brands" },
  { kind: "page", num: "03", href: "/how-we-work/", label: "How We Work" },
  { kind: "page", num: "04", href: "/services/", label: "Services" },
  { kind: "page", num: "05", href: "/contact-us/", label: "Contact" },
];

/* Footer columns. */
export const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Capabilities",
    links: [
      { href: "/products/", label: "Industrial Burners" },
      { href: "/products/gas-regulation/pressure-regulators/", label: "Gas Regulation" },
      { href: "/products/gas-measurement/flow-meters/", label: "Gas Metering" },
      { href: "/brands/gasvigil/", label: "Leak Detection" },
      { href: "/products/burners/dual-fuel-burners/", label: "Dual Fuel Burners" },
      { href: "/gas-trains/", label: "Gas Trains" },
    ],
  },
  {
    title: "Company",
    links: [
      /* Build sheet P02 places About Us in the footer Company column, so it leads
         the list; /about-us/ is the only About page on the site. */
      { href: "/about-us/", label: "About Us" },
      { href: "/brands/", label: "Brands" },
      { href: "/how-we-work/", label: "How We Work" },
      { href: "/how-we-work/#process", label: "Our process" },
      { href: "/services/", label: "Services" },
      { href: "/contact-us/", label: "Contact" },
    ],
  },
];

export function px(n: number): string {
  return `${n}px`;
}
