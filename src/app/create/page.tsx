"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImagePlus,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { confirmVerification, createCelebration, getCharities, requestVerification, type Charity } from "@/lib/api";

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
  email: string;
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
  email: "",
  mobile: "",
  address: "",
  celebrationType: celebrationTypes[0],
  celebrationDate: "",
  charityName: "",
  activeFrom: "",
  activeTill: "",
  message: "",
  pictureName: "",
};

type CharitiesState =
  | { status: "loading" }
  | { status: "loaded"; charities: Charity[] }
  | { status: "error"; message: string };

type VerificationState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "verifying" }
  | { status: "verified" }
  | { status: "error"; message: string };

type PublishState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; slug: string }
  | { status: "error"; message: string };

export default function CreateCelebration() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [verification, setVerification] = useState<VerificationState>({ status: "idle" });
  const [verificationCode, setVerificationCode] = useState("");
  const [publish, setPublish] = useState<PublishState>({ status: "idle" });
  const [charities, setCharities] = useState<CharitiesState>({ status: "loading" });

  useEffect(() => {
    getCharities().then((result) => {
      setCharities(result.ok ? { status: "loaded", charities: result.data.charities } : { status: "error", message: result.error });
    });
  }, []);

  // Default the picker to the first loaded charity, once, without
  // clobbering a choice the host already made (adjusting state during
  // render, per React's guidance -- no effect needed, matches the pattern
  // already used on /celebration for donor autofill).
  if (charities.status === "loaded" && !form.charityName && charities.charities.length > 0) {
    setForm((prev) => ({ ...prev, charityName: charities.charities[0].name }));
  }

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const sendVerificationEmail = async () => {
    if (!form.email) {
      setVerification({ status: "error", message: "Enter an email address first" });
      return;
    }
    setVerification({ status: "sending" });
    const result = await requestVerification("email", form.email, "host_signup");
    setVerification(result.ok ? { status: "sent" } : { status: "error", message: result.error });
  };

  const confirmVerificationCode = async () => {
    if (!verificationCode) return;
    setVerification({ status: "verifying" });
    const result = await confirmVerification("email", form.email, "host_signup", verificationCode);
    if (result.ok && result.data.verified) {
      setVerification({ status: "verified" });
    } else {
      setVerification({ status: "error", message: result.ok ? "Verification failed" : result.error });
    }
  };

  const publishCelebration = async () => {
    const charity = charities.status === "loaded" ? charities.charities.find((c) => c.name === form.charityName) : undefined;
    if (!charity) {
      setPublish({ status: "error", message: "Choose a charity before publishing" });
      return;
    }
    setPublish({ status: "submitting" });
    const result = await createCelebration({
      hostName: form.hostName || "Anonymous host",
      hostEmail: form.email,
      hostMobile: form.mobile,
      hostAddress: form.address || undefined,
      celebrationType: form.celebrationType,
      celebrationDate: form.celebrationDate || undefined,
      charitySlug: charity.slug,
      activeFrom: form.activeFrom || undefined,
      activeTill: form.activeTill || undefined,
      message: form.message || undefined,
    });
    setPublish(result.ok ? { status: "success", slug: result.data.celebration.slug } : { status: "error", message: result.error });
  };

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
            This form calls the live GiftHappiness API. Image upload and payment details are still pending product
            decisions.
          </p>

          {step === 0 && (
            <StepHostOccasion
              form={form}
              update={update}
              verification={verification}
              verificationCode={verificationCode}
              onVerificationCodeChange={setVerificationCode}
              onSendVerification={sendVerificationEmail}
              onConfirmVerification={confirmVerificationCode}
            />
          )}
          {step === 1 && <StepCauseAndPage form={form} update={update} charities={charities} />}
          {step === 2 && <StepPreviewAndPublish form={form} publish={publish} charities={charities} />}

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
                onClick={publishCelebration}
                disabled={publish.status === "submitting" || publish.status === "success"}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {publish.status === "submitting" && <Loader2 className="w-5 h-5 animate-spin" />}
                {publish.status === "success" ? "Submitted" : "Submit for review"}
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
  verification,
  verificationCode,
  onVerificationCodeChange,
  onSendVerification,
  onConfirmVerification,
}: {
  form: FormState;
  update: (field: keyof FormState, value: string) => void;
  verification: VerificationState;
  verificationCode: string;
  onVerificationCodeChange: (value: string) => void;
  onSendVerification: () => void;
  onConfirmVerification: () => void;
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

      <div className="rounded-2xl bg-[#FFF4ED] border border-gray-100 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <Field
            id="email"
            label="Email (used to verify you)"
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            disabled={verification.status === "verified"}
          />
          <button
            type="button"
            onClick={onSendVerification}
            disabled={verification.status === "sending" || verification.status === "verified"}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verification.status === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
            {verification.status === "verified" ? (
              <>
                <Check className="w-4 h-4" /> Verified
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" /> Verify Email
              </>
            )}
          </button>
        </div>

        {(verification.status === "sent" || verification.status === "verifying") && (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label htmlFor="verification-code" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                Verification code
              </label>
              <input
                id="verification-code"
                inputMode="numeric"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => onVerificationCodeChange(e.target.value)}
                className="w-full mt-2 px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={onConfirmVerification}
              disabled={verification.status === "verifying"}
              className="px-6 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-colors disabled:opacity-60"
            >
              {verification.status === "verifying" ? "Confirming..." : "Confirm"}
            </button>
          </div>
        )}

        {verification.status === "error" && (
          <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {verification.message}
          </p>
        )}
        {verification.status === "sent" && (
          <p className="text-xs text-gray-500">Check your email for the code. It expires in 15 minutes.</p>
        )}
        <p className="text-xs text-gray-400">
          Mobile OTP verification is deferred for now; email is the active verification path.
        </p>
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
  charities,
}: {
  form: FormState;
  update: (field: keyof FormState, value: string) => void;
  charities: CharitiesState;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="charity" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
          Charity selected
        </label>
        {charities.status === "loading" && (
          <div className="flex items-center gap-2 text-gray-500 px-1 py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading charities...
          </div>
        )}
        {charities.status === "error" && (
          <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink px-1 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {charities.message}
          </p>
        )}
        {charities.status === "loaded" && (
          <select
            id="charity"
            value={form.charityName}
            onChange={(e) => update("charityName", e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 appearance-none"
          >
            {charities.charities.map((charity) => (
              <option key={charity.slug} value={charity.name}>
                {charity.name} ({charity.category})
              </option>
            ))}
          </select>
        )}
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

function StepPreviewAndPublish({
  form,
  publish,
  charities,
}: {
  form: FormState;
  publish: PublishState;
  charities: CharitiesState;
}) {
  const charity = charities.status === "loaded" ? charities.charities.find((c) => c.name === form.charityName) : undefined;
  const displayName = form.hostName || "Your name";
  const demoUrl = "https://gifthappiness.example/celebration/demo";

  return (
    <div className="space-y-6">
      {publish.status === "success" && (
        <div className="flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 p-5 text-green-800">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">
            Submitted as <code>{publish.slug}</code>. A GiftHappiness admin needs to review and approve it before the page goes live.
          </p>
        </div>
      )}
      {publish.status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl bg-primary-pink/5 border border-primary-pink/20 p-5 text-primary-pink">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{publish.message}</p>
        </div>
      )}

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
            <PreviewField label="Charity" value={charity?.name ?? "Not selected"} />
            <PreviewField label="Active from" value={form.activeFrom || "Not set"} />
            <PreviewField label="Active till" value={form.activeTill || "Not set"} />
          </div>

          {charity && (
            <div className="rounded-2xl bg-white border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed">
              Supporting {charity.name} ({charity.category}). {charity.short_description}
            </div>
          )}
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
