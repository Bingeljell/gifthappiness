"use client";

import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-primary-pink/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-primary-pink">GiftHappiness</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-primary-pink/80 hover:text-primary-pink transition-colors">
            How It Works
          </Link>
          <Link href="#charities" className="text-sm font-medium text-primary-pink/80 hover:text-primary-pink transition-colors">
            Browse Charities
          </Link>
          <Link href="/create" className="text-sm font-medium text-primary-pink/80 hover:text-primary-pink transition-colors">
            Start a Celebration
          </Link>
          <Link href="/signin" className="px-4 py-2 rounded-full border border-primary-pink text-sm font-medium text-primary-pink hover:bg-primary-pink hover:text-white transition-all">
            Sign In
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-primary-pink"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-primary-pink/10 px-4 py-6 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-lg font-medium text-primary-pink" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="#charities" className="text-lg font-medium text-primary-pink" onClick={() => setIsMenuOpen(false)}>
            Browse Charities
          </Link>
          <Link href="/create" className="text-lg font-medium text-primary-pink" onClick={() => setIsMenuOpen(false)}>
            Start a Celebration
          </Link>
          <Link href="/signin" className="text-lg font-medium text-primary-pink" onClick={() => setIsMenuOpen(false)}>
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
