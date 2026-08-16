import { ShieldCheck } from "lucide-react";

const principles = [
  "GiftHappiness does not deduct a platform commission from donations.",
  "Donations are intended to reach the selected charity directly, subject to unavoidable bank or payment-processing charges.",
  "Hosts choose from a list of independently vetted charities; unverified charities cannot be added for an individual celebration.",
  "Content that misrepresents a celebration, host, or charity may be flagged or removed.",
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Terms of Service
          </h1>
          <div className="rounded-3xl bg-white border border-gray-100 p-8 mb-10">
            <p className="text-gray-600 leading-relaxed font-medium">
              This page is a placeholder. Final legal terms require review before launch, once the entity structure,
              payment architecture, and charity agreements are finalized.
            </p>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-5">Working principles</h2>
          <ul className="space-y-4">
            {principles.map((item) => (
              <li key={item} className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-gray-700 font-semibold leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
