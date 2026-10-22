import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SITE } from "@/lib/site";
import { IconSprite } from "@/components/icons";
import { EnquiryProvider } from "@/components/enquiry";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
      <body>
        <MotionConfig reducedMotion="user">
          <EnquiryProvider>
            <FxBootstrap />
            <HashScroller />
            <IconSprite />
            <ScrollProgressBar />
            <a className="skip" href="#main">Skip to content</a>
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </EnquiryProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
