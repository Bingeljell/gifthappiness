"use client";

import Link from "next/link";
import { CalendarDays, CreditCard, Heart, ShieldCheck } from "lucide-react";

export default function CelebrationPage() {
  return (
    <div className="bg-creme">
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-soft-pink text-primary-pink text-xs font-bold uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-primary-pink" />
                Celebration Page Preview
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight mb-8">
                Sarah&apos;s 50th Birthday
              </h1>

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 mb-8">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug italic">
                  &ldquo;This year, your contribution to a cause close to my heart would mean more than any gift.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <Info label="Host" value="Sarah M." />
                <Info label="Celebration" value="Birthday" />
                <Info label="Date" value="24 July 2026" />
                <Info label="Charity chosen" value="UNICEF" />
              </div>

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 mb-6">
                <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">About UNICEF</div>
                <p className="text-gray-600 font-medium leading-relaxed">
                  UNICEF works to protect children&apos;s rights and provide health, nutrition, education, and emergency support to children in need.
                </p>
              </div>

              <div className="flex gap-4 rounded-3xl bg-soft-pink border border-primary-pink/10 p-6 text-primary-pink">
                <CalendarDays className="w-7 h-7 shrink-0 mt-1" />
                <div>
                  <h2 className="font-black text-lg mb-1">Contribution window</h2>
                  <p className="font-medium leading-relaxed">
                    Please contribute between 01 July 2026 and 31 July 2026. Thank you.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary-pink flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Make a contribution</h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                This is a static donor form preview. Payment gateway details are still being finalized.
              </p>

              <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                <Field id="donor-name" label="Name of donor" placeholder="Your name" />
                <Field id="donor-mobile" label="Mobile number" placeholder="+91 98765 43210" inputMode="tel" />
                <Field id="pan" label="PAN number if required" placeholder="Required above eligible limits" />
                <Field id="amount" label="Donation amount" placeholder="e.g. 5000" inputMode="numeric" />

                <button
                  type="button"
                  disabled
                  className="w-full py-5 rounded-2xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Payment Link Pending
                </button>
              </form>

              <div className="mt-8 flex gap-3 text-sm text-gray-500 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-primary-pink shrink-0 mt-0.5" />
                <p>
                  GiftHappiness does not take a platform fee. Final transaction fees and receipt rules will depend on the selected payment gateway and charity setup.
                </p>
              </div>

              <Link href="/create" className="mt-8 inline-block text-primary-pink font-black hover:underline">
                Create another celebration
              </Link>
            </div>
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
}: {
  id: string;
  label: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full px-5 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink placeholder:text-primary-pink/30"
      />
    </div>
  );
}
