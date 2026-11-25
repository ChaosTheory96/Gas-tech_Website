/* ---------------------------------------------------------------------------
   PageHero: the single hero for inner pages. One eyebrow OR a breadcrumb (never
   both), one H1, a lede, at most two CTAs, an optional side card, and a compact
   variant for Privacy and 404. Height and padding come from the --hero-* tokens.
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  title: ReactNode;
  lede: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  aside?: ReactNode;
  /** the aside is a photograph: no padding, image fills the card */
  asideMedia?: boolean;
  compact?: boolean;
  center?: boolean;
} & ({ crumbs: Crumb[]; eyebrow?: never } | { eyebrow: string; crumbs?: never });

export function PageHero({ title, lede, primary, secondary, aside, asideMedia, compact, center, crumbs, eyebrow }: PageHeroProps) {
  const cls = ["page-hero", compact && "page-hero--compact", aside && "page-hero--aside", center && !aside && "page-hero--center"]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={cls}>
      <div className="wrap page-hero-grid">
        <div className="page-hero-copy">
          {crumbs && (
            <nav className="crumbs crumbs--flush" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              {crumbs.map((c) => (
                <Fragment key={c.label}>
                  <span className="sep">/</span>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span className="cur">{c.label}</span>}
                </Fragment>
              ))}
            </nav>
          )}
          {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
          <h1 className="split">{title}</h1>
          <p className="lede" data-reveal>{lede}</p>
          {(primary || secondary) && (
            <div className="intro-cta" data-reveal>
              {primary}
              {secondary}
            </div>
          )}
        </div>
        {aside && <aside className={asideMedia ? "page-hero-aside page-hero-aside--media" : "page-hero-aside"} data-reveal>{aside}</aside>}
      </div>
    </section>
  );
}
