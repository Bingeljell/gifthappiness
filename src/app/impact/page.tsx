"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, HandHeart, Heart, Loader2, Sparkles } from "lucide-react";
import { getCharities, type Charity } from "@/lib/api";
import { sdgDescriptions } from "@/lib/sdgs";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

type CharitiesState =
  | { status: "loading" }
  | { status: "loaded"; charities: Charity[] }
  | { status: "error"; message: string };

export default function ImpactPage() {
  const [charities, setCharities] = useState<CharitiesState>({ status: "loading" });

  useEffect(() => {
    getCharities().then((result) => {
      setCharities(result.ok ? { status: "loaded", charities: result.data.charities } : { status: "error", message: result.error });
    });
  }, []);

  const list = charities.status === "loaded" ? charities.charities : [];
  const totalRaised = list.reduce((sum, charity) => sum + charity.amount_raised, 0);
  const activeCount = list.filter((charity) => charity.status === "active").length;
  const sdgCodes = Array.from(new Set(list.flatMap((charity) => charity.sdgs))).sort();

  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
              <HandHeart className="w-4 h-4" />
              Impact
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Where the money goes.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              GiftHappiness does not take a platform fee. Every charity&apos;s total and status is shown here so it
              is always clear where contributions have gone.
            </p>
          </div>

          {charities.status === "loading" && (
            <div className="flex items-center gap-2 text-gray-500 justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading impact data...
            </div>
          )}

          {charities.status === "error" && (
            <p className="flex items-start justify-center gap-2 text-sm font-semibold text-primary-pink py-16">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {charities.message}
            </p>
          )}

          {charities.status === "loaded" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <StatCard label="Total raised across charities" value={formatInr(totalRaised)} />
                <StatCard label="Charities featured" value={`${list.length}`} />
                <StatCard label="Currently active" value={`${activeCount}`} />
              </div>

              <div className="rounded-[40px] bg-white border border-gray-100 p-8 md:p-10 mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-primary-pink" />
                  <h2 className="text-2xl font-black text-gray-900">Connected to the UN Sustainable Development Goals</h2>
                </div>
                <p className="text-gray-600 leading-relaxed font-medium mb-8">
                  Every approved charity maps to one or more UN SDGs, so a personal celebration connects to a wider
                  global framework.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sdgCodes.map((sdg) => (
                    <div key={sdg} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                      <div className="text-sm font-black text-primary-pink mb-1">{sdg}</div>
                      <p className="text-gray-600 font-medium text-sm leading-relaxed">{sdgDescriptions[sdg]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-8">Charity totals and status</h2>
              <div className="overflow-x-auto rounded-[32px] border border-gray-100 bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                      <th className="px-6 py-5">Charity</th>
                      <th className="px-6 py-5">Category</th>
                      <th className="px-6 py-5">Amount raised</th>
                      <th className="px-6 py-5">Ceiling</th>
                      <th className="px-6 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((charity) => (
                      <tr key={charity.slug} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-5">
                          <Link href={`/charities/${charity.slug}`} className="font-black text-gray-900 hover:text-primary-pink transition-colors">
                            {charity.name}
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-gray-500 font-semibold">{charity.category}</td>
                        <td className="px-6 py-5 text-gray-900 font-bold">{formatInr(charity.amount_raised)}</td>
                        <td className="px-6 py-5 text-gray-500 font-semibold">{formatInr(charity.ceiling)}</td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-soft-pink px-3 py-1 text-xs font-black text-primary-pink uppercase tracking-widest">
                            {charity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="mt-16 text-center">
            <Link href="/create" className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary-pink text-white font-black hover:bg-primary-pink/90 transition-colors">
              <Heart className="w-5 h-5 fill-white" />
              Start a Celebration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[32px] bg-white border border-gray-100 p-8">
      <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{label}</div>
      <div className="text-4xl font-black text-gray-900">{value}</div>
    </div>
  );
}
