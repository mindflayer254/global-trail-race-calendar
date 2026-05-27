export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://global-trail-race-finder.example.com";

export const siteName = "Global Trail Race Finder";

export const siteDescription =
  "Discover verified trail running races worldwide with dates, distances, elevation gain, registration status, and official registration links for international runners.";
