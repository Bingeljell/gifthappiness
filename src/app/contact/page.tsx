import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            Contact
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Get in touch
          </h1>
          <div className="rounded-3xl bg-white border border-gray-100 p-8">
            <p className="text-gray-600 leading-relaxed font-medium">
              A dedicated contact channel has not been finalized yet. This page is a placeholder so the site&apos;s
              navigation and footer are complete; a real contact method (email, form, or both) will be added here
              once it is decided.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
