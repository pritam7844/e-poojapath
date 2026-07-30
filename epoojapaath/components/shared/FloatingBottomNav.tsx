"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Flower2, Landmark, User, MessageCircle, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export function FloatingBottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  const navItems = [
    { label: t("Home", "होम"), icon: Home, href: "/" },
    { label: t("Puja", "पूजा"), icon: Calendar, href: "/puja" },
    { label: t("Chadawa", "चढ़ावा"), icon: Flower2, href: "/chadawa" },
    { label: t("Temples", "मंदिर"), icon: Landmark, href: "/temples" },
    { label: t("My Bookings", "बुकिंग्स"), icon: User, href: "/user/bookings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-150 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
      {/* Quick Action Floating Bar above Bottom Nav */}
      <div className="absolute bottom-[72px] left-0 right-0 px-4 flex items-center justify-between pointer-events-none">
        {/* WhatsApp Chat button */}
        <a
          href="https://wa.me/919165057755"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-2 rounded-full shadow-lg pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <MessageCircle size={15} />
          </div>
          <span className="text-[10px] font-bold text-gray-700">{t("Chat with us", "चैट करें")}</span>
        </a>

        {/* Book Your Puja Now button */}
        <Link
          href="/puja"
          className="flex items-center gap-2 bg-[#E65100] text-white font-bold px-4 py-2.5 rounded-full shadow-lg pointer-events-auto hover:bg-[#BF360C] transition-all duration-300 group text-xs"
        >
          <span>{t("Book Your Puja Now", "पूजा बुक करें")}</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Tab bar */}
      <div className="flex justify-around items-center h-[64px] px-2">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-[#E65100]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <IconComp size={20} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
              <span className="text-[10px] font-bold mt-1 tracking-tight leading-none">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-[#E65100] rounded-full absolute bottom-1.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
