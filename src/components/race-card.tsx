import Link from "next/link";
import type { Race } from "@/types/race";
import { formatDate, getDistanceSummary, getElevationSummary, statusLabels } from "@/lib/races";

type RaceCardProps = {
  race: Race;
};

const statusStyles = {
  open: "bg-[#e7f2df] text-[#28522b] border-[#b9d7aa]",
  "opening-soon": "bg-[#f5ead8] text-[#71461f] border-[#dfc696]",
  closed: "bg-[#ece9e1] text-[#555149] border-[#d7d2c5]",
  waitlist: "bg-[#e6eef0] text-[#284d5f] border-[#bfd1d9]",
};

export function RaceCard({ race }: RaceCardProps) {
  return (
    <article className="premium-card soft-hover group flex h-full flex-col overflow-hidden rounded-[2px]">
      <div className="h-1 bg-gradient-to-r from-[#4f5d45] via-[#9b5b2e] to-[#d7b48a]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#9b5b2e]">
              {race.country} / {race.area}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-[#191917]">
              <Link href={`/races/${race.slug}`} className="outline-none hover:text-[#654021]">
                {race.name}
              </Link>
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-[2px] border px-2.5 py-1.5 text-xs font-bold ${statusStyles[race.registrationStatus]}`}
          >
            {statusLabels[race.registrationStatus]}
          </span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#625f57]">{race.location}</p>
      </div>

      <dl className="mx-5 grid grid-cols-2 gap-3 border-y border-[#eee9df] py-5 text-sm sm:mx-6">
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#7a756b]">
            Race date
          </dt>
          <dd className="mt-1.5 font-semibold text-[#191917]">{formatDate(race.date)}</dd>
        </div>
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#7a756b]">
            Reg opens
          </dt>
          <dd className="mt-1.5 font-semibold text-[#191917]">
            {formatDate(race.registrationOpenDate)}
          </dd>
        </div>
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#7a756b]">
            Distances
          </dt>
          <dd className="mt-1.5 font-semibold text-[#191917]">{getDistanceSummary(race)}</dd>
        </div>
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[#7a756b]">
            Elevation
          </dt>
          <dd className="mt-1.5 font-semibold text-[#191917]">{getElevationSummary(race)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 p-5 sm:p-6">
        <Link
          href={`/races/${race.slug}`}
          className="text-sm font-semibold text-[#654021] underline-offset-4 transition group-hover:text-[#191917] hover:underline"
        >
          View details
        </Link>
        <a
          href={race.registrationUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-[2px] bg-[#191917] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#654021]"
        >
          Register
        </a>
      </div>
    </article>
  );
}
