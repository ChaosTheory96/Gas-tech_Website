import Link from "next/link";
import { Icon } from "@/components/icons";
import { EnquiryButton } from "@/components/enquiry";

/* 404 — "no flow on this line". Red plate + closed-valve flow animation
   (pure CSS, JS-off-safe, reduced-motion static) + waypoint grid so the
   visitor always has an exit. Enquire band kept from the previous design.

   Sheet row P08 asks for its own title/meta and noindex. Next 14 does not
   support metadata exports in a root not-found file: the response already
   carries HTTP 404 and is unreachable as a route, so nothing here can be
   indexed; the rendered <title> falls back to the root layout default.
   Documented as a platform deviation in the qa dashboard, not invented around. */

const WAYPOINTS = [
  { href: "/products/", num: "01", label: "Products", sub: "Burners, regulation, metering and gas safety" },
  { href: "/services/", num: "02", label: "Services", sub: "Consultancy, installation and annual maintenance" },
  { href: "/brands/", num: "03", label: "Brands", sub: "Riello, Pietro Fiorentini and Gasvigil" },
  { href: "/contact-us/", num: "04", label: "Contact", sub: "Talk to an engineer in Pune" },
];

export default function NotFound() {
  return (
    <main id="main">
      <section className="intro-hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal>Error 404 / Signal lost</p>
          <span className="nf-plate" aria-hidden="true">404</span>
          <h1 className="split">
            <span className="line">No flow</span>
            <span className="line"><em>on this line.</em></span>
          </h1>
          <p className="lede" data-reveal>
            The page you asked for has moved or never existed. The burner,
            regulator or gas system you want is still one click away.
          </p>

          {/* pipe feed flowing to a closed valve; dead leg beyond it */}
          <svg className="nf-flow" viewBox="0 0 340 56" aria-hidden="true" focusable="false">
            <line className="nf-pipe" x1="0" y1="28" x2="228" y2="28" />
            <line className="nf-dashes" x1="4" y1="28" x2="216" y2="28" />
            <line className="nf-outlet" x1="262" y1="28" x2="340" y2="28" />
            <g className="nf-valve">
              <circle cx="245" cy="28" r="14" />
              <line x1="245" y1="14" x2="245" y2="5" />
              <line x1="235" y1="5" x2="255" y2="5" />
            </g>
          </svg>

          <div className="intro-cta" data-reveal>
            <Link className="btn btn--primary" href="/">Back to home <Icon name="arrow" /></Link>
            <Link className="btn--tech" href="/products/"><Icon name="layers" /> Browse products</Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <header className="sec-head">
            <p className="eyebrow">Reroute</p>
            <h2>Live lines from here.</h2>
          </header>
          <div className="nf-grid">
            {WAYPOINTS.map((w) => (
              <Link key={w.href} className="nf-card" href={w.href}>
                <span className="nf-num">{w.num}</span>
                <h3>{w.label}</h3>
                <p>{w.sub}</p>
                <span className="nf-go">Open <Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--dark" id="enquire">
        <div className="wrap">
          <header className="sec-head">
            <p className="eyebrow eyebrow--light">Still stuck?</p>
            <h2>Tell us what you need.</h2>
            <p className="sub">Send an enquiry and an engineer will point you to the right equipment.</p>
          </header>
          <div className="cta-dual">
            <EnquiryButton className="btn btn--primary" type="sales" product="General enquiry">Send an enquiry</EnquiryButton>
            <Link className="btn--tech" href="/contact-us/"><Icon name="phone" /> Contact us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
