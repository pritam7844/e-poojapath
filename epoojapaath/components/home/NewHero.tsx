"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck, Calendar, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function NewHero() {
  const { t } = useLang();

  const features = [
    { icon: UserCheck, label: t("Verified Priests", "प्रमाणित पुजारी") },
    { icon: Calendar, label: t("Live Puja Updates", "लाइव अपडेट्स") },
    { icon: ShoppingBag, label: t("Prasad Delivery", "प्रसाद डिलीवरी") },
    { icon: ShieldCheck, label: t("Secure Payments", "सुरक्षित भुगतान") },
  ];

  return (
    <section className="relative bg-white md:bg-[#FFF7F0] pt-[76px] md:pt-24 lg:pt-28 pb-3 md:pb-10 px-3 md:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#FFF5ED] to-[#FFEFE5] md:bg-none rounded-2xl md:rounded-none p-4 min-[360px]:p-5 md:p-0">
        <div className="flex flex-row items-stretch justify-between gap-4 md:gap-8">
          {/* Left - Content */}
          <div className="flex flex-col justify-center gap-1.5 sm:gap-2.5 md:gap-4 w-[60%] md:w-[58%] lg:w-[55%] shrink-0">
            <h1 className="font-heading text-base sm:text-lg md:text-3xl lg:text-4xl text-[#4A1A0C] font-extrabold leading-[1.15]">
              {t("Experience Divine Blessings From ", "प्राप्त करें दिव्य आशीर्वाद सीधे ")}
              <span className="text-[#D45B0A]">
                {t("Sacred Temples", "पवित्र मंदिरों से")}
              </span>
            </h1>

            <p className="text-gray-700 text-[10px] sm:text-xs md:text-base lg:text-lg font-medium line-clamp-2">
              {t(
                "Book Authentic Pujas & Chadavas from the comfort of your home",
                "घर बैठे बुक करें प्रामाणिक पूजा और चढ़ावा अर्पण"
              )}
            </p>

            {/* Features list - Row on mobile, flex on desktop */}
            <div className="grid grid-cols-4 gap-1 md:flex md:flex-wrap md:gap-3 mt-1">
              {features.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center text-center md:text-left gap-1 md:gap-2 md:bg-white md:rounded-xl md:border md:border-orange-100 md:shadow-sm md:px-3.5 md:py-2.5"
                  >
                    <div className="text-orange-600 bg-orange-50 md:bg-transparent rounded-full p-1 md:p-0">
                      <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#D45B0A]" />
                    </div>
                    <span className="text-[7.5px] min-[360px]:text-[8px] sm:text-[9.5px] md:text-xs font-bold text-gray-800 leading-tight">
                      {feat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sanskrit Shloka (Hidden on mobile) */}
            <p className="hidden md:block font-sanskrit text-base text-saffron leading-relaxed font-semibold">
              सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।
              <br />
              सर्वे भद्राणि पश्यन्तु, मा कश्चिद् दुःखभाग् भवेत् ॥
            </p>

            {/* CTA - Single button on mobile, two buttons on desktop */}
            <div className="flex mt-1 md:mt-2 w-full md:w-auto">
              {/* Mobile CTA */}
              <Link
                href="/puja"
                className="md:hidden flex items-center justify-between bg-[#E65100] text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md w-fit"
              >
                <span>{t("Book a Puja Now", "पूजा बुक करें")}</span>
                <span className="bg-white text-[#E65100] rounded-full p-0.5 ml-2">
                  <ArrowRight size={10} strokeWidth={3} />
                </span>
              </Link>

              {/* Desktop CTA */}
              <div className="hidden md:flex flex-row gap-4 w-full">
                <Link
                  href="/puja"
                  className="btn-saffron text-sm px-6 py-2.5 font-bold tracking-wide shadow-lg shadow-saffron/20 text-center flex-none whitespace-nowrap"
                >
                  {t("BOOK PUJA 🪔", "पूजा बुक करें 🪔")}
                </Link>
                <Link
                  href="/chadawa"
                  className="btn-outline-lotus text-sm px-6 py-2.5 font-bold tracking-wide text-center flex-none whitespace-nowrap"
                >
                  {t("BOOK CHADAVA 🌸", "चढ़ावा अर्पण करें 🌸")}
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative w-[40%] md:w-[42%] lg:w-[45%] min-h-[140px] sm:min-h-[160px] md:min-h-[380px] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shrink-0">
            <Image
              src="/hero-puja.png"
              alt="Priests Performing Puja"
              fill
              priority
              sizes="(max-width: 768px) 40vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
