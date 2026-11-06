import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CoopProvider } from "@/components/coop/coop-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { COOP } from "@/lib/coop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "Lokesh Addagiri | Data Science and Business Administration";
const SITE_DESCRIPTION = `${COOP.incoming}. Northeastern University Data Science and Business Administration student. Projects, coursework archive, and reports.`;

export const metadata: Metadata = {
  // The bare domain redirects here, so absolute URLs (like the preview image) skip the redirect.
  metadataBase: new URL("https://www.lokeshaddagiri.com"),

  title: {
    default: SITE_TITLE,
    template: "%s | Lokesh Addagiri",
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "Lokesh Addagiri",
    "Data Science",
    "Business Administration",
    "Northeastern University",
    "Co-op 2027",
    "Data Scientist",
    "Data Engineer",
    "Data Analyst",
    "Operations Analyst",
    "Business Intelligence Analyst",
    "Portfolio",
    "Analytics",
    "Statistics",
    "Data Visualization",
    "Python",
    "SQL",
    "Student Portfolio",
  ],

  authors: [{ name: "Lokesh Addagiri" }],
  creator: "Lokesh Addagiri",

  // Favicon is served automatically from src/app/favicon.ico (App Router file convention).

  // The preview image is src/app/opengraph-image.png (with its alt text beside it).
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Lokesh Addagiri",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CoopProvider>{children}</CoopProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
