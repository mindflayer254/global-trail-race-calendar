import type { Metadata } from "next";
import { AdminImportReview } from "@/components/admin-import-review";
import { getPendingWorkflowRaces } from "@/backend/race-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Imported Race Review",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminImportsPage() {
  const pendingRaces = getPendingWorkflowRaces();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b5b2e]">
            Pending imports
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#191917]">
            Review imported race data
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#625f57]">
            Imported records stay pending until an admin approves them. This route is intentionally
            simple for now and can later be protected with middleware or session-based auth.
          </p>
        </div>
        <div className="rounded-[2px] border border-[#ded8cc] bg-white px-4 py-3 text-sm font-semibold text-[#191917]">
          {pendingRaces.length} pending
        </div>
      </div>

      <AdminImportReview initialRaces={pendingRaces} />
    </section>
  );
}
