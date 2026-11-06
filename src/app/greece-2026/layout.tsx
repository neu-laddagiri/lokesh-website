import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Greece 2026",
  description:
    "Study abroad in Athens, Greece. Academic growth, international business, and unforgettable experiences at the American College of Greece.",
  // The preview image is opengraph-image.png beside this file.
  openGraph: {
    title: "Greece 2026 | Lokesh Addagiri",
    description:
      "A documentary-style archive of my study abroad experience in Athens, Greece.",
    url: "/greece-2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greece 2026 | Lokesh Addagiri",
    description:
      "A documentary-style archive of my study abroad experience in Athens, Greece.",
  },
};

export default function Greece2026Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={playfair.variable}>{children}</div>;
}
