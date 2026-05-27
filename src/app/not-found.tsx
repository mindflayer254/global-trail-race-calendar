import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a5b2f]">
        Route not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1d1d1b]">
        This trail marker does not exist.
      </h1>
      <p className="mt-4 text-base leading-7 text-[#5c5b54]">
        Head back to the calendar and choose an available race from the current data set.
      </p>
      <Link
        href="/races"
        className="mt-8 rounded-sm bg-[#1d1d1b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f3f20]"
      >
        View race calendar
      </Link>
    </section>
  );
}
