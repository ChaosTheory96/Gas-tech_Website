// ============================================================================
// ArchChart — C / ARCH CHART (data figures drawn to scale).
// A pure data-viz: each arch grows from a shared baseline, height LINEAR to the
// value against the largest in the set. Used only where real comparison figures
// exist (regulator max design pressure per family). Zero layout shift: growth is
// a transform only.
//
// Self-contained + JS-off-safe: the numbers, names and sub-labels are always in
// the DOM and visible; only the arch bars animate (scaleY) on the `.in` class,
// added on intersect (or immediately under reduced-motion / no IO). Scoped
// .gt-proc .arch-chart so nothing leaks into production selectors.
// ============================================================================

import "@/styles/process.css";

export type ArchDatum = {
  value: number;
  unit: string;
  name: string;
  sub?: string;
};

export default function ArchChart({
  data,
  note,
}: {
  data: ArchDatum[];
  note?: string;
}) {


  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="gt-proc">
      <div className="arch-chart" data-inview>
        {data.map((d, i) => {
          const ratio = d.value / max;
          return (
            <div
              className="ac-item"
              key={d.name}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="ac-val">
                {d.value} <small>{d.unit}</small>
              </span>
              <div
                className="ac-arch"
                style={{ "--h": `calc(${ratio} * min(300px, 34vh))` } as React.CSSProperties}
              />
              <div>
                <p className="ac-name">{d.name}</p>
                {d.sub && <p className="ac-sub">{d.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {note && <p className="ac-note">{note}</p>}
    </div>
  );
}
