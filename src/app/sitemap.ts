import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lokeshaddagiri.com",
      priority: 1,
    },
    {
      url: "https://lokeshaddagiri.com/coursework",
      priority: 0.9,
    },
  ];
}
