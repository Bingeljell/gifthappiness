"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { adminUpdateCharity, type AdminCharity } from "@/lib/api";
import { FormField, ImageUploadField, SdgChecklist } from "./CharityFormFields";

type FormState = {
  name: string;
  category: string;
  status: string;
  shortDescription: string;
  whatTheyDo: string;
  whoTheyHelp: string;
  whySelected: string;
  impactExample: string;
  website: string;
  amountRaised: string;
  registration: string;
  yearsActive: string;
  verificationNotes: string;
  sdgs: string[];
  logoUrl: string;
};

function toFormState(charity: AdminCharity): FormState {
  return {
    name: charity.name,
    category: charity.category,
    status: charity.status,
    shortDescription: charity.short_description,
    whatTheyDo: charity.what_they_do,
    whoTheyHelp: charity.who_they_help,
    whySelected: charity.why_selected,
    impactExample: charity.impact_example ?? "",
    website: charity.website ?? "",
    amountRaised: String(charity.amount_raised),
    registration: charity.registration ?? "",
    yearsActive: charity.years_active != null ? String(charity.years_active) : "",
    verificationNotes: charity.verification_notes ?? "",
    sdgs: charity.sdgs,
    logoUrl: charity.logo_url ?? "",
  };
}

type SubmitState = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

export default function EditCharityForm({
  charity,
  token,
  onSaved,
  onCancel,
}: {
  charity: AdminCharity;
  token: string;
  onSaved: (charity: AdminCharity) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(charity));
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSdg = (code: string) => {
    setForm((prev) => ({
      ...prev,
      sdgs: prev.sdgs.includes(code) ? prev.sdgs.filter((c) => c !== code) : [...prev.sdgs, code],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.shortDescription || !form.whatTheyDo || !form.whoTheyHelp || !form.whySelected) {
      setSubmit({ status: "error", message: "Fill in all the required fields." });
      return;
    }
    const amountRaised = Number(form.amountRaised);
    if (!Number.isFinite(amountRaised) || amountRaised < 0) {
      setSubmit({ status: "error", message: "Amount raised must be a non-negative number." });
      return;
    }

    setSubmit({ status: "submitting" });
    const result = await adminUpdateCharity(token, charity.slug, {
      name: form.name,
      category: form.category,
      status: form.status,
      short_description: form.shortDescription,
      what_they_do: form.whatTheyDo,
      who_they_help: form.whoTheyHelp,
      why_selected: form.whySelected,
      impact_example: form.impactExample || undefined,
      sdgs: form.sdgs,
      amount_raised: amountRaised,
      website: form.website || undefined,
      registration: form.registration || undefined,
      years_active: form.yearsActive ? Number(form.yearsActive) : null,
      verification_notes: form.verificationNotes || undefined,
      logo_url: form.logoUrl || undefined,
    });

    if (!result.ok) {
      setSubmit({ status: "error", message: result.error });
      return;
    }

    onSaved(result.data.charity);
  };

  return (
    <div className="rounded-2xl bg-white border border-primary-pink/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-gray-500">
          Editing <span className="text-gray-900">{charity.name}</span> &middot; /charities/{charity.slug}
        </p>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField id={`edit-name-${charity.id}`} label="Charity name" value={form.name} onChange={(v) => update("name", v)} />
        <FormField id={`edit-category-${charity.id}`} label="Category" value={form.category} onChange={(v) => update("category", v)} />
        <ImageUploadField id={`edit-logo-${charity.id}`} token={token} value={form.logoUrl} onChange={(v) => update("logoUrl", v)} />

        <div className="space-y-2">
          <label htmlFor={`edit-status-${charity.id}`} className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
            Status
          </label>
          <select
            id={`edit-status-${charity.id}`}
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <FormField
          id={`edit-summary-${charity.id}`}
          label="One-line summary"
          value={form.shortDescription}
          onChange={(v) => update("shortDescription", v)}
        />
        <FormField
          id={`edit-what-${charity.id}`}
          label="What they do"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.whatTheyDo}
          onChange={(v) => update("whatTheyDo", v)}
        />
        <FormField
          id={`edit-who-${charity.id}`}
          label="Who they help"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.whoTheyHelp}
          onChange={(v) => update("whoTheyHelp", v)}
        />
        <FormField
          id={`edit-why-${charity.id}`}
          label="Why we selected them"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.whySelected}
          onChange={(v) => update("whySelected", v)}
        />
        <FormField
          id={`edit-impact-${charity.id}`}
          label="Impact example (optional)"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.impactExample}
          onChange={(v) => update("impactExample", v)}
        />

        <FormField
          id={`edit-website-${charity.id}`}
          label="Website (optional)"
          placeholder="https://example.org"
          value={form.website}
          onChange={(v) => update("website", v)}
        />
        <FormField
          id={`edit-amount-${charity.id}`}
          label="Amount raised (₹)"
          inputMode="numeric"
          value={form.amountRaised}
          onChange={(v) => update("amountRaised", v)}
        />

        <SdgChecklist selected={form.sdgs} onToggle={toggleSdg} />

        <FormField
          id={`edit-registration-${charity.id}`}
          label="Registration details (optional)"
          value={form.registration}
          onChange={(v) => update("registration", v)}
        />
        <FormField
          id={`edit-years-${charity.id}`}
          label="Years active (optional)"
          inputMode="numeric"
          value={form.yearsActive}
          onChange={(v) => update("yearsActive", v)}
        />
        <FormField
          id={`edit-notes-${charity.id}`}
          label="Verification notes (optional)"
          textarea
          value={form.verificationNotes}
          onChange={(v) => update("verificationNotes", v)}
        />

        {submit.status === "error" && (
          <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {submit.message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submit.status === "submitting"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submit.status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
