"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
 
export function MobileBookNow() {
  const { t } = useLang();
  const pathname = usePathname();
  const [showSticky, setShowSticky] = useState(false);
 
  // Hide the generic button on puja detail page
  const isDetailPage = pathname.startsWith("/puja/") && pathname.split("/").length === 3;
 
  useEffect(() => {
    if (isDetailPage) {
      document.body.classList.remove("has-sticky-bottom");
      return;
    }
 
    const checkVisibility = () => {
      // Find all puja booking links (excluding sticky button itself and links inside header/nav/footer)
      const buttons = Array.from(document.querySelectorAll('a[href^="/puja"], a[href^="/chadawa"]'))
        .filter((el) => {
          if (el.id === "sticky-bottom-book-btn") return false;
          if (el.closest("footer") || el.closest("header") || el.closest("nav")) return false;
          return true;
        });
 
      let anyVisible = false;
      const viewportHeight = window.innerHeight;
 
      for (const btn of buttons) {
        const rect = btn.getBoundingClientRect();
        // Check if the button is within the viewport vertically
        if (rect.top < viewportHeight && rect.bottom > 0) {
          anyVisible = true;
          break;
        }
      }
      
      const shouldShow = !anyVisible;
      setShowSticky(shouldShow);
 
      if (shouldShow) {
        document.body.classList.add("has-sticky-bottom");
      } else {
        document.body.classList.remove("has-sticky-bottom");
      }
    };
 
    // Run on scroll, resize
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
 
    // Initial checks to handle dynamic loaded content
    checkVisibility();
    const timer1 = setTimeout(checkVisibility, 500);
    const timer2 = setTimeout(checkVisibility, 1500);
 
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.classList.remove("has-sticky-bottom");
    };
  }, [isDetailPage]);
 
  if (isDetailPage) return null;
 
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          body.has-sticky-bottom #whatsapp-floating-widget {
            bottom: 16px !important;
            right: 80px !important;
          }
          body:not(.has-sticky-bottom) #whatsapp-floating-widget {
            bottom: 80px !important;
            right: 16px !important;
          }
        }
      `}} />
      <Link
        id="sticky-bottom-book-btn"
        href="/puja"
        className={`md:hidden fixed bottom-4 right-[144px] z-50 bg-[#E65100] text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-[#BF360C] transition-all duration-300 border border-white/20 whitespace-nowrap ${
          showSticky ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"
        }`}
      >
        <span>{t("Book a Puja Now", "पूजा बुक करें")}</span>
        <ArrowRight size={14} />
      </Link>
    </>
  );
}
