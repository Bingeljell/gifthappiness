"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Loader2, PartyPopper } from "lucide-react";
import { getCelebrations, type PublicCelebration } from "@/lib/api";

// Plural /celebrations is the public directory; singular /celebration/[slug]
// is one celebration's own page. Distinct paths, so the /celebration/*
// rewrite in public/_redirects doesn't touch this route.
type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; celebrations: PublicCelebration[] };

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function CelebrationsPage() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getCelebrations();
      if (cancelled) return;
      setState(
        result.ok
          ? { status: "loaded", celebrations: result.data.celebrations }
          : { status: "error", message: result.error },
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-creme">
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
              <PartyPopper className="w-4 h-4" />
              Celebrations
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Celebrations happening now
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Every one of these is someone asking for a donation instead of a gift. Find one to support, or{" "}
              <Link href="/create" className="underline font-bold text-primary-pink">
                start your own
              </Link>
              .
            </p>
          </div>

          {state.status === "loading" && (
            <p className="flex items-center gap-3 text-primary-pink font-bold">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading celebrations&hellip;
            </p>
          )}

          {state.status === "error" && (
            <div className="rounded-3xl bg-white border border-gray-100 p-8 max-w-xl">
              <p className="text-gray-600 font-medium leading-relaxed">{state.message}</p>
            </div>
          )}

          {state.status === "loaded" && state.celebrations.length === 0 && (
            <div className="rounded-[40px] bg-white border border-gray-100 p-12 text-center max-w-2xl mx-auto">
              <Heart className="w-10 h-10 text-primary-pink/40 mx-auto mb-5" />
              <h2 className="text-2xl font-black text-gray-900 mb-3">No celebrations just yet</h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                Be the first. Create a celebration and invite your guests to support a charity instead of buying gifts.
              </p>
              <Link
                href="/create"
                className="inline-block px-8 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20"
              >
                Start a celebration
              </Link>
            </div>
          )}

          {state.status === "loaded" && state.celebrations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.celebrations.map((c) => {
                const date = formatDate(c.celebration_date);
                return (
                  <Link
                    key={c.id}
                    href={`/celebration/${c.slug}`}
                    className="group rounded-[32px] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                  >
                    {c.charity_header_image_url ? (
                      <div className="relative w-full h-36">
                        <Image src={c.charity_header_image_url} alt={c.charity_name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="w-full h-36 bg-soft-pink flex items-center justify-center">
                        <Heart className="w-8 h-8 text-primary-pink/40 fill-primary-pink/20" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs font-black text-primary-pink uppercase tracking-widest mb-2">
                        {titleCase(c.celebration_type)}
                      </p>
                      <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary-pink transition-colors">
                        {c.host_name ?? "A celebration"}
                      </h2>
                      {date && <p className="text-sm font-semibold text-gray-500 mb-4">{date}</p>}

                      {c.message && (
                        <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-3 mb-5">
                          &ldquo;{c.message}&rdquo;
                        </p>
                      )}

                      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                        {c.charity_logo_url && (
                          <span className="w-9 h-9 rounded-full bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0">
                            <Image src={c.charity_logo_url} alt={c.charity_name} width={28} height={28} className="object-contain w-full h-full" unoptimized />
                          </span>
                        )}
                        <span className="text-sm font-bold text-gray-700 truncate">{c.charity_name}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
