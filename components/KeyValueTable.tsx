"use client";
// ============================================================================
// KeyValueTable — PRODUCTION SPECIFICATIONS table (p.specRows), styled to match
// the comparison SpecTable: elevated card, brand corner accent, zebra rows,
// hover tint, staggered row reveal. Renders the product's REAL key/value rows
// ({ k, v }); nothing invented. Self-contained reveal (production has no
// ProcessShowcase engine). JS-off-safe: rows render visible by default and the
// animating `.rv`/`.in` classes are only added once JS + IntersectionObserver
// actually run (reduced motion lands the final visible state).
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type KVRow = { k: string; v: string };

export default function KeyValueTable({ rows }: { rows: KVRow[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wrap = root.querySelector<HTMLElement>(".kv-wrap");
    if (!wrap) return;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      wrap.classList.add("in"); // show immediately, no hidden state
      return;
    }
    wrap.classList.add("rv"); // opt in to the reveal (rows hidden until .in)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            wrap.classList.add("in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [rows]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="kv-wrap">
        <table className="kv">
          <thead>
            <tr>
              <th scope="col">Specification</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.k} style={{ "--i": i } as React.CSSProperties}>
                <th scope="row">{r.k}</th>
                <td>{r.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
