import { SITE, absoluteUrl } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";

/* GEO: a plain-text, machine-readable summary of the business and its pages,
   following the llms.txt convention so generative engines can crawl accurate
   facts (who we are, what we supply, where we are, how to contact). */
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];
  lines.push(`# ${SITE.legalName}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push("Gastech Combustions is the Pune-based representative and integrator for Riello industrial burners, Pietro Fiorentini gas regulation and metering, and Gasvigil gas-leak detection. We supply, size, install, commission and service complete gas systems, doing it right first time with one accountable partner.");
  lines.push("");
  lines.push("## Key facts");
  lines.push(`- Legal name: ${SITE.legalName}`);
  lines.push(`- Also known as: ${SITE.name}`);
  lines.push(`- Website: ${SITE.url}`);
  lines.push(`- City / Region / Country: ${SITE.contact.city}, ${SITE.contact.region}, ${SITE.contact.country}`);
  lines.push(`- Works address: ${SITE.contact.worksAddress}`);
  lines.push(`- Registered address: ${SITE.contact.registeredAddress}`);
  lines.push(`- Phone: ${SITE.contact.phonePrimary} / ${SITE.contact.phoneSecondary}`);
  lines.push(`- Sales email: ${SITE.contact.salesEmail}`);
  lines.push(`- Technical email: ${SITE.contact.technicalEmail}`);
  lines.push(`- Brands represented: ${SITE.brands.join(", ")}`);
  lines.push("");
  lines.push("## Pages");
  const core = [
    ["Home", "/"],
    ["Products (full range)", "/products"],
    ["Brands we represent", "/brands"],
    ["How we deliver", "/delivery"],
    ["Services (consultancy, install, AMC)", "/services"],
    ["Contact", "/contact"],
  ] as const;
  for (const [label, path] of core) lines.push(`- [${label}](${absoluteUrl(path)})`);
  lines.push("");
  lines.push("## Products");
  for (const p of PRODUCTS) {
    lines.push(`- [${p.navLabel} (${p.brand})](${absoluteUrl(`/${p.slug}`)}): ${p.metaDescription}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate",
    },
  });
}
