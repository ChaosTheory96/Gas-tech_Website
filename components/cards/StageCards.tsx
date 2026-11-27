"use client";
/* Stage cards (gas train assembly): white at rest, brand red on hover and
   keyboard focus. Touch screens have no hover, so there a card turns red while
   it crosses the middle of the screen. */
import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";
import { cutout } from "@/lib/cutouts";

export type StageItem = { title: string; desc: string; icon?: string; img?: string; alt?: string };

export function StageCards({ items }: { items: StageItem[] }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches || !root.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-lit", e.isIntersecting)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    Array.from(root.current.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <ol className="sc-grid" ref={root} data-stagger>
      {items.map((s) => (
        <li className="sc" key={s.title}>
          <article tabIndex={0}>
            <span className="sc-ic">
              <Icon name={s.icon ?? "manifold"} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {s.img && (
              <div className="sc-shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cutout(s.img).src} alt={s.alt ?? s.title} loading="lazy" decoding="async" />
              </div>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
