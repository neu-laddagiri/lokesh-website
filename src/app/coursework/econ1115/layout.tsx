import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ECON 1115 | Principles of Macroeconomics | Lokesh Addagiri",
  description:
    "Macroeconomics coursework covering GDP, inflation, fiscal and monetary policy, international trade, and a Malaysia IMF World Economic Outlook capstone research project.",
};

export default function ECON1115Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
