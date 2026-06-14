"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Heart, ImagePlus, ShieldCheck } from "lucide-react";

const celebrations = [
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

const charities = [
  "UNICEF (Children)",
  "WWF (Environment)",
  "Medecins Sans Frontieres (Health)",
  "Save the Children",
  "Red Cross",
];

export default function CreateCelebration() {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFF4ED] -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/50 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD9C8]/40 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="mx-auto w-full max-w-5xl">
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

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Start a celebration
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Create the details for a celebration page that friends and family can use to contribute to the charity you choose.
              </p>
              <div className="rounded-3xl bg-[#FFF4ED] border border-gray-100 p-6 space-y-5">
                <div className="flex gap-4">
                  <Calendar className="w-6 h-6 text-primary-pink shrink-0 mt-1" />
                  <div>
                    <h2 className="font-black text-gray-900 mb-1">Static preview form</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      This version collects no data and sends nothing anywhere. Backend, OTP, image upload, and payment details are still pending product decisions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary-pink shrink-0 mt-1" />
                  <div>
                    <h2 className="font-black text-gray-900 mb-1">Charity-first flow</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      The page should make the chosen cause, active donation dates, and personal message clear before any payment step is added.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="host-name" label="Name of the host" placeholder="e.g. Sarah Mehta" />
                <Field id="mobile" label="Mobile number" placeholder="+91 98765 43210" inputMode="tel" />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Street, city, state, PIN code"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <Field id="otp" label="OTP verification" placeholder="Verification will be added later" inputMode="numeric" />
                <button
                  type="button"
                  disabled
                  className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed"
                >
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
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 appearance-none"
                  >
                    {celebrations.map((celebration) => (
                      <option key={celebration}>{celebration}</option>
                    ))}
                  </select>
                </div>
                <Field id="celebration-date" label="Date of celebration" type="date" />
              </div>

              <div className="space-y-2">
                <label htmlFor="charity" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Charity selected
                </label>
                <select
                  id="charity"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 appearance-none"
                >
                  {charities.map((charity) => (
                    <option key={charity}>{charity}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="active-from" label="Donation page active from" type="date" />
                <Field id="active-till" label="Donation page active till" type="date" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Personal message for friends/family
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell your friends and family why this cause matters to you."
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="picture" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Picture if applicable
                </label>
                <label htmlFor="picture" className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-500 cursor-pointer">
                  <ImagePlus className="w-5 h-5" />
                  <span>Upload placeholder</span>
                </label>
                <input id="picture" type="file" accept="image/*" className="sr-only" />
              </div>

              <button
                type="submit"
                className="w-full py-5 rounded-2xl bg-primary-pink text-white font-bold text-lg hover:bg-primary-pink/90 transition-all shadow-xl shadow-primary-pink/20 mt-4 flex items-center justify-center gap-2"
              >
                Create Link And Celebration Page
                <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-gray-500">
                This static prototype does not submit data. View the donor page template at{" "}
                <Link href="/celebration" className="underline font-bold text-primary-pink">
                  /celebration
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  inputMode,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
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
        className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
