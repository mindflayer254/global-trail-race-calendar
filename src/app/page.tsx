import Link from "next/link";
import { RaceCard } from "@/components/race-card";
import { getFeaturedRaces, getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export default function Home() {
  const races = getRaces();
  const featuredRaces = getFeaturedRaces();
  const stats = [
    { label: "curated races", value: races.length.toString() },
    { label: "countries covered", value: new Set(races.map((race) => race.country)).size.toString() },
    { label: "official links", value: "100%" },
  ];

  return (
    <>
      <section className="terrain-grid overflow-hidden border-b border-[#ded8cc]">
        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9b5b2e]">
              Global trail race discovery
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-[#191917] sm:text-6xl lg:text-7xl">
              Find your next mountain race anywhere.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#56554e] sm:text-lg">
              A focused race calendar for international trail runners, built around public
              race information, clear logistics, and direct links to official registration.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/races"
                className="soft-hover rounded-[2px] bg-[#191917] px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#191917]/10 hover:bg-[#654021]"
              >
                Explore races
              </Link>
              <Link
                href="/submit"
                className="soft-hover rounded-[2px] border border-[#b9b4a8] bg-white/82 px-5 py-3.5 text-center text-sm font-semibold text-[#191917] hover:border-[#9b5b2e]"
              >
                Submit race info
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden border border-[#ded8cc] bg-[#ded8cc] sm:max-w-xl">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#fffdfa]/86 p-4">
                  <p className="text-2xl font-semibold tracking-tight text-[#191917]">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-bold uppercase leading-5 tracking-[0.16em] text-[#716d64]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up-delay relative min-h-[520px] overflow-hidden bg-[#191917] text-white shadow-2xl shadow-[#191917]/18 sm:min-h-[620px]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,25,23,0.08),rgba(25,25,23,0.78)),linear-gradient(90deg,rgba(25,25,23,0.72),rgba(25,25,23,0.06)),url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
            <div className="relative flex h-full min-h-[520px] flex-col justify-between p-5 sm:min-h-[620px] sm:p-8">
              <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4e7d2]">
                <span>Mountain calendar</span>
                <span>Global / 2026</span>
              </div>
              <div className="max-w-lg">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b48a]">
                  For overseas runners
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Compare dates, distances, gain, and registration windows in one clean view.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-px bg-white/18 text-sm backdrop-blur">
                  <div className="bg-[#191917]/55 p-3">
                    <p className="text-xl font-semibold">100K</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Longest route</p>
                  </div>
                  <div className="bg-[#191917]/55 p-3">
                    <p className="text-xl font-semibold">6,200m</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Max gain</p>
                  </div>
                  <div className="bg-[#191917]/55 p-3">
                    <p className="text-xl font-semibold">8</p>
                    <p className="mt-1 text-xs text-[#d6d2c7]">Regions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noise-wash py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b5b2e]">
                Upcoming races
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#191917] sm:text-4xl">
                Start with the next trail windows.
              </h2>
            </div>
            <Link
              href="/races"
              className="text-sm font-semibold text-[#654021] underline-offset-4 transition hover:text-[#191917] hover:underline"
            >
              View full calendar
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {featuredRaces.map((race) => (
              <RaceCard key={race.slug} race={race} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
