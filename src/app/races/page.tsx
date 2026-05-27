import type { Metadata } from "next";
import { RaceCalendar } from "@/components/race-calendar";
import { SectionHeading } from "@/components/section-heading";
import { getFilterOptions, getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Race Calendar",
  description:
    "Filter trail running races worldwide by month, distance, country, and registration status.",
};

export default function RacesPage() {
  const races = getRaces();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Race calendar"
        title="Trail races around the world"
        description="Browse public race information across major trail regions and jump to official registration pages when you are ready to confirm details with organizers."
      />
      <RaceCalendar races={races} filterOptions={getFilterOptions()} />
    </section>
  );
}
