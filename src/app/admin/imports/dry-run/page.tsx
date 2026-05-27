import type { Metadata } from "next";
import { DryRunImporter } from "@/components/dry-run-importer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dry Run Importer",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DryRunImporterPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b5b2e]">
          Dry-run importer
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#191917]">
          Preview imports before saving
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#625f57]">
          Run a source adapter against a public listing page, inspect missing fields and possible
          duplicates, then use Confirm import only after review. Dry runs do not save data.
        </p>
      </div>

      <DryRunImporter />
    </section>
  );
}
