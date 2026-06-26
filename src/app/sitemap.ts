import type { MetadataRoute } from "next";

const BASE_URL = "https://lokeshaddagiri.com";

const courseworkRoutes = [
  "acct1201",
  "cs1200",
  "cs1800",
  "af3116",
  "math1231",
  "mg4057",
  "mgsc2301",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/coursework`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...courseworkRoutes.map((slug) => ({
      url: `${BASE_URL}/coursework/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
