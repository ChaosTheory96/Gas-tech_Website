"use client";
/* ---------------------------------------------------------------------------
   CapabilityConveyor — the seamless horizontal card carousel from
   demos/capabilities-circular-carousel.html, ported to React.

   Motion model (unchanged from the signed-off demo): cards ride a straight
   track and flow right-to-left at a constant cruise. Each card's slot loops
   through [0, N*slot); only the on-screen window is shown, the rest of the
   loop is parked off the right edge, so cards exit left and re-enter right
   with no visible seam and no ring travel. Depth is painted with a dark SHADE
   over SOLID white cards (never card alpha, which read pink on the red plate).

   Production hardening over the demo:
   · rAF loop idles when nothing moves and pauses when the section is
     off-screen (IntersectionObserver) — no background CPU burn.
   · hover-pause fires only when the cursor is actually on a card, not the
     empty stage around it.
   · prefers-reduced-motion => no cruise + instant intro.
   · every listener and the animation frame are torn down on unmount.

   NOT yet wired into the homepage; drop it in place of <Carousel> when ready.
   --------------------------------------------------------------------------- */
import { useEffect, useRef } from "react";
import Link from "next/link";
import "../styles/conveyor.css";
import { Icon } from "./icons";

export type ConveyorItem = {
  idx: string;
  img: string;
  alt: string;
  href: string;
  title: string;
  desc: string;
  specs: string[];
  flag?: boolean;
};

type Props = {
  items: ConveyorItem[];
  /** cruise speed in px/s (0 freezes the belt). Demo value: 35. */
  speed?: number;
  /** edge darkening 0..1. Demo value: 0.08 (near-minimum). */
  fade?: number;
  className?: string;
};

const ease = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function CapabilityConveyor({ items, speed = 35, fade = 0.08, className }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterNumRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<HTMLSpanElement>(null);
  const N = items.length;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = items.map((_, i) => cardRefs.current[i]).filter(Boolean) as HTMLElement[];
    const shades = items.map((_, i) => shadeRefs.current[i]).filter(Boolean) as HTMLElement[];
    if (cards.length !== N) return;

    const st = {
      s: 0, fling: 0,
      intro: reduce ? 1 : 0,
      speed, fade,
      auto: reduce ? 0 : 1,
      hover: false, off: false,
      drag: null as null | { id: number; x0: number; s0: number; moved: boolean; samples: { x: number; t: number }[] },
      nudge: null as null | { from: number; to: number; t0: number; dur: number },
      raf: 0, last: 0,
    };

    function geom() {
      const W = stage!.clientWidth;
      const cw = cards[0].offsetWidth || 300;
      const gap = Math.max(22, W * 0.024);
      return { W, cw, gap, slot: cw + gap, total: N * (cw + gap) };
    }

    // Uniform card height (so every CTA sits on one baseline) + a stage box
    // that fully contains the cards, so the horizontal mask never clips a top.
    function sizeAll() {
      cards.forEach((c) => { c.style.minHeight = ""; });
      let h = 0;
      for (const c of cards) h = Math.max(h, c.offsetHeight);
      cards.forEach((c) => { c.style.minHeight = h + "px"; });
      stage!.style.height = Math.round(h * 1.08 + 64) + "px";
    }

    function layout() {
      const { W, cw, gap, slot, total } = geom();
      const tIntro = ease(st.intro);
      let activeIdx = 0;
      let best = Infinity;
      for (let i = 0; i < N; i++) {
        const el = cards[i];
        const u = mod(i * slot - st.s, total);
        const onScreen = u > gap - 2 && u < W + slot + 4;
        const cx = u - slot + cw / 2 - W / 2; // card-center offset from stage center
        const shown = onScreen ? Math.max(0, Math.min(1, tIntro * 1.5 - (Math.abs(cx) / W) * 0.5)) : 0;
        const yLift = (1 - shown) * 36;
        const dim = onScreen ? Math.max(0, Math.abs(cx) / (W * 0.62) - 0.18) * st.fade : 0;
        if (onScreen && Math.abs(cx) < best) { best = Math.abs(cx); activeIdx = i; }
        el.style.transform = `translate(-50%,-50%) translate3d(${cx.toFixed(1)}px,${yLift.toFixed(1)}px,0)`;
        el.style.opacity = shown.toFixed(3);
        if (shades[i]) shades[i].style.opacity = Math.min(0.8, dim).toFixed(3);
        el.style.zIndex = onScreen ? "100" : "10";
        el.style.pointerEvents = shown > 0.6 ? "auto" : "none";
        el.classList.toggle("is-active", onScreen && Math.abs(cx) < slot * 0.45);
      }
      if (counterNumRef.current)
        counterNumRef.current.textContent = String(activeIdx + 1).padStart(2, "0");
      if (scrubRef.current) {
        const phase = mod(st.s / slot, N) / N;
        scrubRef.current.style.marginLeft = (phase * (100 - 100 / N)).toFixed(2) + "%";
      }
    }

    function frame(now: number) {
      st.raf = 0;
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 1 / 60;
      st.last = now;
      if (st.intro < 1) st.intro = Math.min(1, st.intro + dt);
      if (st.nudge) {
        const p = Math.min(1, (now - st.nudge.t0) / st.nudge.dur);
        st.s = st.nudge.from + (st.nudge.to - st.nudge.from) * easeOut(p);
        if (p >= 1) st.nudge = null;
      } else if (!st.drag) {
        st.s += ((st.auto && !st.hover && !st.off ? st.speed : 0) + st.fling) * dt;
        st.fling *= Math.exp(-dt * 2.4);
        if (Math.abs(st.fling) < 1.5) st.fling = 0;
      }
      layout();
      const busy =
        st.intro < 1 || st.nudge || st.drag || st.fling !== 0 ||
        (st.auto && !st.hover && !st.off);
      if (busy) st.raf = requestAnimationFrame(frame);
      else st.last = 0;
    }
    function wake() {
      if (!st.raf && !st.off) st.raf = requestAnimationFrame(frame);
    }

    /* pause ONLY while the cursor is on a card, not the empty stage */
    let overCard = false;
    const onMove = (e: PointerEvent) => {
      const d = st.drag;
      if (d && d.id === e.pointerId) {
        const dx = e.clientX - d.x0;
        if (!d.moved && Math.abs(dx) > 6) { d.moved = true; stage!.setAttribute("data-drag", ""); }
        if (d.moved) {
          st.s = d.s0 - dx;
          d.samples.push({ x: e.clientX, t: performance.now() });
          if (d.samples.length > 6) d.samples.shift();
          wake();
        }
        return;
      }
      const on = !!(e.target as HTMLElement).closest?.(".gt-conv-card");
      if (on !== overCard) { overCard = on; st.hover = on; wake(); }
    };
    const onLeave = () => { overCard = false; st.hover = false; wake(); };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(".gt-conv-cta")) return;
      if (e.button !== 0) return;
      st.drag = { id: e.pointerId, x0: e.clientX, s0: st.s, moved: false, samples: [] };
      st.nudge = null; st.fling = 0; wake();
    };
    const onUp = (e: PointerEvent) => {
      const d = st.drag;
      if (!d || d.id !== e.pointerId) return;
      st.drag = null; stage!.removeAttribute("data-drag");
      if (d.moved) {
        const s = d.samples;
        if (s.length > 1) {
          const v = (s[s.length - 1].x - s[0].x) / Math.max(16, s[s.length - 1].t - s[0].t) * 1000;
          st.fling = -v;
        }
      }
      wake();
    };
    const onWheel = (e: WheelEvent) => {
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horiz) return;
      e.preventDefault();
      st.s += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wake();
    };
    const step = (n: number) => {
      const { slot } = geom();
      st.nudge = { from: st.s, to: st.s + n * slot, t0: performance.now(), dur: 480 };
      wake();
    };
    const onPrev = () => step(-1);
    const onNext = () => step(1);
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement !== stage && !stage!.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    };
    const onResize = () => { sizeAll(); wake(); };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.getElementById("gt-conv-prev")?.addEventListener("click", onPrev);
    document.getElementById("gt-conv-next")?.addEventListener("click", onNext);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    // pause the belt when the section scrolls off-screen
    const io = new IntersectionObserver(
      ([entry]) => { st.off = !entry.isIntersecting; if (!st.off) wake(); },
      { threshold: 0 },
    );
    io.observe(stage);

    sizeAll();
    document.fonts?.ready.then(sizeAll).catch(() => {});
    wake();

    return () => {
      if (st.raf) cancelAnimationFrame(st.raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.getElementById("gt-conv-prev")?.removeEventListener("click", onPrev);
      document.getElementById("gt-conv-next")?.removeEventListener("click", onNext);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [N, speed, fade, items]);

  return (
    <div className={className ? `gt-conv ${className}` : "gt-conv"}>
      <div
        ref={stageRef}
        className="gt-conv-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Capabilities"
        tabIndex={0}
      >
        {items.map((d, i) => (
          <article
            key={d.idx}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={d.flag ? "gt-conv-card is-flag" : "gt-conv-card"}
            role="group"
            aria-label={`${i + 1} of ${N}: ${d.title}`}
          >
            {d.flag && <div className="gt-conv-flagrule" />}
            <div className="gt-conv-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={d.alt} loading="lazy" decoding="async" draggable={false} />
              <span className="gt-conv-num">{d.idx}</span>
              {d.flag && <span className="gt-conv-seal">Gastech Own Line</span>}
            </div>
            <div className="gt-conv-body">
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
              <ul className="gt-conv-specs">
                {d.specs.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <Link className="gt-conv-cta" href={d.href}>
                {d.flag ? "Explore" : "Enquire"} <Icon name="arrow" />
              </Link>
            </div>
            <span ref={(el) => { shadeRefs.current[i] = el; }} className="gt-conv-shade" aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="wrap">
        <div className="gt-conv-rail">
          <div className="gt-conv-pill">
            <button id="gt-conv-prev" type="button" aria-label="Previous"><Icon name="arrow" className="flip" /></button>
            <span className="gt-counter" aria-live="polite"><b ref={counterNumRef}>01</b> / {String(N).padStart(2, "0")}</span>
            <button id="gt-conv-next" type="button" aria-label="Next"><Icon name="arrow" /></button>
          </div>
          <div className="gt-scrub" aria-hidden="true"><i ref={scrubRef} /></div>
        </div>
      </div>
    </div>
  );
}
