"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CalendarDays, Check, CreditCard, Heart, Loader2, ShieldCheck, Users } from "lucide-react";
import {
  getCelebration,
  getCelebrationContributions,
  submitContribution,
  type PublicCelebration,
  type PublicContribution,
} from "@/lib/api";
import { useSession } from "@/lib/session";

// The slug comes from the URL rather than a route param: this component is
// served from the /celebration/_shell static build for every /celebration/*
// path (see page.tsx), so useParams() would report "_shell", not the real one.
function slugFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  const slug = parts[1];
  if (!slug || slug === "_shell") return null;
  return decodeURIComponent(slug);
}

type DonorForm = {
  name: string;
  mobile: string;
  email: string;
  pan: string;
  amount: string;
  message: string;
  showName: boolean;
  showAmount: boolean;
  anonymous: boolean;
};

const initialDonorForm: DonorForm = {
  name: "",
  mobile: "",
  email: "",
  pan: "",
  amount: "",
  message: "",
  showName: true,
  showAmount: false,
  anonymous: false,
};


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors canonicalizeMobile in workers/src/lib/validate.ts: Indian numbers
// are 10 digits starting 6-9, with an optional +91/91/0 prefix; anything with
// another country code is accepted as international.
function isValidMobile(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+") && !cleaned.startsWith("+91")) {
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  }
  const digits = cleaned.replace(/^\+/, "");
  let local: string;
  if (digits.length === 10) local = digits;
  else if (digits.length === 12 && digits.startsWith("91")) local = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) local = digits.slice(1);
  else return false;
  return /^[6-9]\d{9}$/.test(local);
}

type DonorErrors = Partial<Record<"name" | "email" | "mobile" | "amount" | "message", string>>;

function validateDonor(donor: DonorForm): DonorErrors {
  const errors: DonorErrors = {};
  if (!donor.name.trim()) errors.name = "Please enter your name.";

  // Email required, mobile optional: email is how the confirmation and payment
  // instructions reach the donor.
  if (!donor.email.trim()) errors.email = "We need your email to send your confirmation.";
  else if (!EMAIL_PATTERN.test(donor.email.trim())) errors.email = "That doesn't look like a valid email address.";

  if (donor.mobile.trim() && !isValidMobile(donor.mobile)) {
    errors.mobile = "Enter a valid mobile number, or leave this blank.";
  }

  const amount = Number(donor.amount);
  if (!donor.amount.trim()) errors.amount = "Enter the amount you'd like to give.";
  else if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Enter an amount greater than zero.";

  if (donor.message.length > 1000) errors.message = "Please keep your message under 1000 characters.";
  return errors;
}

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; celebration: PublicCelebration };

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function relativeTime(value: string): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Contributed today";
  if (days === 1) return "Contributed yesterday";
  return `Contributed ${days} days ago`;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function CelebrationDetailClient() {
  const { user, token } = useSession();
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [contributions, setContributions] = useState<PublicContribution[]>([]);
  const [donor, setDonor] = useState<DonorForm>(initialDonorForm);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const [donorErrors, setDonorErrors] = useState<DonorErrors>({});
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);

  // Pre-fill from the signed-in account without clobbering in-progress edits.
  // Adjusting state during render (rather than in an effect) is this repo's
  // established pattern for syncing to an external value -- it also satisfies
  // the set-state-in-effect lint rule.
  if (user && user.id !== prefilledFor) {
    setPrefilledFor(user.id);
    setDonor((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      mobile: prev.mobile || user.mobile || "",
    }));
  }

  const loadContributions = useCallback(async (celebrationSlug: string) => {
    const result = await getCelebrationContributions(celebrationSlug);
    if (result.ok) setContributions(result.data.contributions);
  }, []);

  // All state updates happen inside the async body rather than directly in the
  // effect, per this repo's set-state-in-effect rule. The slug is read from
  // window here (not during render) so the prerendered shell and the hydrated
  // client agree on the initial "loading" output.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const found = slugFromPath();
      if (!found) {
        if (!cancelled) setLoad({ status: "error", message: "No celebration was specified in the link." });
        return;
      }

      const result = await getCelebration(found);
      if (cancelled) return;

      if (!result.ok) {
        setLoad({ status: "error", message: result.error });
        return;
      }

      setLoad({ status: "ready", celebration: result.data.celebration });
      loadContributions(found);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadContributions]);

  const updateDonor = <K extends keyof DonorForm>(field: K, value: DonorForm[K]) => {
    setDonor((prev) => ({ ...prev, [field]: value }));
    setDonorErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field as keyof DonorErrors];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (load.status !== "ready") return;
    const slug = load.celebration.slug;

    const found = validateDonor(donor);
    setDonorErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmit({ status: "idle" });
      return;
    }
    const amount = Number(donor.amount);

    setSubmit({ status: "submitting" });
    const result = await submitContribution(
      slug,
      {
        donorName: donor.name,
        donorMobile: donor.mobile || undefined,
        donorEmail: donor.email,
        pan: donor.pan || undefined,
        amount,
        message: donor.message || undefined,
        showName: donor.showName,
        showAmount: donor.showAmount,
        anonymous: donor.anonymous,
      },
      token ?? undefined,
    );

    if (result.ok) {
      setSubmit({ status: "success" });
      setDonor(initialDonorForm);
      setDonorErrors({});
      // Refresh so the contributor sees themselves appear immediately.
      loadContributions(slug);
    } else {
      setSubmit({ status: "error", message: result.error });
    }
  };

  if (load.status === "loading") {
    return (
      <div className="bg-creme min-h-[60vh] flex items-center justify-center">
        <p className="flex items-center gap-3 text-primary-pink font-bold">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading celebration&hellip;
        </p>
      </div>
    );
  }

  if (load.status === "error") {
    return (
      <div className="bg-creme min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 max-w-lg text-center shadow-sm">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Celebration not found</h1>
          <p className="text-gray-600 font-medium leading-relaxed mb-8">
            {load.message} It may not have been published yet, or the link may be incorrect.
          </p>
          <Link href="/charities" className="text-primary-pink font-black hover:underline">
            Browse charities instead
          </Link>
        </div>
      </div>
    );
  }

  const c = load.celebration;
  const hostName = c.host_name ?? "Your host";
  const celebrationDate = formatDate(c.celebration_date);
  const activeFrom = formatDate(c.active_from);
  const activeTill = formatDate(c.active_till);

  return (
    <div className="bg-creme">
      {c.charity_header_image_url && (
        <div className="relative w-full h-56 md:h-72 overflow-hidden">
          <Image
            src={c.charity_header_image_url}
            alt={c.charity_name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-soft-pink text-primary-pink text-xs font-bold uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-primary-pink" />
                {titleCase(c.celebration_type)}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-8">
                {hostName}&apos;s {titleCase(c.celebration_type)}
              </h1>

              {c.message && (
                <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 mb-8">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug italic">
                    &ldquo;{c.message}&rdquo;
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <Info label="Host" value={hostName} />
                <Info label="Celebration" value={titleCase(c.celebration_type)} />
                {celebrationDate && <Info label="Date" value={celebrationDate} />}
                <Info label="Charity chosen" value={c.charity_name} />
              </div>

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-4 mb-3">
                  {c.charity_logo_url && (
                    <span className="w-12 h-12 rounded-full bg-white border border-gray-200 p-1.5 flex items-center justify-center shrink-0">
                      <Image
                        src={c.charity_logo_url}
                        alt={c.charity_name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    </span>
                  )}
                  <div className="text-xs font-black text-primary-pink uppercase tracking-widest">
                    About {c.charity_name}
                  </div>
                </div>
                {c.charity_short_description && (
                  <p className="text-gray-600 font-medium leading-relaxed mb-4">{c.charity_short_description}</p>
                )}
                <Link href={`/charities/${c.charity_slug}`} className="text-primary-pink font-black hover:underline">
                  Read more about {c.charity_name}
                </Link>
              </div>

              {(activeFrom || activeTill) && (
                <div className="flex gap-4 rounded-3xl bg-soft-pink border border-primary-pink/10 p-6 text-primary-pink">
                  <CalendarDays className="w-7 h-7 shrink-0 mt-1" />
                  <div>
                    <h2 className="font-black text-lg mb-1">Contribution window</h2>
                    <p className="font-medium leading-relaxed">
                      {activeFrom && activeTill
                        ? `Please contribute between ${activeFrom} and ${activeTill}. Thank you.`
                        : activeTill
                          ? `Please contribute before ${activeTill}. Thank you.`
                          : `Contributions are open from ${activeFrom}. Thank you.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Make a contribution</h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                Tell {hostName} you&apos;re supporting {c.charity_name}. Share your details below and we&apos;ll
                email you payment instructions to complete your contribution.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Field id="donor-name" label="Name of donor" placeholder="Your name" value={donor.name} onChange={(v) => updateDonor("name", v)} error={donorErrors.name} required />
                <Field id="donor-mobile" label="Mobile number" placeholder="+91 98765 43210" inputMode="tel" value={donor.mobile} onChange={(v) => updateDonor("mobile", v)} error={donorErrors.mobile} />
                <Field id="donor-email" label="Email" placeholder="you@example.com" inputMode="email" value={donor.email} onChange={(v) => updateDonor("email", v)} error={donorErrors.email} required />
                <Field id="pan" label="PAN number if required" placeholder="Required above eligible limits" value={donor.pan} onChange={(v) => updateDonor("pan", v)} />
                <Field id="amount" label="Contribution amount" placeholder="e.g. 5000" inputMode="numeric" value={donor.amount} onChange={(v) => updateDonor("amount", v)} error={donorErrors.amount} required />
                <Field id="donor-message" label="Message (optional)" placeholder={`A note for ${hostName}`} value={donor.message} onChange={(v) => updateDonor("message", v)} />

                <fieldset className="rounded-3xl bg-gray-50 border border-gray-100 p-5 space-y-4">
                  <legend className="text-sm font-black text-gray-900 mb-3">Visibility preferences</legend>
                  <Checkbox id="show-name" label="Show my name on this celebration page" checked={donor.showName} onChange={(v) => updateDonor("showName", v)} />
                  <Checkbox id="show-amount" label="Show my contribution amount publicly" checked={donor.showAmount} onChange={(v) => updateDonor("showAmount", v)} />
                  <Checkbox id="anonymous" label="Contribute anonymously" checked={donor.anonymous} onChange={(v) => updateDonor("anonymous", v)} />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Names are visible by default and can be hidden. Amounts are always private unless you
                    explicitly choose to share yours.
                  </p>
                </fieldset>

                {submit.status === "error" && (
                  <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {submit.message}
                  </p>
                )}
                {submit.status === "success" && (
                  <p className="flex items-start gap-2 text-sm font-semibold text-green-700">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    Thank you! Check your email &mdash; we&apos;ve sent you the details to complete your contribution.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submit.status === "submitting"}
                  className="w-full py-5 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submit.status === "submitting" && <Loader2 className="w-5 h-5 animate-spin" />}
                  Contribute to {c.charity_name}
                </button>
              </form>

              <div className="mt-8 flex gap-3 text-sm text-gray-500 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-primary-pink shrink-0 mt-0.5" />
                <p>
                  GiftHappiness does not take a platform fee. Final transaction fees and receipt rules will depend on
                  the selected payment gateway and charity setup.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  People celebrating with {hostName}
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed max-w-2xl">
                  Everyone who has chosen to support {c.charity_name} for this celebration. Contributors control
                  whether their name appears.
                </p>
              </div>
              <div className="rounded-full bg-soft-pink px-5 py-2 text-sm font-black text-primary-pink whitespace-nowrap">
                {contributions.length} {contributions.length === 1 ? "contributor" : "contributors"} so far
              </div>
            </div>

            {contributions.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-10 text-center">
                <Users className="w-10 h-10 text-primary-pink/40 mx-auto mb-4" />
                <p className="text-gray-600 font-medium leading-relaxed">
                  No contributions yet. Be the first to support {c.charity_name} for {hostName}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contributions.map((contribution) => (
                  <article key={contribution.id} className="rounded-3xl bg-gray-50 border border-gray-100 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{contribution.donor_name}</h3>
                        <p className="text-sm font-semibold text-gray-500">{relativeTime(contribution.created_at)}</p>
                      </div>
                      {/* amount is null until a payment actually succeeds and the
                          donor opted in, so today this is always the private pill. */}
                      {contribution.amount != null ? (
                        <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-black text-primary-pink whitespace-nowrap">
                          ₹{Number(contribution.amount).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-black text-gray-400 whitespace-nowrap">
                          Amount private
                        </span>
                      )}
                    </div>
                    {contribution.message && (
                      <p className="text-gray-700 font-medium leading-relaxed">&ldquo;{contribution.message}&rdquo;</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
      <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-2">{label}</div>
      <div className="text-xl font-black text-gray-900">{value}</div>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  inputMode,
  value,
  onChange,
  error,
  required = false,
}: {
  id: string;
  label: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
        {label}
        {required ? (
          <span className="text-primary-pink ml-1" aria-hidden="true">*</span>
        ) : (
          <span className="text-gray-400 font-medium normal-case tracking-normal ml-2">optional</span>
        )}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all text-primary-pink placeholder:text-primary-pink/30 ${
          error
            ? "border-primary-pink focus:border-primary-pink focus:ring-4 focus:ring-primary-pink/10"
            : "border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-semibold text-primary-pink ml-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function Checkbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm font-semibold text-gray-700">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary-pink"
      />
      <span>{label}</span>
    </label>
  );
}
