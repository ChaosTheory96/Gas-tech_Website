"use client";
/* ---------------------------------------------------------------------------
   Icon system. Every glyph is now a Phosphor icon (regular weight) rendered
   inside a `<span class="i">` wrapper so the whole existing site.css `.i`
   contract keeps working unchanged: parent rules like `.car-btn .i{width:20px}`
   and `.contact-ic .i{width:26px}` still size the wrapper, and the inner SVG
   fills it (`.i > svg{width:100%;height:100%}` in the polish block). Colour
   still flows through `currentColor` (Phosphor fills with currentColor), so the
   red-plate white-flip rules keep applying. Unknown names fall back to Cube.
   The old hand-made sprite is neutralised (kept, not deleted) for safety.
   --------------------------------------------------------------------------- */
import {
  ArrowRight, ArrowUpRight, Cylinder, Gauge, Flame, Drop, Funnel, Wind,
  Waveform, Lightning, Cpu, Atom, Gear, ShieldCheck, Stack, GlobeSimple,
  SlidersHorizontal, Leaf, ChatCircle, Wrench, CalendarBlank, Phone,
  EnvelopeSimple, MapPin, Check, SealCheck, Factory, Flask, Quotes, Cube,
  CircleHalf, SquaresFour, Siren,
} from "@phosphor-icons/react";

const GLYPHS: Record<string, typeof ArrowRight> = {
  arrow: ArrowRight,
  "arrow-dl": ArrowUpRight,
  cylinder: Cylinder,
  gauge: Gauge,
  flame: Flame,
  mix: Drop,
  manifold: Funnel,
  dryer: Wind,
  vacuum: Funnel,
  flow: Waveform,
  bolt: Lightning,
  chip: Cpu,
  molecule: Atom,
  gear: Gear,
  shield: ShieldCheck,
  layers: Stack,
  globe: GlobeSimple,
  settings: SlidersHorizontal,
  leaf: Leaf,
  chat: ChatCircle,
  wrench: Wrench,
  calendar: CalendarBlank,
  phone: Phone,
  mail: EnvelopeSimple,
  pin: MapPin,
  check: Check,
  award: SealCheck,
  factory: Factory,
  flask: Flask,
  quote: Quotes,
  /* mega-menu product set: distinct, semantically right glyphs */
  drop: Drop,          /* light oil burners: oil droplet */
  dual: CircleHalf,    /* dual fuel: two fuels, half and half */
  skid: SquaresFour,   /* gas trains: equipment grouped on a skid */
  siren: Siren,        /* leak detection: sensing + alarm */
};

/** Legacy sprite host is no longer consumed (Phosphor renders inline). */
export function IconSprite() {
  return null;
}

export function Icon({
  name,
  prefix = "ic",
  className,
}: {
  name: string;
  prefix?: "ic" | "mg";
  className?: string;
}) {
  const Glyph = GLYPHS[name] ?? Cube;
  return (
    <span className={className ? `i ${className}` : "i"} aria-hidden="true">
      <Glyph weight="regular" />
    </span>
  );
}
