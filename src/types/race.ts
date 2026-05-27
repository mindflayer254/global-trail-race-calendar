export type RegistrationStatus = "open" | "opening-soon" | "closed" | "waitlist";
export type PublicVerificationStatus = "pending" | "verified" | "rejected";

export type DistanceCategory = {
  label: string;
  distanceKm: number;
  elevationGainM: number;
};

export type Race = {
  slug: string;
  name: string;
  country: string;
  area: string;
  city: string;
  location: string;
  region: string;
  date: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  registrationStatus: RegistrationStatus;
  distances: DistanceCategory[];
  description: string;
  organizer: string;
  officialWebsite: string;
  registrationUrl: string;
  sourceUrl: string;
  lastUpdated: string;
  verificationStatus?: PublicVerificationStatus;
};

export type RaceFilters = {
  month: string;
  distance: string;
  country: string;
  status: string;
};
