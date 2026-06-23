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
    default: "Lokesh Addagiri",
    template: "%s | Lokesh Addagiri",
  },

  description:
    "Data Science & Business Administration student at Northeastern University. Portfolio featuring coursework, analytics projects, business intelligence dashboards, technical projects, and academic work.",

  keywords: [
    "Lokesh Addagiri",
    "Data Science",
    "Business Administration",
    "Northeastern University",
    "Portfolio",
    "Analytics",
    "Business Intelligence",
    "Machine Learning",
    "Statistics",
    "Data Visualization",
    "Python",
    "SQL",
    "Student Portfolio",
  ],

  authors: [{ name: "Lokesh Addagiri" }],
  creator: "Lokesh Addagiri",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Lokesh Addagiri",
    description:
      "Data Science & Business Administration student at Northeastern University.",
    url: "https://lokeshaddagiri.com",
    siteName: "Lokesh Addagiri",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lokesh Addagiri",
    description:
      "Data Science & Business Administration student at Northeastern University.",
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
