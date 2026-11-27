"use client";
// ============================================================================
// FaqAccordion — PRODUCTION J/FAQ, ported from the showcase FaqList.
// Self-contained: owns its scroll-reveal, height animation and one-at-a-time
// behaviour (the showcase relied on the ProcessShowcase engine; production has
// none, so it lives here). Renders native <details>/<summary> inside the
// `.gt-proc` scope so the scoped styles/process.css wins over production
// `.faq-list`, and the FAQ JSON-LD (built from data in [slug]/page.tsx) is
// untouched. Content is visible by default: the reveal only animates when JS +
// IntersectionObserver run, and prefers-reduced-motion lands the final state.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type FaqItem = { q: string; a: string };

const EASE = "cubic-bezier(.16,1,.3,1)";

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dets = useRef<HTMLDetailsElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const list = dets.current.filter(Boolean);
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // initial state: first open, rest closed
    list.forEach((d, i) => (d.open = i === 0));

    // animate a panel open/closed by tweening the body height
    const DUR = 400; // same duration for open + close so a swap is height-neutral
    const anim = (d: HTMLDetailsElement, open: boolean) => {
      const body = d.querySelector<HTMLElement>(".faq-body");
      if (!body) {
        d.open = open;
        return;
      }
      const dur = DUR;
      let done = false;
      const finish = () => {
        body.style.height = "";
        body.style.transition = "";
        body.style.overflow = "";
        if (!open) d.open = false;
      };
      const onEnd = (e?: TransitionEvent) => {
        // only react to the BODY's own height transition — the inner <p>
        // (opacity/transform) transitionend bubbles here and must be ignored,
        // or finish() fires early and the panel snaps (the reported jitter).
        if (e && e.target !== body) return;
        if (done) return;
        done = true;
        body.removeEventListener("transitionend", onEnd);
        finish();
      };
      body.addEventListener("transitionend", onEnd);
      window.setTimeout(onEnd, dur + 80); // fallback if transitionend is missed
      const h = body.scrollHeight;
      body.style.overflow = "hidden";
      body.style.transition = "none";
      body.style.height = (open ? 0 : h) + "px";
      void body.getBoundingClientRect(); // reflow before the transition
      body.style.transition = "height " + dur + "ms " + EASE;
      body.style.height = (open ? h : 0) + "px";
      if (open) d.open = true;
    };

    if (reduce) {
      return;
    }

    const offs: Array<() => void> = [];
    list.forEach((d) => {
      const s = d.querySelector<HTMLElement>("summary");
      if (!s) return;
      const onClick = (e: Event) => {
        e.preventDefault(); // drive open/close ourselves
        const willOpen = !d.open;
        list.forEach((o) => {
          if (o !== d && o.open) anim(o, false); // one at a time
        });
        anim(d, willOpen);
      };
      s.addEventListener("click", onClick);
      offs.push(() => s.removeEventListener("click", onClick));
    });

    return () => {
      offs.forEach((f) => f());
    };
  }, [faqs]);

  return (
    <div className="gt-proc" ref={rootRef} data-inview>
      <div className="faq">
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              ref={(el) => {
                if (el) dets.current[i] = el;
              }}
            >
              <summary>
                {f.q}
                <span className="plus" aria-hidden="true"></span>
              </summary>
              <div className="faq-body">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
