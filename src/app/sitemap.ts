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
    lastModified: new Date(race.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...publicRoutes, ...raceRoutes];
}
