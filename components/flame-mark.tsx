/* ---------------------------------------------------------------------------
   FlameMark — the gas-flow + flame line motif used by the preloader and the
   route-loading state. Purely decorative (aria-hidden); colour comes entirely
   from tokens via the .pl-* classes in enhancements.css (BLOCK X). No raw hex.
   --------------------------------------------------------------------------- */
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {/* gas-flow streaks feeding the burner */}
      <line className="pl-flow" x1="8" y1="86" x2="42" y2="86" />
      <line className="pl-flow b" x1="8" y1="94" x2="46" y2="94" />
      <line className="pl-flow c" x1="8" y1="78" x2="40" y2="78" />
      {/* burner body */}
      <path d="M46 100 h34" stroke="var(--border-strong)" strokeWidth="4" strokeLinecap="round" />
      {/* flame outline */}
      <path
        className="pl-flame"
        d="M68 30 C84 52 92 62 92 76 C92 92 81 101 68 101 C55 101 44 92 44 76 C44 64 50 58 56 50 C58 60 63 63 66 62 C62 50 64 40 68 30 Z"
      />
      {/* inner flame */}
      <path
        className="pl-flame-in"
        d="M68 60 C74 70 77 74 77 80 C77 88 73 92 68 92 C63 92 59 88 59 80 C59 75 62 72 65 66 C66 71 67 72 68 71 C67 67 67 64 68 60 Z"
      />
    </svg>
  );
}
