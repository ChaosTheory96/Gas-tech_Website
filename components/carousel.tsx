"use client";
/* ---------------------------------------------------------------------------
   Generic accessible carousel (no WebGL, transform-only). Used by the product
   image galleries (pcar, one slide per view + caption) and the home
   capabilities rail. Responsive items-per-view, prev/next, dots, optional
   autoplay that honours reduced-motion and pauses on hover/focus.

   Motion is deliberately jitter-free, matching the FAQ: the track is shifted by
   the MEASURED pixel distance between slides (offsetLeft), so it always lands
   exactly on a slide boundary regardless of inter-slide gap or peek padding
   (the old percentage shift drifted). The caption sits in a reserved grid cell
   so a longer/shorter caption can't jump the controls row height. One consistent
   ease-out curve + duration everywhere.
   --------------------------------------------------------------------------- */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Icon } from "./icons";

type Props = {
  slides: ReactNode[];
  captions?: string[];
  maxPerView?: number;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  autoplayMs?: number;
};

const EASE = "cubic-bezier(.16,1,.3,1)"; // site --ease-out (matches the FAQ)
const DUR = 600; // ms

function perViewForWidth(w: number, max: number) {
  if (w < 640) return Math.min(1, max);
  if (w < 1024) return Math.min(2, max);
  return max;
}

export function Carousel({
  slides,
  captions,
  maxPerView = 3,
  className,
  viewportClassName,
  trackClassName,
  autoplayMs,
}: Props) {
  const [perView, setPerView] = useState(maxPerView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0); // measured px between adjacent slides
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const count = slides.length;
  const positions = Math.max(1, count - perView + 1);

  // responsive items-per-view (window width)
  useEffect(() => {
    const compute = () => {
      const pv = perViewForWidth(window.innerWidth, maxPerView);
      setPerView(pv);
      setIndex((i) => Math.min(i, Math.max(0, count - pv)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [maxPerView, count]);

  // measure the exact slide pitch so the shift never lands between slides
  useEffect(() => {
    const track = trackRef.current;
    const vp = viewportRef.current;
    if (!track || !vp) return;
    const measure = () => {
      const kids = track.children;
      let s =
        kids.length > 1
          ? (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
          : vp.clientWidth;
      if (!s || s <= 0 || Number.isNaN(s)) s = vp.clientWidth / Math.max(1, perView);
      setStep(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    ro.observe(track);
    return () => ro.disconnect();
  }, [perView, count]);

  const go = useCallback(
    (next: number) => {
      const max = Math.max(0, count - perView);
      setIndex(((next % (max + 1)) + (max + 1)) % (max + 1));
    },
    [count, perView],
  );

  useEffect(() => {
    if (!autoplayMs || reduce || paused || count <= 1) return;
    const id = window.setInterval(() => go(index + 1), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, reduce, paused, count, index, go]);

  const shift = -(index * step);

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className={viewportClassName}
        style={{ overflow: "hidden" }}
      >
        <div
          ref={trackRef}
          className={trackClassName}
          style={{
            display: "flex",
            // 2D translate (not translate3d) and NO permanent will-change: a
            // settled track must not sit on a composited layer or its slide
            // text loses subpixel AA (Phase 4 text-rendering contract). The
            // transition still animates the slide; only the resting state
            // returns to native rendering.
            transform: `translateX(${shift}px)`,
            transition: reduce ? "none" : `transform ${DUR}ms ${EASE}`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              style={{ flex: `0 0 ${100 / perView}%`, minWidth: `${100 / perView}%` }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="car-ctl-row">
          {captions ? (
            // grid overlap: ALL captions share cell 1/1 and stay in-flow, so the
            // cell is as tall as the tallest one; only opacity/transform change.
            // The row height is therefore constant → no vertical jitter on swap.
            <div style={{ display: "grid", minWidth: 0, flex: "1 1 auto" }}>
              {captions.map((c, i) => (
                <div
                  key={i}
                  className="pcar-cap"
                  aria-hidden={i !== index}
                  aria-live={i === index ? "polite" : undefined}
                  style={{
                    gridArea: "1 / 1",
                    position: "relative",
                    background: "none",
                    opacity: i === index ? 1 : 0,
                    // active caption rests at `none` (not translateY(0)) so its
                    // text is not left on a composited layer (Phase 4 contract);
                    // CSS still interpolates none<->translateY for the swap.
                    transform: i === index ? "none" : "translateY(6px)",
                    transition: reduce ? "none" : `opacity ${DUR}ms ${EASE}, transform ${DUR}ms ${EASE}`,
                    pointerEvents: i === index ? "auto" : "none",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="car-ui">
            <div className="car-dots" role="tablist" aria-label="Choose slide">
              {Array.from({ length: positions }).map((_, d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-label={`Go to slide ${d + 1}`}
                  aria-selected={d === index}
                  className={d === index ? "dot on" : "dot"}
                  onClick={() => go(d)}
                />
              ))}
            </div>
            <div className="car-btns">
              <button className="car-btn" type="button" aria-label="Previous" onClick={() => go(index - 1)}><Icon name="arrow" className="flip" /></button>
              <button className="car-btn" type="button" aria-label="Next" onClick={() => go(index + 1)}><Icon name="arrow" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
