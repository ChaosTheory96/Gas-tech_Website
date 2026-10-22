import type { Config } from "tailwindcss";

/**
 * Tailwind is wired into the toolchain for new layout/utility work, but the
 * proven Gastech design system (styles/tokens.css + site.css + enhancements.css)
 * is imported verbatim as the global stylesheet so the visual result stays
 * pixel-faithful. Preflight is disabled because site.css already ships a full,
 * tuned reset — enabling Tailwind's base would fight it.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  preflight: false,
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-fg": "var(--brand-fg)",
        ink: "var(--text-default)",
        surface: "var(--bg-surface)",
        sunken: "var(--bg-sunken)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        pill: "var(--r-pill)",
      },
    },
  },
  plugins: [],
};

export default config;
