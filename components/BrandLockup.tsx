/* ---------------------------------------------------------------------------
   Brand marks. One mark per brand from the registry in lib/site.ts; a brand
   without a logo file (Electrogas) renders as a text mark. BrandLockup places
   several marks side by side (PF + Gastech on regulation and metering, the full
   set on the Brands hero).
   --------------------------------------------------------------------------- */
import { BRAND, type BrandId, type BrandLogo } from "@/lib/site";

export function BrandMark({ id }: { id: BrandId }) {
  const { name } = BRAND[id];
  const logo: BrandLogo | null = BRAND[id].logo;
  if (!logo) return <span className="brand-mark brand-mark--text">{name}</span>;
  return (
    <span className={logo.emblem ? "brand-mark brand-mark--emblem" : "brand-mark"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} width={logo.width} height={logo.height} alt={logo.emblem ? "" : name} loading="lazy" decoding="async" />
      {logo.emblem && <span className="brand-mark-name">{name}</span>}
    </span>
  );
}

export function BrandLockup({ ids, label, inline }: { ids: readonly BrandId[]; label: string; inline?: boolean }) {
  return (
    <ul className={inline ? "brand-lockup brand-lockup--row" : "brand-lockup"} aria-label={label}>
      {ids.map((id) => (
        <li key={id}>
          <BrandMark id={id} />
        </li>
      ))}
    </ul>
  );
}
