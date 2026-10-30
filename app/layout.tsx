import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SITE } from "@/lib/site";
import { IconSprite } from "@/components/icons";
import { EnquiryProvider } from "@/components/enquiry";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/preloader";
import { FxBootstrap, ScrollProgressBar, PageTransition, HashScroller } from "@/components/fx";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.name + " | Industrial Burners, Gas Regulation, Metering & Gas Safety",
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "industrial",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/assets/gc-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/assets/gc-logo.svg" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: "/assets/gc-logo-flat.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/assets/gc-logo-flat.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Critical type: fetch the faces actually used in parallel with the
            giant chained stylesheet, so headings never sit on the Arial-class
            fallback (font-display:swap otherwise shows it for seconds). */}
        <link rel="preload" href="/fonts/manrope-latin-800-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-700-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sourcesans3-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sourcesans3-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ibmplexmono-latin-500-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <EnquiryProvider>
            <Preloader />
            <FxBootstrap />
            <HashScroller />
            <IconSprite />
            <ScrollProgressBar />
            <a className="skip" href="#main">Skip to content</a>
            <Navbar />
            {/* SmoothScroll wraps ONLY the scrolling document. The fixed navbar and
                scroll-progress above, and the enquiry modal (a sibling rendered by
                EnquiryProvider after this), stay OUTSIDE #smooth-content so
                ScrollSmoother's transform never drags or scales them. */}
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
              <Footer />
            </SmoothScroll>
          </EnquiryProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
