"use client";
// ============================================================================
// SpecTable — PRODUCTION H / COMPARISON TABLE, ported from the showcase
// ComparisonTable. Reuses the `.gt-proc .cmp` styles already defined in
// process.css (dark header + red corner, brand divider, zebra rows, hover tint,
// flagship (first data) column highlight, staggered row reveal, caption legend).
// It renders the product's REAL `columns` data ({ headers, rows }); nothing is
// invented. The showcase relied on the ProcessShowcase engine to add the reveal
// `.in` class — production has none, so this component owns it.
//
// JS-off-safe: `.cmp` rows default to opacity:0 in the engine CSS, so we render
// them VISIBLE by default and only ADD the animating `.rv`/`.in` classes once JS
// + IntersectionObserver actually run (reduced-motion lands the final state).
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type SpecTableColumns = { headers: string[]; rows: string[][] };

export default function SpecTable({ columns }: { columns: SpecTableColumns }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wrap = root.querySelector<HTMLElement>(".tbl-wrap");
    if (!wrap) return;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Without JS / reduced motion the rows stay visible (default no `.rv`).
    if (reduce || !("IntersectionObserver" in window)) {
      wrap.classList.add("in");
      return;
    }
    wrap.classList.add("rv"); // enables the row opacity/transform transition
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            wrap.classList.add("in"); // triggers the staggered row reveal
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [columns]);

  const [corner, ...families] = columns.headers;
  const firstFamily = families[0];

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="tbl-wrap spec-scroll">
        <table className="cmp">
          <thead>
            <tr>
              <th scope="col">{corner}</th>
              {families.map((h) => (
                <th key={h}>
                  <b>{h}</b>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.rows.map((row, ri) => (
              <tr key={row[0]} style={{ "--i": ri } as React.CSSProperties}>
                <th scope="row">{row[0]}</th>
                {row.slice(1).map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {firstFamily ? (
        <p className="tbl-cap">
          <span className="lg">
            Highlighted column = {firstFamily}
          </span>
        </p>
      ) : null}
    </div>
  );
}
