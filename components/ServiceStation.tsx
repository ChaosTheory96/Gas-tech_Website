"use client";
// ============================================================================
// ServiceStation — one dedicated section per service line (Services page).
// Each service gets room to breathe: a real image plate + an animated valve
// "station" marker (the pipe/valve reveal carried over from the service
// pipeline), then kicker, title, lead and the two detail points, and its own
// call to action. Alternating media side + band tone give the page rhythm.
//
// Self-contained + JS-off-safe: the image, all copy and the CTA are always in
// the DOM and visible. Only the valve/stub marker and a gentle media settle are
// gated behind `.rv:not(.in)` (`.rv` is added by JS), so with JS or motion off
// nothing is hidden. Under prefers-reduced-motion / no IntersectionObserver the
// final state is applied immediately. Scoped .gt-proc .svc-*.
// ============================================================================

import { useEffect, useRef } from "react";
import "@/styles/process.css";

export type ServicePoint = { label: string; text: string };

export type ServiceData = {
  num: string;
  code: string;
  kicker: string;
  title: string;
  lead: string;
  points: ServicePoint[];
  img: string;
  alt: string;
};

export default function ServiceStation({
  data,
  flip,
  children,
}: {
  data: ServiceData;
  flip?: boolean;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sec = root.querySelector<HTMLElement>(".svc-sec");
    if (!sec) return;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      sec.classList.add("in");
      return;
    }
    sec.classList.add("rv");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            sec.classList.add("in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
    );
    io.observe(sec);
    return () => io.disconnect();
  }, [data]);

  return (
    <div className="gt-proc" ref={rootRef}>
      <section className={flip ? "svc-sec svc-sec--flip" : "svc-sec"}>
        <div className="svc-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.img} alt={data.alt} loading="lazy" decoding="async" />
          <span className="svc-code">{data.code}</span>
        </div>
        <div className="svc-panel">
          <div className="svc-marker" aria-hidden="true">
            <span className="svc-stub" />
            <span className="svc-valve">{data.num}</span>
          </div>
          <p className="svc-kicker">{data.kicker}</p>
          <h2 className="svc-title">{data.title}</h2>
          <p className="svc-lead">{data.lead}</p>
          <ul className="svc-feats">
            {data.points.map((p) => (
              <li key={p.label}>
                <span className="fl">{p.label}</span> {p.text}
              </li>
            ))}
          </ul>
          {children && <div className="svc-cta">{children}</div>}
        </div>
      </section>
    </div>
  );
}
