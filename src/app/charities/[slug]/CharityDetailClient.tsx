"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AlertCircle, ExternalLink, Heart, Loader2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getCharity, type Charity } from "@/lib/api";
import { sdgDescriptions } from "@/lib/sdgs";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

type CharityState =
  | { status: "loading" }
  | { status: "loaded"; charity: Charity }
  | { status: "not-found" }
  | { status: "error"; message: string };

export default function CharityDetailClient() {
  const [state, setState] = useState<CharityState>({ status: "loading" });

  useEffect(() => {
    async function resolveCharity() {
      const slug = window.location.pathname.replace(/^\/charities\//, "").replace(/\/$/, "");
      if (!slug || slug === "_shell") {
        setState({ status: "not-found" });
        return;
      }

      const result = await getCharity(slug);
      setState(result.ok ? { status: "loaded", charity: result.data.charity } : { status: "error", message: result.error });
    }

    resolveCharity();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-xl font-black text-gray-900">Charity not found.</p>
        <Link href="/charities" className="text-primary-pink font-bold hover:underline">
          &larr; Back to all charities
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary-pink">
          <AlertCircle className="w-4 h-4" />
          {state.message}
        </p>
        <Link href="/charities" className="text-primary-pink font-bold hover:underline">
          &larr; Back to all charities
        </Link>
      </div>
    );
  }

  const { charity } = state;

  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <Link href="/charities" className="text-sm font-bold text-primary-pink hover:underline mb-10 inline-block">
            &larr; Back to all charities
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-soft-pink text-primary-pink flex items-center justify-center font-black">
                  {charity.category.slice(0, 2).toUpperCase()}
                </div>
                <span className="rounded-full bg-gray-50 border border-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-pink">
                  {charity.status}
                </span>
              </div>

              <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{charity.category}</div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                {charity.name}
              </h1>

              {charity.website && (
                <a
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-pink hover:underline mb-8"
                >
                  Visit their website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="space-y-5 mb-10">
                <InfoBlock icon={<Sparkles className="w-5 h-5" />} label="What they do" value={charity.what_they_do} list />
                <InfoBlock icon={<Users className="w-5 h-5" />} label="Who they help" value={charity.who_they_help} list />
                <InfoBlock icon={<ShieldCheck className="w-5 h-5" />} label="Why we selected them" value={charity.why_selected} list />
                {charity.impact_example && <InfoBlock label="Impact example" value={charity.impact_example} list />}
              </div>

              {charity.sdgs.length > 0 && (
                <div className="mb-8">
                  <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-4">Relevant SDGs</div>
                  <div className="flex flex-wrap gap-3">
                    {charity.sdgs.map((sdg) => (
                      <span key={sdg} className="rounded-full bg-soft-pink px-4 py-2 text-sm font-bold text-primary-pink">
                        {sdg}
                        {sdgDescriptions[sdg] ? ` — ${sdgDescriptions[sdg]}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {charity.registration && <InfoBlock label="Registration" value={charity.registration} />}
                {charity.years_active != null && <InfoBlock label="Years active" value={`${charity.years_active}+ years`} />}
                {charity.verification_notes && <InfoBlock label="Verification notes" value={charity.verification_notes} />}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Raised through GiftHappiness</h2>

              <div className="mb-8">
                <span className="text-3xl font-black text-gray-900">{formatInr(charity.amount_raised)}</span>
              </div>

              <Link
                href="/create"
                className="w-full flex items-center justify-center px-6 py-4 rounded-2xl bg-primary-pink text-white font-black hover:bg-primary-pink/90 transition-colors mb-4"
              >
                Choose {charity.name} For My Celebration
              </Link>

              <p className="text-xs text-gray-500 leading-relaxed">
                GiftHappiness does not take a platform fee &mdash; contributions go directly to the cause.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ icon, label, value, list }: { icon?: ReactNode; label: string; value: string; list?: boolean }) {
  const items = list ? value.split("\n").map((line) => line.replace(/^[-•\d.)\s]+/, "").trim()).filter(Boolean) : null;

  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
      <div className="flex items-center gap-2 text-xs font-black text-primary-pink uppercase tracking-widest mb-3">
        {icon}
        {label}
      </div>
      {items ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2 text-gray-700 font-semibold leading-relaxed">
              <span className="text-primary-pink shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 font-semibold leading-relaxed">{value}</p>
      )}
    </div>
  );
}
