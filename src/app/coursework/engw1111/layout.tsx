import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ENGW 1111 | First-Year Writing | Lokesh Addagiri",
  description:
    "First-Year Writing coursework covering professional communication, storytelling, rhetorical analysis, research writing, and audience-focused revision.",
};

export default function ENGW1111Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
