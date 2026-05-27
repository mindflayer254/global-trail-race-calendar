import type { Metadata } from "next";
import { DataError } from "@/components/data-state";
import { RaceCalendar } from "@/components/race-calendar";
import { SectionHeading } from "@/components/section-heading";
import { getFilterOptions, getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Race Calendar",
  description:
    "Filter trail running races worldwide by month, distance, country, and registration status.",
};

export default async function RacesPage() {
  const racesResult = await getRaces();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-[4.5rem] lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Race calendar"
        title="Trail races around the world"
        description="Browse public race information across major trail regions and jump to official registration pages when you are ready to confirm details with organizers."
      />
      {racesResult.error || !racesResult.data ? (
        <div className="mt-10">
          <DataError message={racesResult.error ?? "No race data returned from Supabase."} />
        </div>
      ) : (
        <RaceCalendar races={racesResult.data} filterOptions={getFilterOptions(racesResult.data)} />
      )}
    </section>
  );
}
