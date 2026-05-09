"use client";

import { useState } from "react";
import { Heart, Gift, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CreateCelebration() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-pink via-terracotta to-soft-pink -z-10 opacity-90" />
      
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-pink/20 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="w-full max-w-xl">
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-primary-pink">GiftHappiness</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-primary-pink mb-4 leading-tight">
            Ready to make your next celebration unforgettable?
          </h1>
          <p className="text-primary-pink/70 mb-10 leading-relaxed">
            Create your celebration page in minutes. No fees, no fuss — just pure joy and generosity.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                Your name
              </label>
              <input
                type="text"
                id="name"
                placeholder="e.g. Sarah"
                className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink placeholder:text-primary-pink/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink placeholder:text-primary-pink/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="occasion" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                  Occasion
                </label>
                <select
                  id="occasion"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink appearance-none"
                >
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Anniversary</option>
                  <option>Graduation</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="charity" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                Choose a Charity
              </label>
              <select
                id="charity"
                className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink appearance-none"
              >
                <option>UNICEF (Children)</option>
                <option>WWF (Environment)</option>
                <option>Médecins Sans Frontières (Health)</option>
                <option>Save the Children</option>
                <option>Red Cross</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-primary-pink/60 uppercase tracking-widest ml-1">
                Personal Message
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Tell your friends why this cause matters to you..."
                className="w-full px-6 py-4 rounded-2xl bg-white border border-primary-pink/10 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-primary-pink placeholder:text-primary-pink/30 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-primary-pink text-white font-bold text-lg hover:bg-primary-pink/90 transition-all shadow-xl shadow-primary-pink/20 mt-4 flex items-center justify-center gap-2"
            >
              Create My Celebration Page
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-primary-pink/40">
            By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
