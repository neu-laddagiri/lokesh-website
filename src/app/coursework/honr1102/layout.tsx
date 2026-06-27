import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HONR 1102 | Honors Discovery | Lokesh Addagiri",
  description:
    "Honors Discovery coursework covering global citizenship, systems thinking, digital storytelling, community engagement, and an interactive Knight Lab StoryMap on youth mental health and digital access.",
};

export default function HONR1102Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
