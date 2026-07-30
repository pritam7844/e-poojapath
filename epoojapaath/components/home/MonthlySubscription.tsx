"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

interface MonthlySubscriptionProps {
  subscription?: {
    _id: string;
    name: string;
    nameHi: string;
    description: string;
    descriptionHi: string;
    price: number;
    image: string;
  } | null;
}
 
export function MonthlySubscription({ subscription }: MonthlySubscriptionProps) {
  const { lang, t } = useLang();
 
  const title = subscription
    ? (lang === "hi" && subscription.nameHi ? subscription.nameHi : subscription.name)
    : t("Monthly Puja Subscription", "मासिक पूजा सब्सक्रिप्शन");
 
  const desc = subscription
    ? (lang === "hi" && subscription.descriptionHi ? subscription.descriptionHi : subscription.description)
    : t("Daily blessings for you and your family", "आपके और आपके परिवार के लिए दैनिक आशीर्वाद");
 
  const price = subscription ? subscription.price : 999;
  const image = subscription ? subscription.image : "/subscription-deity.png";
  const exploreUrl = subscription ? `/puja/${subscription._id}` : "/puja";
 
  return (
    <section className="py-8 px-4 md:px-8 bg-white">
      <div 
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-red-950/20 text-white relative"
        style={{ background: "linear-gradient(135deg, #4D1030 0%, #2B0518 100%)" }}
      >
        {/* Ambient light glow in the background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
 
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-12">
          {/* Left Column - Details */}
          <div className="flex flex-col space-y-6 md:space-y-8 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 self-start bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-orange-200">
              <Sparkles size={14} className="text-orange-200" />
              <span>{t("Subscription", "सब्सक्रिप्शन")}</span>
            </div>
 
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-orange-100 leading-tight">
                {title}
              </h2>
              <p className="text-orange-200/80 text-base md:text-lg font-medium line-clamp-2">
                {desc}
              </p>
            </div>
 
            {/* Price Badge */}
            <div className="text-2xl md:text-3xl font-bold flex items-baseline gap-2">
              <span className="text-orange-300 text-sm font-semibold">{t("Starting from", "शुरुआत")}</span>
              <span className="text-white text-3xl md:text-4xl">₹{price}</span>
              <span className="text-white/60 text-sm font-medium">/ {t("month", "महीना")}</span>
            </div>
 
            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={exploreUrl}
                className="inline-flex items-center justify-between bg-white text-[#4A1030] font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-all duration-300 group shadow-lg active:scale-95"
              >
                <span>{t("Explore Plans", "प्लान्स देखें")}</span>
                <div className="ml-4 w-6 h-6 rounded-full bg-[#4D1030] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </Link>
 
              <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-full border border-white/10 text-orange-200 text-sm font-semibold shadow-inner">
                <Calendar size={16} className="text-orange-200" />
                <span>{t("Daily Puja Benefits", "दैनिक पूजा के लाभ")}</span>
              </div>
            </div>
          </div>
 
          {/* Right Column - Image */}
          <div className="relative w-full h-[280px] md:h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={image}
              alt="Subscription Deity"
              fill
              className="object-cover"
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B0518]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
