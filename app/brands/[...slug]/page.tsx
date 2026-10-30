/* Product pages that live under /brands/ in the client scheme (Gasvigil is P24).
   When the authorised-brand pages P11 to P25 are built they become static
   siblings or data rows here, no route plumbing changes. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsUnder, getProductByRoute } from "@/lib/products";
import ProductPage, { productMetadata, segmentsUnder } from "@/components/ProductPage";

const PREFIX = "/brands/";

type Ctx = { params: { slug: string[] } };

/* Same guard as the /products/ catch-all: only routes that exist in
   lib/products.ts are served, anything else is a clean 404 rather than a 200
   with no content. */
export const dynamicParams = false;

export function generateStaticParams() {
  return productsUnder(PREFIX).map((p) => ({ slug: segmentsUnder(p, PREFIX) }));
}

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const p = getProductByRoute(PREFIX, params.slug);
  if (!p) return {};
  return productMetadata(p);
}

export default function BrandChild({ params }: Ctx) {
  const p = getProductByRoute(PREFIX, params.slug);
  if (!p) notFound();
  return <ProductPage p={p} />;
}
