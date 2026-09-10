import { ShieldCheck } from "lucide-react";

const sections: Array<{ heading: string; body: string[] }> = [
  {
    heading: "What we collect",
    body: [
      "When you create a celebration we collect your name, email address, mobile number, and optionally a postal address, along with the details of the celebration itself and the charity you choose to support.",
      "When you contribute to a celebration we collect your name, mobile number, an optional email address, the amount, an optional message to the host, and your PAN if the contribution amount requires it.",
      "We also record the visibility choices you make: whether your name appears publicly, whether your amount appears, and whether you contribute anonymously.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "To run the celebration page you created or contributed to, to send you the emails that flow from it (verification codes, sign-in codes, approval notices, and contribution confirmations), and to pass your contribution to the charity you selected.",
      "We do not sell or rent personal data to third parties, and we do not use your details for advertising.",
    ],
  },
  {
    heading: "What is shown publicly",
    body: [
      "Contribution amounts are private by default. An amount is only ever shown publicly if you explicitly choose to share it.",
      "Your name appears on the celebration page unless you choose to hide it or contribute anonymously, in which case you appear as an anonymous contributor.",
      "Your email address, mobile number, and PAN are never shown publicly.",
    ],
  },
  {
    heading: "Who else sees your data",
    body: [
      "The charity you support receives what it needs to accept and receipt your contribution.",
      "We use third-party providers to operate the service: Supabase for our database, Cloudflare for hosting, and Resend for sending email. They process data on our behalf and are not permitted to use it for their own purposes.",
    ],
  },
  {
    heading: "Keeping you signed in",
    body: [
      "If you sign in, we store a session token in your browser so you stay signed in between visits. It is not an advertising or tracking cookie, and clearing your browser data removes it.",
    ],
  },
  {
    heading: "Retention and your choices",
    body: [
      "We keep celebration and contribution records for as long as needed to run the service and meet accounting and legal obligations. Verification and sign-in codes expire within minutes of being issued.",
      "You can ask us what we hold about you, ask for a correction, or ask us to delete your account and personal details. Contribution records that a charity has already receipted may need to be retained for compliance even after an account is closed.",
    ],
  },
  {
    heading: "Children and the young originator",
    body: [
      "GiftHappiness began as a young person's idea. That originator's identity is deliberately not published anywhere on this site, and we apply particular care to it.",
    ],
  },
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
              GiftHappiness exists so that a celebration can benefit a charity. We collect the least we can to make
              that work, we keep contribution amounts private by default, and we never sell your data.
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
            Questions about your data, or want a copy or deletion? Write to{" "}
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
