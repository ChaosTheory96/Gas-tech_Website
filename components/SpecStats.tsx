// ============================================================================
// SpecStats — F / SPEC-STRIP BIG STATS (gas-burners hero demo).
// The four hero specs (p.specs, a fixed tuple of 4 {value,label}) rendered as
// big-stat blocks: oversized value with a brand-red split, a mono label, and a
// brand rule that draws in under each. Occupies the SAME slot as the flat
// .p-specstrip chips (left hero column) — no layout change, no radial wheel.
// Self-contained, JS-off-safe: stats render visible by default; the reveal
// classes (.rv/.in) are only added once JS + IntersectionObserver actually run
// (prefers-reduced-motion lands the final visible state).
// Scoped under .gt-proc .ss-* so nothing leaks into production selectors.
// ============================================================================

import "@/styles/process.css";

export type StatSpec = { value: string; label: string };

// Split a spec value into a lead token + remainder, e.g.
// "11 to 4885 kW" -> ["11", "to 4885 kW"]. Pure formatting of REAL data.
function splitValue(v: string): [string, string] {
  const i = v.indexOf(" ");
  return i < 0 ? [v, ""] : [v.slice(0, i), v.slice(i + 1)];
}

// Only genuine numeric values get the brand-red lead token; purely
// alphabetic values (e.g. "NG / LPG", "Boilers") stay default-coloured.
function isNumericToken(t: string): boolean {
  return /^[\d.]+\s*(kw|bar|dn|mm|inch|"|l|m3|h)?$/i.test(t.trim());
}

export default function SpecStats({ specs }: { specs: StatSpec[] }) {


  return (
    <div className="gt-proc">
      <div className="ss-stats" data-inview>
        {specs.map((s, i) => {
          const [lead, rest] = splitValue(s.value);
          return (
            <div
              className="ss-stat"
              key={s.label}
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="ss-body">
                <p className="ss-v">
                  <span>
                    {isNumericToken(lead) ? (
                      <>
                        <em>{lead}</em>
                        {rest ? ` ${rest}` : ""}
                      </>
                    ) : (
                      `${lead}${rest ? ` ${rest}` : ""}`
                    )}
                  </span>
                </p>
                <p className="ss-l">{s.label}</p>
              </div>
              <span className="ss-rule" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
