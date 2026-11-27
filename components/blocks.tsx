/* ---------------------------------------------------------------------------
   Reusable, presentational building blocks shared across routes so the navbar,
   footer, section headings and structured data stay identical everywhere.
   --------------------------------------------------------------------------- */
import type { ReactNode } from "react";

/** Renders one or more JSON-LD documents (SEO / AEO / GEO). */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

/**
 * Section heading. `title` may contain a <u>…</u> segment for the underlined
 * emphasis the design uses (passed as ReactNode).
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  light?: boolean;
}) {
  return (
    <header className="sec-head">
      {eyebrow && <p className={light ? "eyebrow eyebrow--light" : "eyebrow"}>{eyebrow}</p>}
      <h2 data-reveal="mask">{title}</h2>
      {sub && <p className="sub" data-reveal>{sub}</p>}
    </header>
  );
}
