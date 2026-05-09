import Link from "next/link";
import { Heart, Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-primary-pink/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-primary-pink">GiftHappiness</span>
            </Link>
            <p className="text-primary-pink/70 text-sm leading-relaxed mb-6">
              Turn every celebration into a gift that changes lives. Give joy, give meaning, give happiness.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-full border border-primary-pink/20 text-primary-pink hover:bg-primary-pink hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-primary-pink/20 text-primary-pink hover:bg-primary-pink hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-primary-pink/20 text-primary-pink hover:bg-primary-pink hover:text-white transition-all">
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-start-3">
            <h3 className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-6">Platform</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="#how-it-works" className="text-primary-pink/70 hover:text-primary-pink text-sm">How It Works</Link></li>
              <li><Link href="#charities" className="text-primary-pink/70 hover:text-primary-pink text-sm">Browse Charities</Link></li>
              <li><Link href="/create" className="text-primary-pink/70 hover:text-primary-pink text-sm">Start a Celebration</Link></li>
              <li><Link href="/signin" className="text-primary-pink/70 hover:text-primary-pink text-sm">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-6">Company</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-primary-pink/70 hover:text-primary-pink text-sm">About Us</Link></li>
              <li><Link href="#" className="text-primary-pink/70 hover:text-primary-pink text-sm">Contact</Link></li>
              <li><Link href="#" className="text-burgundy/70 hover:text-primary-pink text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-burgundy/70 hover:text-primary-pink text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-pink/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-primary-pink/40 text-xs">
          <p>© 2026 GiftHappiness. All rights reserved.</p>
          <p>Made with ❤️ for celebrations that matter</p>
        </div>
      </div>
    </footer>
  );
}
