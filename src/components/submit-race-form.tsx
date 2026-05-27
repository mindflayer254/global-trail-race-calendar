"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type FormState = {
  raceName: string;
  location: string;
  dates: string;
  website: string;
  registrationUrl: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  raceName: "",
  location: "",
  dates: "",
  website: "",
  registrationUrl: "",
  notes: "",
};

const requiredFields: Array<keyof FormState> = [
  "raceName",
  "location",
  "dates",
  "website",
  "registrationUrl",
];

export function SubmitRaceForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function validate() {
    const nextErrors: Errors = {};

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (form.website && !isValidUrl(form.website)) {
      nextErrors.website = "Enter a valid website URL.";
    }

    if (form.registrationUrl && !isValidUrl(form.registrationUrl)) {
      nextErrors.registrationUrl = "Enter a valid registration URL.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(initialState);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="premium-card mt-10 rounded-[4px] p-5 sm:p-7 lg:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <TextField
          label="Race name"
          value={form.raceName}
          error={errors.raceName}
          required
          onChange={(value) => updateField("raceName", value)}
        />
        <TextField
          label="Location"
          value={form.location}
          error={errors.location}
          required
          onChange={(value) => updateField("location", value)}
        />
        <TextField
          label="Dates"
          value={form.dates}
          error={errors.dates}
          placeholder="Example: 24 Oct 2026"
          required
          onChange={(value) => updateField("dates", value)}
        />
        <TextField
          label="Website"
          value={form.website}
          error={errors.website}
          placeholder="https://"
          required
          onChange={(value) => updateField("website", value)}
        />
        <TextField
          label="Registration URL"
          value={form.registrationUrl}
          error={errors.registrationUrl}
          placeholder="https://"
          required
          onChange={(value) => updateField("registrationUrl", value)}
        />
        <label className="grid gap-2 text-sm font-semibold text-[#20231E] sm:col-span-2">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            rows={5}
            className="field-surface min-h-40 resize-y rounded-[3px] px-3.5 py-3 text-sm font-medium text-[#20231E] outline-none transition"
            placeholder="Distance categories, elevation, source links, language notes, or organizer contacts."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {submitted ? (
          <p className="text-sm font-semibold text-[#2b5a2d]">
            Thanks. The submission passed local validation.
          </p>
        ) : (
          <p className="text-sm text-[#6B675F]">Required fields are marked with an asterisk.</p>
        )}
        <button
          type="submit"
          className="soft-hover rounded-[3px] bg-[#1E241D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2a3328] sm:min-w-40"
        >
          Submit for review
        </button>
      </div>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function TextField({ label, value, error, placeholder, required, onChange }: TextFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#20231E]">
      <span>
        {label}
        {required ? <span className="text-[#A45A2A]"> *</span> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="field-surface h-12 rounded-[3px] px-3.5 text-sm font-medium text-[#20231E] outline-none transition"
      />
      {error ? <span className="text-xs font-semibold text-[#9a342f]">{error}</span> : null}
    </label>
  );
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
