import type { MetadataRoute } from "next";

const BASE_URL = "https://lokeshaddagiri.com";

const courseworkRoutes = [
  "mktg2201",
  "acct1201",
  "fina2201",
  "gbst1012",
  "honr1102",
  "econ1115",
  "engw1111",
  "cs1200",
  "cs1800",
  "ds2500",
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
      url: `${BASE_URL}/greece-2026`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
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
