"use client";
/* Product page gallery: one large stage with arrows, swipe and keyboard
   control, the photo's name, and thumbnails. */
import { useState, type KeyboardEvent, type PointerEvent, useRef } from "react";
import { Icon } from "@/components/icons";
import { cutout } from "@/lib/cutouts";
import type { BrandId } from "@/lib/site";
import { Stage, StageImage } from "./Stage";

type Slide = { src: string; alt: string; cap: string };

const SWIPE_PX = 40;

export function ProductCarousel({ slides, tag, brand, red }: { slides: Slide[]; tag: string; brand?: BrandId; red?: boolean }) {
  const [on, setOn] = useState(0);
  const start = useRef<number | null>(null);
  const many = slides.length > 1;
  const go = (n: number) => setOn((n + slides.length) % slides.length);
  // captions read "Name / figure": the figure becomes the second line
  const [name, detail] = slides[on].cap.split(" / ");

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(on + 1);
    else if (e.key === "ArrowLeft") go(on - 1);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent) => {
    start.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (many && Math.abs(dx) > SWIPE_PX) go(on + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="pcx" role="group" aria-roledescription="carousel" aria-label="Product photos" tabIndex={0} onKeyDown={onKey}>
      <div className="pcx-view" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
        <Stage tag={tag} brand={brand} red={red}>
          {slides.map((s, i) => (
            <StageImage key={s.src} shot={s} active={i === on} eager={i === 0} />
          ))}
        </Stage>
        {many && (
          <div className="pcx-nav">
            <button type="button" aria-label="Previous photo" data-dir="prev" onClick={() => go(on - 1)}>
              <Icon name="arrow" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(on + 1)}>
              <Icon name="arrow" />
            </button>
          </div>
        )}
      </div>
      <div className="pcx-foot">
        <p className="pcx-cap" aria-live="polite">
          <b>{name}</b>
          {detail && <span>{detail}</span>}
        </p>
        {many && (
          <div className="pcx-thumbs">
            {slides.map((s, i) => (
              <button key={s.src} type="button" aria-label={s.cap} aria-current={i === on} onClick={() => setOn(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cutout(s.src).src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
