import { ShieldCheck } from "lucide-react";

const sections: Array<{ heading: string; body: string[] }> = [
  {
    heading: "What GiftHappiness does",
    body: [
      "GiftHappiness lets you create a celebration page — a birthday, wedding, anniversary or similar — and invite your guests to contribute to a vetted charity instead of giving you a gift.",
      "We are not a charity ourselves. We connect hosts and their guests to charities we have independently vetted.",
    ],
  },
  {
    heading: "No platform commission",
    body: [
      "We do not deduct a platform commission from contributions. Contributions are intended to reach the selected charity in full, subject only to unavoidable bank or payment-processing charges.",
    ],
  },
  {
    heading: "Choosing a charity",
    body: [
      "Hosts choose from the list of charities we have vetted. A charity cannot be added to an individual celebration without going through that vetting first.",
      "You are welcome to support a charity that is not on our list — simply do so directly. The aim is that giving happens, whether through GiftHappiness or not.",
    ],
  },
  {
    heading: "Hosting a celebration",
    body: [
      "You must verify your email address to create a celebration, and the details you provide must be accurate.",
      "Every celebration is reviewed before it goes live. We may decline to publish a celebration, or remove one already published, if it misrepresents the host, the occasion, or the charity.",
    ],
  },
  {
    heading: "Contributing",
    body: [
      "Contributions are made on the understanding that the money goes to the charity named on the celebration page.",
      "Contribution amounts are private by default. Your name appears publicly unless you choose otherwise. See our Privacy Policy for detail.",
      "Any tax receipt is issued by the charity, not by GiftHappiness, and depends on that charity's own registration.",
    ],
  },
  {
    heading: "Content and conduct",
    body: [
      "Messages left on a celebration page must not be abusive, misleading, or unlawful. We may remove content or suspend an account that breaches this.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update these terms as the service develops. Material changes will be reflected on this page.",
    ],
  },
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
              These terms cover using GiftHappiness as a host or as a contributor. In short: we take no commission,
              charities are vetted before they appear, and contribution amounts stay private unless you share them.
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
            Questions about these terms? Write to{" "}
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
