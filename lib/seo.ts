/* ---------------------------------------------------------------------------
   Metadata factory. Every route calls buildMetadata() so titles, descriptions,
   canonicals, Open Graph and Twitter cards stay consistent and correct — the
   SEO half of the SEO/AEO/GEO requirement.
   --------------------------------------------------------------------------- */
import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

type Opts = {
  title: string;
  description: string;
  path?: string; // route path on the client scheme, e.g. "/products/burners/gas-burners/"
  image?: string; // absolute or root-relative; defaults to logo
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/assets/gc-logo-flat.png",
  type = "website",
  noindex = false,
  keywords,
}: Opts): Metadata {
  const url = absoluteUrl(path);
  const img = image.startsWith("http") ? image : absoluteUrl(image);
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE.name,
      locale: "en_IN",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Append the brand to titles declared in page-level metadata objects. */
export const TITLE_SUFFIX = `${SITE.name}`;
