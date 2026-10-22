import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";

/* Static routes + the 8 data-driven product pages. ~10-ish URLs by design
   (lean sitemap requirement). */
const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/brands", priority: 0.7, changeFrequency: "monthly" },
  { path: "/delivery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = STATIC.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
  const products: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: absoluteUrl(`/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...statics, ...products];
}
