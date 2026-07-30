"use client";
 
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { PujaCard } from "@/components/temple/PujaCard";
 
export function PopularPujasClient({ pujas }: { pujas: any[] }) {
  const { t } = useLang();
 
  return (
    <section className="py-8 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#4A1A0C]">
            {t("Popular Pujas", "लोकप्रिय पूजाएँ")}
          </h2>
          <Link href="/puja" className="text-sm font-bold text-[#E65100] hover:underline shrink-0">
            {t("View All", "सभी देखें")}
          </Link>
        </div>
 
        {/* Grid of Pujas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pujas.map((puja) => (
            <PujaCard key={puja._id} puja={puja} />
          ))}
        </div>
      </div>
    </section>
  );
}
