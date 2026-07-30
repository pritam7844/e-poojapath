"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

type ChadawaItem = {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  temple?: { _id: string; name: string; slug: string };
};

export function ChadawaSectionClient({ items }: { items: ChadawaItem[] }) {
  const { lang, t } = useLang();

  return (
    <section className="py-8 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#4A1A0C]">
              {t("Chadawa Seva", "चढ़ावा सेवा")}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {t("Offer sacred chadawas to receive divine blessings", "दिव्य आशीर्वाद प्राप्त करने के लिए पवित्र चढ़ावा चढ़ाएं")}
            </p>
          </div>
          <Link href="/chadawa" className="text-sm font-bold text-[#E65100] hover:underline shrink-0">
            {t("View All", "सभी देखें")}
          </Link>
        </div>

        {/* Grid of Chadawas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {items.map((item) => {
            const name = lang === "hi" && item.nameHi ? item.nameHi : item.name;
            return (
              <Link
                href={`/chadawa/${item._id}`}
                key={item._id}
                className="flex flex-col bg-white border border-[#FBE9E7] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-3 text-center"
              >
                {/* Offering Image */}
                <div className="relative h-32 md:h-44 w-full rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={item.image || "/placeholder-puja.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Offering Info */}
                <div className="flex flex-col items-center justify-center flex-1 space-y-1 mt-1">
                  {/* Small red flower icon */}
                  <span className="text-red-600 text-xs select-none">🌺</span>
                  
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                    {name}
                  </h3>
                  
                  <p className="text-[10px] text-gray-500 font-semibold mt-1">
                    {t("From", "शुरुआत")} <span className="text-saffron font-bold">₹{item.price}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
