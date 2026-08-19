import Link from "next/link";
import { Heart, HelpCircle, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "Does GiftHappiness take a percentage of the donation or any money?",
    answer: "No. GiftHappiness does not take fees or charges. The whole amount is intended to be credited directly to the charity account, minus bank, financial, or transaction fees.",
  },
  {
    question: "How are the charities selected?",
    answer: "Charities are selected by individuals associated with GiftHappiness and must pass a strict set of criteria without exception.",
  },
  {
    question: "What prevents favoritism or only one charity receiving all the money?",
    answer: "The criteria require no relationship with any member of GiftHappiness, and charities and amounts received are visible on the website for anyone to see.",
  },
  {
    question: "Can I suggest my own charity for my celebration page?",
    answer: "Not currently. You can still collect contributions and give them directly to that charity. The goal is to gift happiness, whether through GiftHappiness or directly.",
  },
  {
    question: "Do I get a tax benefit on my contribution?",
    answer: "This is still to be confirmed and will depend on the charity, donation structure, and payment flow selected.",
  },
  {
    question: "What payment modes are accepted?",
    answer: "The intended payment modes include major options such as UPI, net banking, and cards. The payment gateway is still undecided.",
  },
  {
    question: "Can I get a refund after making a donation?",
    answer: "No. Once the amount is debited, it cannot be refunded.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-primary-pink" />
                About GiftHappiness
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                A simple idea by a 12 year old.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8">
                GiftHappiness is an attempt by 12 year old to make people happy: people happy by receiving, and people happy by giving.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                It is a simple idea to share the celebrations of our lives with the world.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-10 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary-pink flex items-center justify-center mb-8">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-5">Charity-first principles</h2>
              <ul className="space-y-4 text-gray-600 font-medium leading-relaxed">
                <li>GiftHappiness does not take a platform fee from donations.</li>
                <li>Charities must pass strict criteria before being featured.</li>
                <li>Featured charities should have no connection to the promoters of the website.</li>
                <li>Donation limits help prevent one beneficiary from receiving all contributions indefinitely.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">
              <HelpCircle className="w-5 h-5" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Common questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl bg-gray-50 border border-gray-100 p-7">
                <h3 className="text-xl font-black text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link href="/create" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary-pink text-white font-black hover:bg-primary-pink/90 transition-colors">
              Start a Celebration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
