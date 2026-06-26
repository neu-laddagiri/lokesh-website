import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DS 2500 | Intermediate Programming with Data | Lokesh Addagiri",
  description:
    "Data science coursework featuring Python, Pandas, APIs, exploratory analysis, machine learning foundations, and a CFPB banking complaints capstone research project.",
};

export default function DS2500Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
