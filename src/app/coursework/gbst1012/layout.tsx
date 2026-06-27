import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GBST 1012 | Global Learning Experience | Lokesh Addagiri",
  description:
    "Global Learning Experience coursework covering global citizenship, intercultural communication, Hofstede cultural dimensions, and a comparative tourism research project on Seoul and New York City.",
};

export default function GBST1012Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
