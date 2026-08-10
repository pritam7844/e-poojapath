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
 
        <div className="flex flex-row items-stretch justify-between gap-4 p-4 min-[360px]:p-5 md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-12">
          {/* Left Column - Details */}
          <div className="flex flex-col justify-center gap-2 md:gap-8 w-[60%] md:w-auto shrink-0 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 self-start bg-white/10 border border-white/20 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] min-[360px]:text-[9px] md:text-xs font-semibold uppercase tracking-wider text-orange-200">
              <Sparkles className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-orange-200" />
              <span>{t("Subscription", "सब्सक्रिप्शन")}</span>
            </div>
 
            <div className="space-y-1 md:space-y-3">
              <h2 className="text-sm min-[360px]:text-base sm:text-lg md:text-4xl font-heading font-extrabold text-orange-100 leading-tight">
                {title}
              </h2>
              <p className="text-orange-200/80 text-[9px] min-[360px]:text-xs md:text-lg font-medium line-clamp-2">
                {desc}
              </p>
            </div>
 
            {/* Price Badge */}
            <div className="text-xs min-[360px]:text-sm sm:text-base md:text-3xl font-bold flex items-baseline gap-1 md:gap-2">
              <span className="text-orange-300 text-[8px] min-[360px]:text-[10px] font-semibold">{t("Starting from", "शुरुआत")}</span>
              <span className="text-white text-sm min-[360px]:text-base md:text-4xl">₹{price}</span>
              <span className="text-white/60 text-[8px] min-[360px]:text-[10px] font-medium">/ {t("month", "महीना")}</span>
            </div>
 
            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-2">
              {/* Mobile and Desktop Explore button */}
              <Link
                href={exploreUrl}
                className="bg-white text-[#4A1030] text-[9px] min-[360px]:text-[10px] md:text-sm font-bold px-3 py-1.5 md:px-6 md:py-3 rounded-full hover:bg-orange-50 transition-all duration-300 flex items-center justify-between shadow-md active:scale-95 w-fit"
              >
                <span>{t("Explore Plans", "प्लान्स देखें")}</span>
                <ArrowRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 ml-1.5 md:ml-4" />
              </Link>
 
              <div className="hidden min-[380px]:flex md:flex items-center gap-1.5 bg-white/10 px-2 py-1.5 md:px-4 md:py-3 rounded-full border border-white/10 text-orange-200 text-[8px] md:text-sm font-semibold shadow-inner">
                <Calendar className="w-2.5 h-2.5 md:w-4 md:h-4 text-orange-200" />
                <span>{t("Daily Benefits", "दैनिक लाभ")}</span>
              </div>
            </div>
          </div>
 
          {/* Right Column - Image */}
          <div className="relative w-[40%] md:w-full h-[140px] sm:h-[160px] md:h-[380px] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
            <Image
              src={image}
              alt="Subscription Deity"
              fill
              sizes="(max-width: 768px) 40vw, 45vw"
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
