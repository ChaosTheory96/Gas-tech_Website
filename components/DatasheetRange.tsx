// ============================================================================
// DatasheetRange — MODEL RANGE / ASSEMBLY cards from the REAL Variant fields.
// An image well (real `img` when supplied, otherwise a token-only concentric-arc
// line-art placeholder, never an invented product photo) above a body with the
// kicker, title, headline figure, description and model rail. Static: no
// scroll-reveal and no hover lift. `flow` numbers the cards as an assembly chain.
// Renders inside `.gt-proc` so the scoped styles/process.css apply.
// ============================================================================

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

export default function DatasheetRange({
  variants,
  cols = 4,
  flow = false,
}: {
  variants: DatasheetVariant[];
  /** product.grid: 3 puts three cards in a row, 4 lays them out two by two */
  cols?: 3 | 4;
  /** number the cards 01..n and join them with arrows (gas-train assembly) */
  flow?: boolean;
}) {
  const mod = flow ? " ds-grid--flow" : cols === 3 ? " ds-grid--3" : "";
  return (
    <div className="gt-proc">
      <div className={`ds-grid${mod}`}>
        {variants.map((v, i) => (
          <article className="ds-card" key={v.title || v.idx || i}>
            {flow ? <span className="ds-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span> : null}
            <div className="ds-media">
              {v.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ds-img" src={v.img} alt={v.alt || v.title} loading="lazy" decoding="async" />
              ) : (
                <svg className="ds-ph" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
            </div>
            <div className="ds-body">
              <div className="ds-meta">
                {!flow && v.idx ? <span className="ds-idx">{v.idx}</span> : null}
                <span className="ds-kick">{v.kicker}</span>
              </div>
              <h3 className="ds-title">{v.title}</h3>
              {v.spec ? <p className="ds-val">{v.spec}</p> : null}
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
