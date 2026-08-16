"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImagePlus,
  ShieldCheck,
} from "lucide-react";
import { charities } from "@/lib/charities";

const celebrationTypes = [
  "Birthday",
  "Wedding",
  "Engagement",
  "Anniversary",
  "House warming",
  "Baby shower",
  "Naming ceremony",
  "Baptism",
  "Promotion",
  "Other",
];

const steps = [
  { title: "Host & Occasion", desc: "Who is celebrating, and what." },
  { title: "Cause & Page", desc: "Pick a charity and shape the page." },
  { title: "Preview & Publish", desc: "Check the page, then publish." },
];

type FormState = {
  hostName: string;
  mobile: string;
  address: string;
  celebrationType: string;
  celebrationDate: string;
  charityName: string;
  activeFrom: string;
  activeTill: string;
  message: string;
  pictureName: string;
};

const initialForm: FormState = {
  hostName: "",
  mobile: "",
  address: "",
  celebrationType: celebrationTypes[0],
  celebrationDate: "",
  charityName: charities[0].name,
  activeFrom: "",
  activeTill: "",
  message: "",
  pictureName: "",
};

export default function CreateCelebration() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFF4ED] -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/50 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD9C8]/40 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/70">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-brand text-xl font-bold tracking-tight">
              <span className="text-gray-900">Gift</span>
              <span className="text-primary-pink">Happiness</span>
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, index) => (
              <div key={s.title} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-sm transition-colors ${
                      index < step
                        ? "bg-primary-pink text-white"
                        : index === step
                        ? "bg-primary-pink text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {index < step ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-sm font-black ${index <= step ? "text-gray-900" : "text-gray-400"}`}>
                      {s.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full ${index < step ? "bg-primary-pink" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-8">
            This static prototype collects no data and sends nothing anywhere. Backend, OTP, image upload, and
            payment details are still pending product decisions.
          </p>

          {step === 0 && <StepHostOccasion form={form} update={update} />}
          {step === 1 && <StepCauseAndPage form={form} update={update} />}
          {step === 2 && <StepPreviewAndPublish form={form} />}

          <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-500 disabled:opacity-0 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed"
                title="Publishing is not available yet on this static prototype"
              >
                Publish (Coming Soon)
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            View the static donor-facing template at{" "}
            <Link href="/celebration" className="underline font-bold text-primary-pink">
              /celebration
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function StepHostOccasion({
  form,
  update,
}: {
  form: FormState;
  update: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          id="host-name"
          label="Name of the host"
          placeholder="e.g. Sarah Mehta"
          value={form.hostName}
          onChange={(v) => update("hostName", v)}
        />
        <Field
          id="mobile"
          label="Mobile number"
          placeholder="+91 98765 43210"
          inputMode="tel"
          value={form.mobile}
          onChange={(v) => update("mobile", v)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
          Address
        </label>
        <textarea
          id="address"
          rows={3}
          placeholder="Street, city, state, PIN code"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
        <Field id="otp" label="OTP verification" placeholder="Verification will be added later" inputMode="numeric" value="" onChange={() => {}} disabled />
        <button type="button" disabled className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed">
          Verify OTP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="celebration" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
            Celebration
          </label>
          <select
            id="celebration"
            value={form.celebrationType}
            onChange={(e) => update("celebrationType", e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 appearance-none"
          >
            {celebrationTypes.map((celebration) => (
              <option key={celebration}>{celebration}</option>
            ))}
          </select>
        </div>
        <Field
          id="celebration-date"
          label="Date of celebration"
          type="date"
          value={form.celebrationDate}
          onChange={(v) => update("celebrationDate", v)}
        />
      </div>
    </div>
  );
}

function StepCauseAndPage({
  form,
  update,
}: {
  form: FormState;
  update: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="charity" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
          Charity selected
        </label>
        <select
          id="charity"
          value={form.charityName}
          onChange={(e) => update("charityName", e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 appearance-none"
        >
          {charities.map((charity) => (
            <option key={charity.slug} value={charity.name}>
              {charity.name} ({charity.category})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field id="active-from" label="Donation page active from" type="date" value={form.activeFrom} onChange={(v) => update("activeFrom", v)} />
        <Field id="active-till" label="Donation page active till" type="date" value={form.activeTill} onChange={(v) => update("activeTill", v)} />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
          Personal message for friends/family
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Tell your friends and family why this cause matters to you."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="picture" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
          Picture if applicable
        </label>
        <label htmlFor="picture" className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-500 cursor-pointer">
          <ImagePlus className="w-5 h-5" />
          <span>{form.pictureName || "Upload placeholder"}</span>
        </label>
        <input
          id="picture"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => update("pictureName", e.target.files?.[0]?.name ?? "")}
        />
      </div>
    </div>
  );
}

function StepPreviewAndPublish({ form }: { form: FormState }) {
  const charity = charities.find((c) => c.name === form.charityName) ?? charities[0];
  const displayName = form.hostName || "Your name";
  const demoUrl = "https://gifthappiness.example/celebration/demo";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div className="rounded-[32px] bg-gray-50 border border-gray-100 p-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-soft-pink text-primary-pink text-xs font-bold uppercase tracking-widest">
          <Calendar className="w-4 h-4" />
          Celebration Page Preview
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
          {displayName}&apos;s {form.celebrationType || "Celebration"}
        </h2>

        {form.message && (
          <p className="text-lg font-bold text-gray-900 italic mb-6 leading-snug">&ldquo;{form.message}&rdquo;</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <PreviewField label="Date" value={form.celebrationDate || "Not set"} />
          <PreviewField label="Charity" value={charity.name} />
          <PreviewField label="Active from" value={form.activeFrom || "Not set"} />
          <PreviewField label="Active till" value={form.activeTill || "Not set"} />
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed">
          Supporting {charity.name} ({charity.category}). {charity.shortDescription}
        </div>
      </div>

      <div className="rounded-[32px] bg-white border border-gray-100 p-6 flex flex-col items-center text-center">
        <ShieldCheck className="w-6 h-6 text-primary-pink mb-3" />
        <h3 className="font-black text-gray-900 mb-2">Share via QR</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Demo QR only &mdash; publishing and a real per-celebration link are not live yet.
        </p>
        <div className="p-3 bg-white border border-gray-100 rounded-2xl">
          <QRCodeSVG value={demoUrl} size={140} />
        </div>
        <p className="text-[11px] text-gray-400 mt-4 break-all">{demoUrl}</p>
      </div>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-4">
      <div className="text-[11px] font-black text-primary-pink uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  inputMode,
  value,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-60"
      />
    </div>
  );
}
