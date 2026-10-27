"use client";
// ============================================================================
// SpecRadial — E / PRODUCT HERO SPEC RADIAL WHEEL (gas-burners trial).
// The four hero specs (p.specs, a fixed tuple of 4 {value,label}) rendered as
// an engineering dial: four quadrant petals unfolding from a central hub that
// carries the brand name. Replaces the flat horizontal .p-specstrip chips.
// Self-contained, JS-off-safe: petals render visible by default; the
// scale/opacity reveal classes are only added once JS + IntersectionObserver
// actually run (prefers-reduced-motion lands the final visible state).
// Scoped under .sr-* and .gt-proc so nothing leaks into production selectors.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type RadialSpec = { value: string; label: string };

export default function SpecRadial({
  specs,
  hub,
}: {
  specs: RadialSpec[];
  hub: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wheel = root.querySelector<HTMLElement>(".sr-wheel");
    if (!wheel) return;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      wheel.classList.add("in"); // show immediately, no hidden state
      return;
    }
    wheel.classList.add("rv"); // opt in to the reveal (petals hidden until .in)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            wheel.classList.add("in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    io.observe(wheel);
    return () => io.disconnect();
  }, [specs]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="sr-wheel" role="list" aria-label="Key specifications">
        {specs.map((s, i) => (
          <div
            className="sr-sp"
            key={s.label}
            role="listitem"
            style={{ "--i": i } as React.CSSProperties}
          >
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
        <div className="sr-hub" aria-hidden="true">
          <span className="sr-hub-name">{hub}</span>
        </div>
      </div>
    </div>
  );
}
