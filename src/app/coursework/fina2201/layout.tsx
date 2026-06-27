import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FINA 2201 | Financial Management | Lokesh Addagiri",
  description:
    "Corporate finance coursework covering DCF valuation, capital budgeting, CAPM, bond and stock valuation, cost of capital, and Excel financial modeling.",
};

export default function FINA2201Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
