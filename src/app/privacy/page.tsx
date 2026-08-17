import { ShieldCheck } from "lucide-react";

const commitments = [
  "Collect only the information needed to run a celebration page or a contribution: host details, donor details, and payment references.",
  "Never sell or rent personal data to third parties.",
  "Keep donation amount visibility private by default; a contributor chooses to share it.",
  "Apply extra care to the privacy of the young originator's identity, which is intentionally not published.",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Privacy Policy
          </h1>
          <div className="rounded-3xl bg-white border border-gray-100 p-8 mb-10">
            <p className="text-gray-600 leading-relaxed font-medium">
              This page is a placeholder. Final privacy, consent, and data-retention wording is still pending legal
              review, as noted in the GiftHappiness master project document. Nothing on this static site currently
              collects or stores personal data.
            </p>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-5">Working privacy commitments</h2>
          <ul className="space-y-4 mb-10">
            {commitments.map((item) => (
              <li key={item} className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-gray-700 font-semibold leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-500 leading-relaxed">
            This page will be replaced with a finalized policy before any live data collection or payment feature is
            enabled.
          </p>
        </div>
      </section>
    </div>
  );
}
