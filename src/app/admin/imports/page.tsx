import type { Metadata } from "next";
import { DataError } from "@/components/data-state";
import { AdminImportReview } from "@/components/admin-import-review";
import { getPendingRaceRecords } from "@/lib/supabase/races";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Imported Race Review",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminImportsPage() {
  const pendingRacesResult = await getPendingRaceRecords();
  const pendingRaces = pendingRacesResult.data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A45A2A]">
            Pending imports
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#20231E]">
            Review imported race data
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#625f57]">
            Imported records stay pending until an admin approves them. This route is intentionally
            simple for now and can later be protected with middleware or session-based auth.
          </p>
        </div>
        <div className="rounded-[2px] border border-[#D8D0C2] bg-white px-4 py-3 text-sm font-semibold text-[#20231E]">
          {pendingRaces.length} pending
        </div>
      </div>

      {pendingRacesResult.error ? (
        <div className="mt-8">
          <DataError message={pendingRacesResult.error} />
        </div>
      ) : (
        <AdminImportReview initialRaces={pendingRaces} />
      )}
    </section>
  );
}
