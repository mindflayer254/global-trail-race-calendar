import type { RaceImportInput } from "@/backend/race-model";
import type { SourceAdapter } from "@/backend/ingestion/types";

type AhotuTrailRunningAdapterOptions = {
  listingUrl?: string;
  maxRecords?: number;
};

type LinkCandidate = {
  href: string;
  label: string;
  followingText: string;
};

const DEFAULT_AHOTU_TRAIL_LISTING_URL = "https://www.ahotu.com/calendar/trail-running?years=2026";

export function createAhotuTrailRunningAdapter({
  listingUrl = DEFAULT_AHOTU_TRAIL_LISTING_URL,
  maxRecords = 20,
}: AhotuTrailRunningAdapterOptions = {}): SourceAdapter {
  return {
    id: "ahotu-trail-running-calendar",
    sourceName: "Ahotu Trail Running Calendar",
    sourceUrl: listingUrl,
    sourceType: "scraper",
    async parse(context) {
      const html = await context.fetchPublicPage(listingUrl);
      const lastCheckedAt = context.now();
      const candidates = extractRaceCandidates(html, listingUrl).slice(0, maxRecords);
      const races: RaceImportInput[] = [];

      context.log({
        level: "info",
        message: `Found ${candidates.length} possible race listing candidate(s).`,
        sourceName: "Ahotu Trail Running Calendar",
        sourceUrl: listingUrl,
      });

      candidates.forEach((candidate) => {
        try {
          const parsedRace = parseAhotuCandidate(candidate, listingUrl, lastCheckedAt);

          if (!parsedRace) {
            context.log({
              level: "warn",
              message: `Skipped candidate without required race fields: ${candidate.label}`,
              sourceName: "Ahotu Trail Running Calendar",
              sourceUrl: listingUrl,
            });
            return;
          }

          races.push(parsedRace);
        } catch (error) {
          context.log({
            level: "error",
            message: `Failed to parse candidate: ${candidate.label}`,
            sourceName: "Ahotu Trail Running Calendar",
            sourceUrl: listingUrl,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });

      return races;
    },
  };
}

export function extractRaceCandidates(html: string, listingUrl: string): LinkCandidate[] {
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const candidates: LinkCandidate[] = [];
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(html))) {
    const href = toAbsoluteUrl(decodeHtml(match[1]), listingUrl);
    const label = cleanText(stripTags(match[2]));

    if (!isLikelyRaceLink(label, href)) {
      continue;
    }

    const followingHtml = html.slice(anchorPattern.lastIndex, anchorPattern.lastIndex + 2200);
    const followingText = cleanText(stripTags(followingHtml));

    if (!/trail running/i.test(followingText) && !hasDistance(followingText)) {
      continue;
    }

    candidates.push({ href, label, followingText });
  }

  return dedupeCandidates(candidates);
}

function parseAhotuCandidate(
  candidate: LinkCandidate,
  listingUrl: string,
  lastCheckedAt: string,
): RaceImportInput | undefined {
  const raceDate = parseRaceDate(candidate.followingText);
  const location = parseLocation(candidate.followingText);
  const distances = parseDistances(candidate.followingText);

  if (!candidate.label || !raceDate || !location || distances.length === 0) {
    return undefined;
  }

  return {
    raceName: candidate.label,
    country: location.country,
    region: location.country,
    city: location.city,
    raceDate,
    registrationOpenDate: raceDate,
    registrationCloseDate: raceDate,
    distances,
    organizer: "Unknown",
    officialWebsite: candidate.href,
    registrationUrl: findRegistrationUrl(candidate.followingText, candidate.href),
    sources: [
      {
        id: `ahotu-${hashValue(candidate.href)}`,
        sourceUrl: listingUrl,
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt,
        confidenceScore: 0.55,
      },
      {
        id: `ahotu-race-${hashValue(candidate.href)}`,
        sourceUrl: candidate.href,
        sourceName: "Ahotu Race Detail Page",
        sourceType: "scraper",
        lastCheckedAt,
        confidenceScore: 0.6,
      },
    ],
    languages: [{ locale: "en", isPrimary: true }],
    notes:
      "Imported from a public Ahotu trail-running listing page. Requires manual admin verification before publishing.",
    dataConfidenceScore: 0.55,
  };
}

function isLikelyRaceLink(label: string, href: string) {
  if (label.length < 4 || label.length > 140) {
    return false;
  }

  if (!href.includes("ahotu.com")) {
    return false;
  }

  return !/(calendar|login|register|checkout|privacy|terms|contact|about|blog)/i.test(label);
}

function parseRaceDate(text: string) {
  const match = text.match(/\b(\d{1,2})\s+([A-Z][a-z]{2,8}),?\s+(\d{4})\b/);

  if (!match) {
    return undefined;
  }

  const [, day, monthName, year] = match;
  const monthIndex = monthToNumber(monthName);

  if (!monthIndex) {
    return undefined;
  }

  return `${year}-${monthIndex}-${day.padStart(2, "0")}`;
}

function parseLocation(text: string) {
  const dateMatch = text.match(/\b\d{1,2}\s+[A-Z][a-z]{2,8},?\s+\d{4}\b/);
  const textBeforeDate = dateMatch ? text.slice(0, dateMatch.index) : text;
  const locationMatch = textBeforeDate.match(/([A-Z][A-Za-z .'-]{1,80}),\s*([A-Z][A-Za-z .'-]{1,80})\s*$/);

  if (!locationMatch) {
    return undefined;
  }

  return {
    city: cleanText(locationMatch[1]),
    country: cleanText(locationMatch[2]),
  };
}

function parseDistances(text: string) {
  const distanceMatches = Array.from(text.matchAll(/\b(\d+(?:\.\d+)?)\s*(km|k|mi|mile|miles)\b/gi));
  const distances = distanceMatches.map((match, index) => {
    const rawDistance = Number(match[1]);
    const unit = match[2].toLowerCase();
    const distanceKm = unit.startsWith("mi") ? rawDistance * 1.60934 : rawDistance;

    return {
      id: `distance-${index + 1}`,
      label: `${roundDistance(distanceKm)}K`,
      distanceKm: roundDistance(distanceKm),
      elevationGain: 0,
    };
  });

  return dedupeDistances(distances).slice(0, 12);
}

function findRegistrationUrl(text: string, fallbackUrl: string) {
  return /register|registration|checkout|from\s+\d+/i.test(text) ? fallbackUrl : fallbackUrl;
}

function hasDistance(text: string) {
  return /\b\d+(?:\.\d+)?\s*(km|k|mi|mile|miles)\b/i.test(text);
}

function dedupeCandidates(candidates: LinkCandidate[]) {
  const seen = new Set<string>();

  return candidates.filter((candidate) => {
    const key = `${candidate.href}|${candidate.label}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function dedupeDistances(distances: RaceImportInput["distances"]) {
  const seen = new Set<number>();

  return distances.filter((distance) => {
    if (seen.has(distance.distanceKm)) {
      return false;
    }

    seen.add(distance.distanceKm);
    return true;
  });
}

function monthToNumber(monthName: string) {
  const month = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(monthName.slice(0, 3).toLowerCase());

  return month >= 0 ? String(month + 1).padStart(2, "0") : undefined;
}

function toAbsoluteUrl(href: string, baseUrl: string) {
  return new URL(href, baseUrl).toString();
}

function stripTags(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function cleanText(text: string) {
  return decodeHtml(text).replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function roundDistance(value: number) {
  return Math.round(value * 10) / 10;
}

function hashValue(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36);
}
