import Link from "next/link";
import { HeartHandshake, ShieldCheck } from "lucide-react";

const expectations = [
  "Be a legally registered organisation with at least three years of operating history.",
  "Meet GiftHappiness's financial, governance, and compliance requirements.",
  "Have no direct or indirect relationship with GiftHappiness promoters or decision-makers.",
  "Agree to public transparency: amount raised and current status are shown on the site.",
  "Provide documentation needed for donations and applicable tax receipts.",
];

export default function ForCharitiesPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4" />
            For Charities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Partner with GiftHappiness
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium mb-10">
            GiftHappiness connects personal celebrations to trusted causes, at zero platform commission. If your
            organisation is interested in being featured, here is what to expect.
          </p>

          <div className="rounded-3xl bg-white border border-gray-100 p-8 mb-10">
            <div className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-5">What we look for</h2>
            <ul className="space-y-4">
              {expectations.map((item) => (
                <li key={item} className="text-gray-700 font-semibold leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-sm text-gray-500 leading-relaxed mb-10">
            The full vetting checklist and partnership agreement are still being finalized with legal and accounting
            review. See the{" "}
            <Link href="/charity-selection-policy" className="underline font-bold text-primary-pink">
              Charity Selection Policy
            </Link>{" "}
            for the current criteria.
          </div>

          <p className="text-gray-600 font-medium">
            A dedicated intake process has not launched yet. Once it does, this page will link to it directly.
          </p>
        </div>
      </section>
    </div>
  );
}
