import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: SITE.themeColor,
    icons: [
      { src: "/assets/gc-min.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/assets/gc-logo-flat.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
