/* Nested product URLs under /products/ — burners, gas regulation, measurement.
   Owns every depth the client scheme uses. /products/ itself stays with the
   sibling page.tsx, which is why this is a required catch-all, not an optional
   one: the two can never claim the same URL. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsUnder, getProductByRoute } from "@/lib/products";
import ProductPage, { productMetadata, segmentsUnder } from "@/components/ProductPage";

const PREFIX = "/products/";

type Ctx = { params: { slug: string[] } };

/* Every URL under /products/ is a real product in lib/products.ts, so a path
   that is not in generateStaticParams is not a page and must answer 404. Left
   as true, a catch-all renders any unknown depth on demand and the notFound()
   body can be served with a 200 and index, follow. */
export const dynamicParams = false;

export function generateStaticParams() {
  return productsUnder(PREFIX).map((p) => ({ slug: segmentsUnder(p, PREFIX) }));
}

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const p = getProductByRoute(PREFIX, params.slug);
  if (!p) return {};
  return productMetadata(p);
}

export default function ProductHubChild({ params }: Ctx) {
  const p = getProductByRoute(PREFIX, params.slug);
  if (!p) notFound();
  return <ProductPage p={p} />;
}
