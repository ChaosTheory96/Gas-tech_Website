/* ---------------------------------------------------------------------------
   Route loading state. Shown by App Router while a segment resolves (route
   changes; the first-visit intro is the separate <Preloader />). Uses the REAL
   Gastech logo at a smaller scale plus a red sweep bar. Token-backed via
   enhancements.css BLOCK X; reduced-motion flattens the sweep. The prior
   skeleton CSS (.route-loading/.sk*) is left in place, now unused — not deleted.
   --------------------------------------------------------------------------- */
export default function Loading() {
  return (
    <div className="gt-route" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <span className="rt-bar" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="rt-mark" src="/assets/gc-logo.svg" alt="" aria-hidden="true" />
    </div>
  );
}
