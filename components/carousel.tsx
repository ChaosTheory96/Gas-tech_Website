"use client";
/* ---------------------------------------------------------------------------
   Generic accessible carousel (no WebGL, transform-only). Used by the product
   image galleries (pcar, one slide per view + caption) and the home
   capabilities rail. Responsive items-per-view, prev/next, dots, optional
   autoplay that honours reduced-motion and pauses on hover/focus.
   --------------------------------------------------------------------------- */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const count = slides.length;
  const positions = Math.max(1, count - perView + 1);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const pv = perViewForWidth(w, maxPerView);
      setPerView(pv);
      setIndex((i) => Math.min(i, Math.max(0, count - pv)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [maxPerView, count]);

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

  const shift = `-${index * (100 / perView)}%`;

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
          className={trackClassName}
          style={{
            display: "flex",
            gap: "inherit",
            transform: `translateX(${shift})`,
            transition: reduce ? "none" : "transform .6s cubic-bezier(.22,1,.36,1)",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", gap: "16px" }}>
          {captions && captions[index] !== undefined ? (
            <div className="pcar-cap" aria-live="polite" style={{ margin: 0 }}>{captions[index]}</div>
          ) : <span />}
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
