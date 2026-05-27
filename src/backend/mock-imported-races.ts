import type { BackendRace } from "@/backend/race-model";

export const mockImportedRaces: BackendRace[] = [
  {
    id: "import-utmb-val-daran-2026",
    raceName: "Val d'Aran by UTMB",
    slug: "val-daran-by-utmb-spain-2026",
    country: "Spain",
    region: "Europe",
    city: "Vielha",
    raceDate: "2026-07-03",
    registrationOpenDate: "2026-01-15",
    registrationCloseDate: "2026-06-01",
    distances: [
      { id: "vda-110", label: "VDA 110K", distanceKm: 110, elevationGain: 6400 },
      { id: "vda-55", label: "PDA 55K", distanceKm: 55, elevationGain: 3300 }
    ],
    elevationGain: 6400,
    organizer: "UTMB Group",
    officialWebsite: "https://example.com/val-daran",
    registrationUrl: "https://example.com/val-daran/register",
    sourceUrl: "https://example.com/val-daran/source",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-vda-1",
        sourceUrl: "https://example.com/val-daran/source",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:12:00+08:00",
        confidenceScore: 0.76
      }
    ],
    lastCheckedAt: "2026-05-27T00:12:00+08:00",
    lastUpdatedAt: "2026-05-27T00:12:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.76,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Imported from public listing. Needs official page verification."
  },
  {
    id: "import-madeira-island-ultra-2026",
    raceName: "Madeira Island Ultra-Trail",
    slug: "madeira-island-ultra-trail-portugal-2026",
    country: "Portugal",
    region: "Europe",
    city: "Porto Moniz",
    raceDate: "2026-04-25",
    registrationOpenDate: "",
    registrationCloseDate: "",
    distances: [
      { id: "miut-115", label: "MIUT 115", distanceKm: 115, elevationGain: 7100 }
    ],
    elevationGain: 7100,
    organizer: "",
    officialWebsite: "https://example.com/miut",
    registrationUrl: "",
    sourceUrl: "https://example.com/miut/source",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-miut-1",
        sourceUrl: "https://example.com/miut/source",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:18:00+08:00",
        confidenceScore: 0.52
      }
    ],
    lastCheckedAt: "2026-05-27T00:18:00+08:00",
    lastUpdatedAt: "2026-05-27T00:18:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.52,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Missing registration window and organizer. Highlight for admin review."
  },
  {
    id: "import-lavaredo-ultra-2026-a",
    raceName: "Lavaredo Ultra Trail",
    slug: "lavaredo-ultra-trail-italy-2026-a",
    country: "Italy",
    region: "Europe",
    city: "Cortina d'Ampezzo",
    raceDate: "2026-06-26",
    registrationOpenDate: "2025-10-01",
    registrationCloseDate: "2026-05-15",
    distances: [
      { id: "lut-120", label: "120K", distanceKm: 120, elevationGain: 5800 }
    ],
    elevationGain: 5800,
    organizer: "Lavaredo Ultra Trail",
    officialWebsite: "https://example.com/lavaredo",
    registrationUrl: "https://example.com/lavaredo/register",
    sourceUrl: "https://example.com/lavaredo/source-a",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-lut-a",
        sourceUrl: "https://example.com/lavaredo/source-a",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:20:00+08:00",
        confidenceScore: 0.68
      }
    ],
    lastCheckedAt: "2026-05-27T00:20:00+08:00",
    lastUpdatedAt: "2026-05-27T00:20:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.68,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Potential duplicate with another imported listing."
  },
  {
    id: "import-lavaredo-ultra-2026-b",
    raceName: "Lavaredo Ultra Trail",
    slug: "lavaredo-ultra-trail-italy-2026-b",
    country: "Italy",
    region: "Europe",
    city: "Cortina",
    raceDate: "2026-06-26",
    registrationOpenDate: "2025-10-01",
    registrationCloseDate: "2026-05-15",
    distances: [
      { id: "lut-50", label: "50K", distanceKm: 50, elevationGain: 2600 }
    ],
    elevationGain: 2600,
    organizer: "Lavaredo Ultra Trail",
    officialWebsite: "https://example.com/lavaredo",
    registrationUrl: "https://example.com/lavaredo/register",
    sourceUrl: "https://example.com/lavaredo/source-b",
    sourceName: "Official Race Page",
    sourceType: "official",
    sources: [
      {
        id: "source-lut-b",
        sourceUrl: "https://example.com/lavaredo/source-b",
        sourceName: "Official Race Page",
        sourceType: "official",
        lastCheckedAt: "2026-05-27T00:24:00+08:00",
        confidenceScore: 0.91
      }
    ],
    lastCheckedAt: "2026-05-27T00:24:00+08:00",
    lastUpdatedAt: "2026-05-27T00:24:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.91,
    languages: [{ locale: "en", isPrimary: true }, { locale: "it" }],
    notes: "Official source has higher confidence."
  }
];
