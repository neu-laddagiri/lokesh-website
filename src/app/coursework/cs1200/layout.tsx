import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS 1200 | First Year Seminar | Lokesh Addagiri",
  description:
    "Khoury College first-year seminar covering Git, GitHub, version control, developer collaboration, Khoury Odyssey, and the foundations of professional software engineering.",
};

export default function CS1200Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
