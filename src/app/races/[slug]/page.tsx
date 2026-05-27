import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { formatDate, getRaceBySlug, getRaces, statusLabels } from "@/lib/races";

export const dynamic = "force-dynamic";

type RaceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getRaces().map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({ params }: RaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const race = getRaceBySlug(slug);

  if (!race) {
    return {
      title: "Race not found",
    };
  }

  return {
    title: race.name,
    description: `${race.name} in ${race.location}: distances, elevation gain, registration dates, organizer, and official registration links.`,
  };
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { slug } = await params;
  const race = getRaceBySlug(slug);

  if (!race) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow={`${race.country} / ${statusLabels[race.registrationStatus]}`}
        title={race.name}
        description={race.description}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-8">
          <section className="premium-card rounded-[2px] p-5 sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-[#191917]">Race overview</h2>
            <dl className="mt-6 grid gap-px overflow-hidden border border-[#efede6] bg-[#efede6] sm:grid-cols-2">
              <DetailItem label="Race date" value={formatDate(race.date)} />
              <DetailItem label="Location" value={race.location} />
              <DetailItem label="Registration opens" value={formatDate(race.registrationOpenDate)} />
              <DetailItem label="Registration closes" value={formatDate(race.registrationCloseDate)} />
              <DetailItem label="Registration status" value={statusLabels[race.registrationStatus]} />
              <DetailItem label="Organizer" value={race.organizer} />
            </dl>
          </section>

          <section className="premium-card rounded-[2px] p-5 sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-[#191917]">
              Distance categories
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-[#dfddd4] text-xs uppercase tracking-[0.16em] text-[#77756d]">
                    <th className="py-3 pr-4 font-semibold">Category</th>
                    <th className="py-3 pr-4 font-semibold">Distance</th>
                    <th className="py-3 pr-4 font-semibold">Elevation gain</th>
                  </tr>
                </thead>
                <tbody>
                  {race.distances.map((distance) => (
                    <tr key={distance.label} className="border-b border-[#efede6] last:border-0">
                      <td className="py-4 pr-4 font-semibold text-[#191917]">{distance.label}</td>
                      <td className="py-4 pr-4 text-[#5f5e57]">{distance.distanceKm} km</td>
                      <td className="py-4 pr-4 text-[#5f5e57]">
                        {distance.elevationGainM.toLocaleString()} m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[2px] border border-[#2d2b26] bg-[#191917] p-5 text-white shadow-2xl shadow-[#191917]/10 sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight">Disclaimer</h2>
            <p className="mt-4 text-sm leading-7 text-[#d6d2c7]">
              This page uses locally stored mock data representing publicly available race
              information. It is not an official race notice. Dates, categories, entry
              availability, qualification rules, mandatory gear, visa considerations, and
              refund policies must be verified on the organizer&apos;s official channels before
              registering or arranging travel.
            </p>
          </section>
        </div>

        <aside className="premium-card h-fit rounded-[2px] p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold tracking-tight text-[#191917]">Official links</h2>
          <div className="mt-5 grid gap-3">
            <a
              href={race.registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="soft-hover rounded-[2px] bg-[#191917] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#654021]"
            >
              Official registration
            </a>
            <a
              href={race.officialWebsite}
              target="_blank"
              rel="noreferrer"
              className="soft-hover rounded-[2px] border border-[#c9c4b8] px-4 py-3 text-center text-sm font-semibold text-[#191917] hover:border-[#9b5b2e]"
            >
              Official website
            </a>
            <a
              href={race.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="soft-hover rounded-[2px] border border-[#c9c4b8] px-4 py-3 text-center text-sm font-semibold text-[#191917] hover:border-[#9b5b2e]"
            >
              Source URL
            </a>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-[#efede6] pt-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#77756d]">Last updated</dt>
              <dd className="mt-1 font-semibold text-[#191917]">{formatDate(race.lastUpdated)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#77756d]">Region</dt>
              <dd className="mt-1 font-semibold text-[#191917]">{race.region}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="bg-white p-4 sm:p-5">
      <dt className="text-xs uppercase tracking-[0.16em] text-[#77756d]">{label}</dt>
      <dd className="mt-1.5 font-semibold text-[#191917]">{value}</dd>
    </div>
  );
}
