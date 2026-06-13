import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F2] border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary-pink flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">GiftHappiness</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Turn every celebration into a gift that changes lives. Give joy, give meaning, give happiness.
            </p>
            <Link href="/about" className="inline-flex items-center text-sm font-bold text-primary-pink hover:underline">
              Read about the project
            </Link>
          </div>

          <div className="md:col-start-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8">Platform</h3>
            <ul className="flex flex-col gap-5">
              <li><Link href="/#how-it-works" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">How It Works</Link></li>
              <li><Link href="/charities" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">Browse Charities</Link></li>
              <li><Link href="/create" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">Start a Celebration</Link></li>
              <li><Link href="/celebration" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">Celebration Page</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8">Company</h3>
            <ul className="flex flex-col gap-5">
              <li><Link href="/about" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">About Us</Link></li>
              <li><Link href="/about#faq" className="text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-xs font-medium">
          <p>© 2026 GiftHappiness. All rights reserved.</p>
          <p>Made with care for celebrations that matter</p>
        </div>
      </div>
    </footer>
  );
}
