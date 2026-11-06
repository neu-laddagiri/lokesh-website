import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Data pipelines and web apps built by Lokesh Addagiri: a CFPB complaint analysis across 35,000 records, a Monte Carlo poker and blackjack trainer, a privacy-first Instagram export analyzer, and an NFL salary model.",
  alternates: {
    canonical: "/projects",
  },
  // The preview image is opengraph-image.png beside this file.
  openGraph: {
    title: "Projects | Lokesh Addagiri",
    description:
      "Live apps, source code, and written reports from data science and web engineering projects.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Lokesh Addagiri",
    description:
      "Live apps, source code, and written reports from data science and web engineering projects.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
