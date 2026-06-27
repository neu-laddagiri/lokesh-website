import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ENGW 1111 | First-Year Writing | Lokesh Addagiri",
  description:
    "First-Year Writing coursework covering professional communication, digital storytelling, rhetorical analysis, and an interactive Knight Lab StoryMap on how Boston's sports spaces shape the city's identity.",
};

export default function ENGW1111Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
