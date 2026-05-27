"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { RaceCard } from "@/components/race-card";
import { filterRaces, statusLabels } from "@/lib/races";
import type { Race, RaceFilters } from "@/types/race";

type RaceCalendarProps = {
  races: Race[];
  filterOptions: {
    months: string[];
    countries: string[];
    distances: string[];
  };
};

const initialFilters: RaceFilters = {
  month: "all",
  distance: "all",
  country: "all",
  status: "all",
};

export function RaceCalendar({ races, filterOptions }: RaceCalendarProps) {
  const [filters, setFilters] = useState<RaceFilters>(initialFilters);

  const filteredRaces = useMemo(() => filterRaces(filters, races), [filters, races]);

  function updateFilter(key: keyof RaceFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-10">
      <div className="premium-card grid gap-4 rounded-[2px] p-4 sm:p-5 md:grid-cols-4">
        <FilterSelect
          label="Month"
          value={filters.month}
          onChange={(value) => updateFilter("month", value)}
          options={[
            { label: "All months", value: "all" },
            ...filterOptions.months.map((month) => ({ label: month, value: month })),
          ]}
        />
        <FilterSelect
          label="Distance"
          value={filters.distance}
          onChange={(value) => updateFilter("distance", value)}
          options={[
            { label: "All distances", value: "all" },
            ...filterOptions.distances.map((distance) => ({
              label: distance === "81+" ? "81K+" : `${distance}K`,
              value: distance,
            })),
          ]}
        />
        <FilterSelect
          label="Country"
          value={filters.country}
          onChange={(value) => updateFilter("country", value)}
          options={[
            { label: "All countries", value: "all" },
            ...filterOptions.countries.map((country) => ({ label: country, value: country })),
          ]}
        />
        <FilterSelect
          label="Registration"
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { label: "Any status", value: "all" },
            ...Object.entries(statusLabels).map(([value, label]) => ({ label, value })),
          ]}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 text-sm text-[#66635c] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing <span className="font-semibold text-[#191917]">{filteredRaces.length}</span> of{" "}
          {races.length} races
        </p>
        <button
          type="button"
          onClick={() => setFilters(initialFilters)}
          className="soft-hover w-full rounded-[2px] border border-[#c9c4b8] bg-white px-3 py-2.5 font-semibold text-[#191917] hover:border-[#9b5b2e] sm:w-auto"
        >
          Reset filters
        </button>
      </div>

      {filteredRaces.length > 0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRaces.map((race) => (
            <RaceCard key={race.slug} race={race} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No races match these filters"
            message="Try widening your month, distance, country, or registration status selection."
          />
        </div>
      )}
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#34332f]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-[2px] border border-[#c9c4b8] bg-[#f7f4ee] px-3 text-sm font-medium text-[#191917] outline-none transition hover:border-[#9b5b2e] focus:border-[#9b5b2e] focus:ring-2 focus:ring-[#d7b48a]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
