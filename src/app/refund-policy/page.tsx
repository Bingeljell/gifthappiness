import { ShieldCheck } from "lucide-react";

const sections: Array<{ heading: string; body: string[] }> = [
  {
    heading: "Contributions are generally not refundable",
    body: [
      "A contribution made through GiftHappiness is a donation to the charity named on the celebration page. Once it has reached that charity, it cannot ordinarily be refunded — the charity has received it and may already have committed it.",
      "Please make sure the amount and the charity are right before you confirm.",
    ],
  },
  {
    heading: "When we will look into it",
    body: [
      "If you were charged twice for the same contribution, if an amount was debited that does not match what you entered, or if you were charged for a contribution that never completed, contact us and we will investigate.",
      "Where a payment failed or was duplicated in transit, the correction follows the payment provider's own process, and timelines are set by them and your bank rather than by us.",
    ],
  },
  {
    heading: "If a celebration is removed",
    body: [
      "If a celebration is removed before contributions have been passed on — for example because it misrepresented the host or the charity — we will return the affected contributions to the people who made them.",
    ],
  },
  {
    heading: "How to raise it",
    body: [
      "Write to us with the celebration name, the amount, the date, and the email or mobile number you used. The sooner you tell us, the more likely we can trace and resolve it.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Refund / Donation Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Refund &amp; Donation Policy
          </h1>

          <div className="rounded-3xl bg-white border border-gray-100 p-8 mb-10">
            <p className="text-gray-600 leading-relaxed font-medium">
              Contributions go to the charity you chose, so once they have been passed on they cannot normally be
              refunded. Duplicate, failed, or incorrect transactions are a different matter, and we will help you sort
              them out.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-black text-gray-900 mb-5">{section.heading}</h2>
                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-gray-700 font-medium leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mt-10">
            To raise a contribution issue, write to{" "}
            <a href="mailto:hello@gifthappiness.org" className="underline font-bold text-primary-pink">
              hello@gifthappiness.org
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
