/* The photo stage shared by the product card and the product carousel: the
   product stands on a white or brand-red surface, with its category tag and
   brand mark. Cut-outs come from qa/cutouts.py via lib/cutouts.ts. */
import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandLockup";
import { Icon } from "@/components/icons";
import { cutout } from "@/lib/cutouts";
import type { BrandId } from "@/lib/site";

export type Shot = { src: string; alt: string };

export function StageImage({ shot, active = true, eager }: { shot: Shot; active?: boolean; eager?: boolean }) {
  const art = cutout(shot.src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`stage-img stage-img--${art.kind}${active ? " is-on" : ""}`}
      src={art.src}
      alt={active ? shot.alt : ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

export function Stage({
  tag,
  brand,
  red,
  icon = "manifold",
  empty,
  children,
}: {
  tag?: string;
  brand?: BrandId;
  red?: boolean;
  /** shown when there is no photograph yet */
  icon?: string;
  empty?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={red ? "stage stage--red" : "stage"}>
      {tag && <span className="stage-tag">{tag}</span>}
      {brand && (
        <span className="stage-chip">
          <BrandMark id={brand} />
        </span>
      )}
      {empty && (
        <span className="stage-empty" aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
      {children}
    </div>
  );
}
