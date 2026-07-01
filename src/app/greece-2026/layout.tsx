import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Greece 2026",
  description:
    "Study abroad in Athens, Greece — academic growth, international business, and unforgettable experiences at the American College of Greece.",
  openGraph: {
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
  return children;
}
