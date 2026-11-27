/* ---------------------------------------------------------------------------
   Site footer — single instance in the root layout, so it is byte-identical on
   every route (a stated requirement).
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { SITE, FOOTER_COLUMNS, REPRESENTED_BRAND_LIST } from "@/lib/site";
import { Icon } from "./icons";

export function Footer() {
  const year = new Date().getFullYear();
  const c = SITE.contact;
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Link className="brand" href="/" aria-label="Gastech Combustions">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="gc-mark gc-mark--static" src="/assets/gc-logo.svg" alt="" aria-hidden="true" />
            <span className="brand-word"><b>GAS</b><span>TECH</span></span>
          </Link>
          <p className="foot-tag">{SITE.tagline}</p>
          <p className="foot-iso"><Icon name="award" /> Authorised distributor: {REPRESENTED_BRAND_LIST}</p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav className="foot-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="foot-col">
          <h3>Contact</h3>
          <ul className="foot-contact">
            <li><Icon name="mail" /><a href={`mailto:${c.salesEmail}`}>{c.salesEmail}</a></li>
            <li><Icon name="pin" /><span>Corporate office: {c.corporateAddress}</span></li>
          </ul>
        </div>
      </div>

      <div className="wrap foot-bar">
        <span>© {year} {SITE.legalName}. All rights reserved.</span>
        <span className="foot-legal">
          <Link href="/privacy-policy/">Privacy Policy</Link>
        </span>
      </div>
    </footer>
  );
}
