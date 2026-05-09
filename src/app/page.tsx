import Link from "next/link";
import { Gift, Heart, Share2, Quote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-soft-pink/30 to-white -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-pink/5 text-primary-pink text-xs font-bold uppercase tracking-widest">
            Simple & Meaningful
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary-pink mb-8 leading-[1.1]">
            Celebrate with <br />
            <span className="relative">
              Purpose
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C30 2 170 2 198 6" stroke="#D11F63" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-pink/70 mb-12 leading-relaxed">
            For your birthday, wedding, or anniversary — invite friends to donate to a charity you love instead of giving gifts. Every contribution goes directly to the cause, and everyone gets notified with a warm message.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all shadow-lg shadow-primary-pink/20 flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              Start a Celebration
            </Link>
            <Link href="#charities" className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-primary-pink text-primary-pink font-bold hover:bg-primary-pink/5 transition-all flex items-center justify-center gap-2">
              Browse Charities →
            </Link>
          </div>
          
          <div className="mt-20 flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-soft-pink flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-pink fill-primary-pink" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-primary-pink/60">
              <span className="text-primary-pink font-bold">12,000+</span> celebrations created
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-4">Simple & Meaningful</h2>
            <h3 className="text-4xl font-bold text-primary-pink">How It Works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create Your Celebration",
                desc: "Set up your birthday, wedding, anniversary, or any occasion. Add a personal message and choose the date.",
                icon: <Gift className="w-6 h-6 text-primary-pink" />
              },
              {
                step: "02",
                title: "Choose a Charity",
                desc: "Pick a cause close to your heart from our curated list of trusted charities across health, environment, children, and more.",
                icon: <Heart className="w-6 h-6 text-primary-pink" />
              },
              {
                step: "03",
                title: "Share with Friends",
                desc: "Send your celebration page to guests. They contribute any amount directly to the charity — and everyone gets a warm thank-you.",
                icon: <Share2 className="w-6 h-6 text-primary-pink" />
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-3xl bg-accent-pink/50 border border-primary-pink/5 group hover:border-primary-pink/10 transition-all">
                <span className="text-4xl font-bold text-primary-pink/10 absolute top-6 right-8 group-hover:text-primary-pink/20 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-soft-pink/30 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-primary-pink mb-4">{item.title}</h4>
                <p className="text-primary-pink/70 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section id="charities" className="py-24 bg-accent-pink/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-4">Trusted Partners</h2>
            <h3 className="text-4xl font-bold text-primary-pink mb-6">Featured Charities</h3>
            <p className="max-w-2xl mx-auto text-primary-pink/70">
              Every charity on our platform is verified and trusted. Your contributions go directly to the cause — no middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "UNICEF",
                category: "Children",
                desc: "Protecting children's rights and providing life-saving support to kids in need worldwide.",
                icon: "👶"
              },
              {
                name: "WWF",
                category: "Environment",
                desc: "Conserving nature and reducing the most pressing threats to the diversity of life on Earth.",
                icon: "🐼"
              },
              {
                name: "Médecins Sans Frontières",
                category: "Health",
                desc: "Delivering emergency medical care to people affected by conflict, disease, and disaster.",
                icon: "🏥"
              }
            ].map((charity, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-primary-pink/5 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-6">{charity.icon}</div>
                <div className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-2">{charity.category}</div>
                <h4 className="text-2xl font-bold text-primary-pink mb-4">{charity.name}</h4>
                <p className="text-primary-pink/70 text-sm mb-8 leading-relaxed">
                  {charity.desc}
                </p>
                <Link href="#" className="text-sm font-bold text-primary-pink hover:text-soft-pink transition-colors flex items-center gap-2">
                  Choose this charity →
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="#" className="inline-block px-8 py-4 rounded-full border-2 border-primary-pink text-primary-pink font-bold hover:bg-primary-pink/5 transition-all">
              See All 150+ Charities
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-primary-pink uppercase tracking-widest mb-4">Real Stories</h2>
            <h3 className="text-4xl font-bold text-primary-pink">Celebrations That Mattered</h3>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <Quote className="absolute -top-12 -left-12 w-24 h-24 text-soft-pink/20 -z-10" />
            <div className="bg-accent-pink/30 rounded-[40px] p-12 md:p-20 text-center relative border border-primary-pink/5">
              <p className="text-2xl md:text-3xl font-medium italic text-primary-pink leading-relaxed mb-10">
                "Instead of more things I didn't need, my friends donated to a children's hospital in my name. I cried happy tears all day."
              </p>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-soft-pink flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-primary-pink fill-primary-pink" />
                </div>
                <div className="text-lg font-bold text-primary-pink">Sarah M.</div>
                <div className="text-sm text-primary-pink/60">50th Birthday</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary-pink rounded-[40px] p-12 md:p-20 text-center overflow-hidden relative">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-soft-pink/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />
            
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to make your next <br /> celebration unforgettable?
            </h3>
            <p className="max-w-xl mx-auto text-white/70 text-lg mb-12">
              Create your celebration page in minutes. No fees, no fuss — just pure joy and generosity.
            </p>
            <Link href="/create" className="inline-block px-12 py-5 rounded-full bg-white text-primary-pink font-bold hover:bg-white/90 transition-all shadow-xl shadow-black/10">
              Create My Celebration Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
