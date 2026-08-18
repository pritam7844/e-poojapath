"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Video, Gift, Lock, Headphones } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function WhyChoose() {
  const { t } = useLang();
  const [stats, setStats] = useState<{ priests: number }>({ priests: 0 });

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setStats({
            priests: resData.data.priests ?? resData.data.temples ?? 0,
          });
        }
      })
      .catch((err) => console.error("Error fetching stats in WhyChoose:", err));
  }, []);

  const priestTitle = stats.priests > 0 
    ? `${stats.priests.toLocaleString("en-IN")}+ ${t("Verified", "सत्यापित")}`
    : t("Verified", "सत्यापित");

  const reasons = [
    {
      icon: ShieldCheck,
      title: priestTitle,
      desc: t("Temple Priests", "मंदिर के पुजारी"),
    },
    {
      icon: Video,
      title: t("Puja Photo &", "पूजा फोटो और"),
      desc: t("Video Updates", "वीडियो अपडेट्स"),
    },
    {
      icon: Gift,
      title: t("Prasad Delivery", "प्रसाद डिलीवरी"),
      desc: t("Pan India", "पूरे भारत में"),
    },
    {
      icon: Lock,
      title: t("100% Secure", "100% सुरक्षित"),
      desc: t("Payments", "भुगतान प्रणाली"),
    },
    {
      icon: Headphones,
      title: t("24/7 Customer", "24/7 ग्राहक"),
      desc: t("Support", "सहायता सेवा"),
    },
  ];

  return (
    <section className="py-8 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-[#4A1A0C] mb-8">
          {t("Why Choose ePoojapaath?", "ePoojapaath क्यों चुनें?")}
        </h2>

        <div className="grid grid-cols-5 gap-1 min-[360px]:gap-1.5 md:gap-4">
          {reasons.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-1 min-[360px]:p-2 md:p-5 rounded-lg min-[360px]:rounded-xl md:rounded-2xl bg-[#FFF9F2] border border-[#FBE9E7] shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-7 h-7 min-[360px]:w-9 min-[360px]:h-9 md:w-12 md:h-12 rounded-full bg-orange-50 flex items-center justify-center mb-1.5 md:mb-4">
                  <IconComp className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 md:w-6 md:h-6 text-[#D45B0A]" />
                </div>
                <h3 className="text-[7.5px] min-[360px]:text-[9px] md:text-sm font-bold text-gray-800 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[6.5px] min-[360px]:text-[8px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1 leading-tight">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
