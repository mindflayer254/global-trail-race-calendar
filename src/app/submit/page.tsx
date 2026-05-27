import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { SubmitRaceForm } from "@/components/submit-race-form";

export const metadata: Metadata = {
  title: "Submit Race",
  description:
    "Submit public trail race information for review, including race name, location, dates, website, registration URL, and notes.",
};

export default function SubmitRacePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-[4.5rem] lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Contribute"
        title="Submit a trail race"
        description="Share official race information or corrections. This MVP validates the form locally and does not send data to a backend yet."
      />
      <SubmitRaceForm />
    </section>
  );
}
