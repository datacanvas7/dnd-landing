import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL, SITE_NAME } from "@/lib/config/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DND — Good Coffee. Better Company. | Lahore",
  description:
    "Lahore, something's brewing. Join DND-Gang for your 10% membership benefit and first updates from DND — a new coffee brand in Lahore.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "DND — Good Coffee. Better Company.",
    description:
      "Lahore, something's brewing. Join DND-Gang for your 10% membership benefit and first updates from DND.",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "DND — Good Coffee. Better Company.",
    description:
      "Lahore, something's brewing. Join DND-Gang for your 10% membership benefit and first updates from DND.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#500600",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
