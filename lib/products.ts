/* ---------------------------------------------------------------------------
   Authoritative product catalog — content transcribed from the live HTML pages
   (no invented specs). Powers the data-driven product routes, the products hub,
   the sitemap and the Product / FAQ JSON-LD (SEO + AEO + GEO).
   --------------------------------------------------------------------------- */

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
};
export type TableRow = { k: string; v: string };
export type ColumnsTable = { headers: string[]; rows: string[][] };
export type Faq = { q: string; a: string };

export type Product = {
  slug: string;
  navLabel: string;
  brand: string;
  brandline: [string, string];
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
  assembly?: Variant[];
  specEyebrow: string;
  specTitle: string;
  columns?: ColumnsTable;
  specRows: TableRow[];
  generalRows?: TableRow[];
  related: string[];
  faq: Faq[];
};

const IMG = "https://gastechcombustions.in/images";

export const PRODUCTS: Product[] = [
  {
    slug: "gas-burners",
    navLabel: "Gas Burners",
    brand: "Riello",
    brandline: ["Riello", "Industrial Burners"],
    h1: "Riello Gas Burners",
    metaTitle: "Gas Burners | 11 to 4885 kW | Gastech Combustions",
    metaDescription:
      "Riello gas burners for natural gas and LPG. One-stage, two-stage, two-stage progressive and modulating models from 11 to 4885 kW for steam, hot-water and diathermic oil boilers, supplied, sized and serviced by Gastech Combustions in Pune.",
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
      { idx: "01", kicker: "On / Off", title: "One-Stage", spec: "11 to 220 kW", desc: "Single-output firing for steady heat demand in small boilers and light heating duty." },
      { idx: "02", kicker: "High / Low", title: "Two-Stage", spec: "130 to 3200 kW", desc: "Two output levels match demand more closely across mid-sized civil and industrial boilers." },
      { idx: "03", kicker: "Stepped", title: "Two-Stage Progressive", spec: "45 to 2290 kW", desc: "Progressive two-step control for smoother capacity modulation than simple high / low firing." },
      { idx: "04", kicker: "Continuous", title: "Modulating", spec: "130 to 4885 kW", desc: "Continuous output control for hot-water, steam and medium-temperature boilers under varying load." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: "Riello" },
      { k: "Fuel gases", v: "Natural gas, LPG (propane / butane)" },
      { k: "Control modes", v: "One-stage, two-stage, two-stage progressive, modulating" },
      { k: "Output range", v: "11 to 4885 kW (model dependent)" },
      { k: "Applications", v: "Steam boilers, hot-water boilers, diathermic oil boilers" },
      { k: "Gastech scope", v: "Supply, sizing, installation, commissioning & AMC" },
    ],
    related: ["pf-regulators", "gas-trains", "light-oil-burners", "gasvigil"],
    faq: [
      { q: "What fuels do Riello gas burners run on?", a: "The range fires on natural gas or LPG (propane / butane), selected to your site gas supply." },
      { q: "What output range is available?", a: "Model outputs span 11 to 4885 kW across one-stage, two-stage, two-stage progressive and modulating control modes." },
      { q: "Which boilers can they be fitted to?", a: "They suit steam, hot-water and diathermic oil boilers; each burner is matched to your boiler, output and duty." },
      { q: "What does Gastech provide?", a: "Supply, sizing, installation, commissioning and annual maintenance (AMC) of the correct Riello gas burner." },
    ],
  },
  {
    slug: "light-oil-burners",
    navLabel: "Light Oil Burners",
    brand: "Riello",
    brandline: ["Riello", "Oil Burners"],
    h1: "Light Oil Burners",
    metaTitle: "Light Oil Burners | 14 to 5340 kW | Gastech Combustions",
    metaDescription:
      "Riello light oil burners fired on gasoil and kerosene. One-stage, two-stage, three-stage and modulating models from 14 to 5340 kW for steam, hot-water and process boilers, supplied, sized and serviced by Gastech Combustions in Pune.",
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
      { cap: "Modulating light oil burner / 415 to 4340 kW", src: `${IMG}/burner/riello-burner/ligjt-oil-burner-modulating.jpg`, alt: "Riello modulating light oil burner" },
    ],
    modelEyebrow: "Model range",
    modelTitle: "Four firing modes, one light fuel.",
    modelSub: "Capacities below are from the Gastech light oil range. Every burner is matched to your boiler, output and duty.",
    grid: 4,
    variants: [
      { idx: "01", kicker: "On / Off", title: "One-Stage", spec: "23.8 to 240 kW", desc: "Single-output firing for steady heat demand in small boilers and light heating duty." },
      { idx: "02", kicker: "High / Low", title: "Two-Stage", spec: "14 to 296 kW", desc: "Two output levels match demand more closely across civil and light-industrial boilers." },
      { idx: "03", kicker: "Stepped", title: "Three-Stage", spec: "830 to 5340 kW", desc: "Three output steps give finer capacity control for larger steam and hot-water boilers." },
      { idx: "04", kicker: "Continuous", title: "Modulating", spec: "415 to 4340 kW", desc: "Continuous output control holds set temperature or pressure under varying load." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: "Riello" },
      { k: "Fuels", v: "Light oil: gasoil, kerosene (desktop fuel oil)" },
      { k: "Control modes", v: "One-stage, two-stage, three-stage, modulating" },
      { k: "Output range", v: "14 to 5340 kW (model dependent)" },
      { k: "Applications", v: "Steam boilers, hot-water boilers, process and diathermic heating" },
      { k: "Gastech scope", v: "Supply, sizing, installation, commissioning & AMC" },
    ],
    related: ["gas-burners", "dual-fuel-burners", "gas-trains", "pf-regulators"],
    faq: [
      { q: "What fuels do light oil burners use?", a: "They fire on light oil fuels such as gasoil and kerosene (desktop fuel oil)." },
      { q: "What outputs are covered?", a: "The Gastech light oil range spans 14 to 5340 kW across one-stage, two-stage, three-stage and modulating models." },
      { q: "Where are they applied?", a: "Steam boilers, hot-water boilers and process / diathermic heating duty." },
    ],
  },
  {
    slug: "dual-fuel-burners",
    navLabel: "Dual Fuel Burners",
    brand: "Riello",
    brandline: ["Riello", "Dual Fuel"],
    h1: "Dual Fuel Burners",
    metaTitle: "Dual Fuel Burners | 163 to 5000 kW | Gastech Combustions",
    metaDescription:
      "Riello dual fuel burners that fire on gas, light oil or both. Two-stage models from 163 to 1395 kW and modulating models from 407 to 5000 kW for boilers and process heating, supplied, sized and serviced by Gastech Combustions in Pune.",
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
      { idx: "01", kicker: "High / Low", title: "Two-Stage", spec: "163 to 1395 kW", desc: "Two output levels fired on gas or oil, matching demand across civil and industrial boilers." },
      { idx: "02", kicker: "Continuous", title: "Modulating", spec: "407 to 5000 kW", desc: "Continuous output control holds set temperature or pressure while switching between fuels." },
      { idx: "03", kicker: "Fuel security", title: "Why dual fuel", sub: "Gas · light oil · combination", desc: "A second fuel keeps heat and steam online if the primary gas supply is cut, de-pressurised or priced out." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sized to your duty.",
    specRows: [
      { k: "Brand", v: "Riello" },
      { k: "Fuels", v: "Natural gas or LPG with light-oil (gasoil) backup, fired separately or in combination" },
      { k: "Control modes", v: "Two-stage, modulating" },
      { k: "Output range", v: "163 to 5000 kW (model dependent)" },
      { k: "Applications", v: "Steam boilers, hot-water boilers and process heating with fuel-security requirements" },
      { k: "Gastech scope", v: "Supply, sizing, installation, commissioning & AMC" },
    ],
    related: ["gas-burners", "light-oil-burners", "gas-trains", "pf-regulators"],
    faq: [
      { q: "Why choose a dual fuel burner?", a: "A second fuel keeps heat and steam online if the primary gas supply is cut, de-pressurised or priced out." },
      { q: "Which fuel combinations are possible?", a: "Natural gas or LPG with light-oil (gasoil) backup, fired separately or in combination." },
      { q: "What is the output range?", a: "163 to 5000 kW across two-stage and modulating control modes." },
    ],
  },
  {
    slug: "pf-regulators",
    navLabel: "Gas Regulators",
    brand: "Pietro Fiorentini",
    brandline: ["Pietro Fiorentini", "Gas Regulation"],
    h1: "Gas Pressure Regulators & Governors",
    metaTitle: "Gas Pressure Regulators | Pietro Fiorentini | Gastech",
    metaDescription:
      "Pietro Fiorentini gas pressure regulators and governors for natural gas, LPG and biogas. High/medium, medium/low and low pressure families from DN 3/4 inch to DN 12 inch, up to 102 bar, with ASME B16.5 and ISO 7005 connections, supplied and serviced by Gastech Combustions in Pune.",
    lead: "Pietro Fiorentini direct and pilot-operated gas regulators that hold downstream pressure steady across the flow range. Selected by gas type, inlet and outlet pressure and duty, from domestic low-pressure governors up to high/medium-pressure station regulators.",
    specs: [
      { value: 'DN 3/4" to 12"', label: "Nominal sizes" },
      { value: "Up to 102 bar", label: "Design pressure" },
      { value: "0.5 to 74 bar", label: "Downstream Wd" },
      { value: "ASME / ISO", label: "B16.5 & 7005" },
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
      { idx: "01", kicker: "Pilot operated", title: "High / Medium Pressure", spec: 'DN 1" to 12"', sub: "Up to 102 bar design pressure", desc: "Station and cabin regulators for high inlet pressure with tight downstream control.", list: ["APERFLUX 101", "ASX 176", "REFLUX 819"] },
      { idx: "02", kicker: "Direct operated", title: "Medium / Low Pressure", spec: 'DN 3/4" to 8"', sub: "Up to 20 bar design pressure", desc: "Plant and works regulation where a compact direct-acting regulator is enough.", list: ["DIVAL 500", "DIVAL 600", "NORVAL", "HP 100"] },
      { idx: "03", kicker: "Direct operated", title: "Low Pressure & Governors", spec: 'DN 1/2" to 1"', sub: "Up to 8.6 bar design pressure", desc: "Low-pressure governors for burners, appliances and meter-set applications.", list: ["DIVAL 160 AP", "STAFLUX 185", "FE 10 / 25 / 50 / 100"] },
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
      { k: "Gastech scope", v: "Sizing, supply, installation, commissioning & AMC" },
    ],
    related: ["flow-meters", "safety-valves", "gas-trains", "gas-burners"],
    faq: [
      { q: "Which gas types do Pietro Fiorentini regulators handle?", a: "Natural gas, LPG, biogas and other non-corrosive gases." },
      { q: "How are the regulators classified?", a: "Three pressure families: high/medium (pilot operated, up to 102 bar), medium/low and low pressure (direct operated, up to 8.6 bar)." },
      { q: "What sizes and connections are available?", a: 'Nominal sizes from DN 3/4" to 12" with ASME B16.5 flange classes and PN 16 to ISO 7005 connections.' },
    ],
  },
  {
    slug: "flow-meters",
    navLabel: "Flow Meters",
    brand: "Pietro Fiorentini",
    brandline: ["Pietro Fiorentini", "Gas Metering"],
    h1: "Gas Flow Meters & Volume Correction",
    metaTitle: "Gas Flow Meters & EVC | Pietro Fiorentini | Gastech",
    metaDescription:
      "Pietro Fiorentini gas flow meters: RPD positive-displacement and turbine meters with electronic volume correctors (EVC) and intrinsically safe Ex barriers. DN sizes, flow ranges and hydrogen-ready metering supplied and serviced by Gastech Combustions in Pune.",
    lead: "Accurate, billable gas measurement with Pietro Fiorentini RPD positive-displacement and turbine meters, electronic volume correctors and intrinsically safe Ex barriers. Selected by gas type, flow range and connection, from metering stations to plant and skid duty.",
    specs: [
      { value: "0.5 to 6500 m³/h", label: "Flow range" },
      { value: "DN 40 to DN 300", label: "Nominal sizes" },
      { value: "EVC", label: "Corrected volume" },
      { value: "Hydrogen-ready", label: "Rotary & ultrasonic" },
    ],
    slides: [
      { cap: "Turbine gas meter / DN 40 to DN 150", src: `${IMG}/IM-TM%20turbine.jpg`, alt: "Pietro Fiorentini turbine gas meter" },
    ],
    modelEyebrow: "Meter range",
    modelTitle: "Measure, then correct.",
    modelSub: "Two meter principles cover most gas duty, with electronic volume correction turning raw flow into standard, billable volume.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Positive displacement", title: "RPD Meters", spec: "8 to 6500 m³/h", sub: "DN 50 to DN 300", desc: "Rotary positive-displacement meters in aluminium or carbon steel for wide, accurate plant and station measurement." },
      { idx: "02", kicker: "Turbine", title: "Turbine Meters", spec: "0.5 to 1000 m³/h", sub: "DN 40 to DN 150", desc: "Turbine meters in aluminium or ductile iron for clean, dry gas at medium flow across commercial and industrial duty." },
      { idx: "03", kicker: "Correction", title: "EVC & Ex Barrier", sub: "INT-S3/N · II(2)G [Ex ib Gb] IIA", desc: "Electronic volume correctors convert meter pulses with local pressure and temperature into standard volume, with intrinsically safe interfaces." },
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
      { k: "Media", v: "Natural gas, LPG and other non-corrosive gases; hydrogen-ready rotary, ultrasonic and turbine range" },
      { k: "Volume correction", v: "EVC records local pressure and temperature to compute standard (corrected) volume from meter pulses" },
      { k: "Hazardous areas", v: "INT-S3/N interface / Ex barrier, marking II(2)G [Ex ib Gb] IIA, installed outside the hazardous zone" },
      { k: "Gastech scope", v: "Sizing, supply, installation, commissioning & AMC" },
    ],
    related: ["pf-regulators", "safety-valves", "gas-trains", "gasvigil"],
    faq: [
      { q: "What types of gas flow meters are offered?", a: "RPD rotary positive-displacement meters and turbine meters, both with electronic volume correction (EVC)." },
      { q: "What flow range is covered?", a: "From 0.5 to 6500 m³/h across the RPD and turbine ranges, in DN 40 to DN 300 sizes." },
      { q: "Are the meters hydrogen-ready?", a: "Yes — a hydrogen-ready rotary, ultrasonic and turbine range is available." },
    ],
  },
  {
    slug: "safety-valves",
    navLabel: "Safety Valves",
    brand: "Pietro Fiorentini",
    brandline: ["Pietro Fiorentini", "Gas Safety"],
    h1: "Safety Shut-Off, Relief & Governing Valves",
    metaTitle: "Gas Safety Valves | Pietro Fiorentini | Gastech",
    metaDescription:
      'Pietro Fiorentini gas safety devices: slam shut-off valves up to 102 bar and DN 12 inch, relief valves and direct-operated governors for natural gas and LPG systems, supplied and serviced by Gastech Combustions in Pune.',
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
      { idx: "01", kicker: "Isolation", title: "Slam Shut Off Valves", spec: "Up to 102 bar", sub: 'DN up to 12"', desc: "Fast-acting valves that cut gas flow on overpressure or pressure drop, protecting downstream plant." },
      { idx: "02", kicker: "Relief", title: "Relief Valves", spec: "20 bar design", sub: "AG class 2.5 / 5 / 10", desc: "Vent on overpressure to hold downstream pressure within a safe band across BP, MP and TR duties." },
      { idx: "03", kicker: "Governing", title: "Direct-Operated Governors", spec: 'DN 1/2" to 4"', sub: "GOVAL, STD, ZERO, RATIO", desc: "Maintain a set downstream pressure for low-pressure burners, appliances and meter-set duty." },
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
      { k: "Slam shut-off", v: "Design pressure up to 102 bar, DN up to 12\", ANSI 150/300/600 ASME B16.5, PN 16 EN 1092, end-to-end EN 334 / EN 14382" },
      { k: "Relief valves", v: "20 bar design, overpressure 500 / 1000 / 10000 mbar for BP / MP / TR, regulation range 15 to 7000 mbar, AG class 2.5 / 5 / 10" },
      { k: "Gastech scope", v: "Sizing, supply, installation, commissioning & AMC" },
    ],
    related: ["pf-regulators", "gas-trains", "flow-meters", "gasvigil"],
    faq: [
      { q: "What gas safety devices are supplied?", a: "Slam shut-off valves (rapid isolation on failure), relief valves (overpressure protection) and direct-operated governors (downstream pressure control)." },
      { q: "How robust are the shut-off valves?", a: 'Slam shut-off valves cover design pressure up to 102 bar and DN up to 12", built to EN 334 and EN 14382.' },
    ],
  },
  {
    slug: "gas-trains",
    navLabel: "Gas Trains",
    brand: "Gastech",
    brandline: ["Gastech", "Gas Systems"],
    h1: "Gas Trains",
    metaTitle: "Gas Trains & Skids | Gastech Combustions",
    metaDescription:
      "Gastech gas trains are engineered, assembled and commissioned as complete skid-mounted assemblies for safe, reliable and precise fuel-gas supply to industrial burners. Manual and safety shut-off valves, filters, regulators, solenoid valves, pressure switches and flow meters, configured to your application.",
    lead: "Engineered and manufactured to give safe, reliable and precise control of fuel-gas supply to industrial burners and combustion systems. Each gas train is configured to your application: gas type, flow, inlet and outlet pressure, safety requirements and applicable standards, supplied as a complete skid-mounted assembly.",
    specs: [
      { value: "Skid-mounted", label: "Complete assembly" },
      { value: "Application-based", label: "Configured to duty" },
      { value: "Safety built-in", label: "Shut-off & monitoring" },
      { value: "Custom", label: "Reliable & safe" },
    ],
    slides: [
      { cap: "Gas train assembly for industrial burners", src: `${IMG}/burner/gas-burner.png`, alt: "Gas train assembly" },
      { cap: "Pressure regulator in the train", src: `${IMG}/PF/Aperflux%20851.jpg`, alt: "Pressure regulator" },
      { cap: "Safety shut-off valve in the train", src: `${IMG}/PF/gas/shut-off-valves/dilock.jpg`, alt: "Safety shut-off valve" },
      { cap: "Flow meter in the train", src: `${IMG}/IM-TM%20turbine.jpg`, alt: "Gas flow meter" },
    ],
    modelEyebrow: "Configuration",
    modelTitle: "Three ways we build a train.",
    modelSub: "From a compact skid for a single burner to a full application gas supply, each train is engineered around the duty.",
    grid: 3,
    variants: [
      { idx: "01", kicker: "Compact", title: "Monoblock / Package Burners", desc: "Compact and customised trains that feed gas to monoblock and package burners, sized for boilers and single-burner duty." },
      { idx: "02", kicker: "Application", title: "Process & Plant Trains", desc: "Dedicated gas supply for textile stenter machines, dual-fuel gensets, galvanizing plants and steel-plant furnaces." },
      { idx: "03", kicker: "Turnkey", title: "Metering & Regulation Skids", desc: "Flow-meter bypass assemblies with electronic volume correction and communication, built as a complete skid." },
    ],
    assembly: [
      { idx: "", kicker: "Isolation", title: "Shut-off valves", desc: "Manual and safety shut-off valves with solenoid valves for positive gas isolation." },
      { idx: "", kicker: "Conditioning", title: "Filters", desc: "Gas filtration that protects regulators, meters and burners downstream." },
      { idx: "", kicker: "Control", title: "Pressure regulators", desc: "Regulators that hold downstream pressure steady across the flow range." },
      { idx: "", kicker: "Monitoring", title: "Switches & meters", desc: "Pressure switches and flow meters for supervision and measurement." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Engineered around your duty.",
    specRows: [
      { k: "Supply form", v: "Complete skid-mounted assembly, engineered and manufactured by Gastech" },
      { k: "Configuration basis", v: "Gas type, flow, inlet and outlet pressure, safety requirements and applicable standards" },
      { k: "Included devices", v: "Manual shut-off valves, filters, pressure regulators, safety shut-off valves, solenoid valves, pressure switches, flow meters" },
      { k: "Principles", v: "Customized · Reliable · Safe · Application-specific" },
      { k: "Applications", v: "Monoblock / package burners, textile stenter, dual-fuel genset, galvanizing plant, steel plant" },
      { k: "Gastech scope", v: "Design, assembly, testing, installation, commissioning & AMC" },
    ],
    related: ["gas-burners", "pf-regulators", "safety-valves", "flow-meters"],
    faq: [
      { q: "What is a gas train?", a: "A complete skid-mounted assembly that gives safe, reliable and precise control of fuel-gas supply to industrial burners and combustion systems." },
      { q: "What devices are included?", a: "Manual and safety shut-off valves, filters, pressure regulators, solenoid valves, pressure switches and flow meters, configured to your application." },
      { q: "How is a train configured?", a: "Around gas type, flow, inlet and outlet pressure, safety requirements and applicable standards." },
    ],
  },
  {
    slug: "gasvigil",
    navLabel: "Gas Leak Detection",
    brand: "Gasvigil",
    brandline: ["Gasvigil", "Gas Safety"],
    h1: "Gasvigil Gas Leak Detection & Shutoff",
    metaTitle: "Gas Leak Detection & Shutoff | Gasvigil | Gastech",
    metaDescription:
      "Gasvigil gas leak detection and automatic shutoff systems: GV 108 gas detector, control panel, stand-alone units and portable detectors. Continuous sensing of CO, LPG/CNG, H2S and oxygen, supplied and commissioned by Gastech Combustions in Pune.",
    lead: "Continuous gas-leak sensing with automatic shutoff to protect people and plant. Gasvigil detectors and panels sense combustible gas (LPG / CNG), carbon monoxide, hydrogen sulphide and oxygen depletion, alarm early and interlock the supply.",
    specs: [
      { value: "All gases", label: "Combustible & toxic" },
      { value: "10 / 30% LEL", label: "Low / high alarm" },
      { value: "Exd IIC T6 Gb", label: "Production grade" },
      { value: "IP67", label: "Protection grade" },
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
      { idx: "01", kicker: "Point sensor", title: "GV 108 Detector", spec: "Wall-mount LCD", desc: "Fixed wall-mount detector with LCD that continuously monitors for gas presence and raises an audible and visual alarm at the set point." },
      { idx: "02", kicker: "Multi-point", title: "GV 108 Panel", spec: "Zoned interlock", desc: "Central panel that wires multiple detectors, shows zone status and drives alarm and automatic gas-shutoff interlocks across a plant." },
      { idx: "03", kicker: "Self-contained", title: "Stand-Alone Unit", spec: "Built-in relay", desc: "Independent detector with built-in relay for local alarm and shutoff, ideal for kitchens, boiler rooms and single-hazard points." },
      { idx: "04", kicker: "Mobile", title: "Portable Detector", spec: "Handheld", desc: "Handheld leak detector for surveys, commissioning and spot checks where fixed sensing is not installed." },
    ],
    specEyebrow: "Specifications",
    specTitle: "Sensing built for the hazard.",
    specRows: [
      { k: "Brand", v: "Gasvigil" },
      { k: "Gases detected", v: "LPG / CNG (combustible, %LEL), carbon monoxide (CO), hydrogen sulphide (H₂S), oxygen (O₂) depletion" },
      { k: "Sensing", v: "Continuous, natural-diffusion sensing" },
      { k: "Display", v: "On-device LCD with status and alarm indication" },
      { k: "Protection", v: "Waterproof and dustproof enclosure for plant environments" },
      { k: "Output", v: "Alarm and automatic gas-shutoff interlock" },
      { k: "Configuration", v: "Single stand-alone point to multi-zone panelled systems" },
      { k: "Gastech scope", v: "Supply, siting, installation, commissioning & AMC" },
    ],
    related: ["gas-trains", "pf-regulators", "safety-valves", "gas-burners"],
    faq: [
      { q: "Which gases can Gasvigil detect?", a: "Combustible LPG / CNG (in %LEL), carbon monoxide (CO), hydrogen sulphide (H₂S) and oxygen (O₂) depletion." },
      { q: "Does it just alarm or also act?", a: "It alarms and provides an automatic gas-shutoff interlock, from a single stand-alone point to multi-zone panelled systems." },
      { q: "What protection rating do the devices have?", a: "Waterproof and dustproof enclosures for plant environments, with production-grade sensing options (Exd IIC T6 Gb) and IP67 units." },
    ],
  },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCT_MAP[slug];
}
