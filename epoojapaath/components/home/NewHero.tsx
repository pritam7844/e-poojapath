"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck, Calendar, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function NewHero() {
  const { t } = useLang();

  const features = [
    { emoji: "🙏", label: t("Verified Priests", "प्रमाणित पुजारी") },
    { emoji: "📹", label: t("Live Puja Updates", "लाइव अपडेट्स") },
    { emoji: "📦", label: t("Prasad Delivery", "प्रसाद डिलीवरी") },
    { emoji: "🛡️", label: t("Secure Payments", "सुरक्षित भुगतान") },
  ];

  return (
    <section className="relative bg-[#FFF7F0] pt-[76px] md:pt-24 lg:pt-28 pb-4 md:pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row items-stretch justify-between gap-4 md:gap-8">
          {/* Left - Content */}
          <div className="flex flex-col justify-center gap-1.5 sm:gap-2.5 md:gap-4 w-[60%] md:w-[58%] lg:w-[55%] shrink-0">
            <h1 className="font-heading text-lg sm:text-[22px] md:text-3xl lg:text-4xl text-[#4A1A0C] font-extrabold leading-[1.15]">
              {t("Experience Divine Blessings From ", "प्राप्त करें दिव्य आशीर्वाद सीधे ")}
              <span className="text-[#D45B0A]">
                {t("Sacred Temples", "पवित्र मंदिरों से")}
              </span>
            </h1>

            <p className="text-gray-700 text-[11px] sm:text-sm md:text-base lg:text-lg font-medium line-clamp-2">
              {t(
                "Book Authentic Pujas & Chadavas from the comfort of your home",
                "घर बैठे बुक करें प्रामाणिक पूजा और चढ़ावा अर्पण"
              )}
            </p>

            {/* Features list - 2 columns on mobile, flexible wrap on desktop */}
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
              {features.map((feat, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-xl border border-orange-100 shadow-sm px-2.5 py-2 md:px-3.5 md:py-2.5 w-full md:w-fit"
                  >
                    <span className="text-xs md:text-xl select-none leading-none">
                      {feat.emoji}
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-800 leading-tight">
                      {feat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sanskrit Shloka */}
            <p className="font-sanskrit text-[10px] sm:text-xs md:text-base text-saffron leading-relaxed font-semibold">
              सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।
              <br />
              सर्वे भद्राणि पश्यन्तु, मा कश्चिद् दुःखभाग् भवेत् ॥
            </p>

            {/* CTA */}
            <div className="flex flex-row gap-2 sm:gap-4 mt-1 w-full md:w-auto">
              <Link
                href="/puja"
                className="btn-saffron text-[10px] sm:text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5 font-bold tracking-wide shadow-lg shadow-saffron/20 text-center flex-1 md:flex-none whitespace-nowrap"
              >
                {t("BOOK PUJA 🪔", "पूजा बुक करें 🪔")}
              </Link>
              <Link
                href="/chadawa"
                className="btn-outline-lotus text-[10px] sm:text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5 font-bold tracking-wide text-center flex-1 md:flex-none whitespace-nowrap"
              >
                {t("BOOK CHADAVA 🌸", "चढ़ावा अर्पण करें 🌸")}
              </Link>
            </div>
          </div>

          {/* Right - Image, merged into the section (no border/frame, no drop shadow) */}
          <div className="relative w-[40%] md:w-[42%] lg:w-[45%] min-h-[200px] sm:min-h-[220px] md:min-h-[380px] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shrink-0">
            <Image
              src="/hero-puja.png"
              alt="Priests Performing Puja"
              fill
              priority
              sizes="(max-width: 768px) 45vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
