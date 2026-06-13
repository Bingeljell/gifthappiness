import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";

const charities = [
  {
    name: "UNICEF",
    category: "Children",
    status: "Active",
    description: "Supports children with health, nutrition, education, protection, and emergency relief programs.",
  },
  {
    name: "WWF",
    category: "Environment",
    status: "Active",
    description: "Works to conserve wildlife, protect habitats, and reduce threats to the natural world.",
  },
  {
    name: "Medecins Sans Frontieres",
    category: "Health",
    status: "Active",
    description: "Provides emergency medical care for people affected by conflict, disease, and disaster.",
  },
  {
    name: "Save the Children",
    category: "Children",
    status: "Active",
    description: "Helps children access education, healthcare, protection, and emergency support.",
  },
  {
    name: "Indian Red Cross Society",
    category: "Relief",
    status: "Active",
    description: "Supports disaster response, blood services, health programs, and humanitarian relief.",
  },
  {
    name: "Akshaya Patra Foundation",
    category: "Nutrition",
    status: "Active",
    description: "Runs school meal programs that help children stay nourished and in classrooms.",
  },
  {
    name: "Teach For India",
    category: "Education",
    status: "Active",
    description: "Builds leadership and teaching capacity to expand educational opportunity for children.",
  },
  {
    name: "Goonj",
    category: "Community",
    status: "Active",
    description: "Channels urban surplus into rural development, disaster relief, and community-led work.",
  },
  {
    name: "Pratham",
    category: "Education",
    status: "Active",
    description: "Works to improve learning outcomes and access to education for children across India.",
  },
  {
    name: "CRY",
    category: "Children",
    status: "Active",
    description: "Focuses on child rights, education, protection, healthcare, and child participation.",
  },
  {
    name: "HelpAge India",
    category: "Elder Care",
    status: "Active",
    description: "Supports disadvantaged elderly people through healthcare, livelihoods, and advocacy.",
  },
  {
    name: "The Banyan",
    category: "Mental Health",
    status: "Active",
    description: "Works with people experiencing homelessness and mental health challenges.",
  },
];

const criteria = [
  "Registered NGO or charity.",
  "Minimum three years of existence.",
  "No relationship with GiftHappiness promoters.",
  "Rotated out after a predetermined contribution limit.",
];

export default function CharitiesPage() {
  return (
    <div className="bg-creme">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white shadow-sm border border-gray-100 text-primary-pink text-xs font-bold uppercase tracking-widest">
              <Heart className="w-4 h-4 fill-primary-pink" />
              Charity Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Charities families can celebrate with.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              This is a static working list with dummy data. The final launch list, registration details, and donation limits still need to be confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
            {criteria.map((item) => (
              <div key={item} className="bg-white border border-gray-100 rounded-3xl p-6">
                <ShieldCheck className="w-7 h-7 text-primary-pink mb-4" />
                <p className="text-gray-700 font-bold leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <article key={charity.name} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-soft-pink text-primary-pink flex items-center justify-center font-black text-sm">
                    {charity.category.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary-pink">
                    {charity.status}
                  </span>
                </div>
                <div className="text-xs font-black text-primary-pink uppercase tracking-widest mb-3">{charity.category}</div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{charity.name}</h2>
                <p className="text-gray-600 font-medium leading-relaxed mb-8">{charity.description}</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500 leading-relaxed">
                  Registration, years active, verification notes, and donation cap will be added after the final charity list is approved.
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/create" className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary-pink text-white font-black hover:bg-primary-pink/90 transition-colors">
              Start a Celebration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
