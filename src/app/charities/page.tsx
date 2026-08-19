"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Heart, Loader2, ShieldCheck } from "lucide-react";
import { getCharities, type Charity } from "@/lib/api";

const criteria = [
  "Registered NGO or charity.",
  "Minimum three years of existence.",
  "No relationship with GiftHappiness promoters.",
  "Rotated out after a predetermined contribution limit.",
];

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

type CharitiesState =
  | { status: "loading" }
  | { status: "loaded"; charities: Charity[] }
  | { status: "error"; message: string };

export default function CharitiesPage() {
  const [charities, setCharities] = useState<CharitiesState>({ status: "loading" });

  useEffect(() => {
    getCharities().then((result) => {
      setCharities(result.ok ? { status: "loaded", charities: result.data.charities } : { status: "error", message: result.error });
    });
  }, []);

  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
              <Heart className="w-4 h-4 fill-primary-pink" />
              Charity Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Charities families can celebrate with.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              Every charity below has been vetted against our selection criteria before joining the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
            {criteria.map((item) => (
              <div key={item} className="bg-white border border-gray-100 rounded-3xl p-6">
                <ShieldCheck className="w-7 h-7 text-primary-pink mb-4" />
                <p className="text-gray-700 font-bold leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {charities.status === "loading" && (
            <div className="flex items-center gap-2 text-gray-500 justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading charities...
            </div>
          )}

          {charities.status === "error" && (
            <p className="flex items-start justify-center gap-2 text-sm font-semibold text-primary-pink py-16">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {charities.message}
            </p>
          )}

          {charities.status === "loaded" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {charities.charities.map((charity) => (
                <Link
                  key={charity.slug}
                  href={`/charities/${charity.slug}`}
                  className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 block"
                >
                  <div className="flex items-start justify-between gap-4 mb-7">
                    <div className="w-14 h-14 rounded-full bg-soft-pink text-primary-pink flex items-center justify-center font-black text-sm">
                      {charity.category.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary-pink">
                      {charity.status}
                    </span>
                  </div>
                  <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{charity.category}</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-4">{charity.name}</h2>
                  <p className="text-gray-600 font-medium leading-relaxed mb-6">{charity.short_description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {charity.sdgs.map((sdg) => (
                      <span key={sdg} className="rounded-full bg-soft-pink px-3 py-1 text-xs font-black text-primary-pink">
                        {sdg}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600 font-semibold">
                    {formatInr(charity.amount_raised)} raised of {formatInr(charity.ceiling)} ceiling
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/create" className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary-pink text-white font-black hover:bg-primary-pink/90 transition-colors">
              Start a Celebration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
