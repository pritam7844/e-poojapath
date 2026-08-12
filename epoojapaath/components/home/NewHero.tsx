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
    <section className="relative bg-[#FFFBF7] pt-[76px] md:pt-28 lg:pt-32 pb-8 md:pb-20 px-4 md:px-8 overflow-hidden">
      {/* Premium & Unique Pure CSS Animations (High Performance, No Load weight) */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes floating-sparkle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-60px) translateX(15px); opacity: 0; }
        }
        
        .animate-float-custom {
          animation: gentle-float 6s ease-in-out infinite;
        }
        .animate-spin-slow-custom {
          animation: spin-slow 40s linear infinite;
        }
        .animate-glow-pulse {
          animation: subtle-glow 8s ease-in-out infinite;
        }
        .sparkle-particle {
          position: absolute;
          background: radial-gradient(circle, #F59E0B 10%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .btn-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: 0.8s;
        }
        .btn-shimmer:hover::before {
          left: 125%;
        }
      `}</style>

      {/* Floating Sparkles/Particles (Pure CSS - Lightweight) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="sparkle-particle w-2.5 h-2.5 top-1/2 left-[15%] opacity-40" style={{ animation: 'floating-sparkle 7s infinite 0s' }} />
        <div className="sparkle-particle w-3 h-3 top-1/3 left-[45%] opacity-30" style={{ animation: 'floating-sparkle 8s infinite 2s' }} />
        <div className="sparkle-particle w-2 h-2 top-2/3 left-[65%] opacity-50" style={{ animation: 'floating-sparkle 6s infinite 4s' }} />
      </div>

      {/* Decorative Radial Background Aura */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-gradient-to-br from-saffron/15 via-lotus-pink/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-tr from-lotus-purple/8 via-lotus-blue/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-30 -mb-30" />

      <div className="max-w-7xl mx-auto bg-none md:bg-none p-0">
        <div className="flex flex-row items-center justify-between gap-6 md:gap-16">
          {/* Left - Content */}
          <div className="flex flex-col justify-center gap-3.5 sm:gap-4 md:gap-6 w-[58%] md:w-[54%] lg:w-[50%] shrink-0 z-10">
            {/* Unique Glassmorphic Top Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron/15 to-amber-500/10 border border-saffron/20 px-3 py-1.5 rounded-full w-fit shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
              </span>
              <span className="text-[9px] md:text-xs font-bold text-[#4A1A0C] uppercase tracking-wider">
                {t("India's Most Trusted Puja Platform", "भारत का सबसे भरोसेमंद पूजा मंच")}
              </span>
            </div>

            <h1 className="font-heading text-lg sm:text-2xl md:text-5xl lg:text-6xl text-[#4A1A0C] font-extrabold leading-[1.12]">
              {t("Experience Divine Blessings From ", "प्राप्त करें दिव्य आशीर्वाद सीधे ")}
              <span className="relative inline-block text-saffron bg-gradient-to-r from-[#D45B0A] to-saffron bg-clip-text text-transparent">
                {t("Sacred Temples", "पवित्र मंदिरों से")}
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#D45B0A]/80 to-saffron/20 rounded-full" />
              </span>
            </h1>

            <p className="text-gray-700 text-xs md:text-base lg:text-lg font-medium leading-relaxed max-w-xl">
              {t(
                "Book authentic pujas performed by verified priests at historical temples. Receive pure prasad and blessings directly at your doorstep.",
                "ऐतिहासिक मंदिरों में प्रमाणित पुजारियों द्वारा आयोजित प्रामाणिक पूजा बुक करें। सीधे अपने घर पर प्राप्त करें शुद्ध प्रसाद और आशीर्वाद।"
              )}
            </p>

            {/* Features list - Premium Grid Layout */}
            <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3.5 mt-1">
              {features.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-row items-center gap-2 bg-white/80 backdrop-blur-sm border border-saffron/15 hover:border-saffron/40 shadow-sm hover:shadow-md rounded-2xl px-3 py-2 md:px-4 md:py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="text-saffron bg-gradient-to-br from-saffron/10 to-amber-500/10 rounded-xl p-1.5">
                      <IconComp className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-[#D45B0A]" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">
                      {feat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sanskrit Shloka block - Extremely Unique & Sacred Styling */}
            <div className="relative bg-gradient-to-r from-saffron/5 to-transparent border-l-4 border-saffron pl-4 pr-2 py-2.5 rounded-r-2xl mt-1">
              <span className="absolute right-3 top-2 text-saffron/15 text-2xl font-bold">ॐ</span>
              <p className="font-sanskrit text-xs md:text-sm lg:text-base text-saffron leading-relaxed font-semibold italic">
                सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।
                <br className="hidden md:inline" />
                <span className="md:mt-0.5 inline-block text-[10px] md:text-xs font-medium text-amber-700/80">
                  - May all beings be happy and free from illness
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex mt-2 w-full md:w-auto">
              {/* Mobile CTA */}
              <Link
                href="/puja"
                className="md:hidden relative overflow-hidden btn-shimmer flex items-center justify-between bg-gradient-to-r from-[#E65100] to-saffron text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg shadow-saffron/20 w-fit"
              >
                <span>{t("Book a Puja Now", "पूजा बुक करें")}</span>
                <span className="bg-white text-[#E65100] rounded-full p-0.5 ml-2.5">
                  <ArrowRight size={12} strokeWidth={3} />
                </span>
              </Link>

              {/* Desktop CTA */}
              <div className="hidden md:flex flex-row gap-4 w-full">
                <Link
                  href="/puja"
                  className="relative overflow-hidden btn-shimmer btn-saffron text-sm px-8 py-3.5 font-bold tracking-wide shadow-lg shadow-saffron/20 text-center rounded-full flex-none whitespace-nowrap"
                >
                  {t("BOOK PUJA 🪔", "पूजा बुक करें 🪔")}
                </Link>
                <Link
                  href="/chadawa"
                  className="relative overflow-hidden btn-shimmer btn-outline-lotus text-sm px-8 py-3.5 font-bold tracking-wide text-center rounded-full flex-none whitespace-nowrap"
                >
                  {t("BOOK CHADAVA 🌸", "चढ़ावा अर्पण करें 🌸")}
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Asymmetric Image frame with rotating mandala background */}
          <div className="relative w-[42%] md:w-[46%] lg:w-[48%] min-h-[170px] sm:min-h-[240px] md:min-h-[440px] shrink-0 z-10 flex items-center justify-center">
            {/* Unique Rotating Golden Mandala behind the image container */}
            <div className="absolute w-[115%] h-[115%] md:w-[110%] md:h-[110%] pointer-events-none z-0 opacity-40 md:opacity-50 animate-spin-slow-custom">
              <svg className="w-full h-full text-saffron" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <path
                    key={i}
                    d="M100 100 L100 25 Q104 40 100 60 Q96 40 100 25"
                    transform={`rotate(${i * 15} 100 100)`}
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="0.4"
                  />
                ))}
              </svg>
            </div>

            {/* Temple Arch Style Image Container with gentle floating motion */}
            <div className="relative w-[90%] h-[150px] sm:h-[210px] md:h-[400px] rounded-t-[100px] rounded-b-3xl border-4 border-deep-gold/30 shadow-xl overflow-hidden animate-float-custom z-10 bg-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="/hero-puja.png"
                alt="Priests Performing Puja"
                fill
                priority
                sizes="(max-width: 768px) 45vw, 48vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
