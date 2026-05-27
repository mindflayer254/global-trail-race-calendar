import Link from "next/link";
import type { Race } from "@/types/race";
import { formatDate, getDistanceSummary, getElevationSummary, statusLabels } from "@/lib/races";

type RaceCardProps = {
  race: Race;
};

const statusStyles = {
  open: "bg-[#e7f2df] text-[#28522b] border-[#b9d7aa]",
  "opening-soon": "bg-[#f5ead8] text-[#71461f] border-[#dfc696]",
  closed: "bg-[#ece9e1] text-[#555149] border-[#D8D0C2]",
  waitlist: "bg-[#e6eef0] text-[#284d5f] border-[#bfd1d9]",
};

export function RaceCard({ race }: RaceCardProps) {
  return (
    <article className="premium-card soft-hover group flex h-full flex-col overflow-hidden rounded-[4px]">
      <div className="h-1 bg-gradient-to-r from-[#4c5b42] via-[#A45A2A] to-[#d8b48a]" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#A45A2A]">
              {race.country} / {race.area}
            </p>
            <h2 className="mt-3 text-xl font-semibold leading-tight tracking-tight text-[#20231E] sm:text-2xl">
              <Link href={`/races/${race.slug}`} className="outline-none hover:text-[#7c431f]">
                {race.name}
              </Link>
            </h2>
          </div>
          <span
            className={`w-fit shrink-0 rounded-[3px] border px-2.5 py-1.5 text-xs font-bold ${statusStyles[race.registrationStatus]}`}
          >
            {statusLabels[race.registrationStatus]}
          </span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6B675F]">{race.location}</p>
      </div>

      <dl className="mx-5 grid grid-cols-1 gap-px overflow-hidden rounded-[3px] border border-[#ebe4d8] bg-[#ebe4d8] text-sm sm:mx-6 sm:grid-cols-2">
        <div className="bg-[#fffdf9] p-4">
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#6B675F]">
            Race date
          </dt>
          <dd className="mt-1.5 font-semibold text-[#20231E]">{formatDate(race.date)}</dd>
        </div>
        <div className="bg-[#fffdf9] p-4">
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#6B675F]">
            Reg opens
          </dt>
          <dd className="mt-1.5 font-semibold text-[#20231E]">
            {formatDate(race.registrationOpenDate)}
          </dd>
        </div>
        <div className="bg-[#fffdf9] p-4">
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#6B675F]">
            Distances
          </dt>
          <dd className="mt-1.5 font-semibold text-[#20231E]">{getDistanceSummary(race)}</dd>
        </div>
        <div className="bg-[#fffdf9] p-4">
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#6B675F]">
            Elevation
          </dt>
          <dd className="mt-1.5 font-semibold text-[#20231E]">{getElevationSummary(race)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <Link
          href={`/races/${race.slug}`}
          className="text-center text-sm font-semibold text-[#7c431f] underline-offset-4 transition group-hover:text-[#20231E] hover:underline sm:text-left"
        >
          View details
        </Link>
        <a
          href={race.registrationUrl}
          target="_blank"
          rel="noreferrer"
          className="soft-hover rounded-[3px] bg-[#1E241D] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#2a3328] sm:min-w-28"
        >
          Register
        </a>
      </div>
    </article>
  );
}
