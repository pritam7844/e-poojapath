"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const fallbackTestimonials = [
  {
    name: "Priya Sharma",
    city: "Bangalore",
    rating: 5,
    text: "The puja was performed so beautifully. I received the video and prasad on time. Truly a divine experience with ePoojapaath.",
  },
  {
    name: "Ramesh Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "Offered Chadawa to Mata Vaishno Devi on my mother's birthday from Ahmedabad. The process was seamless, prasad arrived in 3 days.",
  },
  {
    name: "Ananya Gupta",
    city: "Mumbai",
    rating: 5,
    text: "Used the Muhurat Finder for my new business launch. The auspicious timing was perfect — business is booming!",
  },
];

export function Testimonials() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setReviews(resData.data);
        }
      })
      .catch((err) => console.error("Error loading testimonials:", err));
  }, []);

  const displayList = reviews.length > 0
    ? reviews.map((r) => ({
        name: r.reviewerName || r.booking?.devoteeName || r.user?.name || "Devotee",
        city: r.city || r.user?.city || "India",
        rating: r.rating || 5,
        text: r.comment || "",
      }))
    : fallbackTestimonials;

  const current = displayList[currentIndex] ?? displayList[0];

  const handleNext = () => setCurrentIndex((prev) => (prev >= displayList.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev <= 0 ? displayList.length - 1 : prev - 1));

  // Auto-play timer for sliding testimonials
  useEffect(() => {
    if (displayList.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds interval

    return () => clearInterval(timer);
  }, [currentIndex, displayList.length]);

  return (
    <section className="py-12 bg-gradient-to-b from-[#FFFDFB] to-[#FFF9F5] px-4 md:px-8 border-y border-orange-100/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-saffron font-medium mb-2 font-sanskrit">{t("भक्तों के अनुभव", "भक्तों के अनुभव")}</p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#4A1A0C]">
            {t("What Devotees Say", "भक्तों के अनुभव")}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-saffron to-deep-gold rounded-full mx-auto mt-3" />
        </div>
 
        <div className="flex items-center gap-3 md:gap-8">
          {displayList.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-orange-100/80 text-[#D45B0A] hover:bg-[#E65100] hover:text-white hover:border-[#E65100] hover:shadow-md transition-all duration-300 shadow-sm flex items-center justify-center active:scale-90"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
          )}
 
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-orange-100/50 rounded-3xl shadow-md p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative overflow-hidden"
              >
                {/* Decorative quote mark */}
                <div className="absolute top-2 right-4 text-9xl text-orange-500/5 font-serif select-none pointer-events-none">
                  “
                </div>
 
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-xl font-extrabold text-[#D45B0A] shrink-0 shadow-inner select-none border border-orange-100/40">
                  {current.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < current.rating ? "currentColor" : "none"} 
                        stroke={i < current.rating ? "none" : "currentColor"} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium italic">
                    &ldquo;{current.text}&rdquo;
                  </p>
                  <div className="text-xs md:text-sm font-extrabold text-[#4A1A0C] tracking-wide uppercase">
                    — {current.name} <span className="text-saffron font-medium">({current.city})</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
 
          {displayList.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-orange-100/80 text-[#D45B0A] hover:bg-[#E65100] hover:text-white hover:border-[#E65100] hover:shadow-md transition-all duration-300 shadow-sm flex items-center justify-center active:scale-90"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
