// ============================================================================
// KeyValueTable — PRODUCTION SPECIFICATIONS table (p.specRows), styled to match
// the comparison SpecTable: elevated card, brand corner accent, zebra rows,
// hover tint, staggered row reveal. Renders the product's REAL key/value rows
// ({ k, v }); nothing invented. Self-contained reveal (production has no
// ProcessShowcase engine). JS-off-safe: rows render visible by default and the
// animating `.rv`/`.in` classes are only added once JS + IntersectionObserver
// actually run (reduced motion lands the final visible state).
// ============================================================================

import "@/styles/process.css";

export type KVRow = { k: string; v: string };

export default function KeyValueTable({ rows }: { rows: KVRow[] }) {


  return (
    <div className="gt-proc">
      <div className="kv-wrap" data-inview>
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
