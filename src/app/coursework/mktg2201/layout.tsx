import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MKTG 2201 | Marketing | Lokesh Addagiri",
  description:
    "Marketing coursework covering strategy, consumer behavior, branding, digital marketing, the Spotify Match innovation project, and a semester-long competitive marketing simulation.",
};

export default function MKTG2201Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
