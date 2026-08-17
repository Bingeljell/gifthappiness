import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  weight: "700",
  style: "normal",
  subsets: ["latin"],
});

const playfairBrand = Playfair_Display({
  variable: "--font-brand",
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gift Happiness - Celebrate with Purpose",
  description: "Turn every celebration into a gift that changes lives. Create a static celebration page preview for charity-first giving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${playfairBrand.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-creme text-text-main font-sans">
        <SessionProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
