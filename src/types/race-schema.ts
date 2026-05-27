export type LocaleCode = "en" | "zh-CN" | "zh-TW" | string;

export type ReviewStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "needs-changes"
  | "rejected"
  | "archived";

export type SourceKind =
  | "official-website"
  | "registration-platform"
  | "social-media"
  | "organizer-submission"
  | "manual-research"
  | "api"
  | "scraper";

export type IngestionMethod = "manual" | "scrape" | "api" | "import";

export type RegistrationStageStatus =
  | "scheduled"
  | "open"
  | "closed"
  | "sold-out"
  | "lottery"
  | "waitlist"
  | "cancelled";

export type DistanceCategoryStatus =
  | "planned"
  | "open"
  | "sold-out"
  | "closed"
  | "cancelled";

export type TranslationString = {
  locale: LocaleCode;
  value: string;
  isMachineTranslated?: boolean;
  sourceLocale?: LocaleCode;
  updatedAt: string;
};

export type LocalizedText = {
  defaultLocale: LocaleCode;
  translations: TranslationString[];
};

export type SourceReference = {
  id: string;
  kind: SourceKind;
  url?: string;
  title?: string;
  publisher?: string;
  retrievedAt: string;
  lastSeenAt?: string;
  checksum?: string;
  confidence: number;
  notes?: string;
};

export type AdminReview = {
  status: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  assignedTo?: string;
  notes?: string;
  flags?: string[];
};

export type IngestionMetadata = {
  method: IngestionMethod;
  provider?: string;
  externalId?: string;
  sourceId?: string;
  ingestedAt: string;
  rawPayloadUri?: string;
  parserVersion?: string;
  apiVersion?: string;
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type LocationEntity = {
  id: string;
  countryCode: string;
  administrativeArea: LocalizedText;
  city?: LocalizedText;
  venue?: LocalizedText;
  address?: LocalizedText;
  coordinates?: GeoPoint;
  timezone: string;
};

export type OrganizerEntity = {
  id: string;
  name: LocalizedText;
  websiteUrl?: string;
  email?: string;
  socialUrls?: string[];
  sourceIds: string[];
};

export type RegistrationStage = {
  id: string;
  label: LocalizedText;
  status: RegistrationStageStatus;
  opensAt?: string;
  closesAt?: string;
  lotteryDrawAt?: string;
  capacity?: number;
  price?: {
    amount: number;
    currency: string;
  };
  registrationUrl?: string;
  sourceIds: string[];
};

export type RaceDistance = {
  id: string;
  raceId: string;
  name: LocalizedText;
  status: DistanceCategoryStatus;
  distanceKm: number;
  elevationGainM?: number;
  elevationLossM?: number;
  startTime?: string;
  cutoffHours?: number;
  capacity?: number;
  qualificationRequired?: boolean;
  mandatoryGearUrl?: string;
  routeGpxUrl?: string;
  sourceIds: string[];
};

export type RaceEvent = {
  id: string;
  slug: string;
  canonicalName: LocalizedText;
  shortName?: LocalizedText;
  description?: LocalizedText;
  countryCode: string;
  locationId: string;
  organizerIds: string[];
  eventStartDate: string;
  eventEndDate?: string;
  officialWebsiteUrl?: string;
  officialRegistrationUrl?: string;
  registrationStages: RegistrationStage[];
  distanceIds: string[];
  sourceIds: string[];
  ingestion: IngestionMetadata[];
  review: AdminReview;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type RaceDataSet = {
  schemaVersion: string;
  generatedAt: string;
  races: RaceEvent[];
  distances: RaceDistance[];
  locations: LocationEntity[];
  organizers: OrganizerEntity[];
  sources: SourceReference[];
};
