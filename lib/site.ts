/* ---------------------------------------------------------------------------
   Site-wide configuration and navigation model. Single source of truth for the
   navbar, footer, contact details and SEO defaults so every route stays
   identical (one of the explicit project requirements).
   --------------------------------------------------------------------------- */

/* Brand registry. Insertion order IS the site-wide brand order (client
   direction, 2026-11): Pietro Fiorentini, Electrogas, Gastech, Riello, Gasvigil.
   Every list, count and comparison on the site derives from this one object. */
/* emblem: the file carries no readable wordmark, so the name is printed beside it. */
export type BrandLogo = { src: string; width: number; height: number; emblem?: boolean };
type BrandDef = { name: string; role: "represented" | "own"; logo: BrandLogo | null };

/* Logos are used as supplied. Raster marks are extracted from the 2026 brochure
   and are LOW RESOLUTION (flagged): Pietro Fiorentini 251x100, Riello 207x101,
   Gasvigil 57x96. Replace the files in public/images/brands/ when the client
   sends vector or larger originals; no code change needed. Electrogas has no
   logo file, so it renders as a text mark (logo: null). */
export const BRAND = {
  pf: { name: "Pietro Fiorentini", role: "represented", logo: { src: "/images/brands/pietro-fiorentini.png", width: 251, height: 100 } },
  electrogas: { name: "Electrogas", role: "represented", logo: null },
  gastech: { name: "Gastech", role: "own", logo: { src: "/assets/gc-logo.svg", width: 1542, height: 1542, emblem: true } },
  riello: { name: "Riello", role: "represented", logo: { src: "/images/brands/riello-logo.png", width: 207, height: 101 } },
  gasvigil: { name: "Gasvigil", role: "represented", logo: { src: "/images/brands/gasvigil.png", width: 57, height: 96, emblem: true } },
} as const satisfies Record<string, BrandDef>;

export type BrandId = keyof typeof BRAND;
export const BRAND_IDS = Object.keys(BRAND) as BrandId[];
export const BRANDS = BRAND_IDS.map((id) => ({ id, ...BRAND[id] }));
export const BRAND_NAMES: string[] = BRANDS.map((b) => b.name);
export const BRAND_COUNT = BRANDS.length;
export const REPRESENTED_BRAND_IDS = BRAND_IDS.filter((id) => BRAND[id].role === "represented");
export const REPRESENTED_BRAND_NAMES = REPRESENTED_BRAND_IDS.map((id) => BRAND[id].name);
export const REPRESENTED_BRAND_COUNT = REPRESENTED_BRAND_NAMES.length;
/* "Pietro Fiorentini, Electrogas, Riello and Gasvigil" */
export const REPRESENTED_BRAND_LIST = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(REPRESENTED_BRAND_NAMES);

/* Pietro Fiorentini facts, stated once and imported wherever they appear. */
export const PF_FACTS = {
  foundedYear: 1940,
  foundedCity: "Bologna",
  yearsLabel: "80+ years",
  yearsProse: "more than 80 years",
} as const;

/* The three service lines, stated once. The Services page is the canonical home;
   Home and About read the count and summaries from here. */
export const SERVICE_LINES = [
  { num: "S / 01", icon: "chat", title: "Technical Consultancy", desc: "Sizing, layout and gas-strategy guidance from application through to commissioning." },
  { num: "S / 02", icon: "wrench", title: "Installation & Commissioning", desc: "Expert installation, then detailed testing and calibration of every parameter, configuration and connection." },
  { num: "S / 03", icon: "calendar", title: "Annual Maintenance Contracts", desc: "Planned AMC cover so uptime is protected and surprises are engineered out." },
];

/* Gastech's scope on every product, stated once and rendered by the product
   template instead of repeating a row in each spec table. */
export const GASTECH_SCOPE = "Supply, sizing, installation, commissioning and annual maintenance contracts, by Gastech's own team.";

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
  backgroundColor: "#FFFFFF",
  locale: "en_IN",
  foundedNote: "Pune-based supplier and integrator of combustion and gas-safety systems.",
  contact: {
    salesEmail: "sales@gastechcombustions.in",
    technicalEmail: "technical@gastechcombustions.in",
    /* The only address shown on the site is the Corporate Office (client
       direction, 2026-11). Phone numbers are intentionally not published. */
    corporateAddress: "Brahma Corp Vantage Towers, C-1005, 10th Floor, Bavdhan Khurd, Pune 411021",
    corporatePostal: "411021",
    mapUrl:
      "https://maps.google.com/?q=Brahma+Corp+Vantage+Towers+Bavdhan+Khurd+Pune+411021",
    mapEmbed:
      "https://maps.google.com/maps?q=Brahma%20Corp%20Vantage%20Towers%2C%20Bavdhan%20Khurd%2C%20Pune%20411021&output=embed",
    city: "Pune",
    region: "Maharashtra",
    country: "IN",
  },
  brands: BRAND_NAMES,
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
export type NavGroup = { heading: string; items: NavChild[]; cta?: { href: string; label: string } };

export type NavItem =
  | { kind: "page"; href: string; label: string; num: string }
  | { kind: "mega"; label: string; num: string; groups: NavGroup[]; feature: NavFeature };

export type NavFeature = {
  href: string;
  img: string;
  imgAlt: string;
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
      href: "/gas-trains/",
      img: "/images/gas-train/steel-plant.jpg",
      imgAlt: "Gastech gas train on a grey skid with yellow pipework, regulators and a control cabinet",
      title: "Gas Trains",
      sub: "Customized, reliable, safe and application-specific. Complete skid-mounted gas trains engineered and built in Pune.",
      cta: "Explore gas trains",
    },
    groups: [
      {
        heading: "Gas systems",
        items: [
          { href: "/products/gas-regulation/pressure-regulators/", label: "Gas Pressure Regulators", sub: BRAND.pf.name, icon: "gauge" },
          { href: "/products/gas-measurement/flow-meters/", label: "Flow Meters", sub: BRAND.pf.name, icon: "flow" },
          { href: "/products/gas-regulation/safety-valves/", label: "Safety Valves", sub: BRAND.pf.name, icon: "shield" },
        ],
      },
      {
        heading: "Burners",
        items: [
          { href: "/products/burners/gas-burners/", label: "Gas Burners", sub: `${BRAND.riello.name} · Natural gas & LPG`, icon: "flame" },
          { href: "/products/burners/oil-burners/", label: "Oil Burners", sub: `${BRAND.riello.name} · Gasoil & kerosene`, icon: "drop" },
          { href: "/products/burners/dual-fuel-burners/", label: "Dual Fuel Burners", sub: `${BRAND.riello.name} · Gas & light oil`, icon: "dual" },
        ],
      },
      {
        heading: "Valves & detection",
        items: [
          { href: "/products/valves/electrogas-valves/", label: "Valves & Actuation", sub: BRAND.electrogas.name, icon: "manifold" },
          { href: "/brands/gasvigil/", label: "Gas Leak Detection", sub: BRAND.gasvigil.name, icon: "siren" },
        ],
        cta: { href: "/products/", label: "View all products" },
      },
    ],
  },
  { kind: "page", num: "02", href: "/brands/", label: "Brands" },
  { kind: "page", num: "03", href: "/about-us/", label: "About Us" },
  { kind: "page", num: "04", href: "/services/", label: "Services" },
  { kind: "page", num: "05", href: "/contact-us/", label: "Contact" },
];

/* Footer columns. */
export const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Capabilities",
    links: [
      { href: "/gas-trains/", label: "Gas Trains" },
      { href: "/products/gas-regulation/pressure-regulators/", label: "Gas Regulation" },
      { href: "/products/gas-measurement/flow-meters/", label: "Gas Metering" },
      { href: "/brands/gasvigil/", label: "Leak Detection" },
      { href: "/products/", label: "Industrial Burners" },
      { href: "/products/burners/dual-fuel-burners/", label: "Dual Fuel Burners" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us/", label: "About Us" },
      { href: "/brands/", label: "Brands" },
      { href: "/services/", label: "Services" },
      { href: "/contact-us/", label: "Contact" },
    ],
  },
];

export function px(n: number): string {
  return `${n}px`;
}
