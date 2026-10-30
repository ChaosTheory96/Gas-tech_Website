"use client";
// QA-RETIRED — not wired to any route (the Services page ships ServiceStation
// instead). Kept in place per the no-deletion rule; the audit classifies this
// file RETIRED BY DECISION, not accidental redundancy. Do not import without a
// fresh decision; do not delete.
// ============================================================================
// ServicePipeline — I / SERVICE PIPELINE + valve stations (Services "lines").
// Three service lines read as valve stations on a running pipe: the pipe fills
// and a flow band travels through it, then a riser + numbered valve pops at
// each station as the block enters view. Fed by the page's REAL service lines.
//
// Self-contained + JS-off-safe: every station card (number, title, copy) is in
// the DOM and visible by default; only the pipe-fill / riser / valve decoration
// is gated on the `.in` class, which JS adds on intersect (or immediately under
// prefers-reduced-motion / no IntersectionObserver). Scoped .gt-proc .pipe-*.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type Station = { num: string; title: string; desc: string };

const pad2 = (i: number) => String(i + 1).padStart(2, "0");

export default function ServicePipeline({ stations }: { stations: Station[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wrap = root.querySelector<HTMLElement>(".pipe-wrap");
    if (!wrap) return;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      wrap.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            wrap.classList.add("in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [stations]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="pipe-wrap">
        <div className="pipe">
          <span className="flow" aria-hidden="true" />
        </div>
        <span className="pipe-term a" aria-hidden="true" />
        <span className="pipe-term b" aria-hidden="true" />
        <div className="stations">
          {stations.map((s, i) => (
            <div className="station" key={s.num} style={{ "--i": i } as React.CSSProperties}>
              <span className="riser" aria-hidden="true" />
              <span className="valve" aria-hidden="true">{pad2(i)}</span>
              <article className="sbody">
                <p className="st-no">{s.num}</p>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
