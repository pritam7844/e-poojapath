"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

type TempleItem = {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  location: { city: string; state: string };
};

export function FeaturedTemplesClient({ temples }: { temples: TempleItem[] }) {
  const { t } = useLang();

  return (
    <section className="py-8 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#4A1A0C]">
            {t("Temples We Serve", "हमारे मंदिर")}
          </h2>
          <Link href="/temples" className="text-sm font-bold text-[#E65100] hover:underline shrink-0">
            {t("View All", "सभी देखें")}
          </Link>
        </div>

        {temples.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🛕</div>
            <p className="font-heading text-lg">{t("No temples featured yet", "अभी तक कोई मंदिर सूचीबद्ध नहीं है")}</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-3 pb-3 -mx-4 px-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-5 md:pb-0 md:mx-0 md:px-0">
            {temples.map((temple) => (
              <Link
                href={`/temples/${temple.slug}`}
                key={temple._id}
                className="flex flex-col group w-[160px] shrink-0 snap-align-start md:w-auto"
              >
                <div className="relative h-28 md:h-40 w-full rounded-2xl overflow-hidden mb-2 shadow-sm">
                  <Image
                    src={temple.coverImage || "/placeholder-temple.jpg"}
                    alt={temple.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2">
                  {temple.name}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5">
                  {temple.location?.city}, {temple.location?.state}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
