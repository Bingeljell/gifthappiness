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
            <p className="text-gray-600 leading-relaxed font-medium mb-6">
              Questions about hosting a celebration, contributing to one, or listing your charity? We&apos;d love to
              hear from you.
            </p>
            <a
              href="mailto:hello@gifthappiness.org"
              className="inline-block text-2xl md:text-3xl font-black text-primary-pink hover:underline break-all"
            >
              hello@gifthappiness.org
            </a>
            <p className="text-sm text-gray-500 leading-relaxed mt-6">
              We read every message and aim to reply within two working days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
