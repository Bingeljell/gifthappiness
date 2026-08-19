"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Gift, Loader2, PartyPopper } from "lucide-react";
import { getMyCelebrations, getMyContributions, type MyCelebration, type MyContribution } from "@/lib/api";
import { useSession } from "@/lib/session";

type CelebrationsState =
  | { status: "loading" }
  | { status: "loaded"; celebrations: MyCelebration[] }
  | { status: "error"; message: string };

type ContributionsState =
  | { status: "loading" }
  | { status: "loaded"; contributions: MyContribution[] }
  | { status: "error"; message: string };

function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, token, loading } = useSession();
  const [celebrations, setCelebrations] = useState<CelebrationsState>({ status: "loading" });
  const [contributions, setContributions] = useState<ContributionsState>({ status: "loading" });

  useEffect(() => {
    if (loading) return;
    if (!user || !token) {
      router.replace("/sign-in");
      return;
    }

    getMyCelebrations(token).then((result) => {
      setCelebrations(result.ok ? { status: "loaded", celebrations: result.data.celebrations } : { status: "error", message: result.error });
    });

    getMyContributions(token).then((result) => {
      setContributions(result.ok ? { status: "loaded", contributions: result.data.contributions } : { status: "error", message: result.error });
    });
  }, [loading, user, token, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFF4ED] -z-10" />
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/70">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My celebrations</h1>
              <p className="text-sm text-gray-500">{user.name || user.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {celebrations.status === "loading" && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            )}

            {celebrations.status === "error" && (
              <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {celebrations.message}
              </p>
            )}

            {celebrations.status === "loaded" && celebrations.celebrations.length === 0 && (
              <div className="rounded-2xl bg-[#FFF4ED] border border-gray-100 p-6 text-center">
                <p className="text-gray-600 font-semibold">You haven&apos;t created a celebration yet.</p>
                <Link
                  href="/create"
                  className="inline-block mt-4 px-6 py-3 rounded-full bg-primary-pink text-sm font-bold text-white hover:bg-primary-pink/90 transition-all"
                >
                  Start a celebration
                </Link>
              </div>
            )}

            {celebrations.status === "loaded" &&
              celebrations.celebrations.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{c.celebration_type}</p>
                    <p className="text-sm text-gray-500">{c.celebration_date || "No date set"}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {c.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-8 bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/70">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Your past donations</h1>
          </div>

          <div className="mt-8 space-y-3">
            {contributions.status === "loading" && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            )}

            {contributions.status === "error" && (
              <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {contributions.message}
              </p>
            )}

            {contributions.status === "loaded" && contributions.contributions.length === 0 && (
              <div className="rounded-2xl bg-[#FFF4ED] border border-gray-100 p-6 text-center">
                <p className="text-gray-600 font-semibold">You haven&apos;t made a donation yet.</p>
              </div>
            )}

            {contributions.status === "loaded" &&
              contributions.contributions.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{c.celebration?.celebration_type ?? "A celebration"}</p>
                    <p className="text-sm text-gray-500">
                      {formatAmount(c.amount)} &middot; {new Date(c.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {c.payment_status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
