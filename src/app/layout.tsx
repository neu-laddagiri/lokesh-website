import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lokeshaddagiri.com"),

  title: {
    default: "Lokesh Addagiri | Data Science and Business Administration",
    template: "%s | Lokesh Addagiri",
  },

  description:
    "Northeastern University Data Science and Business Administration student, available for a January to June 2027 co-op. Projects, coursework archive, and reports.",

  keywords: [
    "Lokesh Addagiri",
    "Data Science",
    "Business Administration",
    "Northeastern University",
    "Co-op 2027",
    "Data Engineer",
    "Data Analyst",
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

  // TODO: Add OG image at public/og-image.png (served as https://lokeshaddagiri.com/og-image.png)
  openGraph: {
    title: "Lokesh Addagiri | Data Science and Business Administration",
    description:
      "Northeastern University student available for a January to June 2027 co-op. Data pipelines, web apps, and a full coursework archive.",
    url: "https://lokeshaddagiri.com",
    siteName: "Lokesh Addagiri",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lokesh Addagiri, Data Science and Business Administration portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lokesh Addagiri | Data Science and Business Administration",
    description:
      "Northeastern University student available for a January to June 2027 co-op. Data pipelines, web apps, and a full coursework archive.",
    images: ["/og-image.png"],
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
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
