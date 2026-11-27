"use client";
/* Product card: stage (tag, brand mark, photo dots), name, one line, one fact
   and one action. With `href` the whole card is the link; otherwise pass an
   `action` button. `wide` lays the first card of a wide grid on its side. */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { BrandId } from "@/lib/site";
import { Stage, StageImage, type Shot } from "./Stage";

type Props = {
  title: string;
  line: string;
  tag: string;
  brand?: BrandId;
  shots: Shot[];
  icon?: string;
  fact?: string;
  sub?: string;
  list?: string[];
  chips?: readonly string[];
  href?: string;
  cta?: string;
  action?: ReactNode;
  /** brand-red photo stage (gas trains) */
  red?: boolean;
  /** brand-red highlight card (Pietro Fiorentini and Gastech) */
  usp?: boolean;
};

export function ProductCard({ title, line, tag, brand, shots, icon, fact, sub, list, chips, href, cta = "View range", action, red, usp }: Props) {
  const [on, setOn] = useState(0);
  return (
    <article className={usp ? "pc pc--usp" : "pc"}>
      <Stage tag={tag} brand={brand} red={red} icon={icon} empty={shots.length === 0}>
        {shots.map((s, i) => (
          <StageImage key={s.src} shot={s} active={i === on} />
        ))}
        {shots.length > 1 && (
          <div className="stage-dots">
            {shots.map((s, i) => (
              <button key={s.src} type="button" aria-label={`Photo ${i + 1} of ${shots.length}: ${title}`} aria-current={i === on} onClick={() => setOn(i)} />
            ))}
          </div>
        )}
      </Stage>
      <div className="pc-body">
        <h3>{title}</h3>
        {sub && <p className="pc-sub">{sub}</p>}
        <p>{line}</p>
        {(list?.length || chips?.length) ? (
          <ul className="pc-chips">
            {[...(chips ?? []), ...(list ?? [])].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
        <div className="pc-act">
          {fact && <span className="pc-fact">{fact}</span>}
          {href ? (
            <Link className="pc-go" href={href} aria-label={`${cta}: ${title}`}>
              {cta} <Icon name="arrow" />
            </Link>
          ) : (
            action
          )}
        </div>
      </div>
    </article>
  );
}
