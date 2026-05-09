import Link from "next/link";
import { Gift, Heart, Share2, Quote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-creme">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-dots -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-soft-pink/50 to-creme -z-20" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
            🎉 Simple & Meaningful
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1] tracking-tight">
            <span className="font-serif italic font-normal text-primary-pink">Celebrate</span> with <br />
            <span className="relative inline-block mt-2">
              Purpose
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C30 2 170 2 198 6" stroke="#FF2D55" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-medium">
            For your birthday, wedding, or anniversary — invite friends to donate to a charity you love instead of giving gifts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/create" className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary-pink text-white font-bold text-lg hover:bg-primary-pink/90 transition-all shadow-xl shadow-primary-pink/25 flex items-center justify-center gap-3">
              <Gift className="w-6 h-6" />
              Start a Celebration
            </Link>
            <Link href="#charities" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white border-2 border-gray-100 text-gray-900 font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              Browse Charities →
            </Link>
          </div>
          
          <div className="mt-24 flex items-center justify-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-soft-pink flex items-center justify-center shadow-md relative z-10 overflow-hidden">
                   <Heart className="w-6 h-6 text-primary-pink fill-primary-pink opacity-80" />
                </div>
              ))}
            </div>
            <p className="text-base font-bold text-gray-900 ml-2">
              <span className="text-primary-pink">12,000+</span> celebrations created
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">The Process</h2>
              <h3 className="text-5xl font-black text-gray-900 leading-tight">Giving made simple.</h3>
            </div>
            <p className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed">
              We've streamlined everything so you can focus on the celebration, while we handle the impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Create Your Celebration",
                desc: "Set up your birthday, wedding, anniversary, or any occasion. Add a personal message and choose the date.",
                icon: <Gift className="w-8 h-8 text-white" />
              },
              {
                step: "02",
                title: "Choose a Charity",
                desc: "Pick a cause close to your heart from our curated list of trusted charities across health, environment, children, and more.",
                icon: <Heart className="w-8 h-8 text-white" />
              },
              {
                step: "03",
                title: "Share with Friends",
                desc: "Send your celebration page to guests. They contribute any amount directly to the charity — and everyone gets a warm thank-you.",
                icon: <Share2 className="w-8 h-8 text-white" />
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-10 rounded-[40px] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
                <span className="text-7xl font-black text-gray-100 absolute top-8 right-10 group-hover:text-primary-pink/5 transition-colors">
                  {item.step}
                </span>
                <div className="w-16 h-16 rounded-2xl bg-primary-pink flex items-center justify-center mb-10 shadow-lg shadow-primary-pink/20">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed text-base font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section id="charities" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-4">Trusted Partners</h2>
            <h3 className="text-5xl font-black text-gray-900 mb-8">Featured Charities</h3>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg font-medium">
              Every charity on our platform is verified and trusted. Your contributions go directly to the cause — no middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
              <div key={idx} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 group">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{charity.icon}</div>
                <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{charity.category}</div>
                <h4 className="text-3xl font-black text-gray-900 mb-6">{charity.name}</h4>
                <p className="text-gray-600 text-base mb-10 leading-relaxed font-medium">
                  {charity.desc}
                </p>
                <Link href="#" className="inline-flex items-center gap-3 text-base font-bold text-gray-900 group-hover:text-primary-pink transition-colors">
                  Choose this charity 
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-pink group-hover:text-white transition-all">
                    →
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="#" className="inline-block px-10 py-5 rounded-full bg-white border-2 border-gray-100 text-gray-900 font-bold text-lg hover:border-primary-pink hover:text-primary-pink transition-all">
              See All 150+ Charities
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-primary-pink font-black text-sm uppercase tracking-[0.2em] mb-12">Real Stories</h2>
            <div className="relative">
              <Quote className="absolute -top-16 left-0 w-32 h-32 text-primary-pink opacity-5 -z-10" />
              <p className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-16 italic tracking-tight">
                "Instead of more things I didn't need, my friends donated to a children's hospital in my name. I cried happy tears all day."
              </p>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-primary-pink flex items-center justify-center mb-6 shadow-xl shadow-primary-pink/30 rotate-3">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <div className="text-2xl font-black text-gray-900">Sarah M.</div>
                <div className="text-base font-bold text-primary-pink">50th Birthday</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-[60px] p-16 md:p-32 text-center overflow-hidden relative shadow-2xl">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FF2D55 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-pink/20 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-pink/10 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tight">
                Ready to make your <br /> celebration unforgettable?
              </h3>
              <p className="max-w-xl mx-auto text-gray-400 text-xl mb-16 font-medium leading-relaxed">
                Create your celebration page in minutes. No fees, no fuss — just pure joy and generosity.
              </p>
              <Link href="/create" className="inline-block px-14 py-6 rounded-full bg-primary-pink text-white font-black text-xl hover:bg-primary-pink/90 transition-all shadow-2xl shadow-primary-pink/40 scale-100 hover:scale-105 duration-300">
                Create My Celebration Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
