import type { MetadataRoute } from "next";
import { getRaces } from "@/lib/races";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const publicRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/races`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const racesResult = await getRaces();
  const raceRoutes = (racesResult.data ?? []).map((race) => ({
    url: `${siteUrl}/races/${race.slug}`,
    lastModified: getSafeDate(race.lastUpdated, now),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...publicRoutes, ...raceRoutes];
}

function getSafeDate(value: string | Date | null | undefined, fallback = new Date()) {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date;
}
