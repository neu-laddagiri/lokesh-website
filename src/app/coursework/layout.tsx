import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Archive | Coursework | Lokesh Addagiri",
  description:
    "A curated academic archive documenting courses, projects, presentations, and technical artifacts from Northeastern University.",
};

export default function CourseworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
