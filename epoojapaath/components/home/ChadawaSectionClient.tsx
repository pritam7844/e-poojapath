"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      let cardWidth = 116;
      if (firstChild) {
        const isDesktop = window.innerWidth >= 768;
        const gap = isDesktop ? 16 : 8;
        cardWidth = firstChild.getBoundingClientRect().width + gap;
      }
      
      const scrollTo = direction === "left" 
        ? scrollLeft - cardWidth 
        : scrollLeft + cardWidth;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

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

        {/* Relative wrapper for arrows */}
        <div className="relative group/nav mt-6">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-orange-100 shadow-md rounded-full flex items-center justify-center text-[#E65100] hover:bg-orange-50 active:scale-95 transition-all md:opacity-0 md:group-hover/nav:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
          </button>

          {/* Flex container of Chadawas */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-2 md:gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory"
          >
            {items.map((item) => {
              const name = lang === "hi" && item.nameHi ? item.nameHi : item.name;
              return (
                <Link
                  href={`/chadawa/${item._id}`}
                  key={item._id}
                  className="flex flex-col bg-white border border-[#FBE9E7] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-1.5 min-[360px]:p-2 md:p-4 text-center w-[100px] min-[360px]:w-[108px] min-[400px]:w-[120px] md:w-[calc(25%-12px)] shrink-0 snap-align-start md:rounded-3xl"
                >
                  {/* Offering Image */}
                  <div className="relative h-20 min-[360px]:h-24 md:h-44 w-full rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
                    <Image
                      src={item.image || "/placeholder-puja.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Offering Info */}
                  <div className="flex flex-col items-center justify-center flex-1 space-y-0.5 md:space-y-1 mt-0.5 md:mt-1">
                    {/* Small red flower icon */}
                    <span className="text-red-600 text-[10px] md:text-xs select-none">🌺</span>
                    
                    <h3 className="text-[9px] min-[360px]:text-[10px] md:text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                      {name}
                    </h3>
                    
                    <p className="text-[8px] min-[360px]:text-[9px] md:text-xs text-gray-500 font-semibold mt-0.5 md:mt-1">
                      {t("From", "शुरुआत")} <span className="text-saffron font-bold">₹{item.price}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-orange-100 shadow-md rounded-full flex items-center justify-center text-[#E65100] hover:bg-orange-50 active:scale-95 transition-all md:opacity-0 md:group-hover/nav:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
