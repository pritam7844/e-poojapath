"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { PujaCard } from "@/components/temple/PujaCard";
  
export function PopularPujasClient({ pujas }: { pujas: any[] }) {
  const { t } = useLang();
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
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#4A1A0C]">
            {t("Popular Pujas", "लोकप्रिय पूजाएँ")}
          </h2>
          <Link href="/puja" className="text-sm font-bold text-[#E65100] hover:underline shrink-0">
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
 
          {/* Flex container of Pujas */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-2 md:gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory"
          >
            {pujas.map((puja) => (
              <div
                key={puja._id}
                className="w-[100px] min-[360px]:w-[108px] min-[400px]:w-[120px] md:w-[calc(25%-12px)] shrink-0 snap-align-start flex"
              >
                <PujaCard puja={puja} />
              </div>
            ))}
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
