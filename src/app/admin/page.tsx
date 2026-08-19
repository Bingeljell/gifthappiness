"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { adminListCharities, type AdminCharity } from "@/lib/api";
import { useSession } from "@/lib/session";
import AddCharityForm from "./AddCharityForm";

type CharitiesState =
  | { status: "loading" }
  | { status: "loaded"; charities: AdminCharity[] }
  | { status: "error"; message: string };

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading } = useSession();
  const [charities, setCharities] = useState<CharitiesState>({ status: "loading" });

  useEffect(() => {
    if (loading) return;
    if (!user || !token) {
      router.replace("/sign-in");
      return;
    }
    if (!user.isAdmin) return;

    adminListCharities(token).then((result) => {
      setCharities(result.ok ? { status: "loaded", charities: result.data.charities } : { status: "error", message: result.error });
    });
  }, [loading, user, token, router]);

  const handleCreated = (charity: AdminCharity) => {
    setCharities((prev) => (prev.status === "loaded" ? { status: "loaded", charities: [charity, ...prev.charities] } : prev));
  };

  if (loading || !user || !token) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FFF4ED] -z-10" />
        <div className="mx-auto w-full max-w-3xl">
          <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/70 text-center">
            <ShieldAlert className="w-10 h-10 text-primary-pink mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">You don&apos;t have access to this page</h1>
            <p className="text-sm text-gray-500">This area is limited to GiftHappiness admins.</p>
          </div>
        </div>
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
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Charities</h1>
          </div>

          <div className="mt-6">
            <AddCharityForm token={token} onCreated={handleCreated} />
          </div>

          <div className="mt-8 space-y-3">
            {charities.status === "loading" && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            )}

            {charities.status === "error" && (
              <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {charities.message}
              </p>
            )}

            {charities.status === "loaded" && charities.charities.length === 0 && (
              <div className="rounded-2xl bg-[#FFF4ED] border border-gray-100 p-6 text-center">
                <p className="text-gray-600 font-semibold">No charities yet.</p>
              </div>
            )}

            {charities.status === "loaded" &&
              charities.charities.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {c.slug} &middot; {c.category} &middot; ₹{c.amount_raised.toLocaleString("en-IN")} of ₹{c.ceiling.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {c.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
