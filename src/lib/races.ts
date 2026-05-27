import { getVerifiedWorkflowRaces, getWorkflowRaceBySlug } from "@/backend/race-store";
import type { BackendRace } from "@/backend/race-model";
import type { Race, RaceFilters, RegistrationStatus } from "@/types/race";

export const races = getRaces();

export const statusLabels: Record<RegistrationStatus, string> = {
  open: "Open",
  "opening-soon": "Opening soon",
  closed: "Closed",
  waitlist: "Waitlist",
};

export function getRaceBySlug(slug: string) {
  const race = getWorkflowRaceBySlug(slug);

  if (!race || race.verificationStatus !== "verified") {
    return undefined;
  }

  return toPublicRace(race);
}

export function getFeaturedRaces() {
  return [...getRaces()]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
}

export function getFilterOptions() {
  const sourceRaces = getRaces();
  const months = Array.from(
    new Set(
      sourceRaces.map((race) =>
        new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(
          new Date(race.date),
        ),
      ),
    ),
  );

  const countries = Array.from(new Set(sourceRaces.map((race) => race.country))).sort();
  const distances = ["0-25", "26-50", "51-80", "81+"];

  return { months, countries, distances };
}

export function filterRaces(filters: RaceFilters, sourceRaces = getRaces()) {
  return sourceRaces.filter((race) => {
    const raceMonth = new Intl.DateTimeFormat("en", {
      month: "long",
      timeZone: "UTC",
    }).format(new Date(race.date));
    const maxDistance = Math.max(...race.distances.map((distance) => distance.distanceKm));

    const matchesMonth = filters.month === "all" || raceMonth === filters.month;
    const matchesCountry = filters.country === "all" || race.country === filters.country;
    const matchesStatus = filters.status === "all" || race.registrationStatus === filters.status;
    const matchesDistance =
      filters.distance === "all" ||
      (filters.distance === "0-25" && maxDistance <= 25) ||
      (filters.distance === "26-50" && maxDistance >= 26 && maxDistance <= 50) ||
      (filters.distance === "51-80" && maxDistance >= 51 && maxDistance <= 80) ||
      (filters.distance === "81+" && maxDistance >= 81);

    return matchesMonth && matchesCountry && matchesStatus && matchesDistance;
  });
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function getDistanceSummary(race: Race) {
  return race.distances.map((distance) => `${distance.distanceKm}K`).join(" / ");
}

export function getElevationSummary(race: Race) {
  const maxGain = Math.max(...race.distances.map((distance) => distance.elevationGainM));
  return `${maxGain.toLocaleString()} m max gain`;
}

export function getRaces() {
  return getVerifiedWorkflowRaces().map(toPublicRace);
}

function toPublicRace(race: BackendRace): Race {
  return {
    slug: race.slug,
    name: race.raceName,
    country: race.country,
    area: `${race.city} / ${race.region}`,
    city: race.city,
    location: `${race.city}, ${race.country}`,
    region: race.region,
    date: race.raceDate,
    registrationOpenDate: race.registrationOpenDate || race.raceDate,
    registrationCloseDate: race.registrationCloseDate || race.raceDate,
    registrationStatus: getRegistrationStatus(race),
    distances: race.distances.map((distance) => ({
      label: distance.label,
      distanceKm: distance.distanceKm,
      elevationGainM: distance.elevationGain,
    })),
    description: race.notes || `${race.raceName} in ${race.city}, ${race.country}.`,
    organizer: race.organizer,
    officialWebsite: race.officialWebsite,
    registrationUrl: race.registrationUrl,
    sourceUrl: race.sourceUrl,
    lastUpdated: race.lastUpdatedAt,
    verificationStatus: race.verificationStatus,
  };
}

function getRegistrationStatus(race: BackendRace): RegistrationStatus {
  const now = new Date();
  const opensAt = new Date(race.registrationOpenDate);
  const closesAt = new Date(race.registrationCloseDate);

  if (Number.isNaN(opensAt.getTime()) || Number.isNaN(closesAt.getTime())) {
    return "opening-soon";
  }

  if (now < opensAt) {
    return "opening-soon";
  }

  if (now > closesAt) {
    return "closed";
  }

  return "open";
}
