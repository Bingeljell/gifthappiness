"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Check, ChevronUp, Loader2, Plus } from "lucide-react";
import { adminCreateCharity, type AdminCharity } from "@/lib/api";
import { FormField, ImageUploadField, HeaderImageUploadField, SdgChecklist } from "./CharityFormFields";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type FormState = {
  name: string;
  category: string;
  shortDescription: string;
  whatTheyDo: string;
  whoTheyHelp: string;
  whySelected: string;
  impactExample: string;
  website: string;
  registration: string;
  yearsActive: string;
  verificationNotes: string;
  sdgs: string[];
  logoUrl: string;
  headerImageUrl: string;
};

const initialForm: FormState = {
  name: "",
  category: "",
  shortDescription: "",
  whatTheyDo: "",
  whoTheyHelp: "",
  whySelected: "",
  impactExample: "",
  website: "",
  registration: "",
  yearsActive: "",
  verificationNotes: "",
  sdgs: [],
  logoUrl: "",
  headerImageUrl: "",
};

type SubmitState = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

export default function AddCharityForm({ token, onCreated }: { token: string; onCreated: (charity: AdminCharity) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
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

  const slug = slugify(form.name);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.shortDescription || !form.whatTheyDo || !form.whoTheyHelp || !form.whySelected) {
      setSubmit({ status: "error", message: "Fill in all the required fields before adding this charity." });
      return;
    }
    if (!slug) {
      setSubmit({ status: "error", message: "Charity name must contain at least one letter or number." });
      return;
    }

    setSubmit({ status: "submitting" });
    const result = await adminCreateCharity(token, {
      slug,
      name: form.name,
      category: form.category,
      shortDescription: form.shortDescription,
      whatTheyDo: form.whatTheyDo,
      whoTheyHelp: form.whoTheyHelp,
      whySelected: form.whySelected,
      impactExample: form.impactExample || undefined,
      sdgs: form.sdgs,
      website: form.website || undefined,
      registration: form.registration || undefined,
      yearsActive: form.yearsActive ? Number(form.yearsActive) : undefined,
      verificationNotes: form.verificationNotes || undefined,
      logoUrl: form.logoUrl || undefined,
      headerImageUrl: form.headerImageUrl || undefined,
    });

    if (!result.ok) {
      setSubmit({ status: "error", message: result.error });
      return;
    }

    setSubmit({ status: "idle" });
    setForm(initialForm);
    setOpen(false);
    onCreated(result.data.charity);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all"
      >
        <Plus className="w-4 h-4" /> Add a charity
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronUp className="w-4 h-4" /> Add a charity
      </button>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField id="charity-name" label="Charity name" value={form.name} onChange={(v) => update("name", v)} />
        {form.name && <p className="text-xs text-gray-400 -mt-3 ml-1">Will be listed at /charities/{slug || "..."}</p>}

        <FormField id="charity-category" label="Category" placeholder="e.g. Education, Health, Environment" value={form.category} onChange={(v) => update("category", v)} />
        <ImageUploadField id="charity-logo" token={token} value={form.logoUrl} onChange={(v) => update("logoUrl", v)} />
        <HeaderImageUploadField id="charity-header" token={token} value={form.headerImageUrl} onChange={(v) => update("headerImageUrl", v)} />
        <FormField id="charity-summary" label="One-line summary" value={form.shortDescription} onChange={(v) => update("shortDescription", v)} />
        <FormField
          id="charity-what"
          label="What they do"
          textarea
          hint="One point per line -- shown as a bulleted list."
          placeholder={"e.g.\nRuns free medical clinics\nProvides emergency shelter"}
          value={form.whatTheyDo}
          onChange={(v) => update("whatTheyDo", v)}
        />
        <FormField
          id="charity-who"
          label="Who they help"
          textarea
          hint="One point per line -- shown as a bulleted list."
          placeholder={"e.g.\nFamilies affected by disaster\nChildren without access to school"}
          value={form.whoTheyHelp}
          onChange={(v) => update("whoTheyHelp", v)}
        />
        <FormField
          id="charity-why"
          label="Why we selected them"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.whySelected}
          onChange={(v) => update("whySelected", v)}
        />
        <FormField
          id="charity-impact"
          label="Impact example (optional)"
          textarea
          hint="One point per line -- shown as a bulleted list."
          value={form.impactExample}
          onChange={(v) => update("impactExample", v)}
        />

        <FormField
          id="charity-website"
          label="Website (optional)"
          placeholder="https://example.org"
          value={form.website}
          onChange={(v) => update("website", v)}
        />

        <SdgChecklist selected={form.sdgs} onToggle={toggleSdg} />

        <FormField
          id="charity-registration"
          label="Registration details (optional)"
          value={form.registration}
          onChange={(v) => update("registration", v)}
        />
        <FormField
          id="charity-years"
          label="Years active (optional)"
          inputMode="numeric"
          value={form.yearsActive}
          onChange={(v) => update("yearsActive", v)}
        />
        <FormField
          id="charity-notes"
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

        <button
          type="submit"
          disabled={submit.status === "submitting"}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submit.status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Add charity
        </button>
      </form>
    </div>
  );
}
