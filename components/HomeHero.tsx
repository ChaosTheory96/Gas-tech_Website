"use client";
/* ---------------------------------------------------------------------------
   Home hero: centred copy over a gas-train photograph, two tilt cards on the
   empty sides, a brand strip along the bottom.

   Parallax: ONE rAF loop eases (lerp) scroll progress and pointer position and
   writes a single transform per layer: the photo (deepest, slowest), the two
   cards (nearer, opposite drift). The copy is never transformed, so its text
   stays crisp. The loop idles when nothing moves, pauses off-screen, is
   skipped for reduced motion, and pointer drift only runs on fine pointers.
   --------------------------------------------------------------------------- */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND, BRAND_IDS } from "@/lib/site";
import { BrandMark } from "./BrandLockup";
import { EnquiryButton } from "./enquiry";
import { Icon } from "./icons";

export type HeroCard = {
  side: "left" | "right";
  img: string;
  alt: string;
  title: string;
  detail: string;
  cta: string;
  href: string;
};

/* Parallax tuning: depth is how far a layer drifts (px) at full pointer
   deflection / full scroll through the hero. */
const DEPTH = {
  photo: { x: 18, y: 12, scroll: 190, ease: 0.075 },
  card: { x: 22, y: 14, scroll: 130 },
  scrollEase: 0.12,
  idle: 0.0006,
} as const;

/* Two passes of the registry per row, so one row is wider than any viewport. */
const BRAND_LOOP = [...BRAND_IDS, ...BRAND_IDS];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function HomeHero({ cards }: { cards: HeroCard[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const photo = photoRef.current;
    if (!root || !photo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wraps = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const s = { px: 0, py: 0, tx: 0, ty: 0, sp: 0, tp: 0, visible: true, raf: 0 };

    const readScroll = () => {
      const r = root.getBoundingClientRect();
      s.tp = clamp01(-r.top / r.height);
    };

    const frame = () => {
      s.raf = 0;
      s.px = lerp(s.px, s.tx, DEPTH.photo.ease);
      s.py = lerp(s.py, s.ty, DEPTH.photo.ease);
      s.sp = lerp(s.sp, s.tp, DEPTH.scrollEase);

      const f = (n: number) => Math.round(n * 100) / 100;
      photo.style.transform = `translate3d(${f(-s.px * DEPTH.photo.x)}px, ${f(s.sp * DEPTH.photo.scroll - s.py * DEPTH.photo.y)}px, 0) scale(1.04)`;
      wraps.forEach((w, i) => {
        const dir = i === 0 ? 1 : -1; // the two cards drift against each other
        w.style.transform = `translate3d(${f(-s.px * DEPTH.card.x * dir)}px, ${f(-s.sp * DEPTH.card.scroll - s.py * DEPTH.card.y)}px, 0)`;
      });

      const moving =
        Math.abs(s.tx - s.px) > DEPTH.idle || Math.abs(s.ty - s.py) > DEPTH.idle || Math.abs(s.tp - s.sp) > DEPTH.idle;
      if (moving && s.visible) s.raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!s.raf && s.visible) s.raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      s.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      s.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      kick();
    };
    const onScroll = () => {
      readScroll();
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible) {
        readScroll();
        kick();
      }
    });
    io.observe(root);

    readScroll();
    s.sp = s.tp;
    kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) {
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(s.raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={rootRef} className="home-hero" aria-labelledby="hero-h">
      <div className="hh-bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={photoRef} className="hh-photo" src="/images/editorial/inspection.jpg" alt="" loading="eager" decoding="async" />
        <span className="hh-shade" />
      </div>

      <div className="hh-main">
      <div className="wrap hh-inner">
        <p className="hh-eyebrow" data-reveal>Pune, India</p>
        <h1 id="hero-h" className="split">
          <span className="line">Safe, steady gas, <em>engineered</em></span>
          <span className="line">from regulator to burner.</span>
        </h1>
        <p className="hh-lede" data-reveal>
          Gastech builds custom gas trains in Pune and supplies the brands inside them: {BRAND.pf.name} regulation and metering,{" "}
          {BRAND.electrogas.name} valves, {BRAND.riello.name} burners and {BRAND.gasvigil.name} leak detection.
        </p>
        <div className="hh-cta" data-reveal>
          <Link className="btn btn--primary fx-magnetic" href="/products/">View products <Icon name="arrow" /></Link>
          <EnquiryButton className="btn btn--outline fx-magnetic" type="technical" product="Engineer enquiry" icon="chat">Talk to an engineer</EnquiryButton>
        </div>
      </div>

      <div className="hh-cards">
        {cards.map((c, i) => (
          <div key={c.side} ref={(el) => { cardRefs.current[i] = el; }} className={`hh-wrap hh-wrap--${c.side}`}>
            <article className="hh-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hh-card-img" src={c.img} alt={c.alt} loading="lazy" decoding="async" />
              <div className="hh-card-top">
                <h2 className="hh-card-t">{c.title}</h2>
              </div>
              <div className="hh-card-more">
                <p>{c.detail}</p>
                <Link href={c.href} className="hh-card-cta">{c.cta} <Icon name="arrow" /></Link>
              </div>
            </article>
          </div>
        ))}
      </div>
      </div>

      <div className="hh-marquee" role="group" aria-label="Brands we supply">
        <div className="hh-marquee-track">
          <ul className="hh-marquee-row">
            {BRAND_LOOP.map((id, i) => <li key={i}><BrandMark id={id} /></li>)}
          </ul>
          <ul className="hh-marquee-row" aria-hidden="true">
            {BRAND_LOOP.map((id, i) => <li key={i}><BrandMark id={id} /></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
