import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const playfairBrand = Playfair_Display({
  variable: "--font-brand",
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gift Happiness - Celebrate with Purpose",
  description: "Turn every celebration into a gift that changes lives. Create a custom donation registry for your birthday, wedding, or anniversary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${playfairBrand.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-creme text-text-main font-sans">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
