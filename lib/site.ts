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
    "Gastech Combustions Pvt Ltd supplies and services industrial burners, gas regulation and metering stations, gas flow meters and gas-leak detection systems in Pune. Representing Riello, Pietro Fiorentini and Gasvigil.",
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
    worksAddress: "Vantage Towers, Bavdhan Khurd, Pune 411021",
    registeredAddress: "Dangat Ind. Estate, Shivane, Pune 411023",
    mapUrl:
      "https://maps.google.com/?q=Vantage+Towers+Bavdhan+Khurd+Pune+411021",
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

/* Primary navigation. `href` uses Next route paths (no .html). */
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
      href: "/products",
      kicker: "Gastech range",
      title: "Find the right equipment.",
      sub: "Burners, regulation, metering and gas safety, sized, installed and serviced in Pune.",
      cta: "View all products",
    },
    groups: [
      {
        heading: "Burners",
        items: [
          { href: "/gas-burners", label: "Gas Burners", sub: "Natural gas & LPG", icon: "flame" },
          { href: "/light-oil-burners", label: "Light Oil Burners", sub: "Gasoil & kerosene", icon: "flame" },
          { href: "/dual-fuel-burners", label: "Dual Fuel Burners", sub: "Gas & light oil", icon: "mix" },
        ],
      },
      {
        heading: "Gas systems",
        items: [
          { href: "/pf-regulators", label: "Gas Regulators", sub: "Pietro Fiorentini", icon: "gauge" },
          { href: "/flow-meters", label: "Flow Meters", sub: "RPD & turbine", icon: "flow" },
          { href: "/safety-valves", label: "Safety Valves", sub: "SSOV & relief", icon: "shield" },
        ],
      },
      {
        heading: "Supply & safety",
        items: [
          { href: "/gas-trains", label: "Gas Trains", sub: "Custom skids", icon: "manifold" },
          { href: "/gasvigil", label: "Gas Leak Detection", sub: "Gasvigil", icon: "chip" },
        ],
      },
    ],
  },
  { kind: "page", num: "02", href: "/brands", label: "Brands" },
  { kind: "page", num: "03", href: "/delivery", label: "Delivery" },
  { kind: "page", num: "04", href: "/services", label: "Services" },
  { kind: "page", num: "05", href: "/contact", label: "Contact" },
];

/* Footer columns. */
export const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Capabilities",
    links: [
      { href: "/products", label: "Industrial Burners" },
      { href: "/pf-regulators", label: "Gas Regulation" },
      { href: "/flow-meters", label: "Gas Metering" },
      { href: "/gasvigil", label: "Leak Detection" },
      { href: "/dual-fuel-burners", label: "Dual Fuel Burners" },
      { href: "/gas-trains", label: "Gas Trains" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/brands", label: "Brands" },
      { href: "/delivery", label: "Delivery" },
      { href: "/services", label: "Services" },
      { href: "/delivery#process", label: "How we work" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function px(n: number): string {
  return `${n}px`;
}
