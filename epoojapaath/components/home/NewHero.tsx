"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck, Calendar, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function NewHero() {
  const { t } = useLang();

  const features = [
    { icon: UserCheck, label: t("Verified Priests", "Verified Priests") },
    { icon: Calendar, label: t("Live Puja Updates", "Live Puja Updates") },
    { icon: ShoppingBag, label: t("Prasad Delivery", "Prasad Delivery") },
    { icon: ShieldCheck, label: t("Secure Payments", "Secure Payments") },
  ];

  return (
    <section className="w-full relative pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 bg-gradient-to-r from-[#FFF5EE] via-[#FFEFE6] to-[#FFEFE6] overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-row items-center min-h-[240px] sm:min-h-[320px] md:min-h-[440px]">
        
        {/* Left - Content Area */}
        <div className="flex flex-col justify-center py-4 pr-1 sm:py-8 md:py-12 w-[58%] md:w-[52%] lg:w-[48%] shrink-0 z-20 relative bg-transparent">
          <h1 className="font-heading text-[13px] sm:text-3xl md:text-4xl lg:text-5xl text-[#4A1A0C] font-extrabold leading-[1.15]">
            {t("Experience Divine Blessings From ", "Experience Divine Blessings From ")}
            <span className="text-[#D45B0A]">
              {t("Sacred Temples", "Sacred Temples")}
            </span>
          </h1>

          <p className="text-gray-600 text-[9px] sm:text-sm md:text-base font-medium mt-1.5 md:mt-3 max-w-md">
            {t(
              "Book Authentic Pujas & Chadavas from the comfort of your home",
              "Book Authentic Pujas & Chadavas from the comfort of your home"
            )}
          </p>

          {/* Features single horizontal row with vertical dividers */}
          <div className="flex flex-row items-center justify-between border-t border-b border-orange-200/50 py-2.5 my-3 md:py-4 md:my-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} className="flex items-center flex-1 min-w-0">
                  {idx > 0 && <div className="h-5 md:h-8 w-px bg-orange-200/50 shrink-0" />}
                  <div className="flex flex-col items-center text-center flex-1 px-0.5">
                    <div className="text-saffron mb-0.5 md:mb-1 shrink-0">
                      <IconComp className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#D45B0A]" />
                    </div>
                    <span className="text-[6.5px] xs:text-[7.5px] sm:text-[10px] md:text-xs font-semibold text-gray-700 leading-tight">
                      {feat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sanskrit Shloka block - Visible only on desktop */}
          <div className="hidden md:block relative bg-gradient-to-r from-saffron/5 to-transparent border-l-4 border-saffron pl-4 pr-2 py-2 rounded-r-xl mb-6">
            <span className="absolute right-3 top-1 text-saffron/15 text-2xl font-bold">ॐ</span>
            <p className="font-sanskrit text-xs md:text-sm text-saffron leading-relaxed font-semibold italic">
              सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।
              <br />
              सर्वे भद्राणि पश्यन्तु, मा कश्चिद् दुःखभाग् भवेत् ॥
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex w-full">
            <Link
              href="/puja"
              className="relative overflow-hidden flex items-center justify-between bg-gradient-to-r from-[#E65100] to-saffron text-white text-[9px] sm:text-xs md:text-sm font-bold px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full shadow-lg shadow-saffron/20 w-fit transition-transform hover:scale-[1.02] gap-1 md:gap-3"
            >
              <span>{t("Book a Puja Now", "Book a Puja Now")}</span>
              <span className="bg-white text-[#E65100] rounded-full p-0.5 sm:p-1 flex items-center justify-center shrink-0">
                <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right - Image block stretching across screen edge to edge */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <Image
            src="/hero-puja-new.png"
            alt="Priests Performing Puja"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-center z-10 scale-105"
          />
          {/* Diagonal Blend Mask */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(108deg, #FFEFE6 25%, #FFEFE6 42%, rgba(255, 239, 230, 0.85) 50%, rgba(255, 239, 230, 0.2) 72%, transparent 90%)'
            }}
          />
        </div>
      </div>

      {/* Slide dots below */}
      <div className="flex justify-center gap-2 mt-2 sm:mt-3 relative z-30">
        <span className="w-2 h-2 rounded-full bg-saffron" />
        <span className="w-2 h-2 rounded-full bg-gray-300/80" />
        <span className="w-2 h-2 rounded-full bg-gray-300/80" />
      </div>
    </section>
  );
}
