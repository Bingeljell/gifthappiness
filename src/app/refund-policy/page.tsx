import { ShieldCheck } from "lucide-react";

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
          <div className="rounded-3xl bg-white border border-gray-100 p-8 mb-10 space-y-5">
            <p className="text-gray-600 leading-relaxed font-medium">
              This page is a placeholder. Final refund wording requires legal and payment-gateway review, and should
              account for duplicate, erroneous, or failed transactions rather than publishing an absolute rule
              prematurely.
            </p>
            <p className="text-gray-600 leading-relaxed font-medium">
              As a working position: once a donation is successfully debited to a charity, it is generally not
              refundable. Failed, duplicate, or erroneous transactions will be handled according to the applicable
              payment gateway&apos;s process once one is selected.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-sm text-gray-500 leading-relaxed">
            No payment gateway is connected on this static site. This policy will be finalized before any real
            donation can be made.
          </div>
        </div>
      </section>
    </div>
  );
}
