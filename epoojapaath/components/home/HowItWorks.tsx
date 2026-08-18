"use client";
 
import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
 
export function HowItWorks() {
  const { t } = useLang();
  const [templeCount, setTempleCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setTempleCount(resData.data.temples || 0);
        }
      })
      .catch((err) => console.error("Error loading stats in HowItWorks:", err));
  }, []);

  const countStr = templeCount > 0 ? `${templeCount}+ ` : "";

  const steps = [
    {
      number: "01",
      emoji: "🛕",
      title: t("Choose Your Temple", "मंदिर चुनें"),
      desc: t(
        `Browse ${countStr}verified temples across India. Filter by deity, city, or puja type.`,
        `भारत भर में ${countStr}सत्यापित मंदिरों को खोजें। देवता, शहर या पूजा प्रकार से फ़िल्टर करें।`
      ),
    },
    {
      number: "02",
      emoji: "📿",
      title: t("Select Puja or Chadawa", "पूजा या चढ़ावा चुनें"),
      desc: t(
        "Pick from curated rituals — Rudrabhishek, Satyanarayan, Navgrah, or custom offerings.",
        "चुनिंदा अनुष्ठानों में से चुनें - रुद्राभिषेक, सत्यनारायण, नवग्रह, या कस्टम चढ़ावा।"
      ),
    },
    {
      number: "03",
      emoji: "🪔",
      title: t("Book & Pay Securely", "सुरक्षित बुकिंग और भुगतान"),
      desc: t(
        "Fill your Sankalp, choose date, and pay via Razorpay. 100% secure, instant confirmation.",
        "अपना संकल्प भरें, तारीख चुनें, और रेज़रपे के माध्यम से भुगतान करें। 100% सुरक्षित, त्वरित पुष्टि।"
      ),
    },
    {
      number: "04",
      emoji: "🌸",
      title: t("Receive Blessings", "आशीर्वाद प्राप्त करें"),
      desc: t(
        "Puja performed by temple pandits. Get live stream link, prasad delivery & photo/video proof.",
        "मंदिर के पंडितों द्वारा पूजा संपन्न। लाइव स्ट्रीम लिंक, प्रसाद वितरण और फोटो/वीडियो प्रमाण प्राप्त करें।"
      ),
    },
  ];
 
  return (
    <section className="py-10 bg-[#FFFDFB] px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title enclosed in brackets */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="text-[#D45B0A] text-3xl font-light select-none">[</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#4A1A0C] text-center px-1">
            {t("How It Works", "यह कैसे काम करता है")}
          </h2>
          <span className="text-[#D45B0A] text-3xl font-light select-none">]</span>
        </div>
 
        {/* Steps Grid - Fixed 4-column row on mobile, Grid on desktop */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:grid-cols-4 md:gap-8">
          {steps.map((step, idx) => {
            return (
              <div key={idx} className="flex flex-col items-center text-center relative">
                {/* Icon Container with Floating Number Badge */}
                <div className="relative w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 sm:mb-4 md:mb-6 text-xl min-[360px]:text-2xl md:text-4xl select-none">
                  {step.emoji}
                  
                  {/* Circular step number */}
                  <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 w-4 h-4 min-[360px]:w-5 min-[360px]:h-5 md:w-6 md:h-6 rounded-full bg-[#E65100] text-white text-[8px] min-[360px]:text-[10px] md:text-xs font-bold flex items-center justify-center border border-white shadow">
                    {step.number}
                  </div>
                </div>
  
                {/* Step Info */}
                <h3 className="text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-base font-bold text-gray-800 mb-1 md:mb-2">
                  {step.title}
                </h3>
                <p className="text-[8px] min-[360px]:text-[9px] sm:text-xs text-gray-500 font-medium leading-tight max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
