"use client";

import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-creme/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center rotate-3">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-brand text-2xl font-bold tracking-tight">
            <span className="text-gray-900">Gift</span>
            <span className="text-primary-pink">Happiness</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-primary-pink transition-colors">
            How It Works
          </Link>
          <Link href="/charities" className="text-sm font-semibold text-gray-600 hover:text-primary-pink transition-colors">
            Browse Charities
          </Link>
          <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-primary-pink transition-colors">
            About
          </Link>
          <Link href="/celebration" className="text-sm font-semibold text-gray-600 hover:text-primary-pink transition-colors">
            Preview Page
          </Link>
          <Link href="/create" className="text-sm font-semibold text-gray-600 hover:text-primary-pink transition-colors">
            Start a Celebration
          </Link>
          <Link href="/create" className="px-6 py-2.5 rounded-full bg-primary-pink text-sm font-bold text-white hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20">
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-8 flex flex-col gap-6 shadow-xl">
          <Link href="/#how-it-works" className="text-xl font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="/charities" className="text-xl font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            Browse Charities
          </Link>
          <Link href="/about" className="text-xl font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/celebration" className="text-xl font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            Preview Page
          </Link>
          <Link href="/create" className="text-xl font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            Start a Celebration
          </Link>
        </div>
      )}
    </header>
  );
}
