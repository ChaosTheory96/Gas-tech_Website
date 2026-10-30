"use client";
// ============================================================================
// ProcessTimeline — A / PROCESS TIMELINE (How We Work, "The path").
// A straight spine that fills dot-to-dot on scroll; each card border is
// split-drawn by two rounded strokes and its node pops as the card reaches the
// viewport centre. Text-only: production has no per-step photography, so the
// media column is intentionally omitted (renders a single-column card).
//
// Self-contained + JS-off-safe: the step text is ALWAYS in the DOM and visible
// (no opacity:0 default). The spine/border SVG paths and the .hit reveal are
// decorative enhancements built from live geometry once JS runs; under
// prefers-reduced-motion (or no IntersectionObserver) every card lands in its
// final revealed state immediately. Scoped under .gt-proc .tl so nothing leaks.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type TimelineStep = { n: string; title: string; desc: string; youGet?: string };

const pad = (n: string) => (n.length < 2 ? `0${n}` : n);

export default function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tl = root.querySelector<HTMLElement>(".tl");
    if (!tl) return;
    const items = Array.from(tl.querySelectorAll<HTMLElement>(".tl-item"));
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build the curved spine + split-drawn card borders from live geometry.
    function buildTL() {
      const tlR = tl!.getBoundingClientRect();
      const pts: { x: number; y: number }[] = [];
      items.forEach((it) => {
        const card = it.querySelector<HTMLElement>(".tl-card");
        const node = it.querySelector<HTMLElement>(".tl-node");
        const svg = it.querySelector<SVGSVGElement>(".tl-border");
        if (!card || !node || !svg) return;
        const cR = card.getBoundingClientRect();
        const nR = node.getBoundingClientRect();
        const W = cR.width;
        const H = cR.height;
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        svg.setAttribute("preserveAspectRatio", "none");
        const p = 1.5;
        const r = Math.max(10, Math.min(20, W / 2, H / 2));
        const x0 = p;
        const y0 = p;
        const x1 = W - p;
        const y1 = H - p;
        const mY = (y0 + y1) / 2;
        const nx = nR.left + nR.width / 2 - cR.left;
        const spineLeft = nx < W / 2;
        const top = svg.querySelector(".bd-top");
        const bot = svg.querySelector(".bd-bot");
        if (top && bot) {
          if (spineLeft) {
            top.setAttribute(
              "d",
              `M${x0} ${mY} L${x0} ${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} L${x1 - r} ${y0} Q${x1} ${y0} ${x1} ${y0 + r} L${x1} ${mY}`
            );
            bot.setAttribute(
              "d",
              `M${x0} ${mY} L${x0} ${y1 - r} Q${x0} ${y1} ${x0 + r} ${y1} L${x1 - r} ${y1} Q${x1} ${y1} ${x1} ${y1 - r} L${x1} ${mY}`
            );
          } else {
            top.setAttribute(
              "d",
              `M${x1} ${mY} L${x1} ${y0 + r} Q${x1} ${y0} ${x1 - r} ${y0} L${x0 + r} ${y0} Q${x0} ${y0} ${x0} ${y0 + r} L${x0} ${mY}`
            );
            bot.setAttribute(
              "d",
              `M${x1} ${mY} L${x1} ${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} L${x0 + r} ${y1} Q${x0} ${y1} ${x0} ${y1 - r} L${x0} ${mY}`
            );
          }
        }
        pts.push({ x: nR.left + nR.width / 2 - tlR.left, y: nR.top + nR.height / 2 - tlR.top });
      });
      const spine = tl!.querySelector<SVGSVGElement>(".tl-spine");
      if (spine && pts.length > 1) {
        spine.setAttribute("viewBox", `0 0 ${tlR.width} ${tlR.height}`);
        spine.setAttribute("preserveAspectRatio", "none");
        const cx = tlR.width / 2;
        const d = `M${cx.toFixed(1)} ${pts[0].y.toFixed(1)} L${cx.toFixed(1)} ${pts[pts.length - 1].y.toFixed(1)}`;
        tl!.querySelector(".sp-track")?.setAttribute("d", d);
        tl!.querySelector(".sp-fill")?.setAttribute("d", d);
      }
    }

    // Scroll progress --p for the spine fill.
    function fill() {
      const rect = tl!.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = (vh * 0.78 - rect.top) / (rect.height * 0.72);
      tl!.style.setProperty("--p", String(Math.max(0, Math.min(1, prog))));
    }

    buildTL();

    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((it) => it.classList.add("in", "hit"));
      tl.style.setProperty("--p", "1");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in", "hit");
          io.unobserve(en.target);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    items.forEach((it) => io.observe(it));

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        fill();
      });
    };
    const onResize = () => {
      buildTL();
      fill();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    fill();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [steps]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <div className="tl tl--text" data-prog>
        <svg className="tl-spine" aria-hidden="true">
          <path className="sp-track" pathLength={1} />
          <path className="sp-fill" pathLength={1} />
        </svg>
        {steps.map((s) => (
          <div className="tl-item" key={s.n}>
            <span className="tl-link" />
            <span className="tl-node" />
            <article className="tl-card">
              <svg className="tl-border" aria-hidden="true">
                <path className="bd-top" pathLength={1} />
                <path className="bd-bot" pathLength={1} />
              </svg>
              <div className="tl-txt">
                <p className="tl-n">STEP {pad(s.n)}</p>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {s.youGet && (
                  <p className="tl-get"><span>You get</span>{s.youGet}</p>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
