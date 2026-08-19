import { ShieldCheck } from "lucide-react";

const criteria = [
  "The organisation must be legally registered.",
  "It should have existed for at least three years.",
  "It must satisfy GiftHappiness's financial, governance, and compliance requirements.",
  "It must have no direct or indirect relationship with GiftHappiness promoters or decision-makers.",
  "It must agree to transparency requirements.",
  "It must provide documentation required for donations and applicable tax receipts.",
];

export default function CharitySelectionPolicyPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Charity Selection Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            How charities are selected
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10">
            Trust is central to GiftHappiness. Every charity featured on the platform is expected to meet the
            following minimum eligibility standards before being listed.
          </p>

          <ol className="space-y-4 mb-10">
            {criteria.map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl bg-white border border-gray-100 p-5">
                <span className="shrink-0 w-8 h-8 rounded-full bg-soft-pink text-primary-pink flex items-center justify-center font-black text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-700 font-semibold leading-relaxed">{item}</p>
              </li>
            ))}
          </ol>

          <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 space-y-3 text-sm text-gray-500 leading-relaxed">
            <p>The final vetting checklist and agreements are still to be reviewed by legal and accounting professionals before launch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
