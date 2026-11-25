import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const description =
  "Stonebridge Construction is a fictional construction, contracting and property development company — a portfolio demonstration website by RS Technology Group.";

export const metadata: Metadata = {
  title: { default: "Stonebridge Construction — Built With Purpose. Designed To Last.", template: "%s | Stonebridge Construction" },
  description,
  applicationName: "Stonebridge Construction (Demo)",
  keywords: ["construction", "design and build", "renovations", "property development", "portfolio demo"],
  openGraph: { title: "Stonebridge Construction", description, type: "website", siteName: "Stonebridge Construction" },
  twitter: { card: "summary_large_image", title: "Stonebridge Construction", description },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#202725" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-3 focus:text-charcoal">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
