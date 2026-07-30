"use client";
 
import { useLang } from "@/contexts/LanguageContext";
 
export function TrustBadges() {
  const { t } = useLang();
 
  const badges = [
    { emoji: "💳", label: t("Secure Payments", "सुरक्षित भुगतान") },
    { emoji: "🔒", label: t("Privacy Protected", "गोपनीयता सुरक्षित") },
    { emoji: "🎖️", label: t("Verified Temple Priests", "प्रमाणित मंदिर पुजारी") },
    { emoji: "📦", label: t("Pan India Prasad Delivery", "पूरे भारत में प्रसाद डिलीवरी") },
  ];
 
  return (
    <section className="py-6 bg-white border-t border-orange-50/50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center font-heading text-lg font-bold text-gray-500 tracking-wider uppercase mb-8">
          {t("Your Trust is Our Priority", "आपका विश्वास हमारी प्राथमिकता")}
        </h3>
 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-br from-white to-[#FFF9F5] border border-orange-100/60 rounded-2xl hover:shadow-md hover:border-orange-200/80 transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center shrink-0 text-2xl select-none shadow-inner">
                  {item.emoji}
                </div>
                <span className="text-xs sm:text-sm md:text-base font-bold text-gray-700 leading-tight text-center sm:text-left">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
