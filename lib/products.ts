/* ---------------------------------------------------------------------------
   Authoritative product catalog — content transcribed from the live HTML pages
   (no invented specs). Powers the data-driven product routes, the products hub,
   the sitemap and the Product / FAQ JSON-LD (SEO + AEO + GEO).
   --------------------------------------------------------------------------- */

import { BRAND } from "./site";

export type Spec = { value: string; label: string };
export type Slide = { cap: string; src: string; alt: string };
export type Variant = {
  idx: string;
  kicker: string;
  title: string;
  spec?: string;
  sub?: string;
  desc: string;
  list?: string[];
  img?: string; // product image shown on the range card
  alt?: string;
};
export type TableRow = { k: string; v: string };
export type ColumnsTable = { headers: string[]; rows: string[][] };
export type Faq = { q: string; a: string };

import type { BrandId } from "./site";

export type Product = {
  slug: string;
  /** Canonical live path, trailing slash included, per the client URL scheme. */
  route: string;
  navLabel: string;
  brand: string;
  brandline: [string, string];
  /** brand marks shown in the hero, in registry order */
  brandIds: BrandId[];
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  specs: [Spec, Spec, Spec, Spec];
  slides: Slide[];
  modelEyebrow: string;
  modelTitle: string;
  modelSub: string;
  grid: 3 | 4;
  variants: Variant[];
  /** named types with no photo yet; rendered as line-art tiles */
  types?: { id: "solenoid" | "motorised" | "butterfly" | "port"; label: string }[];
  assembly?: Variant[];
  specEyebrow: string;
  specTitle: string;
  columns?: ColumnsTable;
  specRows: TableRow[];
  generalRows?: TableRow[];
  related: string[];
  faq: Faq[];
  /** optional extra section after the specifications (e.g. hydrogen duty) */
  hydrogen?: { eyebrow: string; title: string; sub: string; rows: TableRow[] };
};

const IMG = "/images"; // self-hosted mirror of gastechcombustions.in/images — run `node qa/_fetch-assets.mjs` to populate public/images

export const PRODUCTS: Product[] = [
  {
    slug: "gas-burners",
    route: "/products/burners/gas-burners/",
    navLabel: "Gas Burners",
    brand: BRAND.riello.name,
    brandline: [BRAND.riello.name, "Industrial Burners"],
    brandIds: ["riello"],
    h1: "Industrial Gas Burners",
    metaTitle: "Industrial Gas Burners: One, Two Stage, Modulating",
    metaDescription:
      "Riello gas burners: one stage 11-220 kW, two stage 130-3,200 kW, progressive 45-2,290 kW and modulating 130-4,885 kW. Pune supplier with AMC.",
    lead: "One-stage, two-stage, two-stage progressive and modulating gas burners fired on natural gas or LPG. Gastech supplies, sizes and services Riello gas burners for steam, hot-water and diathermic oil boilers.",
    specs: [
      { value: "11 to 4885 kW", label: "Output range" },
      { value: "NG / LPG", label: "Fuel gases" },
      { value: "4 control modes", label: "One to modulating" },
      { value: "Boilers", label: "Steam & hot-water" },
    ],
    slides: [
      { cap: "One-stage gas burner / 11 to 220 kW", src: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-ONE-STAGE.jpg`, alt: "Riello one-stage gas burner" },
      { cap: "Two-stage gas burner / 130 to 3200 kW", src: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-TWO-STAGE.jpg`, alt: "Riello two-stage gas burner" },
      { cap: "Modulating gas burner / 130 to 4885 kW", src: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg`, alt: "Riello modulating gas burner" },
    ],
    modelEyebrow: "Model range",
    modelTitle: "Four firing modes, one gas fuel.",
    modelSub: "Capacities below are from the Gastech range. Every burner is matched to your boiler, output and duty.",
    grid: 4,
    variants: [
      { idx: "01", kicker: "On / Off", title: "One-Stage", img: "/images/burner/riello-burner/light-oil-product/gas-burner-ONE-STAGE.jpg", alt: "Riello one-stage gas burner", spec: "11 to 220 kW", desc: "Single-output firing for steady heat demand in small boilers and light heating duty." },
      { idx: "02", kicker: "High / Low", title: "Two-Stage", img: "/images/burner/riello-burner/light-oil-product/gas-burner-TWO-STAGE.jpg", alt: "Riello two-stage gas burner", spec: "130 to 3200 kW", desc: "Two output levels match demand more closely across mid-sized civil and industrial boilers." },
      { idx: "03", kicker: "Stepped", title: "Two-Stage Progressive", img: "/images/burner/gas-burner.png", alt: "Riello progressive gas burner", spec: "45 to 2290 kW", desc: "Progressive two-step control for smoother capacity modulation than simple high / low firing." },
      { idx: "04", kicker: "Continuous", title: "Modulating", img: "/images/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg", alt: "Riello modulating gas burner", spec: "130 to 4885 kW", desc: "Continuous output control for hot-water, steam and medium-temperature boilers under varying load." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: BRAND.riello.name },
      { k: "Fuel gases", v: "Natural gas, LPG (propane / butane)" },
      { k: "Applications", v: "Steam boilers, hot-water boilers, diathermic oil boilers" },
    ],
    related: ["gas-trains", "pressure-regulators", "light-oil-burners", "gasvigil"],
    faq: [
      { q: "What fuels do Riello gas burners run on?", a: "The range fires on natural gas or LPG (propane / butane), selected to your site gas supply." },
      { q: "How do the firing modes differ?", a: "One-stage fires at a single output; two-stage adds a second level; progressive steps between them; modulating varies output continuously with demand." },
      { q: "Which boilers can they be fitted to?", a: "They suit steam, hot-water and diathermic oil boilers; each burner is matched to your boiler, output and duty." },
      { q: "What does Gastech provide?", a: "Supply, sizing, installation, commissioning and annual maintenance (AMC) of the correct Riello gas burner." },
    ],
  },
  {
    slug: "light-oil-burners",
    route: "/products/burners/oil-burners/",
    navLabel: "Oil Burners",
    brand: BRAND.riello.name,
    brandline: [BRAND.riello.name, "Oil Burners"],
    brandIds: ["riello"],
    h1: "Industrial Light Oil Burners",
    metaTitle: "Industrial Light Oil Burners | Gastech",
    metaDescription:
      "Light oil burners from 14 kW to 5,340 kW for boilers and furnaces. Riello distributor in Pune with installation and AMC.",
    lead: "One-stage, two-stage, three-stage and modulating light oil burners fired on gasoil or kerosene. Gastech supplies, sizes and services Riello light oil burners for steam, hot-water and process boilers across heating duty.",
    specs: [
      { value: "14 to 5340 kW", label: "Output range" },
      { value: "Gasoil / Kerosene", label: "Light fuels" },
      { value: "4 control modes", label: "One to modulating" },
      { value: "Boilers", label: "Steam & hot-water" },
    ],
    slides: [
      { cap: "One-stage light oil burner / 23.8 to 240 kW", src: `${IMG}/burner/riello-burner/light-oil-burner-01-stage.jpg`, alt: "Riello one-stage light oil burner" },
      { cap: "Two-stage light oil burner / 14 to 296 kW", src: `${IMG}/burner/riello-burner/light-oil-burner-02-stage.jpg`, alt: "Riello two-stage light oil burner" },
      { cap: "Three-stage light oil burner / 830 to 5340 kW", src: `${IMG}/burner/riello-burner/light-oil-burner-03-stage.jpg`, alt: "Riello three-stage light oil burner" },
      { cap: "Modulating light oil burner / 415 to 4340 kW", src: `${IMG}/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg`, alt: "Riello modulating light oil burner" },
    ],
    modelEyebrow: "Model range",
    modelTitle: "Four firing modes, one light fuel.",
    modelSub: "Capacities below are from the Gastech light oil range. Every burner is matched to your boiler, output and duty.",
    grid: 4,
    variants: [
      { idx: "01", kicker: "On / Off", title: "One-Stage", img: "/images/burner/riello-burner/light-oil-burner-01-stage.jpg", alt: "Riello one-stage light oil burner", spec: "23.8 to 240 kW", desc: "Single-output firing for steady heat demand in small boilers and light heating duty." },
      { idx: "02", kicker: "High / Low", title: "Two-Stage", img: "/images/burner/riello-burner/light-oil-burner-02-stage.jpg", alt: "Riello two-stage light oil burner", spec: "14 to 296 kW", desc: "Two output levels match demand more closely across civil and light-industrial boilers." },
      { idx: "03", kicker: "Stepped", title: "Three-Stage", img: "/images/burner/riello-burner/light-oil-burner-03-stage.jpg", alt: "Riello three-stage light oil burner", spec: "830 to 5340 kW", desc: "Three output steps give finer capacity control for larger steam and hot-water boilers." },
      { idx: "04", kicker: "Continuous", title: "Modulating", img: "/images/burner/riello-burner/light-oil-product/gas-burner-MODULATING.jpg", alt: "Riello modulating light oil burner", spec: "415 to 4340 kW", desc: "Continuous output control holds set temperature or pressure under varying load." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: BRAND.riello.name },
      { k: "Fuels", v: "Light oil: gasoil, kerosene (desktop fuel oil)" },
      { k: "Applications", v: "Steam boilers, hot-water boilers, process and diathermic heating" },
    ],
    related: ["gas-trains", "gas-burners", "dual-fuel-burners", "pressure-regulators"],
    faq: [
      { q: "What fuels do light oil burners use?", a: "They fire on light oil fuels such as gasoil and kerosene (desktop fuel oil)." },
      { q: "Can one boiler run on gas and oil?", a: "Yes, with a dual-fuel burner, which fires gas, light oil or both." },
      { q: "Where are they applied?", a: "Steam boilers, hot-water boilers and process / diathermic heating duty." },
    ],
  },
  {
    slug: "dual-fuel-burners",
    route: "/products/burners/dual-fuel-burners/",
    navLabel: "Dual Fuel Burners",
    brand: BRAND.riello.name,
    brandline: [BRAND.riello.name, "Dual Fuel"],
    brandIds: ["riello"],
    h1: "Dual-Fuel Burners",
    metaTitle: "Dual-Fuel Burners: Gas and Oil | Gastech Combustions",
    metaDescription:
      "Riello dual fuel burners: two stage 163-1,395 kW and modulating 407-5,000 kW. Switch between gas and oil. Supply and AMC from Gastech in Pune.",
    lead: "Burners that run on gas, on light oil, or on both, so a fuel supply interruption does not stop your process. Gastech supplies, sizes and services Riello dual fuel burners for boilers and heating duty where fuel flexibility and continuity matter.",
    specs: [
      { value: "163 to 5000 kW", label: "Output range" },
      { value: "Gas + Light Oil", label: "Dual-fuel firing" },
      { value: "2 control modes", label: "Two-stage & modulating" },
      { value: "Fuel backup", label: "Run-through security" },
    ],
    slides: [
      { cap: "Two-stage dual fuel burner / 163 to 1395 kW", src: `${IMG}/burner/riello-burner/light-oil-product/dual-fuel-two-stage.jpg`, alt: "Riello two-stage dual fuel burner" },
      { cap: "Modulating dual fuel burner / 407 to 5000 kW", src: `${IMG}/burner/riello-burner/light-oil-product/dual-fuel-modulating.jpg`, alt: "Riello modulating dual fuel burner" },
    ],
    modelEyebrow: "Model range",
    modelTitle: "Two fuels, two control modes.",
    modelSub: "Capacities below are from the Gastech dual fuel range. Every burner is matched to your boiler, fuels and duty.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "High / Low", title: "Two-Stage", img: "/images/burner/riello-burner/light-oil-product/dual-fuel-two-stage.jpg", alt: "Riello two-stage dual fuel burner", spec: "163 to 1395 kW", desc: "Two output levels fired on gas or oil, matching demand across civil and industrial boilers." },
      { idx: "02", kicker: "Continuous", title: "Modulating", img: "/images/burner/riello-burner/light-oil-product/dual-fuel-modulating.jpg", alt: "Riello modulating dual fuel burner", spec: "407 to 5000 kW", desc: "Continuous output control holds set temperature or pressure while switching between fuels." },
      { idx: "03", kicker: "Fuel security", title: "Why dual fuel", img: "/images/gas-train/genset-dual-fuel-kit.jpg", alt: "Dual fuel gas train kit", sub: "Gas · light oil · combination", desc: "A second fuel keeps heat and steam online if the primary gas supply is cut, de-pressurised or priced out." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: BRAND.riello.name },
      { k: "Fuels", v: "Natural gas or LPG with light-oil (gasoil) backup, fired separately or in combination" },
      { k: "Applications", v: "Steam boilers, hot-water boilers and process heating with fuel-security requirements" },
    ],
    related: ["gas-trains", "gas-burners", "light-oil-burners", "pressure-regulators"],
    faq: [
      { q: "Why choose a dual fuel burner?", a: "If the gas supply is interrupted, the burner switches to light oil, so the process keeps running." },
      { q: "Can a diesel genset run on dual fuel?", a: "Yes. Gastech builds gas trains for dual-fuel genset kits (see Gas Trains)." },
    ],
  },
  {
    slug: "pressure-regulators",
    route: "/products/gas-regulation/pressure-regulators/",
    navLabel: "Gas Pressure Regulators",
    brand: BRAND.pf.name,
    brandline: [BRAND.pf.name, "Gas Regulation"],
    brandIds: ["pf", "gastech"],
    h1: "Gas Pressure Regulators",
    metaTitle: "Gas Pressure Regulators for Industrial Use | Gastech",
    metaDescription:
      "Industrial gas pressure regulators by pressure class: low, medium-low and high-medium, direct or pilot operated. Pietro Fiorentini range from Gastech.",
    lead: "Pietro Fiorentini direct and pilot-operated gas regulators that hold downstream pressure steady across the flow range. Selected by gas type, inlet and outlet pressure and duty, from domestic low-pressure governors up to high/medium-pressure station regulators.",
    specs: [
      { value: 'DN 3/4" to 12"', label: "Nominal sizes" },
      { value: "Up to 102 bar", label: "Design pressure" },
      { value: "0.5 to 74 bar", label: "Downstream Wd" },
      { value: "Up to 100% H₂", label: "Hydrogen range" },
    ],
    slides: [
      { cap: "APERFLUX high / medium pressure regulator", src: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pietro Fiorentini APERFLUX regulator" },
      { cap: "STAFLUX low pressure governor", src: `${IMG}/PF/Staflux%20187.jpg`, alt: "Pietro Fiorentini STAFLUX governor" },
      { cap: "DIVAL 500 direct-operated regulator", src: `${IMG}/PF/gas/medium-low-pressure-regulator/direct-operated/dival-500.jpg`, alt: "Pietro Fiorentini DIVAL 500 regulator" },
      { cap: "FE series low pressure regulator", src: `${IMG}/PF/gas/low-pressure-regulator/fex.jpg`, alt: "Pietro Fiorentini FE low pressure regulator" },
    ],
    modelEyebrow: "Regulator families",
    modelTitle: "Three pressure classes.",
    modelSub: "Each family is offered in direct-operated or pilot-operated form, sized to your flow and downstream pressure.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Pilot operated", title: "High / Medium Pressure", img: "/images/PF/Aperflux%20851.jpg", alt: "Pietro Fiorentini APERFLUX pilot-operated regulator", spec: 'DN 1" to 12"', sub: "Up to 102 bar design pressure", desc: "Station and cabin regulators for high inlet pressure with tight downstream control.", list: ["APERFLUX 101", "ASX 176", "REFLUX 819"] },
      { idx: "02", kicker: "Direct operated", title: "Medium / Low Pressure", img: "/images/PF/gas/medium-low-pressure-regulator/direct-operated/dival-500.jpg", alt: "Pietro Fiorentini DIVAL 500 direct-operated regulator", spec: 'DN 3/4" to 8"', sub: "Up to 20 bar design pressure", desc: "Plant and works regulation where a compact direct-acting regulator is enough.", list: ["DIVAL 500", "DIVAL 600", "NORVAL", "HP 100"] },
      { idx: "03", kicker: "Direct operated", title: "Low Pressure & Governors", img: "/images/PF/gas/low-pressure-regulator/fex.jpg", alt: "Pietro Fiorentini FE low pressure regulator", spec: 'DN 1/2" to 1"', sub: "Up to 8.6 bar design pressure", desc: "Low-pressure governors for burners, appliances and meter-set applications.", list: ["DIVAL 160 AP", "STAFLUX 185", "FE 10 / 25 / 50 / 100"] },
    ],
    specEyebrow: "Specifications",
    specTitle: "Family comparison.",
    columns: {
      headers: ["Parameter", "High / Medium", "Medium / Low", "Low Pressure"],
      rows: [
        ["Principle", "Pilot operated", "Direct operated", "Direct operated"],
        ["Nominal size DN", '1" to 12"', '3/4" to 8"', '1/2" to 1"'],
        ["Design pressure", "Up to 102 bar", "Up to 20 bar", "Up to 8.6 bar"],
        ["Min differential", "1 bar (rec. > 2 bar)", "0.1 bar", "0.1 bar"],
        ["Downstream Wd", "0.5 to 74 bar", "0.01 to 6 bar", "13 mbar to 4.5 bar"],
        ["Connections", "ASME B16.5 cl 150/300/600, PN 16 ISO 7005", "ASME B16.5 cl 150, PN 16 ISO 7005", "Threaded / flanged to size"],
        ["Models", "APERFLUX 101, ASX 176, REFLUX 819", "DIVAL 500, DIVAL 600, NORVAL, HP 100", "DIVAL 160 AP, STAFLUX 185, FE 10/25/50/100"],
      ],
    },
    specRows: [
      { k: "Brand", v: "Pietro Fiorentini (Italy)" },
      { k: "Media", v: "Natural gas, LPG, biogas and other non-corrosive gases" },
      { k: "Standards", v: "ASME B16.5 flange classes and PN 16 to ISO 7005" },
      { k: "Options", v: "Relief valves and slam shut-off valves for complete regulation trains" },
    ],
    hydrogen: {
      eyebrow: "Hydrogen",
      title: "Regulation for hydrogen duty.",
      sub: "Gas networks are adding hydrogen. Pietro Fiorentini's hydrogen range covers regulation and metering for up to 100% H₂.",
      rows: [
        { k: "Hydrogen content", v: "Up to 100% H₂ on the Pietro Fiorentini hydrogen range" },
        { k: "Selection", v: "Model, pressure class and materials are confirmed for your duty before quotation" },
        { k: "Metering", v: "A hydrogen-ready rotary and turbine meter range is available (see Flow Meters)" },
        { k: "Gastech role", v: "Sizing, supply, commissioning and annual maintenance on hydrogen duty" },
      ],
    },
    related: ["gas-trains", "flow-meters", "safety-valves", "gas-burners"],
    faq: [
      { q: "Which gas types do Pietro Fiorentini regulators handle?", a: "Natural gas, LPG, biogas and other non-corrosive gases." },
      { q: "Can they regulate hydrogen?", a: "Pietro Fiorentini has a hydrogen range for up to 100% H₂. We confirm the model, pressure class and materials for your duty before we quote." },
      { q: "Can you supply a complete regulation train?", a: "Yes. With relief and slam shut-off valves, filters and metering, built as a Gastech gas train or regulating station." },
    ],
  },
  {
    slug: "flow-meters",
    route: "/products/gas-measurement/flow-meters/",
    navLabel: "Flow Meters",
    brand: BRAND.pf.name,
    brandline: [BRAND.pf.name, "Gas Metering"],
    brandIds: ["pf", "gastech"],
    h1: "Gas Flow Meters",
    metaTitle: "Industrial Gas Flow Meters & Totalisers | Gastech",
    metaDescription:
      "Industrial gas flow meters: rotary and turbine. Pietro Fiorentini meters with EVC, bypass and RS485 options from Gastech Combustions.",
    lead: "Precise gas measurement with Pietro Fiorentini RPD positive-displacement and turbine meters, electronic volume correctors and intrinsically safe Ex barriers. Selected by gas type, flow range and connection, from metering stations to plant and skid duty.",
    specs: [
      { value: "0.5 to 6500 m³/h", label: "Flow range" },
      { value: "DN 40 to DN 300", label: "Nominal sizes" },
      { value: "EVC", label: "Corrected volume" },
      { value: "Hydrogen-ready", label: "Rotary & turbine" },
    ],
    slides: [
      { cap: "Turbine gas meter / DN 40 to DN 150", src: `${IMG}/IM-TM%20turbine.jpg`, alt: "Pietro Fiorentini turbine gas meter" },
    ],
    modelEyebrow: "Meter range",
    modelTitle: "Measure, then correct.",
    modelSub: "Two meter principles cover most gas duty, with electronic volume correction turning raw flow into standard, corrected volume.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Positive displacement", title: "RPD Meters", img: "/images/products/rpd-meter.jpg", alt: "Pietro Fiorentini RPD rotary positive displacement meter", spec: "8 to 6500 m³/h", sub: "DN 50 to DN 300", desc: "Rotary positive-displacement meters in aluminium or carbon steel for wide, accurate plant and station measurement." },
      { idx: "02", kicker: "Turbine", title: "Turbine Meters", img: "/images/products/turbine-meters.jpg", alt: "Pietro Fiorentini turbine gas meters", spec: "0.5 to 1000 m³/h", sub: "DN 40 to DN 150", desc: "Turbine meters in aluminium or ductile iron for clean, dry gas at medium flow across commercial and industrial duty." },
      { idx: "03", kicker: "Correction", title: "EVC & Ex Barrier", img: "/images/products/evc.jpg", alt: "Pietro Fiorentini electronic volume corrector", sub: "INT-S3/N · II(2)G [Ex ib Gb] IIA", desc: "Electronic volume correctors convert meter pulses with local pressure and temperature into standard volume, with intrinsically safe interfaces." },
    ],
    specEyebrow: "Specifications",
    specTitle: "RPD vs turbine.",
    columns: {
      headers: ["Parameter", "RPD Meters", "Turbine Meters"],
      rows: [
        ["Principle", "Rotary positive displacement", "Turbine"],
        ["Body", "Hard anodized aluminium alloy or carbon steel", "Hard anodized aluminium alloy or spheroidal graphite cast iron"],
        ["Nominal size DN", "DN 50 to 200 (alu), DN 50 to 300 (steel)", "DN 40 to DN 150 (1 ½\" to 6\")"],
        ["Connections", "ANSI 150/300/600 ASME B16.5, PN 16 to 100 EN 1092-1", "ANSI 150 ASME B16.5 or PN 16/25 EN 1092-1"],
        ["Working temp", "-40 °C to +55 °C (steel body)", "-25 °C to +55 °C"],
        ["Min flow", "8 m³/h", "0.5 m³/h"],
        ["Max flow", "6,500 m³/h", "1,000 m³/h"],
      ],
    },
    specRows: [
      { k: "Brand", v: "Pietro Fiorentini (Italy)" },
      { k: "Media", v: "Natural gas, LPG and other non-corrosive gases; hydrogen-ready rotary and turbine range" },
      { k: "Volume correction", v: "EVC records local pressure and temperature to compute standard (corrected) volume from meter pulses" },
      { k: "Hazardous areas", v: "INT-S3/N interface / Ex barrier, marking II(2)G [Ex ib Gb] IIA, installed outside the hazardous zone" },
    ],
    related: ["gas-trains", "pressure-regulators", "safety-valves", "gasvigil"],
    faq: [
      { q: "Which meter type should I choose?", a: "Turbine meters suit clean, dry gas at medium flow; RPD meters cover the wider range up to the largest sizes." },
      { q: "Are the meters hydrogen-ready?", a: "Yes. A hydrogen-ready rotary and turbine range is available." },
      { q: "Can the meter come as a complete skid?", a: "Yes. We build flow-meter bypass assemblies with electronic volume correction and RS485 communication." },
    ],
  },
  {
    slug: "safety-valves",
    route: "/products/gas-regulation/safety-valves/",
    navLabel: "Safety Valves",
    brand: BRAND.pf.name,
    brandline: [BRAND.pf.name, "Gas Safety"],
    brandIds: ["pf"],
    h1: "Safety Shut-Off and Relief Valves",
    metaTitle: "Safety Shut-Off and Relief Valves | Gastech",
    metaDescription:
      "Pietro Fiorentini slam-shut valves for overpressure protection, design pressure up to 102 bar, up to DN 12. Authorised distributor Gastech Combustions.",
    lead: "Gas safety devices that protect people, plant and downstream equipment. Pietro Fiorentini slam shut-off valves cut the supply on failure, relief valves vent on overpressure, and governors hold downstream pressure, for natural gas and LPG regulation trains.",
    specs: [
      { value: "Up to 102 bar", label: "SSOV design pressure" },
      { value: 'DN up to 12"', label: "Nominal sizes" },
      { value: "-20 to +60 °C", label: "Design temperature" },
      { value: "EN 334 / 14382", label: "Standards" },
    ],
    slides: [
      { cap: "Slam shut-off valve", src: `${IMG}/PF/gas/shut-off-valves/dilock.jpg`, alt: "Pietro Fiorentini slam shut-off valve" },
    ],
    modelEyebrow: "Device range",
    modelTitle: "Three layers of protection.",
    modelSub: "Isolation, overpressure relief and pressure governing, matched to your regulation train and gas duty.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Isolation", title: "Slam Shut Off Valves", img: "/images/PF/gas/shut-off-valves/dilock.jpg", alt: "Pietro Fiorentini slam shut-off valve", spec: "Up to 102 bar", desc: "Fast-acting valves that cut gas flow on overpressure or pressure drop, protecting downstream plant." },
      { idx: "02", kicker: "Relief", title: "Relief Valves", img: "/images/products/reflux-819.jpg", alt: "Pietro Fiorentini REFLUX relief valve", spec: "20 bar design", sub: "AG class 2.5 / 5 / 10", desc: "Vent on overpressure to hold downstream pressure within a safe band across BP, MP and TR duties." },
      { idx: "03", kicker: "Governing", title: "Direct-Operated Governors", img: "/images/products/governor.jpg", alt: "Pietro Fiorentini direct-operated governor", spec: 'DN 1/2" to 4"', sub: "GOVAL, STD, ZERO, RATIO", desc: "Maintain a set downstream pressure for low-pressure burners, appliances and meter-set duty." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Device comparison.",
    columns: {
      headers: ["Parameter", "Slam Shut Off", "Relief Valves", "Governors"],
      rows: [
        ["Function", "Rapid gas isolation on failure", "Overpressure protection", "Downstream pressure control"],
        ["Design pressure", "Up to 102 bar", "20 bar", "Up to 1 bar (350 mbar)"],
        ["Nominal size DN", 'Up to 12"', '1"F x 1"F connections', '1/2" to 4"'],
        ["Key range", "ANSI 150/300/600 ASME B16.5, PN 16 EN 1092", "Who 15 to 7000 mbar; overpressure 500 / 1000 / 10000 mbar", "Min diff 2.5 / 20 mbar; Wd -5 to 300 mbar"],
        ["Standards", "End-to-end EN 334, EN 14382", "Accuracy class AG 2.5, 5, 10", "Direct operated"],
        ["Design temp", "-20 °C to +60 °C", "-20 °C to +60 °C", "Ambient gas service"],
      ],
    },
    specRows: [
      { k: "Brand", v: "Pietro Fiorentini (Italy)" },
      { k: "Media", v: "Natural gas, LPG and other non-corrosive gases" },
    ],
    related: ["gas-trains", "pressure-regulators", "flow-meters", "gasvigil"],
    faq: [
      { q: "What gas safety devices are supplied?", a: "Slam shut-off valves (rapid isolation on failure), relief valves (overpressure protection) and direct-operated governors (downstream pressure control)." },
      { q: "When does each device act?", a: "Slam shut-off valves close on overpressure or pressure drop; relief valves vent on overpressure; governors hold the set downstream pressure." },
    ],
  },
  {
    slug: "gas-trains",
    route: "/gas-trains/",
    navLabel: "Gas Trains",
    brand: BRAND.gastech.name,
    brandline: [BRAND.gastech.name, "Gas Systems"],
    brandIds: ["gastech"],
    h1: "Gas Trains: Custom, Skid-Mounted, Application-Specific",
    metaTitle: "Gas Train Manufacturer in Pune, India | Gastech",
    metaDescription:
      "Gastech Combustions designs and manufactures custom skid-mounted gas trains for burners, boilers and furnaces in Pune. Regulators, SSOV, filters, meters.",
    lead: "Engineered and manufactured for safe, reliable and precise control of fuel-gas supply to industrial burners and combustion systems. Each train is configured to your duty and supplied as a complete skid-mounted assembly.",
    specs: [
      { value: "Skid-mounted", label: "Complete assembly" },
      { value: "Application-based", label: "Configured to duty" },
      { value: "Safety built-in", label: "Shut-off & monitoring" },
      { value: "Tested", label: "Before handover" },
    ],
    slides: [
      { cap: "Compact gas train for monoblock and package burners", src: `${IMG}/gas-train/compact-monoblock.jpg`, alt: "Gastech compact gas train: ball valve, filter, regulator and gauges on yellow pipework" },
      { cap: "Customised gas train for monoblock burners", src: `${IMG}/gas-train/customized-monoblock.jpg`, alt: "Gastech customised gas train with regulators and gauges on a skid" },
      { cap: "Gas train for a textile stenter machine", src: `${IMG}/gas-train/textile-stenter.jpg`, alt: "Gastech gas train on a tubular frame for a textile stenter machine" },
      { cap: "Gas train for a steel plant", src: `${IMG}/gas-train/steel-plant.jpg`, alt: "Gastech gas train with regulators, solenoid valve and control cabinet for a steel plant" },
      { cap: "Gas train for a dual fuel kit (genset)", src: `${IMG}/gas-train/genset-dual-fuel-kit.jpg`, alt: "Gastech gas train for a dual fuel genset kit" },
      { cap: "Flow meter with bypass assembly, EVC and ISB for RS485", src: `${IMG}/gas-train/flowmeter-bypass.jpg`, alt: "Gastech flow-meter bypass skid with control cabinet" },
    ],    modelEyebrow: "Configuration",
    modelTitle: "Three ways we build a train.",
    modelSub: "From a compact skid for a single burner to a full application gas supply, each train is engineered around the duty.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Compact", title: "Monoblock / Package Burners", img: "/images/gas-train/compact-monoblock.jpg", alt: "Compact monoblock gas train for package burners", desc: "Compact and customised trains that feed gas to monoblock and package burners, sized for boilers and single-burner duty." },
      { idx: "02", kicker: "Application", title: "Process & Plant Trains", img: "/images/gas-train/steel-plant.jpg", alt: "Gas train for a steel plant process", desc: "Dedicated gas supply for textile stenter machines, dual-fuel gensets, galvanizing plants and steel-plant furnaces." },
      { idx: "03", kicker: "Turnkey", title: "Metering & Regulation Skids", img: "/images/gas-train/flowmeter-bypass.jpg", alt: "Skid with flow meter bypass and electronic volume correction", desc: "Flow-meter bypass assemblies with electronic volume correction and communication, built as a complete skid." },
    ],
    assembly: [
      { idx: "", kicker: "Isolation", title: "Shut-off valves", img: "/images/PF/gas/shut-off-valves/dilock.jpg", alt: "Safety shut-off valve", desc: "Manual and safety shut-off valves with solenoid valves for positive gas isolation." },
      { idx: "", kicker: "Conditioning", title: "Filters", img: "/images/gas-train/compact-monoblock.jpg", alt: "Gas train filter section on a compact monoblock", desc: "Gas filtration that protects regulators, meters and burners downstream." },
      { idx: "", kicker: "Control", title: "Pressure regulators", img: "/images/PF/gas/low-pressure-regulator/fex.jpg", alt: "Gas pressure regulator", desc: "Regulators that hold downstream pressure steady across the flow range." },
      { idx: "", kicker: "Monitoring", title: "Switches & meters", img: "/images/IM-TM%20turbine.jpg", alt: "Gas turbine flow meter", desc: "Pressure switches and flow meters for supervision and measurement." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Engineered around your duty.",
    specRows: [
      { k: "Supply form", v: "Complete skid-mounted assembly, engineered and manufactured by Gastech" },
      { k: "Configuration basis", v: "Gas type, flow, inlet and outlet pressure, safety requirements and applicable standards" },
    ],
    related: ["pressure-regulators", "safety-valves", "flow-meters", "gas-burners"],
    faq: [
      { q: "Can you build a train for a dual-fuel genset?", a: "Yes. We build gas trains for dual-fuel genset kits, as well as for textile stenter machines, galvanizing plants and steel-plant furnaces." },
      { q: "Can metering come with the train?", a: "Yes. We build flow-meter bypass assemblies with electronic volume correction and RS485 communication as a complete skid." },
      { q: "Who installs and commissions it?", a: "Our own team. The train is assembled and tested in our facility, then installed, commissioned and calibrated on site against the design duty." },
    ],
  },
  {
    slug: "valves",
    route: "/products/valves/electrogas-valves/",
    navLabel: "Valves & Actuation",
    brand: BRAND.electrogas.name,
    brandline: [BRAND.electrogas.name, "Gas Valves"],
    brandIds: ["electrogas"],
    h1: "Electrogas Valves: Solenoid, Motorised, Butterfly and Port",
    metaTitle: "Electrogas Gas Valves: Solenoid, Motorised, Butterfly | Gastech",
    metaDescription:
      "Electrogas solenoid, motorised, butterfly and port valves for gas lines, specified with regulation and burners on a Gastech gas train.",
    lead: "Solenoid, motorised, butterfly and port valves for gas lines. Gastech specifies Electrogas valves together with the regulation, metering and burners on your gas train, so isolation and control are selected as one system.",
    specs: [
      { value: "Solenoid", label: "Valves" },
      { value: "Motorised", label: "Valves" },
      { value: "Butterfly", label: "Valves" },
      { value: "Port", label: "Valves" },
    ],
    slides: [
      { cap: "Gas train with a solenoid valve", src: `${IMG}/gas-train/steel-plant.jpg`, alt: "Gastech gas train with a solenoid valve, regulators and control cabinet" },
    ],
    modelEyebrow: "Valve range",
    modelTitle: "Four valve types.",
    modelSub: "Solenoid, motorised, butterfly and port valves.",
    grid: 4,
    variants: [],
    types: [
      { id: "solenoid", label: "Solenoid valves" },
      { id: "motorised", label: "Motorised valves" },
      { id: "butterfly", label: "Butterfly valves" },
      { id: "port", label: "Port valves" },
    ],
    specEyebrow: "Specifications",
    specTitle: "Selected to your duty.",
    specRows: [
      { k: "Brand", v: BRAND.electrogas.name },
      { k: "Valve types", v: "Solenoid, motorised, butterfly and port valves" },
      { k: "Selection basis", v: "Gas type, line size, pressure, safety requirements and applicable standards" },
      { k: "Typical use", v: "Together with Pietro Fiorentini regulation, Riello burners and Gasvigil detection on a Gastech gas train" },
      { k: "Datasheets", v: "Models, sizes and ratings are confirmed per application on request" },
    ],
    related: ["gas-trains", "pressure-regulators", "safety-valves", "gas-burners"],
    faq: [
      { q: "Which Electrogas valves do you supply?", a: "Solenoid, motorised, butterfly and port valves for gas lines." },
      { q: "How do I choose a valve?", a: "Send us the gas type, line size, pressure and safety requirements. We specify the valve together with the rest of your gas train and send a quotation." },
      { q: "Can the valves come on a complete skid?", a: "Yes. We build them into Gastech gas trains with regulation, metering and safety devices." },
    ],
  },
  {
    slug: "gasvigil",
    route: "/brands/gasvigil/",
    navLabel: "Gas Leak Detection",
    brand: BRAND.gasvigil.name,
    brandline: [BRAND.gasvigil.name, "Gas Safety"],
    brandIds: ["gasvigil"],
    h1: "Gasvigil Gas Leak Detection Systems",
    metaTitle: "Gasvigil Gas Leak Detectors Distributor | Gastech",
    metaDescription:
      "Authorised Gasvigil distributor in India: fixed and portable gas leak detectors, GV 108 detector and panels for combustible and toxic gases, oxygen and carbon dioxide.",
    lead: "Continuous gas-leak sensing with automatic shutoff to protect people and plant. Gasvigil detectors and panels sense combustible gases such as LPG and methane, toxic gases such as carbon monoxide and hydrogen sulphide, and oxygen and carbon dioxide, alarm early and interlock the supply.",
    specs: [
      { value: "Multi-gas", label: "Combustible, toxic, O₂ & CO₂" },
      { value: "10 / 30% LEL", label: "Low / high alarm" },
      { value: "Exd IIC T6 Gb", label: "GV 108 explosion protection" },
      { value: "IP67", label: "GV 108 ingress protection" },
    ],
    slides: [
      { cap: "GV 108 gas detector", src: `${IMG}/Gasvigil/GV%20108%20Gas%20Detector.jpg`, alt: "Gasvigil GV 108 gas detector" },
      { cap: "GV 108 control panel", src: `${IMG}/Gasvigil/GV%20108%20Panel.jpg`, alt: "Gasvigil GV 108 control panel" },
      { cap: "Stand-alone detector unit", src: `${IMG}/Gasvigil/Stand%20Alone.png`, alt: "Gasvigil stand-alone gas detector" },
      { cap: "Portable gas leak detector", src: `${IMG}/Gasvigil/Untitled%20design%20(1).png`, alt: "Gasvigil portable gas leak detector" },
    ],
    modelEyebrow: "System range",
    modelTitle: "Fixed, panelled and portable detection.",
    modelSub: "From a single stand-alone detector to a multi-point panel that interlocks the gas supply.",
    grid: 4,
    variants: [
      { idx: "01", kicker: "Point sensor", title: "GV 108 Detector", img: "/images/Gasvigil/GV%20108%20Gas%20Detector.jpg", alt: "Gasvigil GV 108 gas detector", spec: "Wall-mount LCD", desc: "Fixed wall-mount detector with LCD that continuously monitors for gas presence and raises an audible and visual alarm at the set point." },
      { idx: "02", kicker: "Multi-point", title: "GV 108 Panel", img: "/images/Gasvigil/GV%20108%20Panel.jpg", alt: "Gasvigil GV 108 detector panel", spec: "Zoned interlock", desc: "Central panel that wires multiple detectors, shows zone status and drives alarm and automatic gas-shutoff interlocks across a plant." },
      { idx: "03", kicker: "Self-contained", title: "Stand-Alone Unit", img: "/images/Gasvigil/Stand%20Alone.png", alt: "Gasvigil stand-alone gas detector on a post", spec: "Built-in relay", desc: "Independent detector with built-in relay for local alarm and shutoff, ideal for kitchens, boiler rooms and single-hazard points." },
      { idx: "04", kicker: "Mobile", title: "Portable Detector", img: "/images/Gasvigil/Untitled%20design%20(1).png", alt: "Gasvigil portable gas detectors", spec: "Handheld", desc: "Handheld leak detector for surveys, commissioning and spot checks where fixed sensing is not installed." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sensing built for the hazard.",
    specRows: [
      { k: "Brand", v: BRAND.gasvigil.name },
      { k: "Combustible gases", v: "LPG, LNG, methane (CH₄), propane, butane, hydrogen (H₂), acetylene, ethylene and others on the GV 108 list, in %LEL" },
      { k: "Toxic gases", v: "Hydrogen sulphide (H₂S), carbon monoxide (CO), chlorine (Cl₂), ammonia (NH₃), sulphur dioxide (SO₂), benzene, formaldehyde, HCl, HCN, VOC and others on the GV 108 list" },
      { k: "Other gases", v: "Oxygen (O₂) and carbon dioxide (CO₂)" },
      { k: "Alarm points", v: "Low alarm 10% LEL, high alarm 30% LEL (GV 108)" },
      { k: "GV 108 ratings", v: "24 V DC supply; Exd IIC T6 Gb; IP67; fixed bracket or wall mounting" },
      { k: "Sensing", v: "Continuous, natural-diffusion sensing" },
      { k: "Display", v: "On-device LCD with status and alarm indication" },
            { k: "Output", v: "Alarm and automatic gas-shutoff interlock" },
      { k: "Configuration", v: "Single stand-alone point to multi-zone panelled systems" },
    ],
    related: ["gas-trains", "pressure-regulators", "safety-valves", "gas-burners"],
    faq: [
      { q: "Which gases can Gasvigil detect?", a: "Combustible gases such as LPG, LNG, methane, propane, butane and hydrogen, toxic gases such as H₂S, CO, chlorine, ammonia and SO₂, and oxygen and carbon dioxide. The GV 108 datasheet lists every gas." },
      { q: "Does it just alarm or also act?", a: "It alarms and provides an automatic gas-shutoff interlock, from a single stand-alone point to multi-zone panelled systems." },
      { q: "What protection rating does the GV 108 have?", a: "IP67, with an Exd IIC T6 Gb explosion-protection marking, on a 24 V DC supply." },
    ],
  },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

const ROUTE_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.route, p]),
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCT_MAP[slug];
}

/**
 * Resolve a product from the segments a catch-all route receives, e.g.
 * ("/products/", ["burners","gas-burners"]). The prefix is required: a route
 * folder only ever hands over the segments beneath it, so rebuilding the path
 * without it would look up "/burners/gas-burners/" and miss every product.
 */
export function getProductByRoute(
  prefix: string,
  segments: string[],
): Product | undefined {
  return ROUTE_MAP[prefix + segments.join("/") + "/"];
}

/** Products whose canonical path sits under a given prefix, e.g. "/products/" . */
export function productsUnder(prefix: string): Product[] {
  return PRODUCTS.filter((p) => p.route.startsWith(prefix) && p.route !== prefix);
}
