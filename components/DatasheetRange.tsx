"use client";
// ============================================================================
// DatasheetRange — PRODUCTION G / MODEL RANGE, ported from the showcase
// DatasheetRange. The showcase version is a gauge-dial + DN-span-bar design
// that needs numeric data (max pressure, --goff/--w fractions) which the real
// catalog does NOT carry, and we never invent specs. So this production card
// presents the REAL Variant fields inside an image-forward bento cell: a
// media well (real `img` when supplied, otherwise a token-only concentric-arc
// line-art PLACEHOLDER — no invented product photos) with the readout + title
// as a scrim overlay at the image bottom, and the description / model rail
// below on the card surface.
//
// Self-contained: owns its own scroll-reveal (the showcase relied on the
// ProcessShowcase engine; production has none). Renders inside `.gt-proc` so the
// scoped styles/process.css win over the production `.var-card`. Content is
// visible by default — the reveal classes are only ADDED once JS + Intersection
// Observer run, so with JS off, or reduced motion, nothing is ever hidden.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type DatasheetVariant = {
  idx: string;
  kicker: string;
  title: string;
  spec?: string;
  sub?: string;
  desc: string;
  list?: string[];
  img?: string; // real product image, when available (else line-art placeholder)
  alt?: string;
};

export default function DatasheetRange({ variants }: { variants: DatasheetVariant[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".ds-card"));
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // JS-off-safe reveal: cards render fully visible. We only hide-then-reveal
    // once we know IntersectionObserver is actually going to run, and reduced
    // motion lands the final (visible) state with no animation.
    if (reduce || !("IntersectionObserver" in window) || cards.length === 0) {
      return;
    }
    cards.forEach((c) => {
      c.classList.add("ds-rv", "ds-pre");
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          el.style.transitionDelay =
            Math.min(cards.indexOf(el), 6) * 70 + "ms"; // stagger
          el.classList.remove("ds-pre"); // transition (.ds-rv) animates it in
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [variants]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="ds-grid">
        {variants.map((v, i) => (
          <article className="ds-card" key={v.title || v.idx || i}>
            <div className="ds-media">
              {v.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ds-img" src={v.img} alt={v.alt || v.title} loading="lazy" decoding="async" />
              ) : (
                <svg
                  className="ds-ph"
                  viewBox="0 0 240 180"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g className="ds-arcs" fill="none" stroke="currentColor">
                    <circle cx="200" cy="150" r="40" />
                    <circle cx="200" cy="150" r="66" />
                    <circle cx="200" cy="150" r="92" />
                    <circle cx="200" cy="150" r="120" />
                  </g>
                  <g className="ds-arcs2" fill="none" stroke="currentColor">
                    <circle cx="42" cy="34" r="24" />
                    <circle cx="42" cy="34" r="42" />
                    <circle cx="42" cy="34" r="60" />
                  </g>
                </svg>
              )}
              <div className="ds-overlay">
                <span className="ds-val">{v.spec || v.idx || v.kicker}</span>
                <h3 className="ds-title">{v.title}</h3>
              </div>
            </div>
            <div className="ds-body">
              <div className="ds-meta">
                {v.idx ? <span className="ds-idx">{v.idx}</span> : null}
                <span className="ds-kick">{v.kicker}</span>
              </div>
              {v.sub ? <p className="ds-subline">{v.sub}</p> : null}
              <p className="ds-desc">{v.desc}</p>
              {v.list && v.list.length > 0 ? (
                <div className="ds-models">
                  {v.list.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
