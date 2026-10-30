/* Gastech gas trains, P30 in the client scheme. A top-level URL of its own
   rather than under /products/, exactly as the sheet places it, with the P31 to
   P39 application pages to be nested beneath it later. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import ProductPage, { productMetadata } from "@/components/ProductPage";

const product = getProduct("gas-trains");

export const metadata: Metadata = product ? productMetadata(product) : {};

export default function GasTrainsPage() {
  if (!product) notFound();
  return <ProductPage p={product} />;
}
