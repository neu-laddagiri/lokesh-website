import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS 1800 | Discrete Structures | Lokesh Addagiri",
  description:
    "Discrete Structures coursework covering logic, proofs, sets, combinatorics, probability, mathematical induction, graph theory, and asymptotic analysis at Northeastern Khoury College.",
};

export default function CS1800Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
