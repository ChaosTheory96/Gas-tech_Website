import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";

/* Static routes plus the 8 data-driven product pages, every one on the client
   scheme: nested path, trailing slash, no aliases. /gas-trains/ and
   /brands/gasvigil/ arrive through the PRODUCTS loop, never typed here. */
const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/brands/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about-us/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-we-work/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact-us/", priority: 0.7, changeFrequency: "yearly" },
  /* Sheet row P06 marks privacy index, follow, so it belongs in the sitemap:
     the 16 indexable URLs are exactly the live pages minus the 404. */
  { path: "/privacy-policy/", priority: 0.3, changeFrequency: "yearly" },
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
    url: absoluteUrl(p.route),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...statics, ...products];
}
