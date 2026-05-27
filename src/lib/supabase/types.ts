export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RaceRow = {
  id: string;
  race_name: string;
  slug: string;
  country: string;
  region: string;
  city: string;
  race_date: string;
  registration_open_date: string | null;
  registration_close_date: string | null;
  elevation_gain: number;
  organizer: string;
  official_website: string;
  registration_url: string;
  source_url: string;
  source_name: string;
  source_type: string;
  last_checked_at: string;
  last_updated_at: string;
  verification_status: "pending" | "verified" | "rejected";
  data_confidence_score: number;
  languages: Json;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type RaceInsert = Omit<RaceRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type RaceDistanceRow = {
  id: string;
  race_id: string;
  label: string;
  distance_km: number;
  elevation_gain: number;
  start_time: string | null;
  cutoff_hours: number | null;
  registration_url: string | null;
  created_at: string;
  updated_at: string;
};

export type RaceDistanceInsert = Omit<RaceDistanceRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      races: {
        Row: RaceRow;
        Insert: RaceInsert;
        Update: Partial<RaceInsert>;
        Relationships: [];
      };
      race_distances: {
        Row: RaceDistanceRow;
        Insert: RaceDistanceInsert;
        Update: Partial<RaceDistanceInsert>;
        Relationships: [
          {
            foreignKeyName: "race_distances_race_id_fkey";
            columns: ["race_id"];
            referencedRelation: "races";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
