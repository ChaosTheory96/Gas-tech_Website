import type { Product } from "@/lib/products";

/* Line-art glyphs for product types that have no photograph yet. Generic valve
   symbols, not product images. */
const GLYPH: Record<NonNullable<Product["types"]>[number]["id"], string> = {
  solenoid: "M22 6h20v18H22zM32 24v10M8 44h48v10H8zM18 44l14-10 14 10",
  motorised: "M42 16a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM32 26v8M8 44h48v10H8zM18 44l14-10 14 10",
  butterfly: "M54 32a22 22 0 1 1-44 0 22 22 0 0 1 44 0zM32 10v44M32 32c10-14 14-6 0 0zM32 32c-10 14-14 6 0 0z",
  port: "M10 20h44a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4zM40 32a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM6 32h18M40 32h18",
};

export default function TypeTiles({ types, brand }: { types: NonNullable<Product["types"]>; brand: string }) {
  return (
    <ul className="p-tiles">
      {types.map((t, i) => (
        <li className="p-tile" key={t.id}>
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d={GLYPH[t.id]} />
          </svg>
          <span className="p-tile-k">{String(i + 1).padStart(2, "0")} · {brand}</span>
          <b>{t.label}</b>
        </li>
      ))}
    </ul>
  );
}
