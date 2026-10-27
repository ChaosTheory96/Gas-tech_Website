"use client";
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

export type BentoItem = {
  href: string;
  img: string;
  alt: string;
  title: string;
  brand: string;
  desc: string;
  span: string; // e.g. "c4 r2" / "c6 r2"
};

export default function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="gt-proc">
      <div className="bento">
        {items.map((it) => (
          <Link className={`bt bt--prod ${it.span}`} href={it.href} key={it.href}>
            <div className="bt-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt={it.alt} loading="lazy" decoding="async" />
            </div>
            <div className="bt-body">
              <h3>{it.title}</h3>
              <p className="bt-spec">{it.brand}</p>
              <p className="bt-sub">{it.desc}</p>
              <span className="bt-more">View range</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
