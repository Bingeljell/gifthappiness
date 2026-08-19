"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Gift, Heart, Loader2, Quote, ShieldCheck, Share2 } from "lucide-react";
import { getCharities, type Charity } from "@/lib/api";

const steps = [
  {
    step: "01",
    title: "Create Your Celebration",
    desc: "Set up your birthday, wedding, anniversary, or any occasion. Add a personal message and choose the date.",
    icon: <Gift className="w-8 h-8 text-white" />,
  },
  {
    step: "02",
    title: "Choose a Charity",
    desc: "Pick a cause close to your heart from our curated list of trusted charities across health, environment, children, and more.",
    icon: <Heart className="w-8 h-8 text-white" />,
  },
  {
    step: "03",
    title: "Share with Friends",
    desc: "Send your celebration page to guests. They contribute any amount directly to the charity, and everyone gets a warm thank-you.",
    icon: <Share2 className="w-8 h-8 text-white" />,
  },
];

const criteria = [
  "Registered NGO or charity.",
  "Minimum three years of existence.",
  "No relationship with the promoters of GiftHappiness.",
];

const contributorMessages = [
  {
    name: "Ananya R.",
    celebration: "Aarav's birthday",
    charity: "UNICEF",
    message: "Such a thoughtful way to celebrate. Happy birthday, Aarav. This gift feels meaningful.",
  },
  {
    name: "Rohan S.",
    celebration: "Meera and Kabir's wedding",
    charity: "WWF",
    message: "Wishing you both a beautiful life together. Loved contributing to a cause you care about.",
  },
  {
    name: "Anonymous contributor",
    celebration: "Nisha's anniversary",
    charity: "Save the Children",
    message: "Thank you for turning a personal milestone into something that helps others.",
  },
];

type FeaturedState =
  | { status: "loading" }
  | { status: "loaded"; charities: Charity[] }
  | { status: "error"; message: string };

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedState>({ status: "loading" });

  useEffect(() => {
    getCharities().then((result) => {
      setFeatured(result.ok ? { status: "loaded", charities: result.data.charities.slice(0, 3) } : { status: "error", message: result.error });
    });
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative pt-24 pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[#FFF4ED] -z-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD9C8]/60 to-transparent -z-20" />

        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[12%] left-[8%] w-12 h-12 rounded-full bg-primary-pink/15" />
          <div className="absolute top-[18%] right-[12%] w-10 h-10 rounded-full bg-accent-pink/20" />
          <div className="absolute top-[55%] left-[5%] w-16 h-16 rounded-full bg-primary-pink/10" />
          <div className="absolute top-[45%] right-[5%] w-14 h-14 rounded-full bg-primary-pink/15" />
          <div className="absolute bottom-[20%] left-[20%] w-8 h-8 rounded-full bg-accent-pink/20" />
          <div className="absolute bottom-[15%] right-[25%] w-12 h-12 rounded-full bg-primary-pink/15" />
          <div className="bg-dots absolute inset-0 opacity-[0.08]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            Simple And Meaningful
          </div>
          <h1 className="font-serif font-bold text-6xl md:text-8xl text-gray-900 mb-8 leading-[1] tracking-tight">
            <span>Celebrate</span> with <br />
            <span className="relative inline-block mt-2 text-primary-pink">
              Purpose
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C30 2 170 2 198 6" stroke="#FF2D55" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-medium">
            For your birthday, wedding, or anniversary, invite friends to donate to a charity you love instead of giving gifts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/create" className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary-pink text-white font-bold text-lg hover:bg-primary-pink/90 hover:scale-105 transition-all shadow-xl shadow-primary-pink/25 flex items-center justify-center gap-3 active:scale-95">
              <Gift className="w-6 h-6" />
              Start a Celebration
            </Link>
            <Link href="/charities" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white border-2 border-gray-100 text-gray-900 font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95">
              Browse Charities
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">How It Works</h2>
              <h3 className="text-5xl font-black text-gray-900 leading-tight">Giving made simple.</h3>
            </div>
            <p className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed">
              We have streamlined everything so you can focus on the celebration while the page keeps the cause clear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((item) => (
              <div key={item.step} className="relative p-10 rounded-[40px] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
                <span className="text-7xl font-black text-gray-200 absolute top-8 right-10 group-hover:text-primary-pink/10 transition-colors">
                  {item.step}
                </span>
                <div className="w-16 h-16 rounded-full bg-primary-pink flex items-center justify-center mb-10 shadow-lg shadow-primary-pink/20 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed text-base font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="charities" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">Trusted Partners</h2>
            <h3 className="text-5xl font-black text-gray-900 mb-8">Featured Charities</h3>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg font-medium">
              Every charity on the platform is reviewed before being featured. Contributions are intended to go directly to the cause, with no GiftHappiness platform fee.
            </p>
          </div>

          {featured.status === "loading" && (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-16">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading charities...
            </div>
          )}

          {featured.status === "error" && (
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-pink py-16">
              <AlertCircle className="w-4 h-4" />
              {featured.message}
            </p>
          )}

          {featured.status === "loaded" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featured.charities.map((charity) => (
                <Link
                  key={charity.slug}
                  href={`/charities/${charity.slug}`}
                  className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 group block"
                >
                  <div className="w-16 h-16 rounded-full bg-soft-pink text-primary-pink flex items-center justify-center mb-8 font-black text-sm">
                    {charity.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{charity.category}</div>
                  <h4 className="text-3xl font-black text-gray-900 mb-6">{charity.name}</h4>
                  <p className="text-gray-600 text-base leading-relaxed font-medium">{charity.short_description}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16 bg-white border border-gray-100 rounded-[32px] p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10 lg:items-start lg:justify-between">
              <div className="max-w-lg">
                <div className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-3xl font-black text-gray-900 mb-4">How charities are selected</h4>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Each charity is vetted against clear criteria before being listed.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-w-2xl">
                {criteria.map((item) => (
                  <li key={item} className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-gray-700 font-semibold leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-12">Real Stories: Celebrations That Mattered</h2>
            <div className="relative">
              <Quote className="absolute -top-16 left-0 w-32 h-32 text-primary-pink opacity-5 -z-10" />
              <p className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-16 italic tracking-tight">
                &ldquo;Instead of more things I did not need, my friends donated to a children&apos;s hospital in my name. I cried happy tears all day.&rdquo;
              </p>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-pink flex items-center justify-center mb-6 shadow-xl shadow-primary-pink/30 rotate-3">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <div className="text-2xl font-black text-gray-900">Sarah M.</div>
                <div className="text-base font-bold text-primary-pink">50th Birthday</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#FFF4ED]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">Contributor Messages</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Small notes from celebrations with purpose.</h3>
            </div>
            <p className="text-gray-600 max-w-md text-lg font-medium leading-relaxed">
              Across celebrations, friends and family can leave a note with their contribution, with privacy controls for what appears publicly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contributorMessages.map((item) => (
              <article key={`${item.name}-${item.celebration}`} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-4">{item.charity}</div>
                <p className="text-xl font-bold text-gray-900 leading-snug mb-8">&ldquo;{item.message}&rdquo;</p>
                <div className="border-t border-gray-100 pt-5">
                  <div className="font-black text-gray-900">{item.name}</div>
                  <div className="text-sm font-semibold text-gray-500">{item.celebration}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-[60px] p-16 md:p-32 text-center overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#FF2D55 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-pink/20 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-pink/10 rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tight">
                Ready to make your next celebration unforgettable?
              </h3>
              <p className="max-w-xl mx-auto text-gray-400 text-xl mb-16 font-medium leading-relaxed">
                Create your celebration page in minutes. No fees, no fuss, just joy and generosity.
              </p>
              <Link href="/create" className="inline-block px-14 py-6 rounded-full bg-primary-pink text-white font-black text-xl hover:bg-primary-pink/90 transition-all shadow-2xl shadow-primary-pink/40 scale-100 hover:scale-105 duration-300">
                Create My Celebration Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
