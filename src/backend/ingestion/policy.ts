import type { FetchPolicy } from "@/backend/ingestion/types";

export const DEFAULT_FETCH_POLICY: FetchPolicy = {
  userAgent: "GlobalTrailRaceFinderBot/0.1 (+https://global-trail-race-finder.example.com)",
  minDelayMs: 1500,
  timeoutMs: 12000,
  respectRobotsTxt: true,
};

export const DISALLOWED_CONTENT_PATTERNS = [
  /login required/i,
  /sign in to continue/i,
  /captcha/i,
  /paywall/i,
  /subscribe to continue/i,
  /access denied/i,
];

export function assertPublicContentOnly(html: string, sourceUrl: string) {
  const blockedPattern = DISALLOWED_CONTENT_PATTERNS.find((pattern) => pattern.test(html));

  if (blockedPattern) {
    throw new Error(`Source appears restricted or protected: ${sourceUrl}`);
  }
}

export function stripPotentialPersonalData(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[redacted-phone]");
}
