import Link from "next/link";
import { Icon } from "@/components/icons";
import { EnquiryButton } from "@/components/enquiry";

export default function NotFound() {
  return (
    <main id="main">
      <section className="intro-hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal>404</p>
          <h1 className="split">
            <span className="line">Page not</span>
            <span className="line"><em>found.</em></span>
          </h1>
          <p className="lede" data-reveal>The page you were looking for has moved or never existed. The burner, regulator or gas system you want is still one click away.</p>
          <div className="intro-cta" data-reveal>
            <Link className="btn btn--primary" href="/">Back to home <Icon name="arrow" /></Link>
            <Link className="btn--tech" href="/products"><Icon name="layers" /> Browse products</Link>
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
            <Link className="btn--tech" href="/contact"><Icon name="phone" /> Contact us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
