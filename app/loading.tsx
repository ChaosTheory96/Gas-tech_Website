/* ---------------------------------------------------------------------------
   Route loading state. Shown by App Router while a segment resolves. Purely
   token-backed: the top route-progress bar + neutral skeleton blocks that echo
   the site's section rhythm (eyebrow / heading / grid). No raw values, respects
   reduced-motion (shimmer disabled in the polish block).
   --------------------------------------------------------------------------- */
export default function Loading() {
  return (
    <div className="route-loading" aria-busy="true" aria-live="polite">
      <span className="route-bar" aria-hidden="true" />
      <div className="wrap" style={{ paddingBlock: "var(--sec-pad)" }}>
        <span className="sk sk-eyebrow" />
        <span className="sk sk-title" />
        <span className="sk sk-sub" />
        <div className="sk-grid">
          <span className="sk sk-card" />
          <span className="sk sk-card" />
          <span className="sk sk-card" />
          <span className="sk sk-card" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
