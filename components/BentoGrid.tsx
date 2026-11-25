"use client";
import { PF_FACTS } from "@/lib/site";
// ============================================================================
// BentoGrid — B / CATALOGUE BENTO (Products hub, one fitted grid per category).
// Each product renders as an image-forward bento cell: contained product photo
// on a tinted well, then title + brand spec line + a 2-line description and a
// "View range" rule. Cards link to the real product pages; nothing is invented.
//
// Layout discipline (from prior bento failures): the .bento grid uses DEFINITE
// uniform rows and FLEXIBLE media (already in process.css), no `dense`. Every
// cell in a group is given an equal column span + a 2-row height so the photo
// and text always fit (no clipping, no dead whitespace). On small screens a
// scoped override drops to a single auto-height column.
// ============================================================================

import Link from "next/link";
import "@/styles/process.css";
import { Icon } from "./icons";

export type BentoItem = {
  href: string;
  img?: string; // omitted: a plain icon panel is shown (no photograph yet)
  icon?: string;
  cta?: string; // link label, default "View range"
  alt: string;
  title: string;
  brand: string;
  desc: string;
  span: string; // e.g. "c4 r2" / "c6 r2"
  usp?: "pf" | "gt"; // Pietro Fiorentini (brand USP) or Gas Trains (product USP)
};

const USP = {
  pf: { chips: [`Since ${PF_FACTS.foundedYear}`, PF_FACTS.yearsLabel] },
  gt: { chips: ["Customized", "Reliable & safe", "Application-specific"] },
} as const;

export default function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="gt-proc">
      <div className="bento">
        {items.map((it) => (
          <Link className={`bt bt--prod ${it.span}${it.usp ? ` bt--usp-${it.usp}` : ""}`} href={it.href} key={it.href}>
            {it.img ? (
              <div className="bt-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.img} alt={it.alt} loading="lazy" decoding="async" />
              </div>
            ) : (
              <div className="bt-media bt-media--plain" aria-hidden="true"><Icon name={it.icon ?? "manifold"} /></div>
            )}
            <div className="bt-body">
              <h3>{it.title}</h3>
              <p className="bt-spec">{it.brand}</p>
              <p className="bt-sub">{it.desc}</p>
              {it.usp && (
                <ul className="bt-chips" aria-label="Key points">
                  {USP[it.usp].chips.map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
              <span className="bt-more">{it.cta ?? "View range"}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
