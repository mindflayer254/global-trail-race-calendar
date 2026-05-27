import Link from "next/link";
import { DataError } from "@/components/data-state";
import { RaceCard } from "@/components/race-card";
import { getFeaturedRaces, getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export default async function Home() {
  const racesResult = await getRaces();
  const featuredRacesResult = await getFeaturedRaces();
  const races = racesResult.data ?? [];
  const featuredRaces = featuredRacesResult.data ?? [];
  const stats = [
    { label: "curated races", value: races.length.toString() },
    { label: "countries covered", value: new Set(races.map((race) => race.country)).size.toString() },
    { label: "official links", value: "100%" },
  ];

  return (
    <>
      <section className="terrain-grid overflow-hidden border-b border-[#D8D0C2]">
        <div className="mx-auto grid min-h-[calc(100vh-69px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-[4.5rem] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-24">
          <div className="fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A45A2A]">
              Global trail race discovery
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-tight text-[#20231E] sm:text-6xl lg:text-7xl">
              Find your next mountain race anywhere.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6B675F] sm:text-lg">
              A focused race calendar for international trail runners, built around public
              race information, clear logistics, and direct links to official registration.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/races"
                className="soft-hover rounded-[3px] bg-[#1E241D] px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#1E241D]/10 hover:bg-[#2a3328] sm:min-w-40"
              >
                Explore races
              </Link>
              <Link
                href="/submit"
                className="soft-hover rounded-[3px] border border-[#D8D0C2] bg-white/82 px-5 py-3.5 text-center text-sm font-semibold text-[#20231E] hover:border-[#A45A2A] hover:bg-[#fffdfa] sm:min-w-40"
              >
                Submit race info
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[3px] border border-[#D8D0C2] bg-[#D8D0C2] shadow-sm sm:max-w-2xl sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#fffdfa]/90 p-4 sm:p-5">
                  <p className="text-2xl font-semibold tracking-tight text-[#20231E] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[0.65rem] font-bold uppercase leading-5 tracking-[0.16em] text-[#6B675F]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="topographic-panel fade-up-delay relative min-h-[460px] overflow-hidden rounded-[4px] text-white shadow-2xl shadow-[#1E241D]/18 ring-1 ring-[#1E241D]/10 sm:min-h-[620px]">
            <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
            <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-between p-5 sm:min-h-[620px] sm:p-8">
              <div className="flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#f4e7d2] sm:text-xs">
                <span>Mountain calendar</span>
                <span>Global / 2026</span>
              </div>
              <div className="max-w-lg">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d8b48a]">
                  For overseas runners
                </p>
                <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Compare dates, distances, gain, and registration windows in one clean view.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-px rounded-[3px] bg-white/18 text-sm backdrop-blur">
                  <div className="bg-[#1E241D]/62 p-3">
                    <p className="text-xl font-semibold">100K</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Longest route</p>
                  </div>
                  <div className="bg-[#1E241D]/62 p-3">
                    <p className="text-xl font-semibold">6,200m</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Max gain</p>
                  </div>
                  <div className="bg-[#1E241D]/62 p-3">
                    <p className="text-xl font-semibold">8</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Regions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noise-wash py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A45A2A]">
                Upcoming races
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#20231E] sm:text-4xl">
                Start with the next trail windows.
              </h2>
            </div>
            <Link
              href="/races"
              className="text-sm font-semibold text-[#7c431f] underline-offset-4 transition hover:text-[#20231E] hover:underline"
            >
              View full calendar
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
            {featuredRacesResult.error ? (
              <div className="md:col-span-3">
                <DataError message={featuredRacesResult.error} />
              </div>
            ) : (
              featuredRaces.map((race) => <RaceCard key={race.slug} race={race} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}
