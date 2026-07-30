"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function Newsletter() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-8 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#FFF9F5] to-[#FFF0E6] border border-orange-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        {/* Left Side - Info */}
        <div className="flex items-start gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-orange-100/60 border border-orange-100 flex items-center justify-center shrink-0">
            <Mail size={24} className="text-[#D45B0A]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#4A1A0C]">
              {t("Stay Connected with Divine Blessings", "दिव्य आशीर्वाद से जुड़े रहें")}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
              {t(
                "Get updates on special pujas, offers and spiritual tips straight to your inbox.",
                "विशेष पूजा, ऑफ़र और आध्यात्मिक सुझावों के बारे में जानकारी सीधे अपने इनबॉक्स में पाएं।"
              )}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-auto shrink-0 min-w-[280px] md:min-w-[400px]">
          {subscribed ? (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-sm font-bold p-4 rounded-2xl border border-emerald-100">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{t("Successfully Subscribed! Thank you.", "सफलतापूर्वक सब्सक्राइब किया गया! धन्यवाद।")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your email", "अपना ईमेल दर्ज करें")}
                className="flex-1 bg-white border border-orange-100 text-gray-800 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-[#E65100] shadow-inner"
              />
              <button
                type="submit"
                className="bg-[#E65100] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-[#BF360C] transition-colors shadow-md"
              >
                {t("Subscribe", "सब्सक्राइब")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
