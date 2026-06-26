import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACCT 1201 | Financial Accounting & Reporting | Lokesh Addagiri",
  description:
    "Financial Accounting coursework including SEC research, financial statement analysis, Excel financial modeling, Tesla vs Ford valuation, and AI-assisted accounting analysis.",
};

export default function ACCT1201Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
