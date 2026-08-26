"use client";

import NextLink from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function BottomCTA() {
  const { t } = useLang();

  return (
    <section className="py-8 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#FFF9F2] to-[#FFF0E5] border border-orange-100 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        {/* Left - WhatsApp CTA */}
        <div className="flex items-center gap-4 shrink-0 bg-white/60 border border-orange-100/50 p-4 rounded-2xl shadow-inner">
          <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            {/* Green WhatsApp SVG icon */}
            <svg className="w-6 h-6 text-[#4CAF50]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.029L2 22l5.13-1.348a9.932 9.932 0 004.877 1.28h.005c5.508 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.92-7.062A9.925 9.925 0 0012.012 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">{t("Chat with us", "व्हाट्सएप चैट")}</h4>
            <a
              href="https://wa.me/919165057755"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 font-semibold hover:text-[#4CAF50] transition-colors"
            >
              {t("on WhatsApp", "संपर्क करें")}
            </a>
          </div>
        </div>

        {/* Center - Promo Text */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#4A1A0C]">
            {t("Ready to experience divine blessings?", "दिव्य आशीर्वाद का अनुभव करने के लिए तैयार हैं?")}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {t(
              "Book your puja now and invite positivity in your life.",
              "अभी अपनी puja book करें और अपने जीवन में सकारात्मकता लाएं।"
            )}
          </p>
        </div>

        {/* Right - CTA Button */}
        <NextLink
          href="/puja"
          className="inline-flex items-center justify-between bg-[#E65100] text-white font-bold px-6 py-4 rounded-full hover:bg-[#BF360C] transition-all duration-300 group shrink-0"
        >
          <span>{t("Book a Puja Now", "पूजा बुक करें")}</span>
          <div className="ml-4 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#E65100] group-hover:translate-x-1 transition-transform">
            <ArrowRight size={14} />
          </div>
        </NextLink>
      </div>
    </section>
  );
}
